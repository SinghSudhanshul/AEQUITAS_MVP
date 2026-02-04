"""
Aequitas LV-COP Backend - Working Forecast Engine
=================================================

Main forecast engine with real predictions.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from datetime import date
from decimal import Decimal
from typing import Optional

import numpy as np
import pandas as pd

from app.config import settings
from app.core.enums import Regime

logger = logging.getLogger(__name__)


class ForecastEngine:
    """
    Main forecast engine.
    
    Orchestrates:
    - Feature engineering
    - Regime detection
    - Model selection (steady-state vs crisis)
    - Quantile predictions
    - Ensemble blending
    """
    
    def __init__(self):
        self.steady_state_model = None
        self.crisis_model = None
        self._is_loaded = False
    
    async def load_models(self) -> None:
        """Load trained models or initialize for demo mode."""
        if self._is_loaded:
            return
        
        try:
            from app.ml.forecasting.models import SteadyStateModel, CrisisModel
            
            self.steady_state_model = SteadyStateModel()
            self.crisis_model = CrisisModel()
            self._is_loaded = True
            logger.info("Forecast models initialized")
        except Exception as e:
            logger.error(f"Failed to initialize models: {e}")
            raise
    
    async def predict(
        self,
        features: Optional[pd.DataFrame] = None,
        regime: Regime = Regime.STEADY_STATE,
        target_date: Optional[date] = None,
        horizon_days: int = 1,
    ) -> dict:
        """
        Generate forecast prediction.
        
        Args:
            features: Feature dataframe (optional, uses demo mode if None)
            regime: Current market regime
            target_date: Target forecast date
            horizon_days: Forecast horizon
        
        Returns:
            Dictionary with predictions and metadata
        """
        await self.load_models()
        
        # Get regime weights
        steady_weight, crisis_weight = self._get_regime_weights(regime)
        
        # Get predictions from both models
        steady_pred = self.steady_state_model.predict(features)
        crisis_pred = self.crisis_model.predict(features, regime)
        
        # Blend predictions
        blended = self._blend_predictions(
            steady_pred, crisis_pred,
            steady_weight, crisis_weight
        )
        
        return {
            "p5": Decimal(str(round(blended["p5"], 2))),
            "p50": Decimal(str(round(blended["p50"], 2))),
            "p95": Decimal(str(round(blended["p95"], 2))),
            "inflow_p50": Decimal(str(round(blended.get("inflow_p50", 0), 2))),
            "outflow_p50": Decimal(str(round(blended.get("outflow_p50", 0), 2))),
            "steady_state_weight": Decimal(str(steady_weight)),
            "crisis_weight": Decimal(str(crisis_weight)),
            "confidence": Decimal(str(round(blended.get("confidence", 0.75), 4))),
            "model_name": "hybrid",
            "model_version": settings.MODEL_VERSION,
        }
    
    async def detect_regime(
        self,
        vix: Optional[float] = None,
        credit_spread: Optional[float] = None,
    ) -> tuple[Regime, float]:
        """
        Detect current market regime based on indicators.
        
        Args:
            vix: Current VIX value
            credit_spread: Current credit spread (basis points)
        
        Returns:
            Tuple of (regime, confidence)
        """
        from app.core.constants import VIX_THRESHOLDS, CREDIT_SPREAD_THRESHOLDS
        
        # Default values if not provided
        if vix is None:
            vix = 18.0 + np.random.normal(0, 5)
        if credit_spread is None:
            credit_spread = 120.0 + np.random.normal(0, 30)
        
        # Determine regime from VIX
        if vix >= VIX_THRESHOLDS.get("crisis", 40):
            vix_regime = Regime.CRISIS
            vix_confidence = min(1.0, vix / 60)
        elif vix >= VIX_THRESHOLDS.get("elevated", 25):
            vix_regime = Regime.ELEVATED
            vix_confidence = (vix - 25) / 15
        else:
            vix_regime = Regime.STEADY_STATE
            vix_confidence = 1 - (vix / 25)
        
        # Determine regime from credit spreads
        if credit_spread >= CREDIT_SPREAD_THRESHOLDS.get("crisis", 400):
            spread_regime = Regime.CRISIS
            spread_confidence = min(1.0, credit_spread / 600)
        elif credit_spread >= CREDIT_SPREAD_THRESHOLDS.get("elevated", 200):
            spread_regime = Regime.ELEVATED
            spread_confidence = (credit_spread - 200) / 200
        else:
            spread_regime = Regime.STEADY_STATE
            spread_confidence = 1 - (credit_spread / 200)
        
        # Combine (worst-case wins)
        regime_priority = {Regime.CRISIS: 3, Regime.ELEVATED: 2, Regime.STEADY_STATE: 1}
        
        if regime_priority[vix_regime] >= regime_priority[spread_regime]:
            final_regime = vix_regime
            confidence = (vix_confidence + spread_confidence) / 2
        else:
            final_regime = spread_regime
            confidence = (vix_confidence + spread_confidence) / 2
        
        return final_regime, round(confidence, 4)
    
    def _get_regime_weights(self, regime: Regime) -> tuple[float, float]:
        """Get model weights based on regime."""
        weights = {
            Regime.STEADY_STATE: (0.90, 0.10),
            Regime.ELEVATED: (0.60, 0.40),
            Regime.CRISIS: (0.20, 0.80),
        }
        return weights.get(regime, (0.85, 0.15))
    
    def _blend_predictions(
        self,
        steady_pred: dict,
        crisis_pred: dict,
        steady_weight: float,
        crisis_weight: float,
    ) -> dict:
        """Blend predictions from both models."""
        blended = {}
        
        for key in ["p5", "p50", "p95"]:
            blended[key] = (
                steady_pred.get(key, 0) * steady_weight +
                crisis_pred.get(key, 0) * crisis_weight
            )
        
        # Components
        if "inflow_p50" in steady_pred or "inflow_p50" in crisis_pred:
            blended["inflow_p50"] = (
                steady_pred.get("inflow_p50", 0) * steady_weight +
                crisis_pred.get("inflow_p50", 0) * crisis_weight
            )
        
        if "outflow_p50" in steady_pred or "outflow_p50" in crisis_pred:
            blended["outflow_p50"] = (
                steady_pred.get("outflow_p50", 0) * steady_weight +
                crisis_pred.get("outflow_p50", 0) * crisis_weight
            )
        
        # Confidence is weighted average
        blended["confidence"] = (
            steady_pred.get("confidence", 0.75) * steady_weight +
            crisis_pred.get("confidence", 0.60) * crisis_weight
        )
        
        return blended
    
    async def train_on_data(
        self,
        positions_df: pd.DataFrame,
        transactions_df: pd.DataFrame,
    ) -> dict:
        """
        Train models on historical data.
        
        Args:
            positions_df: Historical positions
            transactions_df: Historical transactions
        
        Returns:
            Training metrics
        """
        await self.load_models()
        
        # Engineer features from positions
        features = self._engineer_features(positions_df, transactions_df)
        
        if features.empty:
            logger.warning("Not enough data for training")
            return {"status": "insufficient_data"}
        
        # Calculate target (next day's net flow)
        target = transactions_df.groupby(
            transactions_df["transaction_date"]
        )["amount"].sum().shift(-1).dropna()
        
        # Align features and target
        common_dates = features.index.intersection(target.index)
        if len(common_dates) < 30:
            logger.warning("Not enough data for training (need 30+ days)")
            return {"status": "insufficient_data", "rows": len(common_dates)}
        
        X = features.loc[common_dates]
        y = target.loc[common_dates]
        
        # Train steady state model
        metrics = self.steady_state_model.train(X, y)
        
        logger.info(f"Model trained on {len(common_dates)} days of data")
        return {"status": "trained", "rows": len(common_dates), "metrics": metrics}
    
    def _engineer_features(
        self,
        positions_df: pd.DataFrame,
        transactions_df: pd.DataFrame,
    ) -> pd.DataFrame:
        """Engineer features from raw data."""
        features = pd.DataFrame()
        
        if transactions_df.empty:
            return features
        
        # Daily aggregates
        daily_txn = transactions_df.groupby("transaction_date").agg({
            "amount": ["sum", "count", "std"],
        })
        daily_txn.columns = ["daily_net", "daily_count", "daily_std"]
        daily_txn = daily_txn.fillna(0)
        
        # Rolling features
        if len(daily_txn) >= 7:
            daily_txn["rolling_7d_mean"] = daily_txn["daily_net"].rolling(7).mean()
            daily_txn["rolling_7d_std"] = daily_txn["daily_net"].rolling(7).std()
            daily_txn["rolling_30d_mean"] = daily_txn["daily_net"].rolling(30, min_periods=7).mean()
        
        # Day of week features
        daily_txn["day_of_week"] = daily_txn.index.dayofweek
        daily_txn["is_monday"] = (daily_txn["day_of_week"] == 0).astype(int)
        daily_txn["is_friday"] = (daily_txn["day_of_week"] == 4).astype(int)
        
        # Month features
        daily_txn["day_of_month"] = daily_txn.index.day
        daily_txn["is_month_end"] = (daily_txn.index.day > 25).astype(int)
        
        return daily_txn.dropna()


# Global engine instance
forecast_engine = ForecastEngine()
