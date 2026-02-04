// ============================================
// HARVEY'S OFFICE WING TYPES
// Executive Strategy (Features 71-80)
// ============================================

import type { HarveyMood } from '../agents/harvey';

/**
 * Strategy canvas node
 */
export interface StrategyCanvasNode {
  id: string;
  type: 'objective' | 'tactic' | 'resource' | 'constraint' | 'outcome';
  title: string;
  description: string;
  position: { x: number; y: number };
  connections: string[];
  status: 'planning' | 'active' | 'completed' | 'blocked';
  assignee?: string;
  priority: number;
}

/**
 * Strategy canvas
 */
export interface StrategyCanvas {
  id: string;
  name: string;
  description: string;
  nodes: StrategyCanvasNode[];
  connections: CanvasConnection[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'archived';
}

/**
 * Canvas connection
 */
export interface CanvasConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'dependency' | 'influence' | 'conflict' | 'supports';
  strength: 'weak' | 'moderate' | 'strong';
}

/**
 * Motivational soundscape
 */
export interface MotivationalSoundscape {
  id: string;
  name: string;
  description: string;
  mood: 'intense' | 'focused' | 'victorious' | 'contemplative';
  tracks: SoundscapeTrack[];
  harveyApproved: boolean;
  unlockRequirement?: string;
}

/**
 * Soundscape track
 */
export interface SoundscapeTrack {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop: boolean;
}

/**
 * Execution trigger
 */
export interface ExecutionTrigger {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'scheduled' | 'conditional' | 'event';
  status: 'armed' | 'disarmed' | 'fired' | 'cooldown';
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  lastFiredAt?: string;
  cooldownMinutes?: number;
}

/**
 * Trigger condition
 */
export interface TriggerCondition {
  id: string;
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value: number | [number, number];
  logicalOperator?: 'and' | 'or';
}

/**
 * Trigger action
 */
export interface TriggerAction {
  id: string;
  type: 'notify' | 'execute' | 'escalate' | 'log';
  config: Record<string, unknown>;
  order: number;
}

/**
 * Risk tolerance setting (Bigger Gun)
 */
export interface RiskToleranceSetting {
  id: string;
  name: string;
  level: 'conservative' | 'moderate' | 'aggressive' | 'maximum';
  multiplier: number;
  description: string;
  harveyQuote: string;
  warnings: string[];
  requiresConfirmation: boolean;
}

/**
 * Win rate dashboard data
 */
export interface WinRateDashboard {
  overallWinRate: number;
  winRateByType: WinRateCategory[];
  streak: WinStreak;
  recentOutcomes: Outcome[];
  comparison: WinRateComparison;
}

/**
 * Win rate category
 */
export interface WinRateCategory {
  category: string;
  wins: number;
  losses: number;
  winRate: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Win streak
 */
export interface WinStreak {
  current: number;
  best: number;
  type: 'winning' | 'losing' | 'neutral';
}

/**
 * Outcome
 */
export interface Outcome {
  id: string;
  date: string;
  type: string;
  result: 'win' | 'loss' | 'draw';
  value: number;
  notes?: string;
}

/**
 * Win rate comparison
 */
export interface WinRateComparison {
  vsLastMonth: number;
  vsLastQuarter: number;
  vsIndustryAvg: number;
  rank: number;
  totalParticipants: number;
}

/**
 * Authoritative alert dialog
 */
export interface AuthoritativeAlertDialog {
  id: string;
  type: 'warning' | 'error' | 'critical' | 'decision';
  title: string;
  message: string;
  harveyQuote: string;
  mood: HarveyMood;
  options: AlertOption[];
  timeout?: number;
  requiresAction: boolean;
}

/**
 * Alert option
 */
export interface AlertOption {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'destructive';
  action: string;
  keyboard?: string;
}

/**
 * Decision boundary governance
 */
export interface DecisionBoundaryGovernance {
  boundaries: DecisionBoundary[];
  overrideHistory: BoundaryOverride[];
  currentRiskLevel: number;
  maxAllowedRisk: number;
}

/**
 * Decision boundary
 */
export interface DecisionBoundary {
  id: string;
  name: string;
  metric: string;
  softLimit: number;
  hardLimit: number;
  currentValue: number;
  status: 'within' | 'approaching' | 'breached';
  action: 'warn' | 'block' | 'escalate';
}

/**
 * Boundary override
 */
export interface BoundaryOverride {
  id: string;
  boundaryId: string;
  overriddenBy: string;
  reason: string;
  timestamp: string;
  expiresAt: string;
  approved: boolean;
}

/**
 * Explainability report
 */
export interface ExplainabilityReport {
  decisionId: string;
  decision: string;
  factors: ExplainabilityFactor[];
  confidence: number;
  alternativeOutcomes: AlternativeOutcome[];
  reasoning: string;
  generatedAt: string;
}

/**
 * Explainability factor
 */
export interface ExplainabilityFactor {
  name: string;
  contribution: number;
  direction: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

/**
 * Alternative outcome
 */
export interface AlternativeOutcome {
  scenario: string;
  probability: number;
  impact: string;
}

/**
 * Strategy rollback
 */
export interface StrategyRollback {
  id: string;
  strategyId: string;
  fromVersion: number;
  toVersion: number;
  reason: string;
  initiatedBy: string;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

/**
 * Rainmaker analytics
 */
export interface RainmakerAnalytics {
  userId: string;
  period: string;
  revenueGenerated: number;
  dealsWon: number;
  dealsPending: number;
  avgDealSize: number;
  pipelineValue: number;
  forecast: number;
  ranking: number;
  achievements: string[];
}
