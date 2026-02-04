"""
Aequitas LV-COP Backend - Forecast Schemas
==========================================

Forecast request/response schemas.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import Field, field_validator

from app.core.enums import ForecastStatus, ForecastType, Regime
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin


class ForecastRequest(BaseSchema):
    """Request schema for generating a forecast."""
    
    forecast_type: ForecastType = Field(default=ForecastType.DAILY)
    target_date: Optional[date] = Field(None, description="Target date for forecast")
    horizon_days: int = Field(default=5, ge=1, le=30)
    account_id: Optional[str] = Field(None, max_length=100)
    portfolio_id: Optional[str] = Field(None, max_length=100)
    include_components: bool = Field(default=True)
    include_features: bool = Field(default=False)
    
    @field_validator("target_date", mode="before")
    @classmethod
    def set_default_target(cls, v):
        if v is None:
            from datetime import date, timedelta
            return date.today() + timedelta(days=1)
        return v


class ForecastBase(BaseSchema):
    """Base forecast schema."""
    
    forecast_type: ForecastType
    forecast_date: date
    target_date: date
    horizon_days: int
    predicted_net_flow_p50: Decimal
    predicted_net_flow_p5: Optional[Decimal] = None
    predicted_net_flow_p95: Optional[Decimal] = None
    currency: str = "USD"
    regime: Regime
    confidence_score: Optional[Decimal] = None


class ForecastResponse(ForecastBase, IDMixin, TimestampMixin):
    """Forecast response schema."""
    
    organization_id: UUID
    status: ForecastStatus
    
    # Components
    predicted_inflow_p50: Optional[Decimal] = None
    predicted_outflow_p50: Optional[Decimal] = None
    
    # Model info
    model_name: str
    model_version: str
    steady_state_weight: Optional[Decimal] = None
    crisis_weight: Optional[Decimal] = None
    
    # Market context
    vix_at_forecast: Optional[Decimal] = None
    credit_spread_at_forecast: Optional[Decimal] = None
    regime_confidence: Optional[Decimal] = None
    
    # Timing
    generated_at: Optional[datetime] = None
    generation_time_ms: Optional[int] = None
    
    # Scope
    account_id: Optional[str] = None
    portfolio_id: Optional[str] = None


class ForecastListItem(BaseSchema):
    """Minimal forecast info for lists."""
    
    id: UUID
    forecast_date: date
    target_date: date
    predicted_net_flow_p50: Decimal
    regime: Regime
    confidence_score: Optional[Decimal] = None
    status: ForecastStatus


class ForecastBatchResponse(BaseSchema):
    """Response for multi-day forecasts."""
    
    organization_id: UUID
    generated_at: datetime
    regime: Regime
    forecasts: list[ForecastResponse]
    
    # Summary
    total_predicted_net_flow: Decimal
    avg_confidence: Optional[Decimal] = None


class ForecastAccuracyMetrics(BaseSchema):
    """Forecast accuracy metrics."""
    
    period_start: date
    period_end: date
    total_forecasts: int
    
    # MAPE (Mean Absolute Percentage Error)
    mape: Optional[Decimal] = None
    
    # MAE (Mean Absolute Error)
    mae: Optional[Decimal] = None
    
    # Directional accuracy
    directional_accuracy: Optional[Decimal] = None
    
    # Confidence interval coverage
    within_90_ci: Optional[Decimal] = None
    
    # By regime
    accuracy_steady_state: Optional[Decimal] = None
    accuracy_elevated: Optional[Decimal] = None
    accuracy_crisis: Optional[Decimal] = None


class ForecastComparison(BaseSchema):
    """Forecast vs actual comparison."""
    
    forecast_id: UUID
    target_date: date
    
    # Predicted
    predicted_net_flow: Decimal
    predicted_p5: Optional[Decimal] = None
    predicted_p95: Optional[Decimal] = None
    
    # Actual
    actual_net_flow: Decimal
    actual_inflow: Optional[Decimal] = None
    actual_outflow: Optional[Decimal] = None
    
    # Error
    error: Decimal
    absolute_error: Decimal
    percentage_error: Optional[Decimal] = None
    within_confidence_interval: bool
    
    # Context
    regime: Regime
