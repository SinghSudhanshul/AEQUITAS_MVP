// ============================================
// TREASURY WING TYPES
// Financial Operations (Features 51-60)
// ============================================

/**
 * Daily liquidity forecast card data
 */
export interface DailyLiquidityForecast {
  forecastDate: string;
  targetDate: string;
  liquidity: {
    p5: number;
    p50: number;
    p95: number;
  };
  change: {
    amount: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  };
  confidence: number;
  regime: string;
  alerts: string[];
}

/**
 * Margin requirement data
 */
export interface MarginRequirement {
  broker: string;
  assetClass: string;
  currentMargin: number;
  requiredMargin: number;
  excessDeficit: number;
  utilizationPercent: number;
  status: 'healthy' | 'warning' | 'critical';
  callRisk: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

/**
 * Transaction record
 */
export interface Transaction {
  id: string;
  timestamp: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'margin_call' | 'fee';
  amount: number;
  currency: string;
  broker?: string;
  counterparty?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  notes?: string;
}

/**
 * Transaction history filters
 */
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: string;
  broker?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
}

/**
 * Sub-millisecond latency data
 */
export interface SubMillisecondMetrics {
  endpoint: string;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p99LatencyMs: number;
  throughputPerSec: number;
  lastMeasured: string;
  trend: 'improving' | 'stable' | 'degrading';
}

/**
 * Multi-currency account
 */
export interface MultiCurrencyAccount {
  accountId: string;
  currency: string;
  balance: number;
  balanceUsd: number;
  exchangeRate: number;
  lastUpdated: string;
  transactions24h: number;
}

/**
 * Rainmaker revenue data
 */
export interface RainmakerRevenue {
  period: string;
  revenue: number;
  target: number;
  percentOfTarget: number;
  growth: number;
  sources: RevenueSource[];
}

/**
 * Revenue source
 */
export interface RevenueSource {
  name: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Burn rate SLO data
 */
export interface BurnRateSLO {
  currentBurnRate: number;
  targetBurnRate: number;
  sloStatus: 'met' | 'at_risk' | 'breached';
  daysRemaining: number;
  runway: number;
  trend: 'improving' | 'stable' | 'worsening';
}

/**
 * Peer group benchmark
 */
export interface PeerGroupBenchmark {
  metric: string;
  yourValue: number;
  peerAverage: number;
  peerP25: number;
  peerP50: number;
  peerP75: number;
  percentile: number;
  trend: 'above' | 'at' | 'below';
}

/**
 * Scenario planning slider config
 */
export interface ScenarioSlider {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  defaultValue: number;
  unit: string;
  impact: 'low' | 'medium' | 'high';
}

/**
 * Scenario result
 */
export interface ScenarioResult {
  scenarioName: string;
  inputs: Record<string, number>;
  liquidityImpact: number;
  marginImpact: number;
  riskScore: number;
  recommendation: string;
}

/**
 * Quantum Monte Carlo simulation
 */
export interface QuantumMonteCarloResult {
  simulationId: string;
  iterations: number;
  convergenceRate: number;
  meanOutcome: number;
  standardDeviation: number;
  var95: number;
  expectedShortfall: number;
  distribution: number[];
  computeTimeMs: number;
}
