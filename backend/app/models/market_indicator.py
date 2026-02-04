"""
Aequitas LV-COP Backend - Market Indicator Model
================================================

Model for storing market indicators used in regime detection.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Date, DateTime, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class MarketIndicator(BaseModel):
    """
    Market indicator model for regime detection.
    
    Stores time-series market data:
    - VIX (volatility index)
    - Credit spreads (IG, HY)
    - Repo rates
    - Treasury yields
    - Other macro indicators
    """
    
    __tablename__ = "market_indicators"
    
    __table_args__ = (
        Index("ix_market_date", "indicator_date"),
        Index("ix_market_name_date", "indicator_name", "indicator_date"),
        {"timescaledb_hypertable": {
            "time_column_name": "indicator_date",
        }},
    )
    
    # Indicator identification
    indicator_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    
    indicator_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    
    # Date/time
    indicator_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    
    indicator_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Value
    value: Mapped[Decimal] = mapped_column(
        Numeric(20, 8),
        nullable=False,
    )
    
    # Additional values for range data
    open_value: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    high_value: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    low_value: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    close_value: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    # Change metrics
    change: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    change_percent: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 6),
        nullable=True,
    )
    
    # Statistical values
    rolling_mean_7d: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    rolling_mean_30d: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    rolling_std_30d: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 8),
        nullable=True,
    )
    
    z_score: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 6),
        nullable=True,
    )
    
    percentile_90d: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 6),
        nullable=True,
    )
    
    # Source
    source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="fred",
    )
    
    source_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Unit and description
    unit: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Metadata
    metadata: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    def __repr__(self) -> str:
        return f"<MarketIndicator(name={self.indicator_name}, date={self.indicator_date}, value={self.value})>"


# Predefined indicator names
class IndicatorNames:
    """Standard indicator names."""
    VIX = "vix"
    VIX_CLOSE = "vix_close"
    IG_CREDIT_SPREAD = "ig_credit_spread"
    HY_CREDIT_SPREAD = "hy_credit_spread"
    REPO_RATE_OVERNIGHT = "repo_rate_overnight"
    REPO_RATE_30D = "repo_rate_30d"
    TREASURY_2Y = "treasury_2y"
    TREASURY_10Y = "treasury_10y"
    TREASURY_SPREAD_2_10 = "treasury_spread_2_10"
    FED_FUNDS_RATE = "fed_funds_rate"
    SP500 = "sp500"
    SP500_VOLATILITY = "sp500_volatility"
    MOVE_INDEX = "move_index"
    TED_SPREAD = "ted_spread"
    LIBOR_OIS_SPREAD = "libor_ois_spread"
