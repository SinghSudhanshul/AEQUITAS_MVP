"""
Aequitas LV-COP Backend - Transaction Model
===========================================

Transaction model for cash flow data - TimescaleDB hypertable.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Date, DateTime, ForeignKey, Index, Numeric, String, Text, Boolean
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.enums import Currency, TransactionType
from app.models.base import BaseModel


class Transaction(BaseModel):
    """
    Transaction model for cash flow tracking.
    
    This is a TimescaleDB hypertable partitioned by transaction_date.
    Tracks all cash inflows and outflows for forecasting.
    
    Features:
    - Multi-tenant (organization_id)
    - Supports schedules and recurring transactions
    - Settlement tracking
    - Counterparty information
    """
    
    __tablename__ = "transactions"
    
    # TimescaleDB hypertable configuration
    __table_args__ = (
        Index("ix_txn_org_date", "organization_id", "transaction_date"),
        Index("ix_txn_org_type", "organization_id", "transaction_type"),
        Index("ix_txn_settlement", "organization_id", "settlement_date"),
        {"timescaledb_hypertable": {
            "time_column_name": "transaction_date",
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
    
    # User who created
    created_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    
    # Transaction identification
    external_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    
    reference: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # Transaction type (inflow/outflow)
    transaction_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    
    # Amount (positive for inflow, negative for outflow)
    amount: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
    )
    
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
    
    amount_usd: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    # Dates
    transaction_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    
    value_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
    )
    
    settlement_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )
    
    # Time (for intraday tracking)
    transaction_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Category and classification
    category: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    
    subcategory: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Description
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Counterparty
    counterparty_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    counterparty_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    counterparty_type: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    
    # Related security (if applicable)
    security_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    
    security_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # Account/portfolio
    account_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    
    portfolio_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Broker info
    broker: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Settlement status
    is_settled: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    settled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Scheduling
    is_scheduled: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    is_recurring: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    recurrence_rule: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    parent_transaction_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
    )
    
    # Confidence (for predicted transactions)
    is_predicted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    confidence: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 4),
        nullable=True,
    )
    
    # Source
    source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="manual",
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
        default=True,
    )
    
    validation_errors: Mapped[Optional[list]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    def __repr__(self) -> str:
        return f"<Transaction(date={self.transaction_date}, type={self.transaction_type}, amount={self.amount})>"
    
    @property
    def is_inflow(self) -> bool:
        """Check if transaction is an inflow."""
        return self.transaction_type == TransactionType.INFLOW.value
    
    @property
    def is_outflow(self) -> bool:
        """Check if transaction is an outflow."""
        return self.transaction_type == TransactionType.OUTFLOW.value
    
    @property
    def signed_amount(self) -> Decimal:
        """Get signed amount (positive for inflow, negative for outflow)."""
        if self.is_outflow and self.amount > 0:
            return -self.amount
        return self.amount
