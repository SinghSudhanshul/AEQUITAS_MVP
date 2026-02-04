"""
Aequitas LV-COP Backend - Forecast Actual Model
===============================================

Model for storing actual values to compare against forecasts.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Date, DateTime, ForeignKey, Index, Numeric, String, Boolean
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class ForecastActual(BaseModel):
    """
    Forecast actual model for accuracy tracking.
    
    Stores actual values to compare against forecasts.
    This enables backtesting and accuracy metrics.
    """
    
    __tablename__ = "forecast_actuals"
    
    __table_args__ = (
        Index("ix_actual_org_date", "organization_id", "actual_date"),
        Index("ix_actual_forecast", "forecast_id"),
    )
    
    # Tenant
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # Link to forecast
    forecast_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("forecasts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    # Date of actual
    actual_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    
    # Actual values
    actual_net_flow: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
    )
    
    actual_inflow: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    actual_outflow: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    # Currency
    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
        default="USD",
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
    
    # Accuracy metrics (if forecast linked)
    prediction_error: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    absolute_error: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    
    percentage_error: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 6),
        nullable=True,
    )
    
    within_confidence_interval: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True,
    )
    
    # Data quality
    is_complete: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    
    data_source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="calculated",
    )
    
    # Recorded timestamp
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default="now()",
    )
    
    def __repr__(self) -> str:
        return f"<ForecastActual(date={self.actual_date}, actual={self.actual_net_flow})>"
    
    def calculate_error(self, predicted: Decimal) -> None:
        """Calculate error metrics given a prediction."""
        self.prediction_error = self.actual_net_flow - predicted
        self.absolute_error = abs(self.prediction_error)
        
        if self.actual_net_flow != 0:
            self.percentage_error = self.absolute_error / abs(self.actual_net_flow)
