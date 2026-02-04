// ============================================
// FORECAST TYPE DEFINITIONS
// ============================================

export type RegimeType = 'steady' | 'elevated' | 'crisis';

export interface ForecastBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface Forecast {
  id: string;
  date: string;
  predicted: number;
  confidence: number;
  range: {
    low: number;
    high: number;
  };
  regime: RegimeType;
  generatedAt: string;
  breakdown: ForecastBreakdown[];
  actual?: number;
  accuracy?: number;
}

export interface ForecastHistory {
  date: string;
  predicted: number;
  actual: number;
  accuracy: number;
  regime: RegimeType;
  mape?: number;
}

export interface MarketRegime {
  current: RegimeType;
  confidence: number;
  indicators: {
    vix: number;
    creditSpread: number;
    repoRate: number;
    [key: string]: number;
  };
  lastUpdated: string;
  previousRegime?: RegimeType;
  changedAt?: string;
}

export interface RealtimeForecast extends Forecast {
  timestamp: string;
  updateSequence: number;
  deltaFromPrevious: number;
}

export interface ForecastComparison {
  periodA: {
    label: string;
    forecasts: Forecast[];
    avgAccuracy: number;
    avgMape: number;
  };
  periodB: {
    label: string;
    forecasts: Forecast[];
    avgAccuracy: number;
    avgMape: number;
  };
  improvement: {
    accuracy: number;
    mape: number;
  };
}

// Regime configuration for UI
export const REGIME_CONFIG = {
  steady: {
    label: 'Steady State',
    icon: '🟢',
    color: 'steady-green',
    description: 'Normal market conditions',
    bgClass: 'bg-steady-green/10',
    textClass: 'text-steady-green',
    borderClass: 'border-steady-green/30',
  },
  elevated: {
    label: 'Elevated',
    icon: '🟡',
    color: 'elevated-amber',
    description: 'Heightened volatility',
    bgClass: 'bg-elevated-amber/10',
    textClass: 'text-elevated-amber',
    borderClass: 'border-elevated-amber/30',
  },
  crisis: {
    label: 'Crisis',
    icon: '🔴',
    color: 'crisis-red',
    description: 'Extreme market stress',
    bgClass: 'bg-crisis-red/10',
    textClass: 'text-crisis-red',
    borderClass: 'border-crisis-red/30',
  },
} as const;
