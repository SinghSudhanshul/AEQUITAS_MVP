"""
Aequitas LV-COP Backend - FastAPI Dependencies
==============================================

Reusable dependency injection functions for routes.
Provides database sessions, authentication, authorization, and pagination.

Author: Aequitas Engineering
Version: 1.0.0
"""

from typing import Annotated, AsyncGenerator, Optional

from fastapi import Depends, Header, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database.session import get_db_session
from app.database.redis import get_redis_client
from app.exceptions import (
    AuthenticationError,
    AuthorizationError,
    SubscriptionRequiredError,
)


# =============================================================================
# DATABASE DEPENDENCIES
# =============================================================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Get database session for dependency injection.
    
    Yields:
        AsyncSession: SQLAlchemy async session
    
    Example:
        @app.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    async for session in get_db_session():
        yield session


# Type alias for database dependency
DBSession = Annotated[AsyncSession, Depends(get_db)]


# =============================================================================
# REDIS DEPENDENCIES
# =============================================================================

async def get_redis():
    """
    Get Redis client for dependency injection.
    
    Returns:
        Redis client instance
    """
    return await get_redis_client()


# =============================================================================
# AUTHENTICATION DEPENDENCIES
# =============================================================================

async def get_current_user_optional(
    request: Request,
    authorization: Optional[str] = Header(None),
) -> Optional[dict]:
    """
    Get current user if authenticated, None otherwise.
    
    For endpoints that work with or without authentication.
    """
    if not authorization:
        return None
    
    try:
        return await get_current_user(request, authorization)
    except AuthenticationError:
        return None


async def get_current_user(
    request: Request,
    authorization: str = Header(..., description="Bearer token"),
) -> dict:
    """
    Get current authenticated user.
    
    Validates JWT token and returns user information.
    
    Args:
        request: FastAPI request object
        authorization: Authorization header value
    
    Returns:
        User dictionary with id, email, org_id, role, tier
    
    Raises:
        AuthenticationError: If token is missing or invalid
    """
    if not authorization:
        raise AuthenticationError("Authorization header required")
    
    if not authorization.startswith("Bearer "):
        raise AuthenticationError("Invalid authorization header format")
    
    token = authorization.replace("Bearer ", "")
    
    # TODO: Implement actual JWT validation with Auth0
    # For now, return mock user for development
    if settings.DEBUG and token == "dev-token":
        return {
            "user_id": "dev-user-id",
            "email": "dev@aequitas.ai",
            "org_id": "dev-org-id",
            "role": "admin",
            "tier": "enterprise",
        }
    
    # In production, validate token with Auth0
    # from app.auth.jwt import decode_token
    # user = await decode_token(token)
    
    raise AuthenticationError("Invalid token")


# Type alias for authenticated user dependency
CurrentUser = Annotated[dict, Depends(get_current_user)]
OptionalUser = Annotated[Optional[dict], Depends(get_current_user_optional)]


# =============================================================================
# AUTHORIZATION DEPENDENCIES
# =============================================================================

def require_role(*allowed_roles: str):
    """
    Dependency factory that requires user to have one of the specified roles.
    
    Args:
        allowed_roles: List of roles that can access the endpoint
    
    Example:
        @app.get("/admin")
        async def admin_endpoint(user: dict = Depends(require_role("admin"))):
            ...
    """
    async def role_checker(user: dict = Depends(get_current_user)) -> dict:
        user_role = user.get("role", "")
        if user_role not in allowed_roles:
            raise AuthorizationError(
                f"Role '{user_role}' not authorized. Required: {', '.join(allowed_roles)}"
            )
        return user
    
    return role_checker


def require_tier(*allowed_tiers: str):
    """
    Dependency factory that requires user's organization to have specified tier.
    
    Args:
        allowed_tiers: List of subscription tiers that can access the endpoint
    
    Example:
        @app.get("/premium-feature")
        async def premium_feature(user: dict = Depends(require_tier("premium", "enterprise"))):
            ...
    """
    async def tier_checker(user: dict = Depends(get_current_user)) -> dict:
        user_tier = user.get("tier", "free")
        if user_tier not in allowed_tiers:
            raise SubscriptionRequiredError(
                required_tier=allowed_tiers[0],
                current_tier=user_tier,
                feature="this endpoint",
            )
        return user
    
    return tier_checker


# Convenience dependencies for common tier checks
RequirePremium = Depends(require_tier("premium", "enterprise"))
RequireEnterprise = Depends(require_tier("enterprise"))
RequireAdmin = Depends(require_role("admin"))


# =============================================================================
# PAGINATION DEPENDENCIES
# =============================================================================

class PaginationParams:
    """Pagination parameters for list endpoints."""
    
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    ):
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size
        self.limit = page_size


Pagination = Annotated[PaginationParams, Depends()]


# =============================================================================
# SORTING DEPENDENCIES
# =============================================================================

class SortingParams:
    """Sorting parameters for list endpoints."""
    
    def __init__(
        self,
        sort_by: str = Query("created_at", description="Field to sort by"),
        sort_order: str = Query(
            "desc",
            regex="^(asc|desc)$",
            description="Sort order (asc or desc)",
        ),
    ):
        self.sort_by = sort_by
        self.sort_order = sort_order
        self.is_ascending = sort_order == "asc"


Sorting = Annotated[SortingParams, Depends()]


# =============================================================================
# FILTERING DEPENDENCIES
# =============================================================================

class DateRangeFilter:
    """Date range filter for time-series data."""
    
    def __init__(
        self,
        start_date: Optional[str] = Query(
            None,
            description="Start date (YYYY-MM-DD)",
            regex=r"^\d{4}-\d{2}-\d{2}$",
        ),
        end_date: Optional[str] = Query(
            None,
            description="End date (YYYY-MM-DD)",
            regex=r"^\d{4}-\d{2}-\d{2}$",
        ),
    ):
        self.start_date = start_date
        self.end_date = end_date


DateRange = Annotated[DateRangeFilter, Depends()]


# =============================================================================
# REQUEST CONTEXT
# =============================================================================

class RequestContext:
    """Request context with user, organization, and request metadata."""
    
    def __init__(
        self,
        request: Request,
        user: Optional[dict] = None,
    ):
        self.request = request
        self.user = user
        self.request_id = getattr(request.state, "request_id", None)
    
    @property
    def user_id(self) -> Optional[str]:
        return self.user.get("user_id") if self.user else None
    
    @property
    def org_id(self) -> Optional[str]:
        return self.user.get("org_id") if self.user else None
    
    @property
    def tier(self) -> str:
        return self.user.get("tier", "free") if self.user else "free"
    
    @property
    def role(self) -> Optional[str]:
        return self.user.get("role") if self.user else None


async def get_request_context(
    request: Request,
    user: Optional[dict] = Depends(get_current_user_optional),
) -> RequestContext:
    """Get request context with user information."""
    return RequestContext(request=request, user=user)


Context = Annotated[RequestContext, Depends(get_request_context)]
