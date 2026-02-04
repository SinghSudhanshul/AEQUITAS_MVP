// ============================================
// FORECAST API TYPES
// Liquidity & Volatility Forecasting
// ============================================

/**
 * Market regime classification
 */
export type MarketRegime = 'steady' | 'elevated' | 'crisis';

/**
 * Forecast confidence levels
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Quantile forecast values
 */
export interface QuantileForecast {
  p5: number;   // 5th percentile (worst case)
  p25: number;  // 25th percentile
  p50: number;  // 50th percentile (median)
  p75: number;  // 75th percentile
  p95: number;  // 95th percentile (best case)
}

/**
 * Daily liquidity forecast response
 */
export interface DailyForecast {
  forecastId: string;
  orgId: string;
  targetDate: string;
  generatedAt: string;

  // Predicted liquidity values
  predictedLiquidity: QuantileForecast;

  // Regime detection
  regimeDetected: MarketRegime;
  regimeProbability: number;

  // Confidence metrics
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;

  // Model information
  modelVersion: string;
  modelType: 'steady_state' | 'crisis' | 'hybrid';

  // Feature importance
  topFeatures: FeatureImportance[];

  // Alerts
  alerts: ForecastAlert[];
}

/**
 * Feature importance for explainability
 */
export interface FeatureImportance {
  featureName: string;
  importance: number;
  direction: 'positive' | 'negative';
  description: string;
}

/**
 * Forecast-generated alerts
 */
export interface ForecastAlert {
  alertId: string;
  severity: 'info' | 'warning' | 'critical';
  type: 'quantile_compression' | 'regime_shift' | 'accuracy_degradation' | 'data_quality';
  title: string;
  message: string;
  actionRequired: boolean;
  suggestedAction?: string;
}

/**
 * Forecast history item
 */
export interface ForecastHistoryItem {
  forecastId: string;
  targetDate: string;
  predictedP50: number;
  actualValue?: number;
  accuracyPct?: number;
  regimeDetected: MarketRegime;
  confidenceScore: number;
}

/**
 * Forecast accuracy metrics
 */
export interface ForecastAccuracyMetrics {
  periodStart: string;
  periodEnd: string;
  totalForecasts: number;

  // Overall accuracy
  meanAbsoluteError: number;
  meanAbsolutePercentageError: number;
  rootMeanSquareError: number;

  // Accuracy by regime
  steadyStateAccuracy: number;
  crisisAccuracy: number;

  // Accuracy trends
  weeklyAccuracyTrend: AccuracyTrendPoint[];

  // Calibration metrics
  coverageProbability: number;
  sharpness: number;
}

/**
 * Accuracy trend data point
 */
export interface AccuracyTrendPoint {
  date: string;
  accuracy: number;
  regime: MarketRegime;
}

/**
 * Intraday forecast update
 */
export interface IntradayForecast extends DailyForecast {
  updateSequence: number;
  previousForecastId?: string;
  delta: {
    p50Change: number;
    confidenceChange: number;
    regimeChanged: boolean;
  };
}

/**
 * Forecast request parameters
 */
export interface ForecastRequest {
  targetDate?: string;
  horizon?: number; // days ahead
  includeFeatureImportance?: boolean;
  includeAlerts?: boolean;
}

/**
 * Forecast history request
 */
export interface ForecastHistoryRequest {
  startDate?: string;
  endDate?: string;
  limit?: number;
  includeActuals?: boolean;
}

/**
 * API response wrapper for forecasts
 */
export interface ForecastResponse<T> {
  success: boolean;
  data: T;
  metadata: {
    requestId: string;
    timestamp: string;
    processingTimeMs: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
