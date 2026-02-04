"""
Aequitas LV-COP Backend - JWT Utilities
======================================

JWT token creation and validation for Auth0 and local tokens.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from datetime import datetime, timedelta
from typing import Any, Optional

import httpx
import jwt
from jwt import PyJWKClient

from app.config import settings
from app.exceptions import InvalidTokenError, TokenExpiredError

logger = logging.getLogger(__name__)


# Cache for Auth0 JWKS
_jwks_client: Optional[PyJWKClient] = None


def get_jwks_client() -> PyJWKClient:
    """Get or create JWKS client for Auth0."""
    global _jwks_client
    
    if _jwks_client is None and settings.AUTH0_DOMAIN:
        _jwks_client = PyJWKClient(
            settings.auth0_jwks_url,
            cache_keys=True,
            lifespan=3600,  # Cache keys for 1 hour
        )
    
    return _jwks_client


def create_access_token(
    data: dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Payload data to encode
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "iss": "aequitas",
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    
    return encoded_jwt


def create_refresh_token(
    user_id: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a refresh token.
    
    Args:
        user_id: User ID to encode
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded refresh token string
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "sub": user_id,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh",
    }
    
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT token.
    
    Supports both Auth0 tokens and local tokens.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded token payload
    
    Raises:
        InvalidTokenError: If token is invalid
        TokenExpiredError: If token has expired
    """
    try:
        # Try to decode as local token first
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={
                "verify_exp": True,
                "verify_iat": True,
            },
        )
        return payload
        
    except jwt.ExpiredSignatureError:
        raise TokenExpiredError()
    
    except jwt.InvalidTokenError:
        # If local decode fails, try Auth0
        if settings.AUTH0_DOMAIN:
            return decode_auth0_token(token)
        raise InvalidTokenError()


def decode_auth0_token(token: str) -> dict[str, Any]:
    """
    Decode and validate an Auth0 JWT token.
    
    Args:
        token: Auth0 JWT token
    
    Returns:
        Decoded token payload
    
    Raises:
        InvalidTokenError: If token is invalid
        TokenExpiredError: If token has expired
    """
    try:
        jwks_client = get_jwks_client()
        if not jwks_client:
            raise InvalidTokenError("Auth0 not configured")
        
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=settings.AUTH0_ALGORITHMS,
            audience=settings.AUTH0_AUDIENCE,
            issuer=settings.auth0_issuer,
            options={
                "verify_exp": True,
                "verify_aud": True,
                "verify_iss": True,
            },
        )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise TokenExpiredError()
    
    except jwt.InvalidAudienceError:
        raise InvalidTokenError("Invalid audience")
    
    except jwt.InvalidIssuerError:
        raise InvalidTokenError("Invalid issuer")
    
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid Auth0 token: {e}")
        raise InvalidTokenError()


def verify_token_type(token: str, expected_type: str = "access") -> dict[str, Any]:
    """
    Verify token is of expected type.
    
    Args:
        token: JWT token
        expected_type: Expected token type (access or refresh)
    
    Returns:
        Decoded payload
    
    Raises:
        InvalidTokenError: If token type doesn't match
    """
    payload = decode_token(token)
    
    token_type = payload.get("type", "access")
    if token_type != expected_type:
        raise InvalidTokenError(f"Expected {expected_type} token, got {token_type}")
    
    return payload


def extract_user_from_token(token: str) -> dict[str, Any]:
    """
    Extract user information from token.
    
    Args:
        token: JWT token
    
    Returns:
        User dictionary with id, email, org_id, role, tier
    """
    payload = decode_token(token)
    
    # For Auth0 tokens
    if "sub" in payload and payload.get("iss", "").startswith("https://"):
        return {
            "user_id": payload.get("sub"),
            "email": payload.get("email") or payload.get(f"{settings.AUTH0_AUDIENCE}/email"),
            "org_id": payload.get(f"{settings.AUTH0_AUDIENCE}/org_id"),
            "role": payload.get(f"{settings.AUTH0_AUDIENCE}/role", "viewer"),
            "tier": payload.get(f"{settings.AUTH0_AUDIENCE}/tier", "free"),
        }
    
    # For local tokens
    return {
        "user_id": payload.get("sub") or payload.get("user_id"),
        "email": payload.get("email"),
        "org_id": payload.get("org_id"),
        "role": payload.get("role", "viewer"),
        "tier": payload.get("tier", "free"),
    }
