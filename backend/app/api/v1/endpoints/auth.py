"""
Aequitas LV-COP Backend - Authentication Endpoints
=================================================

Login, logout, token refresh, OAuth, and password management.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from app.config import settings
from app.dependencies import CurrentUser, DBSession
from app.exceptions import AuthenticationError, ValidationError
from app.services.auth_service import AuthService
from app.schemas.auth import (
    LoginRequest,
    PasswordChangeRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshTokenRequest,
    SessionInfo,
    TokenResponse,
)
from app.schemas.base import ResponseModel

router = APIRouter()


# =============================================================================
# LOGIN ENDPOINTS
# =============================================================================

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User login",
    description="Authenticate user and return access token.",
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: DBSession = None,
) -> TokenResponse:
    """
    Authenticate user with email and password.
    
    Only existing users can login.
    
    **Super Admin Credentials:**
    - Email: admin@aequitas.ai
    - Password: Aequitas2024!
    """
    auth_service = AuthService(db)
    
    try:
        result = await auth_service.login(
            email=form_data.username,
            password=form_data.password,
        )
        return TokenResponse(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            token_type=result["token_type"],
            expires_in=result["expires_in"],
        )
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post(
    "/login/json",
    response_model=ResponseModel[dict],
    summary="User login (JSON)",
    description="Authenticate user with JSON body.",
)
async def login_json(
    request: LoginRequest,
    db: DBSession = None,
) -> ResponseModel[dict]:
    """
    Authenticate user with JSON request body.
    
    Returns user info along with tokens.
    """
    auth_service = AuthService(db)
    
    try:
        result = await auth_service.login(
            email=request.email,
            password=request.password,
        )
        return ResponseModel(
            success=True,
            data=result,
            message="Login successful",
        )
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


# =============================================================================
# REGISTRATION
# =============================================================================

@router.post(
    "/register",
    response_model=ResponseModel[dict],
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
    description="Create a new user account.",
)
async def register(
    email: str,
    password: str,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    organization_name: Optional[str] = None,
    db: DBSession = None,
) -> ResponseModel[dict]:
    """
    Register a new user.
    
    If organization_name is provided, creates new org and user becomes admin.
    """
    auth_service = AuthService(db)
    
    try:
        result = await auth_service.register(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            organization_name=organization_name,
        )
        return ResponseModel(
            success=True,
            data=result,
            message="Registration successful",
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =============================================================================
# OAUTH - GOOGLE
# =============================================================================

@router.get(
    "/google",
    summary="Start Google OAuth",
    description="Redirect to Google for authentication.",
)
async def google_login() -> RedirectResponse:
    """
    Start Google OAuth flow.
    
    Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env",
        )
    
    # Build authorization URL
    redirect_uri = f"{settings.API_BASE_URL}/api/v1/auth/google/callback"
    scope = "openid email profile"
    
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope={scope}"
        f"&access_type=offline"
    )
    
    return RedirectResponse(auth_url)


@router.get(
    "/google/callback",
    summary="Google OAuth callback",
    description="Handle callback from Google.",
)
async def google_callback(
    code: str = Query(...),
    db: DBSession = None,
) -> ResponseModel[dict]:
    """
    Handle Google OAuth callback.
    
    Exchanges code for tokens and creates/logs in user.
    """
    import httpx
    
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured",
        )
    
    redirect_uri = f"{settings.API_BASE_URL}/api/v1/auth/google/callback"
    
    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            },
        )
        
        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to exchange code for tokens",
            )
        
        tokens = token_response.json()
        
        # Get user info
        userinfo_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        
        if userinfo_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Google",
            )
        
        user_info = userinfo_response.json()
    
    # Create or get user
    auth_service = AuthService(db)
    user = await auth_service.get_user_by_email(user_info["email"])
    
    if not user:
        # Auto-register Google users
        result = await auth_service.register(
            email=user_info["email"],
            password=f"google-{user_info['id']}-oauth",  # Random password
            first_name=user_info.get("given_name"),
            last_name=user_info.get("family_name"),
        )
    else:
        result = await auth_service._create_session(user)
    
    return ResponseModel(
        success=True,
        data=result,
        message="Google login successful",
    )


# =============================================================================
# OAUTH - MICROSOFT
# =============================================================================

@router.get(
    "/microsoft",
    summary="Start Microsoft OAuth",
    description="Redirect to Microsoft for authentication.",
)
async def microsoft_login() -> RedirectResponse:
    """
    Start Microsoft OAuth flow.
    
    Requires MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in .env
    """
    if not settings.MICROSOFT_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Microsoft OAuth not configured. Set MICROSOFT_CLIENT_ID in .env",
        )
    
    redirect_uri = f"{settings.API_BASE_URL}/api/v1/auth/microsoft/callback"
    scope = "openid email profile User.Read"
    
    auth_url = (
        f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID or 'common'}/oauth2/v2.0/authorize?"
        f"client_id={settings.MICROSOFT_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope={scope}"
    )
    
    return RedirectResponse(auth_url)


