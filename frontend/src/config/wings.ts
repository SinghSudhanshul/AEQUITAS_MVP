// ============================================
// WINGS CONFIGURATION
// 9-Wing Navigation with Routes & Permissions
// ============================================

import type { RankId } from './gamification';

// ============================================
// TYPES
// ============================================

export type WingId =
  | 'lobby'
  | 'bullpen'
  | 'library'
  | 'treasury'
  | 'situation-room'
  | 'war-room'
  | 'donnas-desk'
  | 'harveys-office'
  | 'vault';

export interface WingFeature {
  id: string;
  name: string;
  description: string;
  tier: 'free' | 'premium' | 'enterprise';
  component: string;
}

export interface WingConfig {
  id: WingId;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  path: string;
  color: string;
  accentColor: string;
  requiredRank: RankId;
  tier: 'free' | 'premium' | 'enterprise';
  features: WingFeature[];
  persona?: 'harvey' | 'donna';
  order: number;
}

// ============================================
// WING CONFIGURATIONS
// ============================================

export const WINGS: Record<WingId, WingConfig> = {
  lobby: {
    id: 'lobby',
    name: 'The Lobby',
    shortName: 'Lobby',
    icon: '🏛️',
    description: 'Welcome center, onboarding, and discovery',
    path: '/app/wings/lobby',
    color: '#94a3b8',
    accentColor: '#64748b',
    requiredRank: 'junior_associate',
    tier: 'free',
    order: 1,
    features: [
      { id: 'intent-recognition', name: 'Intent Recognition Modal', description: 'Smart onboarding flow', tier: 'free', component: 'IntentRecognitionModal' },
      { id: 'regime-detection', name: 'Regime Detection Badge', description: 'Real-time market regime indicator', tier: 'free', component: 'RegimeDetectionBadge' },
      { id: 'reception-desk', name: 'Reception Desk Dashboard', description: 'Central hub for navigation', tier: 'free', component: 'ReceptionDeskDashboard' },
      { id: 'biometric-gate', name: 'Biometric Gatekeeper', description: 'Secure authentication', tier: 'premium', component: 'BiometricGatekeeper' },
      { id: 'progressive-kyc', name: 'Progressive KYC', description: 'Step-by-step verification', tier: 'premium', component: 'ProgressiveKYC' },
      { id: 'org-chart', name: 'Institutional Org Chart', description: 'Organization visualization', tier: 'enterprise', component: 'InstitutionalOrgChart' },
      { id: 'daily-standup', name: 'Daily Standup Notification', description: 'Morning briefing', tier: 'free', component: 'DailyStandupNotification' },
      { id: 'sitemap-builder', name: 'Interactive Sitemap Builder', description: 'Navigation customization', tier: 'premium', component: 'InteractiveSitemapBuilder' },
      { id: 'rbac-matrix', name: 'RBAC Matrix', description: 'Role-based access control', tier: 'enterprise', component: 'RBACMatrix' },
      { id: 'feature-2', name: 'Feature 2', description: 'Placeholder feature', tier: 'free', component: 'Feature2' },
    ],
  },

  bullpen: {
    id: 'bullpen',
    name: 'The Bullpen',
    shortName: 'Bullpen',
    icon: '📊',
    description: 'Associate workspace for data management',
    path: '/app/wings/bullpen',
    color: '#3b82f6',
    accentColor: '#2563eb',
    requiredRank: 'associate',
    tier: 'free',
    order: 2,
    features: [
      { id: 'evidence-log', name: 'Evidence Log Data Table', description: 'Transaction and position logs', tier: 'free', component: 'EvidenceLogDataTable' },
      { id: 'billable-hours', name: 'Billable Hour Tracker', description: 'Time tracking gamification', tier: 'free', component: 'BillableHourTracker' },
      { id: 'task-kanban', name: 'Task Kanban Fixolaw', description: 'Workflow management', tier: 'premium', component: 'TaskKanbanFixolaw' },
      { id: 'doc-unbinding', name: 'Document Unbinding Animation', description: 'Data extraction visuals', tier: 'free', component: 'DocumentUnbindingAnimation' },
      { id: 'contextual-help', name: 'Contextual Help Tooltips', description: 'Smart assistance', tier: 'free', component: 'ContextualHelpTooltips' },
      { id: 'hard-love-toast', name: 'Hard Love Failure Toast', description: 'Harvey-style error messages', tier: 'free', component: 'HardLoveFailureToast' },
      { id: 'priority-sorter', name: 'Dynamic Priority Sorter', description: 'Smart task prioritization', tier: 'premium', component: 'DynamicPrioritySorter' },
      { id: 'war-room-sheet', name: 'Collaborative War Room Sheet', description: 'Team collaboration', tier: 'enterprise', component: 'CollaborativeWarRoomSheet' },
      { id: 'snapshot-validator', name: 'Snapshot Date Validator', description: 'Data consistency checks', tier: 'premium', component: 'SnapshotDateValidator' },
      { id: 'xp-toast', name: 'XP Celebration Toast', description: 'Gamification feedback', tier: 'free', component: 'XPCelebrationToast' },
    ],
  },

  library: {
    id: 'library',
    name: 'The Library',
    shortName: 'Library',
    icon: '📚',
    description: 'Analytics, ML metrics, and research',
    path: '/app/wings/library',
    color: '#8b5cf6',
    accentColor: '#7c3aed',
    requiredRank: 'senior_associate',
    tier: 'premium',
    order: 3,
    features: [
      { id: 'quantile-viz', name: 'Quantile Risk Range Visualizer', description: 'P5/P50/P95 charts', tier: 'premium', component: 'QuantileRiskRangeVisualizer' },
      { id: 'market-weather', name: 'Market Weather Topographic', description: '3D regime visualization', tier: 'premium', component: 'MarketWeatherTopographic' },
      { id: 'confidence-gauge', name: 'Confidence Score Gauge', description: 'ML confidence display', tier: 'premium', component: 'ConfidenceScoreGauge' },
      { id: 'quantile-compression', name: 'Quantile Compression Alert', description: 'Convergence detection', tier: 'premium', component: 'QuantileCompressionAlert' },
      { id: 'historical-overlay', name: 'Historical Forecast Overlay', description: 'Actuals vs predictions', tier: 'premium', component: 'HistoricalForecastOverlay' },
      { id: 'xgboost-badge', name: 'XGBoost Inference Badge', description: 'ML model indicator', tier: 'premium', component: 'XGBoostInferenceBadge' },
      { id: 'seasonality', name: 'Seasonality Detector', description: 'Pattern recognition', tier: 'premium', component: 'SeasonalityDetector' },
      { id: 'uncertainty-viz', name: 'Uncertainty Visualizer', description: 'Confidence intervals', tier: 'premium', component: 'UncertaintyVisualizer' },
      { id: 'mlflow-tracker', name: 'MLflow Experiment Tracker', description: 'Model versioning', tier: 'enterprise', component: 'MLflowExperimentTracker' },
      { id: 'expert-override', name: 'Expert Override Slider', description: 'Manual adjustments', tier: 'premium', component: 'ExpertOverrideSlider' },
    ],
  },

  treasury: {
    id: 'treasury',
    name: 'The Treasury',
    shortName: 'Treasury',
    icon: '💰',
    description: 'Financial operations and forecasting',
    path: '/app/wings/treasury',
    color: '#10b981',
    accentColor: '#059669',
    requiredRank: 'junior_partner',
    tier: 'premium',
    order: 4,
    features: [
      { id: 'liquidity-forecast', name: 'Daily Liquidity Forecast Card', description: 'Cash flow predictions', tier: 'premium', component: 'DailyLiquidityForecastCard' },
      { id: 'margin-monitor', name: 'Margin Requirement Monitor', description: 'Real-time margin tracking', tier: 'premium', component: 'MarginRequirementMonitor' },
      { id: 'transaction-history', name: 'Transaction History', description: 'Audit trail', tier: 'premium', component: 'TransactionHistory' },
      { id: 'sub-ms-badge', name: 'Sub-Millisecond Badge', description: 'Latency indicator', tier: 'enterprise', component: 'SubMillisecondBadge' },
      { id: 'multi-currency', name: 'Multi-Currency Account Manager', description: 'FX management', tier: 'premium', component: 'MultiCurrencyAccountManager' },
      { id: 'rainmaker-revenue', name: 'Rainmaker Revenue Dashboard', description: 'P&L analytics', tier: 'premium', component: 'RainmakerRevenueDashboard' },
      { id: 'burn-rate-slo', name: 'Burn Rate SLO Alert', description: 'Spend monitoring', tier: 'premium', component: 'BurnRateSLOAlert' },
      { id: 'peer-benchmark', name: 'Peer Group Benchmarking', description: 'Competitive analysis', tier: 'enterprise', component: 'PeerGroupBenchmarking' },
      { id: 'scenario-sliders', name: 'Scenario Planning Sliders', description: 'What-if analysis', tier: 'premium', component: 'ScenarioPlanningSliders' },
      { id: 'quantum-monte-carlo', name: 'Quantum Monte Carlo Sim', description: 'Advanced simulations', tier: 'enterprise', component: 'QuantumMonteCarloSim' },
    ],
  },

  'situation-room': {
    id: 'situation-room',
    name: 'The Situation Room',
    shortName: 'Situation',
    icon: '🚨',
    description: 'Crisis simulation and stress testing',
    path: '/app/wings/situation-room',
    color: '#ef4444',
    accentColor: '#dc2626',
    requiredRank: 'partner',
    tier: 'premium',
    order: 5,
    features: [
      { id: 'disaster-journey', name: 'Disaster Journey Mapper', description: 'Crisis timeline visualization', tier: 'premium', component: 'DisasterJourneyMapper' },
      { id: 'paranoia-mode', name: 'Paranoia Mode UI', description: 'Emergency single-column layout', tier: 'premium', component: 'ParanoiaModeUI' },
      { id: 'high-res-scenario', name: 'High-Res Scenario Modeler', description: 'Detailed scenario builder', tier: 'premium', component: 'HighResScenarioModeler' },
      { id: 'decision-tree', name: 'Decision Tree Visualizer', description: 'Choice mapping', tier: 'premium', component: 'DecisionTreeVisualizer' },
      { id: 'time-pressure', name: 'Time Constraint Pressure Tester', description: 'Deadline simulation', tier: 'enterprise', component: 'TimeConstraintPressureTester' },
      { id: 'incident-notifier', name: 'Automated Incident Notifier', description: 'Alert escalation', tier: 'premium', component: 'AutomatedIncidentNotifier' },
      { id: 'ransomware-recovery', name: 'Ransomware Recovery Dashboard', description: 'Cyber response', tier: 'enterprise', component: 'RansomwareRecoveryDashboard' },
      { id: 'post-crisis-interview', name: 'Post-Crisis Interview Tool', description: 'Debrief and analysis', tier: 'premium', component: 'PostCrisisInterviewTool' },
      { id: 'monte-carlo-race', name: 'Monte Carlo Simulation Race', description: 'Scenario racing', tier: 'premium', component: 'MonteCarloSimulationRace' },
      { id: 'ciso-it-view', name: 'CISO vs IT Admin View', description: 'Role-based dashboards', tier: 'enterprise', component: 'CISOVsITAdminView' },
    ],
  },

  'war-room': {
    id: 'war-room',
    name: 'The War Room',
    shortName: 'War Room',
    icon: '⚔️',
    description: 'Litigation tech and evidence presentation',
    path: '/app/wings/war-room',
    color: '#f97316',
    accentColor: '#ea580c',
    requiredRank: 'senior_partner',
    tier: 'enterprise',
    order: 6,
    features: [
      { id: 'evidence-timeline', name: 'Visual Evidence Timeline', description: 'Chronological evidence view', tier: 'enterprise', component: 'VisualEvidenceTimeline' },
      { id: 'financial-heatmap', name: 'Financial Heatmap', description: 'Transaction heat visualization', tier: 'enterprise', component: 'FinancialHeatmap' },
      { id: 'speech-to-text', name: 'Speech To Text Deposition', description: 'Audio transcription', tier: 'enterprise', component: 'SpeechToTextDeposition' },
      { id: 'jury-graph', name: 'Jury Comprehension Graph', description: 'Presentation effectiveness', tier: 'enterprise', component: 'JuryComprehensionGraph' },
      { id: 'trial-exhibits', name: 'Interactive Trial Exhibits', description: 'Exhibit management', tier: 'enterprise', component: 'InteractiveTrialExhibits' },
      { id: 'on-record', name: 'On The Record Indicator', description: 'Recording status', tier: 'enterprise', component: 'OnTheRecordIndicator' },
      { id: 'asset-repo', name: 'Post-Proceeding Asset Repo', description: 'Document storage', tier: 'enterprise', component: 'PostProceedingAssetRepo' },
      { id: 'evidence-culling', name: 'Evidence Culling Tool', description: 'Smart filtering', tier: 'enterprise', component: 'EvidenceCullingTool' },
      { id: '3d-reconstruction', name: '3D Accident Reconstruction', description: 'Incident visualization', tier: 'enterprise', component: '3DAccidentReconstruction' },
      { id: 'legal-ai-chat', name: 'Legal Insight AI Chat', description: 'AI legal research', tier: 'enterprise', component: 'LegalInsightAIChat' },
    ],
  },

  'donnas-desk': {
    id: 'donnas-desk',
    name: "Donna's Desk",
    shortName: 'Donna',
    icon: '💅',
    description: 'AI persona chat and workflow automation',
    path: '/app/wings/donnas-desk',
    color: '#0d9488',
    accentColor: '#0f766e',
    requiredRank: 'senior_partner',
    tier: 'premium',
    order: 7,
    persona: 'donna',
    features: [
      { id: 'donna-chat', name: 'Donna Chat Interface', description: 'Conversational AI', tier: 'premium', component: 'DonnaChatInterface' },
      { id: 'donna-radar', name: 'Donna Radar Proactive Nudge', description: 'Anticipatory suggestions', tier: 'premium', component: 'DonnaRadarProactiveNudge' },
      { id: 'workflow-automation', name: 'Multi-Step Workflow Automation', description: 'Process automation', tier: 'premium', component: 'MultiStepWorkflowAutomation' },
      { id: 'eq-aware', name: 'EQ Aware Microcopy', description: 'Emotionally intelligent UI', tier: 'premium', component: 'EQAwareMicrocopy' },
      { id: 'shadowing-agent', name: 'Shadowing Agent', description: 'Learning from actions', tier: 'enterprise', component: 'ShadowingAgent' },
      { id: 'multimodal-command', name: 'Multimodal Command Ingest', description: 'Voice/text/gesture input', tier: 'enterprise', component: 'MultimodalCommandIngest' },
      { id: 'auto-draft', name: 'Automatic Draft Generator', description: 'Document drafting', tier: 'premium', component: 'AutomaticDraftGenerator' },
      { id: 'teacher-loop', name: 'Teacher Loop', description: 'AI training feedback', tier: 'enterprise', component: 'TeacherLoop' },
      { id: 'multi-agent', name: 'Social Multi-Agent Coordinator', description: 'Agent orchestration', tier: 'enterprise', component: 'SocialMultiAgentCoordinator' },
      { id: 'persona-signed', name: 'Persona Signed Messages', description: 'AI attribution', tier: 'premium', component: 'PersonaSignedMessages' },
    ],
  },

  'harveys-office': {
    id: 'harveys-office',
    name: "Harvey's Office",
    shortName: 'Harvey',
    icon: '👔',
    description: 'Executive strategy and decision-making',
    path: '/app/wings/harveys-office',
    color: '#f59e0b',
    accentColor: '#d97706',
    requiredRank: 'managing_partner',
    tier: 'enterprise',
    order: 8,
    persona: 'harvey',
    features: [
      { id: 'strategy-builder', name: 'Strategy Builder Canvas', description: 'Visual strategy planning', tier: 'enterprise', component: 'StrategyBuilderCanvas' },
      { id: 'motivational-sound', name: 'Motivational Soundscape', description: 'Audio environment', tier: 'premium', component: 'MotivationalSoundscape' },
      { id: 'execution-triggers', name: 'Execution Triggers', description: 'Action automation', tier: 'enterprise', component: 'ExecutionTriggers' },
      { id: 'risk-tolerance', name: 'Risk Tolerance Bigger Gun', description: 'Risk adjustment', tier: 'enterprise', component: 'RiskToleranceBiggerGun' },
      { id: 'win-rate', name: 'Win Rate Dashboard', description: 'Performance tracking', tier: 'enterprise', component: 'WinRateDashboard' },
      { id: 'alert-dialogs', name: 'Authoritative Alert Dialogs', description: 'Harvey-style confirmations', tier: 'premium', component: 'AuthoritativeAlertDialogs' },
      { id: 'decision-boundary', name: 'Decision Boundary Governance', description: 'Approval workflows', tier: 'enterprise', component: 'DecisionBoundaryGovernance' },
      { id: 'explainability', name: 'Explainability On Demand', description: 'ML transparency', tier: 'enterprise', component: 'ExplainabilityOnDemand' },
      { id: 'strategy-rollback', name: 'Strategy Rollback Controls', description: 'Version control', tier: 'enterprise', component: 'StrategyRollbackControls' },
      { id: 'rainmaker-analytics', name: 'Rainmaker Analytics Core', description: 'Revenue attribution', tier: 'enterprise', component: 'RainmakerAnalyticsCore' },
    ],
  },

  vault: {
    id: 'vault',
    name: 'The Vault',
    shortName: 'Vault',
    icon: '🔐',
    description: 'Security, compliance, and audit',
    path: '/app/wings/vault',
    color: '#6366f1',
    accentColor: '#4f46e5',
    requiredRank: 'name_partner',
    tier: 'enterprise',
    order: 9,
    features: [
      { id: 'otp-vault', name: 'OTP Vault Input', description: 'Secure code entry', tier: 'enterprise', component: 'OTPVaultInput' },
      { id: 'audit-log', name: 'Seven Year Audit Log', description: 'Complete history', tier: 'enterprise', component: 'SevenYearAuditLog' },
      { id: 'tls-indicator', name: 'TLS Security Indicator', description: 'Encryption status', tier: 'enterprise', component: 'TLSSecurityIndicator' },
      { id: 'post-quantum', name: 'Post-Quantum Crypto Badge', description: 'Future-proof security', tier: 'enterprise', component: 'PostQuantumCryptoBadge' },
      { id: 'audit-summaries', name: 'Audit Record Auto Summaries', description: 'AI-generated summaries', tier: 'enterprise', component: 'AuditRecordAutoSummaries' },
      { id: 'biometric-recovery', name: 'Biometric Recovery Flow', description: 'Account recovery', tier: 'enterprise', component: 'BiometricRecoveryFlow' },
      { id: 'compliance-badges', name: 'In-Context Compliance Badges', description: 'Regulation indicators', tier: 'enterprise', component: 'InContextComplianceBadges' },
      { id: 'granular-permissions', name: 'Granular Permissions Matrix', description: 'Access control', tier: 'enterprise', component: 'GranularPermissionsMatrix' },
      { id: 'hybrid-edge', name: 'Hybrid Edge Processing Badge', description: 'Data locality', tier: 'enterprise', component: 'HybridEdgeProcessingBadge' },
      { id: 'integrity-benchmark', name: 'Integrity Benchmark', description: 'Security scoring', tier: 'enterprise', component: 'IntegrityBenchmark' },
    ],
  },
};

