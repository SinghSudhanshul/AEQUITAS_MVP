"""
Aequitas LV-COP Backend - Forecast Engine
=========================================

Main forecast engine orchestrating models and regime detection.

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
        """
        Load trained models from disk or MLflow.
        """
        from app.ml.forecasting.models import SteadyStateModel, CrisisModel
        
        if self._is_loaded:
            return
        
        try:
            # TODO: Load from MLflow
            self.steady_state_model = SteadyStateModel()
            self.crisis_model = CrisisModel()
            self._is_loaded = True
            logger.info("Forecast models loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            raise
    
    async def predict(
        self,
        features: pd.DataFrame,
        regime: Regime,
        target_date: date,
        horizon_days: int = 1,
    ) -> dict:
        """
        Generate forecast prediction.
        
        Args:
            features: Feature dataframe
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
        steady_pred = await self._predict_steady_state(features)
        crisis_pred = await self._predict_crisis(features, regime)
        
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
            "confidence": Decimal(str(round(blended.get("confidence", 0.8), 4))),
            "model_name": "hybrid",
            "model_version": settings.MODEL_VERSION,
        }
    
    def _get_regime_weights(self, regime: Regime) -> tuple[float, float]:
        """
        Get model weights based on regime.
        
        Returns:
            Tuple of (steady_state_weight, crisis_weight)
        """
        weights = {
            Regime.STEADY_STATE: (0.90, 0.10),
            Regime.ELEVATED: (0.60, 0.40),
            Regime.CRISIS: (0.20, 0.80),
        }
        return weights.get(regime, (0.85, 0.15))
    
    async def _predict_steady_state(self, features: pd.DataFrame) -> dict:
        """Generate steady-state model prediction."""
        if self.steady_state_model is None:
            return self._mock_prediction()
        
        return self.steady_state_model.predict(features)
    
    async def _predict_crisis(
        self,
        features: pd.DataFrame,
        regime: Regime,
    ) -> dict:
        """Generate crisis model prediction with regime-specific shocks."""
        if self.crisis_model is None:
            return self._mock_prediction(crisis=True)
        
        return self.crisis_model.predict(features, regime)
    
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
        
        # Components if available
        if "inflow_p50" in steady_pred:
            blended["inflow_p50"] = (
                steady_pred.get("inflow_p50", 0) * steady_weight +
                crisis_pred.get("inflow_p50", 0) * crisis_weight
            )
        
        if "outflow_p50" in steady_pred:
            blended["outflow_p50"] = (
                steady_pred.get("outflow_p50", 0) * steady_weight +
                crisis_pred.get("outflow_p50", 0) * crisis_weight
            )
        
        # Confidence is the minimum of both
        blended["confidence"] = min(
            steady_pred.get("confidence", 0.8),
            crisis_pred.get("confidence", 0.7)
        )
        
        return blended
    
    def _mock_prediction(self, crisis: bool = False) -> dict:
        """Generate mock prediction for development."""
        base = 25000 if not crisis else 10000
        spread = 0.3 if not crisis else 0.5
        
        return {
            "p5": base * (1 - spread * 2),
            "p50": base,
            "p95": base * (1 + spread * 2),
            "inflow_p50": base * 1.5,
            "outflow_p50": base * 0.5,
            "confidence": 0.78 if not crisis else 0.65,
        }


# Global engine instance
forecast_engine = ForecastEngine()