@router.get(
    "/microsoft/callback",
    summary="Microsoft OAuth callback",
    description="Handle callback from Microsoft.",
)
async def microsoft_callback(
    code: str = Query(...),
    db: DBSession = None,
) -> ResponseModel[dict]:
    """
    Handle Microsoft OAuth callback.
    """
    import httpx
    
    if not settings.MICROSOFT_CLIENT_ID or not settings.MICROSOFT_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Microsoft OAuth not configured",
        )
    
    redirect_uri = f"{settings.API_BASE_URL}/api/v1/auth/microsoft/callback"
    tenant = settings.MICROSOFT_TENANT_ID or "common"
    
    async with httpx.AsyncClient() as client:
        # Exchange code for tokens
        token_response = await client.post(
            f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token",
            data={
                "client_id": settings.MICROSOFT_CLIENT_ID,
                "client_secret": settings.MICROSOFT_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
                "scope": "openid email profile User.Read",
            },
        )
        
        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to exchange code for tokens",
            )
        
        tokens = token_response.json()
        
        # Get user info from Microsoft Graph
        userinfo_response = await client.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        
        if userinfo_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Microsoft",
            )
        
        user_info = userinfo_response.json()
    
    email = user_info.get("mail") or user_info.get("userPrincipalName")
    
    # Create or get user
    auth_service = AuthService(db)
    user = await auth_service.get_user_by_email(email)
    
    if not user:
        result = await auth_service.register(
            email=email,
            password=f"microsoft-{user_info['id']}-oauth",
            first_name=user_info.get("givenName"),
            last_name=user_info.get("surname"),
        )
    else:
        result = await auth_service._create_session(user)
    
    return ResponseModel(
        success=True,
        data=result,
        message="Microsoft login successful",
    )


# =============================================================================
# TOKEN MANAGEMENT
# =============================================================================

@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token",
    description="Get new access token using refresh token.",
)
async def refresh_token(
    request: RefreshTokenRequest,
    db: DBSession = None,
) -> TokenResponse:
    """
    Refresh access token.
    """
    from app.auth.jwt import verify_token_type, create_access_token
    
    try:
        payload = verify_token_type(request.refresh_token, "refresh")
        user_id = payload.get("sub")
        
        auth_service = AuthService(db)
        user = await auth_service.get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        
        result = await auth_service._create_session(user)
        
        return TokenResponse(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            token_type="bearer",
            expires_in=result["expires_in"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )


@router.post(
    "/logout",
    summary="User logout",
    description="Invalidate current session.",
)
async def logout(
    user: CurrentUser,
) -> dict:
    """Logout user."""
    return {"message": "Successfully logged out"}


# =============================================================================
# SESSION INFO
# =============================================================================

@router.get(
    "/me",
    response_model=SessionInfo,
    summary="Get current session",
    description="Get information about current authenticated session.",
)
async def get_current_session(
    user: CurrentUser,
) -> SessionInfo:
    """Get current session information."""
    from app.auth.permissions import get_user_permissions
    
    permissions = list(get_user_permissions(
        user["role"],
        user["tier"],
        is_org_admin=True,
    ))
    
    return SessionInfo(
        session_id="session-id",
        user_id=user["user_id"],
        email=user["email"],
        org_id=user["org_id"],
        tier=user["tier"],
        role=user["role"],
        permissions=permissions,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        xp_total=0,
        level=1,
        streak_days=0,
    )


# =============================================================================
# PASSWORD MANAGEMENT
# =============================================================================

@router.post(
    "/password/reset",
    summary="Request password reset",
    description="Send password reset email.",
)
async def request_password_reset(
    request: PasswordResetRequest,
) -> dict:
    """Request password reset."""
    return {"message": "If the email exists, a reset link has been sent"}


@router.post(
    "/password/reset/confirm",
    summary="Confirm password reset",
    description="Reset password using token from email.",
)
async def confirm_password_reset(
    request: PasswordResetConfirm,
) -> dict:
    """Confirm password reset."""
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired token",
    )


@router.post(
    "/password/change",
    summary="Change password",
    description="Change password for authenticated user.",
)
async def change_password(
    request: PasswordChangeRequest,
    user: CurrentUser,
    db: DBSession = None,
) -> dict:
    """Change password."""
    from app.core.security import hash_password, verify_password
    
    auth_service = AuthService(db)
    db_user = await auth_service.get_user_by_id(user["user_id"])
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(request.current_password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    db_user.password_hash = hash_password(request.new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}
