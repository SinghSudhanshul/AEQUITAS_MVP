"""
Aequitas LV-COP Backend - Forecast Model
========================================

Forecast model for storing generated predictions.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Date, DateTime, ForeignKey, Index, Integer, Numeric, String, Text, Boolean
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.enums import ForecastStatus, ForecastType, Regime
from app.models.base import BaseModel


class Forecast(BaseModel):
    """
    Forecast model for liquidity predictions.
    
    Stores:
    - Point estimates (p50)
    - Confidence intervals (p5, p95)
    - Regime at generation time
    - Model version used
    """
    
    __tablename__ = "forecasts"
    
    __table_args__ = (
        Index("ix_forecast_org_date", "organization_id", "forecast_date"),
        Index("ix_forecast_org_target", "organization_id", "target_date"),
        Index("ix_forecast_regime", "organization_id", "regime"),
    )
    
    # Tenant
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # User who requested
    requested_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    
    # Forecast type
    forecast_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=ForecastType.DAILY.value,
        index=True,
    )
    
    # Status
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=ForecastStatus.PENDING.value,
        index=True,
    )
    
    # Dates
    forecast_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    
    target_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    
    horizon_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    
    # Generation timestamp
    generated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    generation_time_ms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    
    # Predictions (quantiles)
    predicted_net_flow_p5: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    predicted_net_flow_p50: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
    )
    
    predicted_net_flow_p95: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    # Individual components
    predicted_inflow_p50: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    predicted_outflow_p50: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    # Currency
    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
        default="USD",
    )
    
    # Regime at time of forecast
    regime: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=Regime.STEADY_STATE.value,
        index=True,
    )
    
    regime_confidence: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 4),
        nullable=True,
    )
    
    # Model information
    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="hybrid",
    )
    
    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="1.0",
    )
    
    steady_state_weight: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 4),
        nullable=True,
    )
    
    crisis_weight: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 4),
        nullable=True,
    )
    
    # Features used
    features_snapshot: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    # Market indicators at forecast time
    vix_at_forecast: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 4),
        nullable=True,
    )
    
    credit_spread_at_forecast: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 4),
        nullable=True,
    )
    
    # Account/portfolio scope
    account_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    portfolio_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Confidence score
    confidence_score: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 4),
        nullable=True,
    )
    
    # Error handling
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Caching
    cached: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    
    cache_key: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # MLflow tracking
    mlflow_run_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    def __repr__(self) -> str:
        return f"<Forecast(target={self.target_date}, p50={self.predicted_net_flow_p50}, regime={self.regime})>"
    
    @property
    def confidence_interval_width(self) -> Decimal | None:
        """Calculate width of confidence interval."""
        if self.predicted_net_flow_p95 and self.predicted_net_flow_p5:
            return self.predicted_net_flow_p95 - self.predicted_net_flow_p5
        return None
    
    @property
    def is_high_confidence(self) -> bool:
        """Check if forecast has high confidence."""
        return self.confidence_score is not None and self.confidence_score >= Decimal("0.85")
    
    @property
    def is_crisis_regime(self) -> bool:
        """Check if forecast was made during crisis regime."""
        return self.regime == Regime.CRISIS.value
