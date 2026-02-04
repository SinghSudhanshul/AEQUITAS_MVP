"""
Aequitas LV-COP Backend - API Usage Model
=========================================

Model for tracking API usage by organization/user.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import Date, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class APIUsage(BaseModel):
    """
    API usage model for rate limiting and billing.
    
    Tracks:
    - Daily API calls by organization/user
    - Endpoint usage patterns
    - Rate limit consumption
    """
    
    __tablename__ = "api_usage"
    
    __table_args__ = (
        Index("ix_api_usage_org_date", "organization_id", "usage_date"),
        Index("ix_api_usage_user_date", "user_id", "usage_date"),
        {"timescaledb_hypertable": {
            "time_column_name": "usage_date",
            "partitioning_column": "organization_id",
        }},
    )
    
    # Tenant
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # User (nullable for org-level tracking)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    # Date
    usage_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    
    # Endpoint (optional, for detailed tracking)
    endpoint: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )
    
    # Counts
    request_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    success_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    error_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    rate_limited_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Specific endpoint counts
    forecast_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    upload_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    broker_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    analytics_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Data volume
    bytes_uploaded: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    bytes_downloaded: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    rows_processed: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Timing
    total_response_time_ms: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Limits
    daily_limit: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=100,
    )
    
    limit_percentage_used: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    def __repr__(self) -> str:
        return f"<APIUsage(org={self.organization_id}, date={self.usage_date}, requests={self.request_count})>"
    
    @property
    def avg_response_time_ms(self) -> float:
        """Calculate average response time."""
        if self.request_count == 0:
            return 0
        return self.total_response_time_ms / self.request_count
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate percentage."""
        if self.request_count == 0:
            return 100.0
        return (self.success_count / self.request_count) * 100
    
    @property
    def remaining_requests(self) -> int:
        """Calculate remaining requests for the day."""
        return max(0, self.daily_limit - self.request_count)
    
    @property
    def is_rate_limited(self) -> bool:
        """Check if usage has hit rate limit."""
        return self.request_count >= self.daily_limit
