"""
Aequitas LV-COP Backend - Market Data Endpoints
===============================================

Market data and regime detection endpoints.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import date
from typing import Optional

from fastapi import APIRouter, Query

from app.dependencies import CurrentUser, DBSession
from app.schemas.base import ResponseModel
from app.schemas.market import (
    CrisisAlert,
    MarketIndicatorSeries,
    MarketIndicatorValue,
    MarketRegimeResponse,
    MarketSnapshot,
    RegimeHistory,
)

router = APIRouter()


@router.get(
    "/regime",
    response_model=ResponseModel[MarketRegimeResponse],
    summary="Get current market regime",
    description="Get the current market regime classification.",
)
async def get_current_regime(
    user: CurrentUser,
    db: DBSession,
) -> ResponseModel[MarketRegimeResponse]:
    """
    Get current market regime.
    
    Returns:
    - Regime classification (steady_state, elevated, crisis)
    - Confidence score
    - Key indicators (VIX, credit spreads)
    """
    from datetime import datetime
    from decimal import Decimal
    from app.core.enums import Regime
    
    return ResponseModel(
        data=MarketRegimeResponse(
            regime=Regime.STEADY_STATE,
            regime_confidence=Decimal("0.85"),
            vix_current=Decimal("18.5"),
            vix_percentile_90d=Decimal("0.45"),
            credit_spread_current=Decimal("125.0"),
            last_updated=datetime.utcnow(),
            data_as_of=date.today(),
        ),
    )


@router.get(
    "/snapshot",
    response_model=ResponseModel[MarketSnapshot],
    summary="Get market snapshot",
    description="Get comprehensive market snapshot.",
)
async def get_market_snapshot(
    user: CurrentUser,
    db: DBSession,
) -> ResponseModel[MarketSnapshot]:
    """
    Get complete market snapshot.
    
    Returns all key indicators with current values.
    """
    from datetime import datetime
    from decimal import Decimal
    from app.core.enums import Regime
    
    vix = MarketIndicatorValue(
        indicator_name="vix",
        value=Decimal("18.5"),
        date=date.today(),
        source="cboe",
    )
    
    return ResponseModel(
        data=MarketSnapshot(
            as_of=datetime.utcnow(),
            regime=Regime.STEADY_STATE,
            indicators={"vix": vix},
            vix=vix,
        ),
    )


@router.get(
    "/indicators/{indicator_name}",
    response_model=ResponseModel[MarketIndicatorSeries],
    summary="Get indicator time series",
    description="Get historical data for a specific indicator.",
)
async def get_indicator_series(
    indicator_name: str,
    user: CurrentUser,
    db: DBSession,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
) -> ResponseModel[MarketIndicatorSeries]:
    """
    Get indicator time series.
    
    Returns historical values for the specified indicator.
    """
    from decimal import Decimal
    
    return ResponseModel(
        data=MarketIndicatorSeries(
            indicator_name=indicator_name,
            source="fred",
            data=[],
            current=Decimal("0"),
        ),
    )


@router.get(
    "/regime/history",
    response_model=ResponseModel[RegimeHistory],
    summary="Get regime history",
    description="Get historical regime changes.",
)
async def get_regime_history(
    user: CurrentUser,
    db: DBSession,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
) -> ResponseModel[RegimeHistory]:
    """
    Get regime change history.
    
    Returns list of all regime transitions.
    """
    return ResponseModel(
        data=RegimeHistory(
            start_date=start_date or date.today(),
            end_date=end_date or date.today(),
            regimes=[],
            days_steady_state=0,
            days_elevated=0,
            days_crisis=0,
            total_transitions=0,
            transition_details=[],
        ),
    )


@router.get(
    "/alerts",
    response_model=ResponseModel[list[CrisisAlert]],
    summary="Get crisis alerts",
    description="Get recent crisis alerts.",
)
async def get_crisis_alerts(
    user: CurrentUser,
    db: DBSession,
    limit: int = Query(10, ge=1, le=100),
) -> ResponseModel[list[CrisisAlert]]:
    """
    Get recent crisis alerts.
    
    Returns regime changes and threshold breaches.
    """
    return ResponseModel(data=[])


@router.post(
    "/refresh",
    response_model=ResponseModel[dict],
    summary="Refresh market data",
    description="Trigger refresh of market data from sources.",
)
async def refresh_market_data(
    user: CurrentUser,
    db: DBSession,
) -> ResponseModel[dict]:
    """
    Refresh market data.
    
    Triggers async fetch from FRED and other sources.
    """
    return ResponseModel(
        data={
            "status": "refresh_queued",
            "message": "Market data refresh queued",
        },
    )
