"""
Aequitas LV-COP Backend - Forecast Models
=========================================

XGBoost-based forecast models for steady-state and crisis regimes.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd

from app.config import settings
from app.core.enums import Regime
from app.core.constants import CRISIS_SHOCK_MULTIPLIERS, VOLATILITY_SCALING

logger = logging.getLogger(__name__)


class BaseModel:
    """Base class for forecast models."""
    
    def __init__(self, model_path: Optional[Path] = None):
        self.model = None
        self.model_path = model_path
        self.is_loaded = False
    
    def load(self) -> None:
        """Load model from disk."""
        if self.model_path and self.model_path.exists():
            import joblib
            self.model = joblib.load(self.model_path)
            self.is_loaded = True
            logger.info(f"Model loaded from {self.model_path}")
    
    def save(self, path: Path) -> None:
        """Save model to disk."""
        if self.model:
            import joblib
            joblib.dump(self.model, path)
            logger.info(f"Model saved to {path}")


class SteadyStateModel(BaseModel):
    """
    Steady-state XGBoost model for normal market conditions.
    
    Uses:
    - Historical cash flow patterns
    - Seasonal features
    - Position-level features
    - Market indicators (moderate impact)
    """
    
    def __init__(self, model_path: Optional[Path] = None):
        super().__init__(model_path)
        self.quantile_models = {}  # {quantile: model}
        self.feature_names = []
    
    def train(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        quantiles: list[float] = [0.05, 0.50, 0.95],
    ) -> None:
        """
        Train quantile regression models.
        
        Args:
            X: Feature dataframe
            y: Target values
            quantiles: Quantiles to predict
        """
        from xgboost import XGBRegressor
        
        self.feature_names = list(X.columns)
        
        for q in quantiles:
            logger.info(f"Training quantile {q} model...")
            
            model = XGBRegressor(
                objective="reg:quantileerror",
                quantile_alpha=q,
                n_estimators=200,
                max_depth=6,
                learning_rate=0.05,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
            )
            
            model.fit(X, y)
            self.quantile_models[q] = model
        
        self.is_loaded = True
        logger.info("Steady-state model training complete")
    
    def predict(self, X: pd.DataFrame) -> dict:
        """
        Generate quantile predictions.
        
        Args:
            X: Feature dataframe
        
        Returns:
            Dictionary with p5, p50, p95 predictions
        """
        if not self.is_loaded:
            # Return mock prediction if model not loaded
            return self._mock_predict()
        
        predictions = {}
        
        for q, model in self.quantile_models.items():
            pred = model.predict(X)
            key = f"p{int(q * 100)}"
            predictions[key] = float(pred[0]) if len(pred) == 1 else float(pred.mean())
        
        predictions["confidence"] = self._calculate_confidence(predictions)
        
        return predictions
    
    def _calculate_confidence(self, predictions: dict) -> float:
        """Calculate confidence score based on prediction interval width."""
        p95 = predictions.get("p95", 0)
        p5 = predictions.get("p5", 0)
        p50 = predictions.get("p50", 1)
        
        if p50 == 0:
            return 0.5
        
        # Narrower intervals = higher confidence
        width_ratio = abs(p95 - p5) / abs(p50)
        confidence = max(0.3, min(0.95, 1 - width_ratio * 0.3))
        
        return confidence
    
    def _mock_predict(self) -> dict:
        """Mock prediction for development."""
        return {
            "p5": -25000,
            "p50": 30000,
            "p95": 85000,
            "confidence": 0.78,
        }


class CrisisModel(BaseModel):
    """
    Crisis shock model for stressed market conditions.
    
    Applies regime-specific shock multipliers to capture:
    - Liquidity shocks
    - Volatility spikes
    - Correlation breakdowns
    - Tail events
    """
    
    def __init__(self, model_path: Optional[Path] = None):
        super().__init__(model_path)
        self.shock_multipliers = CRISIS_SHOCK_MULTIPLIERS
        self.volatility_scaling = VOLATILITY_SCALING
    
    def predict(
        self,
        X: pd.DataFrame,
        regime: Regime,
    ) -> dict:
        """
        Generate crisis-adjusted predictions.
        
        Args:
            X: Feature dataframe
            regime: Current market regime
        
        Returns:
            Dictionary with shocked predictions
        """
        # Base prediction (could use a trained model)
        base_pred = self._get_base_prediction(X)
        
        # Apply regime-specific adjustments
        shock_mult = self.shock_multipliers.get(regime.value, 1.0)
        vol_scale = self.volatility_scaling.get(regime.value, 1.0)
        
        # Shock the predictions
        shocked = {
            "p5": base_pred["p5"] * shock_mult * vol_scale,
            "p50": base_pred["p50"] * shock_mult,
            "p95": base_pred["p95"] * shock_mult / vol_scale,
            "confidence": base_pred["confidence"] * (1 / vol_scale),
        }
        
        return shocked
    
    def _get_base_prediction(self, X: pd.DataFrame) -> dict:
        """Get base prediction before shocks."""
        if self.is_loaded and self.model:
            # Use trained model
            pred = self.model.predict(X)
            return {
                "p5": float(pred[0, 0]) if len(pred.shape) > 1 else float(pred[0]) * 0.5,
                "p50": float(pred[0, 1]) if len(pred.shape) > 1 else float(pred[0]),
                "p95": float(pred[0, 2]) if len(pred.shape) > 1 else float(pred[0]) * 1.5,
                "confidence": 0.7,
            }
        
        # Mock base prediction
        return {
            "p5": -40000,
            "p50": 15000,
            "p95": 70000,
            "confidence": 0.65,
        }
    
    def simulate_monte_carlo(
        self,
        base_prediction: float,
        regime: Regime,
        n_simulations: int = 10000,
    ) -> dict:
        """
        Run Monte Carlo simulation for tail risk analysis.
        
        Args:
            base_prediction: Base forecast value
            regime: Current regime
            n_simulations: Number of simulations
        
        Returns:
            Dictionary with simulation statistics
        """
        np.random.seed(42)
        
        # Get regime-specific parameters
        vol_scale = self.volatility_scaling.get(regime.value, 1.0)
        volatility = 0.15 * vol_scale  # Base volatility scaled by regime
        
        # Generate log-normal returns
        returns = np.random.lognormal(
            mean=0,
            sigma=volatility,
            size=n_simulations,
        )
        
        # Apply to base prediction
        simulated = base_prediction * returns
        
        return {
            "mean": float(np.mean(simulated)),
            "std": float(np.std(simulated)),
            "p1": float(np.percentile(simulated, 1)),
            "p5": float(np.percentile(simulated, 5)),
            "p50": float(np.percentile(simulated, 50)),
            "p95": float(np.percentile(simulated, 95)),
            "p99": float(np.percentile(simulated, 99)),
            "var_95": float(base_prediction - np.percentile(simulated, 5)),
            "cvar_95": float(base_prediction - np.mean(simulated[simulated < np.percentile(simulated, 5)])),
        }
