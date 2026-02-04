"""
Aequitas LV-COP Backend - User Model
====================================

User model with authentication and gamification support.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import Role, UserStatus
from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.organization import Organization


class User(BaseModel):
    """
    User model representing an individual user.
    
    Features:
    - Auth0 integration
    - Role-based access control
    - Gamification (XP, level, achievements)
    - Organization membership
    """
    
    __tablename__ = "users"
    
    # Organization relationship
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # Authentication
    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )
    
    auth0_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
        index=True,
    )
    
    # Profile
    first_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    last_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    display_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    
    job_title: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    department: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    phone: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    
    timezone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="UTC",
    )
    
    locale: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="en-US",
    )
    
    # Status
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=UserStatus.ACTIVE.value,
        index=True,
    )
    
    # Role and permissions
    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=Role.ANALYST.value,
        index=True,
    )
    
    is_org_admin: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    # Email verification
    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    email_verified_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Activity tracking
    last_login_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    last_active_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    login_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Gamification
    xp_total: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        index=True,
    )
    
    level: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    
    prestige: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    streak_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    longest_streak: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    last_streak_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Preferences
    preferences: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        default=dict,
    )
    
    notification_preferences: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        default=dict,
    )
    
    # Dashboard customization
    dashboard_layout: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    selected_theme: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="dark",
    )
    
    # Onboarding
    onboarding_completed: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    onboarding_step: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        default=0,
    )
    
    # Terms acceptance
    terms_accepted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    privacy_accepted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Soft delete
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="users",
    )
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
    
    @property
    def full_name(self) -> str:
        """Get user's full name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.display_name or self.email.split("@")[0]
    
    @property
    def is_active(self) -> bool:
        """Check if user is active."""
        return self.status == UserStatus.ACTIVE.value and self.deleted_at is None
    
    @property
    def is_admin(self) -> bool:
        """Check if user is an admin."""
        return self.role == Role.ADMIN.value or self.is_org_admin
    
    @property
    def can_manage_users(self) -> bool:
        """Check if user can manage other users."""
        return self.role in [Role.ADMIN.value, Role.MANAGER.value] or self.is_org_admin
    
    def has_permission(self, permission: str) -> bool:
        """
        Check if user has a specific permission.
        
        Permission hierarchy:
        - admin: all permissions
        - manager: CRUD on data, manage analysts
        - analyst: CRUD on own data
        - viewer: read-only
        """
        role_permissions = {
            Role.ADMIN.value: ["*"],
            Role.MANAGER.value: [
                "forecast:read", "forecast:create",
                "position:read", "position:create", "position:update", "position:delete",
                "user:read", "user:invite",
                "broker:read", "broker:connect",
                "analytics:read",
            ],
            Role.ANALYST.value: [
                "forecast:read", "forecast:create",
                "position:read", "position:create", "position:update",
                "analytics:read",
            ],
            Role.VIEWER.value: [
                "forecast:read",
                "position:read",
                "analytics:read",
            ],
        }
        
        user_perms = role_permissions.get(self.role, [])
        return "*" in user_perms or permission in user_perms
