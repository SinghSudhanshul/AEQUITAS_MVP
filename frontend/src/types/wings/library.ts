// ============================================
// LIBRARY WING TYPES
// Analytics & ML (Features 31-40)
// ============================================

/**
 * Quantile risk range data
 */
export interface QuantileRiskRange {
  date: string;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
  actual?: number;
}

/**
 * Quantile compression alert
 */
export interface QuantileCompression {
  date: string;
  spread: number;  // p95 - p5
  normalSpread: number;
  compressionRatio: number;
  isCompressed: boolean;
  severity: 'low' | 'medium' | 'high';
  implication: string;
}

/**
 * Market weather data point
 */
export interface MarketWeatherPoint {
  x: number;  // VIX level
  y: number;  // Credit spread
  z: number;  // Liquidity stress
  regime: 'steady' | 'elevated' | 'crisis';
  timestamp: string;
}

/**
 * Market weather topographic config
 */
export interface TopographicConfig {
  resolution: number;
  colorScale: string[];
  contourLevels: number;
  animationSpeed: number;
}

/**
 * Confidence score gauge data
 */
export interface ConfidenceGaugeData {
  score: number;
  level: 'high' | 'medium' | 'low';
  trend: 'improving' | 'stable' | 'declining';
  factors: ConfidenceFactor[];
}

/**
 * Confidence factor
 */
export interface ConfidenceFactor {
  name: string;
  contribution: number;
  direction: 'positive' | 'negative';
}

/**
 * Historical forecast overlay
 */
export interface HistoricalForecastOverlay {
  forecastDate: string;
  targetDate: string;
  predicted: number;
  actual: number;
  error: number;
  errorPercent: number;
  regime: string;
}

/**
 * XGBoost inference result
 */
export interface XGBoostInference {
  modelVersion: string;
  prediction: number;
  confidence: number;
  featureImportances: Array<{
    feature: string;
    importance: number;
    value: number;
  }>;
  treeContributions: number[];
  inferenceTimeMs: number;
}

/**
 * Seasonality detection result
 */
export interface SeasonalityDetection {
  hasSeasonality: boolean;
  patterns: SeasonalPattern[];
  dominantPeriod?: number;
  strength: number;
}

/**
 * Seasonal pattern
 */
export interface SeasonalPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  period: number;
  amplitude: number;
  phase: number;
  confidence: number;
}

/**
 * Uncertainty visualization data
 */
export interface UncertaintyVisualization {
  type: 'fan_chart' | 'violin' | 'distribution' | 'ensemble';
  centerLine: number[];
  upperBounds: number[][];
  lowerBounds: number[][];
  probabilityLevels: number[];
}

/**
 * MLflow experiment
 */
export interface MLflowExperiment {
  experimentId: string;
  name: string;
  runs: MLflowRun[];
  bestRunId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * MLflow run
 */
export interface MLflowRun {
  runId: string;
  status: 'running' | 'finished' | 'failed' | 'killed';
  startTime: string;
  endTime?: string;
  metrics: Record<string, number>;
  params: Record<string, string>;
  tags: Record<string, string>;
}

/**
 * Expert override
 */
export interface ExpertOverride {
  id: string;
  userId: string;
  originalValue: number;
  overrideValue: number;
  reason: string;
  confidence: number;
  appliedAt: string;
  expiresAt?: string;
}
