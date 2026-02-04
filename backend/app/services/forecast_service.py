"""
Aequitas LV-COP Backend - Forecast Service
==========================================

Forecast generation and management service.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.enums import ForecastStatus, ForecastType, Regime
from app.database.redis import cache
from app.exceptions import ForecastError, InsufficientDataError
from app.models.forecast import Forecast
from app.models.position import PositionSnapshot

logger = logging.getLogger(__name__)


class ForecastService:
    """
    Service for generating and managing forecasts.
    
    Orchestrates:
    - Data preparation
    - Regime detection
    - Model selection (steady-state vs crisis)
    - Forecast generation
    - Caching
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def generate_forecast(
        self,
        organization_id: UUID,
        user_id: UUID,
        target_date: Optional[date] = None,
        horizon_days: int = 5,
        forecast_type: ForecastType = ForecastType.DAILY,
        account_id: Optional[str] = None,
        portfolio_id: Optional[str] = None,
    ) -> Forecast:
        """
        Generate a liquidity forecast.
        
        Args:
            organization_id: Organization ID
            user_id: User requesting forecast
            target_date: Target date for forecast (default: tomorrow)
            horizon_days: Number of days to forecast
            forecast_type: Type of forecast
            account_id: Optional account filter
            portfolio_id: Optional portfolio filter
        
        Returns:
            Generated Forecast object
        
        Raises:
            InsufficientDataError: If not enough historical data
            ForecastError: If forecast generation fails
        """
        if target_date is None:
            target_date = date.today() + timedelta(days=1)
        
        forecast_date = date.today()
        
        # Check cache first
        cache_key = self._get_cache_key(
            organization_id, target_date, account_id, portfolio_id
        )
        cached = await self._get_cached_forecast(cache_key)
        if cached:
            logger.info(f"Returning cached forecast for {target_date}")
            return cached
        
        # Create forecast record
        forecast = Forecast(
            organization_id=organization_id,
            requested_by=user_id,
            forecast_type=forecast_type.value,
            status=ForecastStatus.PROCESSING.value,
            forecast_date=forecast_date,
            target_date=target_date,
            horizon_days=horizon_days,
            account_id=account_id,
            portfolio_id=portfolio_id,
        )
        
        self.db.add(forecast)
        await self.db.flush()
        
        try:
            start_time = datetime.utcnow()
            
            # Step 1: Validate data availability
            await self._validate_data_availability(organization_id, account_id)
            
            # Step 2: Get current market regime
            regime, regime_confidence = await self._get_market_regime()
            forecast.regime = regime.value
            forecast.regime_confidence = regime_confidence
            
            # Step 3: Get market indicators
            vix, credit_spread = await self._get_market_indicators()
            forecast.vix_at_forecast = vix
            forecast.credit_spread_at_forecast = credit_spread
            
            # Step 4: Generate prediction
            prediction = await self._generate_prediction(
                organization_id=organization_id,
                target_date=target_date,
                regime=regime,
                account_id=account_id,
                portfolio_id=portfolio_id,
            )
            
            # Step 5: Update forecast with prediction
            forecast.predicted_net_flow_p5 = prediction["p5"]
            forecast.predicted_net_flow_p50 = prediction["p50"]
            forecast.predicted_net_flow_p95 = prediction["p95"]
            forecast.predicted_inflow_p50 = prediction.get("inflow_p50")
            forecast.predicted_outflow_p50 = prediction.get("outflow_p50")
            forecast.steady_state_weight = prediction.get("steady_state_weight")
            forecast.crisis_weight = prediction.get("crisis_weight")
            forecast.confidence_score = prediction.get("confidence")
            forecast.model_name = prediction.get("model_name", "hybrid")
            forecast.model_version = prediction.get("model_version", settings.MODEL_VERSION)
            
            # Step 6: Mark complete
            end_time = datetime.utcnow()
            forecast.generated_at = end_time
            forecast.generation_time_ms = int((end_time - start_time).total_seconds() * 1000)
            forecast.status = ForecastStatus.COMPLETED.value
            
            await self.db.commit()
            
            # Cache the result
            await self._cache_forecast(cache_key, forecast)
            
            logger.info(
                f"Generated forecast for org={organization_id}, "
                f"target={target_date}, regime={regime.value}, "
                f"p50={forecast.predicted_net_flow_p50}"
            )
            
            return forecast
            
        except Exception as e:
            forecast.status = ForecastStatus.FAILED.value
            forecast.error_message = str(e)
            await self.db.commit()
            logger.error(f"Forecast generation failed: {e}")
            raise ForecastError(f"Forecast generation failed: {e}")
    
    async def get_forecast(
        self,
        forecast_id: UUID,
        organization_id: UUID,
    ) -> Optional[Forecast]:
        """Get a forecast by ID."""
        result = await self.db.execute(
            select(Forecast).where(
                Forecast.id == forecast_id,
                Forecast.organization_id == organization_id,
            )
        )
        return result.scalar_one_or_none()
    
    async def get_daily_forecast(
        self,
        organization_id: UUID,
        target_date: Optional[date] = None,
    ) -> Optional[Forecast]:
        """Get the most recent daily forecast."""
        if target_date is None:
            target_date = date.today() + timedelta(days=1)
        
        result = await self.db.execute(
            select(Forecast)
            .where(
                Forecast.organization_id == organization_id,
                Forecast.target_date == target_date,
                Forecast.status == ForecastStatus.COMPLETED.value,
            )
            .order_by(Forecast.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()
    
    async def _validate_data_availability(
        self,
        organization_id: UUID,
        account_id: Optional[str] = None,
    ) -> None:
        """Validate sufficient data exists for forecasting."""
        from app.core.constants import MIN_POSITIONS_FOR_FORECAST
        
        query = select(PositionSnapshot).where(
            PositionSnapshot.organization_id == organization_id
        )
        if account_id:
            query = query.where(PositionSnapshot.account_id == account_id)
        
        result = await self.db.execute(query.limit(MIN_POSITIONS_FOR_FORECAST))
        positions = result.scalars().all()
        
        if len(positions) < MIN_POSITIONS_FOR_FORECAST:
            raise InsufficientDataError(
                f"Minimum {MIN_POSITIONS_FOR_FORECAST} position snapshots required",
                required=MIN_POSITIONS_FOR_FORECAST,
                available=len(positions),
            )
    
    async def _get_market_regime(self) -> tuple[Regime, Decimal]:
        """
        Get current market regime.
        
        Returns:
            Tuple of (regime, confidence)
        """
        # TODO: Implement actual regime detection from MarketIndicator
        # For now, return steady state
        return Regime.STEADY_STATE, Decimal("0.85")
    
    async def _get_market_indicators(self) -> tuple[Decimal, Decimal]:
        """
        Get current market indicators.
        
        Returns:
            Tuple of (VIX, credit_spread)
        """
        # TODO: Fetch from MarketIndicator table
        return Decimal("18.5"), Decimal("125.0")
    
    async def _generate_prediction(
        self,
        organization_id: UUID,
        target_date: date,
        regime: Regime,
        account_id: Optional[str] = None,
        portfolio_id: Optional[str] = None,
    ) -> dict:
        """
        Generate the actual prediction using ML models.
        
        This is a placeholder - actual implementation will use:
        - XGBoost steady-state model
        - Crisis shock model
        - Regime-weighted blending
        """
        # TODO: Integrate with ML engine
        # For now, return mock prediction
        
        return {
            "p5": Decimal("-50000.00"),
            "p50": Decimal("25000.00"),
            "p95": Decimal("100000.00"),
            "inflow_p50": Decimal("75000.00"),
            "outflow_p50": Decimal("50000.00"),
            "steady_state_weight": Decimal("0.85"),
            "crisis_weight": Decimal("0.15"),
            "confidence": Decimal("0.78"),
            "model_name": "hybrid",
            "model_version": settings.MODEL_VERSION,
        }
    
    def _get_cache_key(
        self,
        organization_id: UUID,
        target_date: date,
        account_id: Optional[str],
        portfolio_id: Optional[str],
    ) -> str:
        """Generate cache key for forecast."""
        parts = [
            "forecast",
            str(organization_id),
            str(target_date),
        ]
        if account_id:
            parts.append(f"acc:{account_id}")
        if portfolio_id:
            parts.append(f"port:{portfolio_id}")
        return ":".join(parts)
    
    async def _get_cached_forecast(self, cache_key: str) -> Optional[Forecast]:
        """Get forecast from cache."""
        # TODO: Implement cache retrieval
        return None
    
    async def _cache_forecast(self, cache_key: str, forecast: Forecast) -> None:
        """Cache forecast for future requests."""
        from app.core.constants import CACHE_TTL
        
        try:
            await cache.set_json(
                cache_key,
                forecast.to_dict(),
                ttl=CACHE_TTL["forecast"],
            )
        except Exception as e:
            logger.warning(f"Failed to cache forecast: {e}")
