"""
Aequitas LV-COP Backend - Organization Schemas
=============================================

Organization request/response schemas.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import EmailStr, Field

from app.core.enums import OrganizationStatus, Tier
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin


class OrganizationBase(BaseSchema):
    """Base organization schema."""
    
    name: str = Field(..., min_length=2, max_length=255)
    primary_email: Optional[EmailStr] = None
    primary_contact_name: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    industry: Optional[str] = Field(None, max_length=100)
    company_size: Optional[str] = Field(None, max_length=50)


class OrganizationCreate(OrganizationBase):
    """Schema for creating a new organization."""
    
    slug: Optional[str] = Field(None, max_length=100, pattern=r"^[a-z0-9-]+$")
    tier: Tier = Field(default=Tier.FREE)


class OrganizationUpdate(BaseSchema):
    """Schema for updating an organization."""
    
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    primary_email: Optional[EmailStr] = None
    primary_contact_name: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    industry: Optional[str] = Field(None, max_length=100)
    company_size: Optional[str] = Field(None, max_length=50)
    address_line1: Optional[str] = Field(None, max_length=255)
    address_line2: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=2)
    settings: Optional[dict] = None


class OrganizationResponse(OrganizationBase, IDMixin, TimestampMixin):
    """Organization response schema."""
    
    slug: str
    tier: Tier
    status: OrganizationStatus
    
    # Billing
    stripe_customer_id: Optional[str] = None
    trial_ends_at: Optional[datetime] = None
    
    # Limits
    daily_api_limit: int
    
    # Features
    feature_broker_api: bool
    feature_realtime: bool
    feature_crisis_simulator: bool
    feature_gamification: bool
    
    # Onboarding
    onboarding_completed: bool
    onboarding_step: Optional[int] = None
    
    # Address
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None


class OrganizationStats(BaseSchema):
    """Organization statistics."""
    
    total_users: int = 0
    active_users_30d: int = 0
    total_forecasts: int = 0
    forecasts_this_month: int = 0
    avg_accuracy: Optional[float] = None
    api_calls_today: int = 0
    api_calls_month: int = 0
    storage_used_mb: float = 0
    broker_connections: int = 0


class OrganizationUsage(BaseSchema):
    """Organization usage summary."""
    
    organization_id: UUID
    period_start: datetime
    period_end: datetime
    
    api_calls: int = 0
    forecasts_generated: int = 0
    files_uploaded: int = 0
    data_rows_processed: int = 0
    storage_used_bytes: int = 0
    
    limit_api_calls: int = 100
    limit_storage_bytes: int = 1_073_741_824  # 1GB


class SubscriptionInfo(BaseSchema):
    """Subscription information."""
    
    tier: Tier
    status: str
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    trial_end: Optional[datetime] = None
    
    # Features
    api_limit_daily: int
    realtime_enabled: bool
    broker_api_enabled: bool
    support_level: str = "community"
