"""
Aequitas LV-COP Backend - Auth Schemas
======================================

Authentication and authorization schemas.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.base import BaseSchema


class LoginRequest(BaseSchema):
    """Login request schema."""
    
    email: EmailStr = Field(..., example="user@aequitas.ai")
    password: str = Field(..., min_length=8, example="SecurePass123!")


class RefreshTokenRequest(BaseSchema):
    """Refresh token request schema."""
    
    refresh_token: str = Field(..., min_length=10)


class TokenResponse(BaseSchema):
    """Token response schema."""
    
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer")
    expires_in: int = Field(..., description="Token expiry in seconds")
    refresh_token: Optional[str] = Field(None, description="Refresh token")
    scope: Optional[str] = Field(None, description="Token scope")


class PasswordResetRequest(BaseSchema):
    """Password reset request schema."""
    
    email: EmailStr = Field(..., example="user@aequitas.ai")


class PasswordResetConfirm(BaseSchema):
    """Password reset confirmation schema."""
    
    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=12)
    confirm_password: str = Field(..., min_length=12)
    
    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v
    
    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password meets security requirements."""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain digit")
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in v):
            raise ValueError("Password must contain special character")
        return v


class PasswordChangeRequest(BaseSchema):
    """Password change request schema."""
    
    current_password: str = Field(...)
    new_password: str = Field(..., min_length=12)
    confirm_password: str = Field(..., min_length=12)
    
    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v


class Auth0UserInfo(BaseSchema):
    """Auth0 user info schema."""
    
    sub: str = Field(..., description="Auth0 user ID")
    email: EmailStr
    email_verified: bool = False
    name: Optional[str] = None
    picture: Optional[str] = None
    nickname: Optional[str] = None
    updated_at: Optional[datetime] = None


class SessionInfo(BaseSchema):
    """User session information."""
    
    session_id: str
    user_id: str
    email: str
    org_id: str
    tier: str
    role: str
    permissions: list[str]
    expires_at: datetime
    
    # Gamification quick stats
    xp_total: int = 0
    level: int = 1
    streak_days: int = 0
