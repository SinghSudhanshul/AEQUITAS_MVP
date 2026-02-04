"""
Aequitas LV-COP Backend - Position Schemas
==========================================

Position request/response schemas.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import Field

from app.core.enums import AssetClass, Currency
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin


class PositionBase(BaseSchema):
    """Base position schema."""
    
    snapshot_date: date
    security_id: str = Field(..., max_length=100)
    security_name: Optional[str] = Field(None, max_length=255)
    ticker: Optional[str] = Field(None, max_length=20)
    isin: Optional[str] = Field(None, max_length=12)
    asset_class: AssetClass = Field(default=AssetClass.EQUITY)
    quantity: Decimal
    price: Decimal
    market_value: Decimal
    currency: Currency = Field(default=Currency.USD)


class PositionCreate(PositionBase):
    """Schema for creating a position."""
    
    sector: Optional[str] = Field(None, max_length=100)
    industry: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=2)
    cost_basis: Optional[Decimal] = None
    account_id: Optional[str] = Field(None, max_length=100)
    portfolio_id: Optional[str] = Field(None, max_length=100)
    broker: Optional[str] = Field(None, max_length=100)


class PositionResponse(PositionBase, IDMixin, TimestampMixin):
    """Position response schema."""
    
    organization_id: UUID
    
    # Additional identifiers
    cusip: Optional[str] = None
    sedol: Optional[str] = None
    
    # Classification
    sector: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    
    # Values
    cost_basis: Optional[Decimal] = None
    unrealized_pnl: Optional[Decimal] = None
    realized_pnl: Optional[Decimal] = None
    fx_rate: Decimal = Decimal("1.0")
    market_value_usd: Optional[Decimal] = None
    portfolio_weight: Optional[Decimal] = None
    
    # Risk
    beta: Optional[Decimal] = None
    volatility_30d: Optional[Decimal] = None
    var_95: Optional[Decimal] = None
    
    # Liquidity
    avg_daily_volume: Optional[Decimal] = None
    days_to_liquidate: Optional[Decimal] = None
    
    # Grouping
    account_id: Optional[str] = None
    portfolio_id: Optional[str] = None
    strategy: Optional[str] = None
    broker: Optional[str] = None
    
    # Source
    source: str = "csv_upload"


class PositionListItem(BaseSchema):
    """Minimal position for lists."""
    
    id: UUID
    snapshot_date: date
    security_id: str
    security_name: Optional[str] = None
    ticker: Optional[str] = None
    asset_class: AssetClass
    market_value: Decimal
    portfolio_weight: Optional[Decimal] = None


class PositionUploadRequest(BaseSchema):
    """Request schema for CSV upload."""
    
    file_name: str
    date_column: str = "date"
    security_column: str = "security_id"
    quantity_column: str = "quantity"
    price_column: str = "price"
    value_column: Optional[str] = "market_value"
    currency_column: Optional[str] = None
    has_header: bool = True
    date_format: str = "%Y-%m-%d"


class PositionUploadResponse(BaseSchema):
    """Response for position upload."""
    
    upload_id: UUID
    file_name: str
    rows_total: int
    rows_processed: int
    rows_failed: int
    positions_created: int
    errors: list[dict] = []
    warnings: list[dict] = []
    processing_time_ms: int


class PortfolioSummary(BaseSchema):
    """Portfolio summary response."""
    
    organization_id: UUID
    snapshot_date: date
    
    # Totals
    total_market_value: Decimal
    total_positions: int
    total_securities: int
    
    # By asset class
    by_asset_class: dict[str, Decimal]
    
    # By currency
    by_currency: dict[str, Decimal]
    
    # By sector
    by_sector: dict[str, Decimal]
    
    # Top positions
    top_positions: list[PositionListItem]
    
    # Risk metrics
    portfolio_beta: Optional[Decimal] = None
    portfolio_volatility: Optional[Decimal] = None
    var_95: Optional[Decimal] = None
