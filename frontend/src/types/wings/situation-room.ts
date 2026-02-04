// ============================================
// SITUATION ROOM WING TYPES
// Crisis Simulator (Features 21-30)
// ============================================

/**
 * Disaster journey phase
 */
export type DisasterPhase =
  | 'detection'
  | 'assessment'
  | 'containment'
  | 'eradication'
  | 'recovery'
  | 'lessons_learned';

/**
 * Disaster journey map
 */
export interface DisasterJourneyMap {
  scenarioId: string;
  scenarioName: string;
  currentPhase: DisasterPhase;
  phases: DisasterPhaseDetails[];
  totalDuration: number;
  elapsedTime: number;
  criticalDecisions: CriticalDecision[];
}

/**
 * Disaster phase details
 */
export interface DisasterPhaseDetails {
  phase: DisasterPhase;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  startTime?: string;
  endTime?: string;
  duration?: number;
  actions: PhaseAction[];
  outcomes: string[];
}

/**
 * Phase action
 */
export interface PhaseAction {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Critical decision
 */
export interface CriticalDecision {
  id: string;
  phase: DisasterPhase;
  question: string;
  options: DecisionOption[];
  selectedOption?: string;
  decidedAt?: string;
  decidedBy?: string;
  impact: string;
}

/**
 * Decision option
 */
export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  timeImpact: number;
  costImpact: number;
}

/**
 * Paranoia mode state
 */
export interface ParanoiaModeState {
  isActive: boolean;
  activatedAt?: string;
  reason: string;
  severity: 'elevated' | 'critical';
  indicators: ParanoiaIndicator[];
  recommendations: string[];
  autoDeactivateAt?: string;
}

/**
 * Paranoia indicator
 */
export interface ParanoiaIndicator {
  name: string;
  value: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'worsening';
}

/**
 * High-res scenario model
 */
export interface HighResScenario {
  scenarioId: string;
  name: string;
  description: string;
  type: 'market_crash' | 'liquidity_crisis' | 'counterparty_default' | 'cyber_attack' | 'regulatory_action';
  parameters: ScenarioParameter[];
  timeline: ScenarioTimelineEvent[];
  projectedImpact: ScenarioImpact;
}

/**
 * Scenario parameter
 */
export interface ScenarioParameter {
  name: string;
  value: number;
  unit: string;
  adjustable: boolean;
  min?: number;
  max?: number;
}

/**
 * Scenario timeline event
 */
export interface ScenarioTimelineEvent {
  time: number;  // minutes from start
  event: string;
  impact: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Scenario impact
 */
export interface ScenarioImpact {
  liquidityChange: number;
  marginChange: number;
  pnlImpact: number;
  recoveryTime: number;
  confidenceInterval: [number, number];
}

/**
 * Decision tree node
 */
export interface DecisionTreeNode {
  id: string;
  type: 'decision' | 'chance' | 'outcome';
  label: string;
  probability?: number;
  value?: number;
  children: DecisionTreeNode[];
  isSelected?: boolean;
}

/**
 * Time constraint pressure test
 */
export interface PressureTestConfig {
  testId: string;
  timeLimit: number;  // seconds
  scenario: string;
  decisions: number;
  complexity: 'easy' | 'medium' | 'hard' | 'extreme';
}

/**
 * Pressure test result
 */
export interface PressureTestResult {
  testId: string;
  userId: string;
  completedIn: number;
  correctDecisions: number;
  totalDecisions: number;
  score: number;
  xpEarned: number;
  rank: string;
}

/**
 * Incident notification
 */
export interface IncidentNotification {
  incidentId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: string;
  source: string;
  affectedSystems: string[];
  status: 'open' | 'investigating' | 'mitigating' | 'resolved';
}

/**
 * Ransomware recovery dashboard
 */
export interface RansomwareRecoveryDashboard {
  incidentId: string;
  status: 'detected' | 'contained' | 'recovering' | 'restored';
  affectedSystems: number;
  recoveredSystems: number;
  dataLossEstimate: number;
  estimatedRecoveryTime: number;
  backupStatus: 'available' | 'partial' | 'unavailable';
  timeline: RecoveryTimelineEvent[];
}

/**
 * Recovery timeline event
 */
export interface RecoveryTimelineEvent {
  timestamp: string;
  event: string;
  status: 'completed' | 'in_progress' | 'pending';
}

/**
 * Monte Carlo simulation race
 */
export interface MonteCarloRace {
  raceId: string;
  scenarios: MonteCarloScenario[];
  iterations: number;
  status: 'preparing' | 'running' | 'completed';
  progress: number;
  winner?: string;
}

/**
 * Monte Carlo scenario
 */
export interface MonteCarloScenario {
  id: string;
  name: string;
  color: string;
  currentValue: number;
  finalValue?: number;
  trajectory: number[];
}

/**
 * CISO vs IT Admin view config
 */
export interface ViewPerspective {
  role: 'ciso' | 'it_admin';
  metrics: string[];
  priorities: string[];
  dashboardLayout: string;
}
