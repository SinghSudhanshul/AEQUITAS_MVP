"""
Aequitas LV-COP Backend - Position Snapshot Model
=================================================

Position data model - TimescaleDB hypertable for time-series data.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Boolean, Date, DateTime, ForeignKey, Index, Integer,
    Numeric, String, Text
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.enums import AssetClass, Currency
from app.models.base import BaseModel


class PositionSnapshot(BaseModel):
    """
    Position snapshot model for point-in-time portfolio data.
    
    This is a TimescaleDB hypertable partitioned by snapshot_date.
    Each row represents a position at a specific point in time.
    
    Features:
    - Multi-tenant (organization_id)
    - Time-series optimized
    - Supports multiple currencies
    - Asset class classification
    """
    
    __tablename__ = "position_snapshots"
    
    # TimescaleDB will partition on this column
    __table_args__ = (
        Index("ix_positions_org_date", "organization_id", "snapshot_date"),
        Index("ix_positions_org_security", "organization_id", "security_id"),
        {"timescaledb_hypertable": {
            "time_column_name": "snapshot_date",
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
    
    # User who uploaded
    uploaded_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    
    # Time dimension
    snapshot_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    
    snapshot_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Security identification
    security_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    
    security_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    isin: Mapped[Optional[str]] = mapped_column(
        String(12),
        nullable=True,
        index=True,
    )
    
    cusip: Mapped[Optional[str]] = mapped_column(
        String(9),
        nullable=True,
    )
    
    sedol: Mapped[Optional[str]] = mapped_column(
        String(7),
        nullable=True,
    )
    
    ticker: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        index=True,
    )
    
    # Classification
    asset_class: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=AssetClass.EQUITY.value,
        index=True,
    )
    
    sector: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    industry: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    country: Mapped[Optional[str]] = mapped_column(
        String(2),
        nullable=True,
    )
    
    # Position data
    quantity: Mapped[Decimal] = mapped_column(
        Numeric(20, 8),
        nullable=False,
    )
    
    price: Mapped[Decimal] = mapped_column(
        Numeric(20, 8),
        nullable=False,
    )
    
    market_value: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
    )
    
    cost_basis: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    unrealized_pnl: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    realized_pnl: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    # Currency
    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
        default=Currency.USD.value,
    )
    
    fx_rate: Mapped[Decimal] = mapped_column(
        Numeric(15, 8),
        nullable=False,
        default=1.0,
    )
    
    market_value_usd: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    # Weight and allocation
    portfolio_weight: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 6),
        nullable=True,
    )
    
    # Risk metrics
    beta: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 6),
        nullable=True,
    )
    
    volatility_30d: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 6),
        nullable=True,
    )
    
    var_95: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    # Liquidity
    avg_daily_volume: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 2),
        nullable=True,
    )
    
    days_to_liquidate: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )
    
    # Account/portfolio grouping
    account_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    
    portfolio_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    
    strategy: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Broker info
    broker: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    prime_broker: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Data source
    source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="csv_upload",
    )
    
    source_file: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # Custom fields
    custom_fields: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    # Validation
    is_validated: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    validation_errors: Mapped[Optional[list]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    def __repr__(self) -> str:
        return f"<PositionSnapshot(date={self.snapshot_date}, security={self.security_id}, value={self.market_value})>"
