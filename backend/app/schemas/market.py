"""
Aequitas LV-COP Backend - Market Schemas
========================================

Market data and regime detection schemas.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import Field

from app.core.enums import Regime
from app.schemas.base import BaseSchema


class MarketRegimeResponse(BaseSchema):
    """Current market regime response."""
    
    regime: Regime
    regime_confidence: Decimal = Field(ge=0, le=1)
    
    # Key indicators
    vix_current: Decimal
    vix_percentile_90d: Optional[Decimal] = None
    credit_spread_current: Optional[Decimal] = None
    credit_spread_percentile_90d: Optional[Decimal] = None
    repo_rate_current: Optional[Decimal] = None
    
    # Thresholds
    vix_threshold_elevated: Decimal = Decimal("25.0")
    vix_threshold_crisis: Decimal = Decimal("40.0")
    
    # Trend
    vix_change_1d: Optional[Decimal] = None
    vix_change_7d: Optional[Decimal] = None
    
    # Timestamps
    last_updated: datetime
    data_as_of: date


class MarketIndicatorValue(BaseSchema):
    """Single market indicator value."""
    
    indicator_name: str
    value: Decimal
    date: date
    time: Optional[datetime] = None
    change: Optional[Decimal] = None
    change_percent: Optional[Decimal] = None
    source: str


class MarketIndicatorSeries(BaseSchema):
    """Time series of market indicator."""
    
    indicator_name: str
    unit: Optional[str] = None
    source: str
    data: list[dict]  # [{date, value, ...}]
    
    # Statistics
    current: Decimal
    high_52w: Optional[Decimal] = None
    low_52w: Optional[Decimal] = None
    mean_90d: Optional[Decimal] = None
    std_90d: Optional[Decimal] = None


class MarketSnapshot(BaseSchema):
    """Complete market snapshot."""
    
    as_of: datetime
    regime: Regime
    
    indicators: dict[str, MarketIndicatorValue]
    
    # Key metrics
    vix: MarketIndicatorValue
    sp500: Optional[MarketIndicatorValue] = None
    treasury_10y: Optional[MarketIndicatorValue] = None
    credit_spread_ig: Optional[MarketIndicatorValue] = None
    credit_spread_hy: Optional[MarketIndicatorValue] = None


class RegimeHistory(BaseSchema):
    """Historical regime changes."""
    
    start_date: date
    end_date: date
    
    regimes: list[dict]  # [{start, end, regime, duration_days}]
    
    # Summary
    days_steady_state: int
    days_elevated: int
    days_crisis: int
    
    # Transitions
    total_transitions: int
    transition_details: list[dict]


class CrisisAlert(BaseSchema):
    """Crisis alert notification."""
    
    alert_id: str
    alert_type: str  # regime_change, threshold_breach, volatility_spike
    severity: str  # info, warning, critical
    
    current_regime: Regime
    previous_regime: Optional[Regime] = None
    
    message: str
    details: dict
    
    triggered_at: datetime
    indicators: dict[str, Decimal]
