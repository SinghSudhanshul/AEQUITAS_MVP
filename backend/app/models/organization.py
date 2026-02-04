"""
Aequitas LV-COP Backend - Organization Model
============================================

Organization (tenant) model for multi-tenancy.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import OrganizationStatus, Tier
from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.broker_connection import BrokerConnection


class Organization(BaseModel):
    """
    Organization model representing a client/tenant.
    
    Each organization has:
    - Unique subscription tier
    - Multiple users
    - Isolated data (positions, forecasts, etc.)
    - Broker connections
    - API usage tracking
    """
    
    __tablename__ = "organizations"
    
    # Basic info
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    
    slug: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )
    
    # Subscription
    tier: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=Tier.FREE.value,
        index=True,
    )
    
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=OrganizationStatus.ACTIVE.value,
        index=True,
    )
    
    # Trial info
    trial_ends_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True,
    )
    
    # Stripe integration
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
        index=True,
    )
    
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
    )
    
    # API limits
    daily_api_limit: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=100,  # Free tier default
    )
    
    # Settings
    settings: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        default=dict,
    )
    
    # Contact info
    primary_email: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    primary_contact_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    phone: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    
    # Industry and size
    industry: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    company_size: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    
    # Address
    address_line1: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    address_line2: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    city: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    state: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    postal_code: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
    )
    
    country: Mapped[Optional[str]] = mapped_column(
        String(2),
        nullable=True,
        default="US",
    )
    
    # Features flags
    feature_broker_api: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    feature_realtime: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    feature_crisis_simulator: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    
    feature_gamification: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
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
    
    # Relationships
    users: Mapped[list["User"]] = relationship(
        "User",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
    
    broker_connections: Mapped[list["BrokerConnection"]] = relationship(
        "BrokerConnection",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        return f"<Organization(id={self.id}, name={self.name}, tier={self.tier})>"
    
    @property
    def is_premium(self) -> bool:
        """Check if organization has premium tier or higher."""
        return self.tier in [Tier.PREMIUM.value, Tier.ENTERPRISE.value]
    
    @property
    def is_enterprise(self) -> bool:
        """Check if organization has enterprise tier."""
        return self.tier == Tier.ENTERPRISE.value
    
    @property
    def is_trial(self) -> bool:
        """Check if organization is in trial period."""
        return self.status == OrganizationStatus.TRIAL.value
    
    @property
    def can_use_broker_api(self) -> bool:
        """Check if organization can use broker API feature."""
        return self.feature_broker_api and self.is_premium
    
    @property
    def can_use_realtime(self) -> bool:
        """Check if organization can use real-time forecasts."""
        return self.feature_realtime and self.is_enterprise