// ============================================
// WING ORDER
// ============================================

export const WING_ORDER: WingId[] = [
  'lobby',
  'bullpen',
  'library',
  'treasury',
  'situation-room',
  'war-room',
  'donnas-desk',
  'harveys-office',
  'vault',
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getWingByPath(path: string): WingConfig | undefined {
  return Object.values(WINGS).find((wing) => wing.path === path);
}

export function getWingsForRank(rank: string): WingConfig[] {
  const rankOrder = [
    'junior_associate',
    'associate',
    'senior_associate',
    'junior_partner',
    'partner',
    'senior_partner',
    'managing_partner',
    'name_partner',
  ];

  const rankIndex = rankOrder.indexOf(rank.toLowerCase().replace(/ /g, '_'));

  return Object.values(WINGS).filter((wing) => {
    const wingRankIndex = rankOrder.indexOf(wing.requiredRank);
    return wingRankIndex <= rankIndex;
  });
}

export function getWingsForTier(tier: 'free' | 'premium' | 'enterprise'): WingConfig[] {
  const tierOrder = ['free', 'premium', 'enterprise'];
  const tierIndex = tierOrder.indexOf(tier);

  return Object.values(WINGS).filter((wing) => {
    const wingTierIndex = tierOrder.indexOf(wing.tier);
    return wingTierIndex <= tierIndex;
  });
}

export function isWingUnlocked(
  wingId: WingId,
  userRank: string,
  userTier: 'free' | 'premium' | 'enterprise'
): boolean {
  const wing = WINGS[wingId];
  if (!wing) return false;

  const rankUnlocked = getWingsForRank(userRank).some((w) => w.id === wingId);
  const tierUnlocked = getWingsForTier(userTier).some((w) => w.id === wingId);

  return rankUnlocked && tierUnlocked;
}

// ============================================
// EXPORTS
// ============================================

export default WINGS;
