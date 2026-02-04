// ============================================
// POSITION API TYPES
// Trading Position & Portfolio Data
// ============================================

/**
 * Asset class categories
 */
export type AssetClass =
  | 'equities'
  | 'fixed_income'
  | 'derivatives'
  | 'commodities'
  | 'fx'
  | 'crypto'
  | 'alternatives';

/**
 * Broker names
 */
export type BrokerName =
  | 'goldman_sachs'
  | 'morgan_stanley'
  | 'jp_morgan'
  | 'citadel'
  | 'ubs'
  | 'credit_suisse'
  | 'other';

/**
 * Position data source
 */
export type PositionSource = 'csv' | 'api' | 'manual';

/**
 * Individual position snapshot
 */
export interface PositionSnapshot {
  positionId: string;
  orgId: string;
  snapshotDate: string;
  snapshotTime?: string;

  // Position details
  broker: BrokerName;
  assetClass: AssetClass;
  symbol?: string;
  description?: string;

  // Values (USD)
  positionValueUsd: number;
  marginRequirementUsd: number;
  availableCollateralUsd: number;
  netLiquidityUsd: number;

  // Risk metrics
  leverage?: number;
  var95?: number; // Value at Risk
  expectedShortfall?: number;

  // Metadata
  source: PositionSource;
  createdAt: string;
  updatedAt: string;
}

/**
 * Aggregated position summary
 */
export interface PositionSummary {
  orgId: string;
  asOfDate: string;

  // Totals
  totalPositionValue: number;
  totalMarginRequirement: number;
  totalAvailableCollateral: number;
  totalNetLiquidity: number;

  // By broker breakdown
  byBroker: BrokerBreakdown[];

  // By asset class breakdown
  byAssetClass: AssetClassBreakdown[];

  // Key metrics
  overallLeverage: number;
  marginUtilization: number;
  liquidityRatio: number;

  // Alerts
  marginCallRisk: 'low' | 'medium' | 'high';
  concentrationRisk: 'low' | 'medium' | 'high';
}

/**
 * Broker breakdown
 */
export interface BrokerBreakdown {
  broker: BrokerName;
  positionValue: number;
  marginRequirement: number;
  availableCollateral: number;
  positionCount: number;
  percentageOfTotal: number;
}

/**
 * Asset class breakdown
 */
export interface AssetClassBreakdown {
  assetClass: AssetClass;
  positionValue: number;
  marginRequirement: number;
  positionCount: number;
  percentageOfTotal: number;
}

/**
 * Position history for trend analysis
 */
export interface PositionHistory {
  orgId: string;
  startDate: string;
  endDate: string;
  granularity: 'daily' | 'weekly' | 'monthly';

  dataPoints: PositionHistoryPoint[];
}

/**
 * Position history data point
 */
export interface PositionHistoryPoint {
  date: string;
  totalPositionValue: number;
  totalMarginRequirement: number;
  totalAvailableCollateral: number;
  leverage: number;
}

/**
 * CSV upload result
 */
export interface CSVUploadResult {
  success: boolean;
  uploadId: string;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsFailed: number;

  // Validation results
  validationErrors: CSVValidationError[];
  warnings: string[];

  // Summary
  summary: {
    earliestDate: string;
    latestDate: string;
    brokersCovered: BrokerName[];
    assetClassesCovered: AssetClass[];
  };
}

/**
 * CSV validation error
 */
export interface CSVValidationError {
  row: number;
  column: string;
  value: string;
  error: string;
  severity: 'error' | 'warning';
}

/**
 * Position query parameters
 */
export interface PositionQueryParams {
  asOfDate?: string;
  broker?: BrokerName;
  assetClass?: AssetClass;
  minValue?: number;
  maxValue?: number;
  limit?: number;
  offset?: number;
}

/**
 * Margin requirement update
 */
export interface MarginUpdate {
  updateId: string;
  broker: BrokerName;
  previousRequirement: number;
  newRequirement: number;
  changePercent: number;
  effectiveDate: string;
  reason?: string;
}
