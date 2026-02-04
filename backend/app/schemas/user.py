"""
Aequitas LV-COP Backend - User Schemas
======================================

User request/response schemas.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import EmailStr, Field

from app.core.enums import Role, UserStatus
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin


class UserBase(BaseSchema):
    """Base user schema with common fields."""
    
    email: EmailStr
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    display_name: Optional[str] = Field(None, max_length=100)
    job_title: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=50)
    timezone: str = Field(default="UTC", max_length=50)
    locale: str = Field(default="en-US", max_length=10)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    
    organization_id: UUID
    role: Role = Field(default=Role.ANALYST)
    password: Optional[str] = Field(None, min_length=12)
    send_invite: bool = Field(default=True)


class UserUpdate(BaseSchema):
    """Schema for updating a user."""
    
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    display_name: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = Field(None, max_length=500)
    job_title: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=50)
    timezone: Optional[str] = Field(None, max_length=50)
    locale: Optional[str] = Field(None, max_length=10)
    selected_theme: Optional[str] = Field(None, max_length=50)
    preferences: Optional[dict] = None
    notification_preferences: Optional[dict] = None


class UserResponse(UserBase, IDMixin, TimestampMixin):
    """User response schema."""
    
    organization_id: UUID
    status: UserStatus
    role: Role
    is_org_admin: bool
    email_verified: bool
    avatar_url: Optional[str] = None
    
    # Activity
    last_login_at: Optional[datetime] = None
    last_active_at: Optional[datetime] = None
    login_count: int = 0
    
    # Gamification
    xp_total: int = 0
    level: int = 1
    prestige: int = 0
    streak_days: int = 0
    longest_streak: int = 0
    
    # Computed
    full_name: Optional[str] = None


class UserListItem(BaseSchema):
    """Minimal user info for lists."""
    
    id: UUID
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Role
    status: UserStatus
    last_active_at: Optional[datetime] = None


class UserInvite(BaseSchema):
    """Schema for inviting a new user."""
    
    email: EmailStr
    role: Role = Field(default=Role.ANALYST)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    message: Optional[str] = Field(None, max_length=500)


class UserPreferences(BaseSchema):
    """User preferences schema."""
    
    theme: str = "dark"
    compact_view: bool = False
    show_tutorials: bool = True
    default_currency: str = "USD"
    default_date_format: str = "YYYY-MM-DD"
    default_number_format: str = "1,234.56"
    dashboard_widgets: Optional[list[str]] = None


class UserNotificationPreferences(BaseSchema):
    """Notification preferences schema."""
    
    email_daily_digest: bool = True
    email_forecast_ready: bool = True
    email_accuracy_reports: bool = True
    email_achievements: bool = True
    push_enabled: bool = True
    slack_enabled: bool = False
    slack_channel: Optional[str] = None
