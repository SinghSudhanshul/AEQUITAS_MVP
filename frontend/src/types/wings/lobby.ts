// ============================================
// LOBBY WING TYPES
// Onboarding & Discovery (Features 1-10)
// ============================================

/**
 * User intent categories
 */
export type UserIntent =
  | 'forecast_liquidity'
  | 'analyze_positions'
  | 'monitor_crisis'
  | 'manage_team'
  | 'view_reports'
  | 'configure_settings'
  | 'learn_platform';

/**
 * Intent recognition result
 */
export interface IntentRecognitionResult {
  intent: UserIntent;
  confidence: number;
  suggestedRoute: string;
  suggestedActions: string[];
  donnaMessage: string;
}

/**
 * Biometric verification status
 */
export type BiometricStatus =
  | 'not_configured'
  | 'pending'
  | 'verified'
  | 'failed'
  | 'expired';

/**
 * Biometric method
 */
export type BiometricMethod = 'fingerprint' | 'face' | 'voice' | 'none';

/**
 * Biometric gatekeeper state
 */
export interface BiometricGatekeeperState {
  status: BiometricStatus;
  method: BiometricMethod;
  lastVerifiedAt?: string;
  failedAttempts: number;
  lockedUntil?: string;
}

/**
 * KYC step
 */
export interface KYCStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  required: boolean;
  component: string;
}

/**
 * Progressive KYC state
 */
export interface ProgressiveKYCState {
  currentStep: number;
  totalSteps: number;
  steps: KYCStep[];
  completionPercentage: number;
  canProceed: boolean;
  missingRequirements: string[];
}

/**
 * Org chart node
 */
export interface OrgChartNode {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  department: string;
  children: OrgChartNode[];
  isExpanded: boolean;
}

/**
 * Sitemap item
 */
export interface SitemapItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  children: SitemapItem[];
  tier: 'free' | 'premium' | 'enterprise';
  wingId: string;
}

/**
 * RBAC permission
 */
export interface RBACPermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  effect: 'allow' | 'deny';
  conditions?: Record<string, unknown>;
}

/**
 * RBAC role
 */
export interface RBACRole {
  roleId: string;
  name: string;
  description: string;
  permissions: RBACPermission[];
  inheritsFrom?: string;
}

/**
 * Daily standup notification
 */
export interface DailyStandupNotification {
  id: string;
  date: string;
  forecasts: {
    todayP50: number;
    change: number;
    regime: string;
  };
  alerts: number;
  tasks: number;
  harveyMessage: string;
  donnaMessage: string;
}

/**
 * Reception desk dashboard data
 */
export interface ReceptionDeskData {
  welcomeMessage: string;
  userName: string;
  userRank: string;
  todaysForecast: number;
  pendingTasks: number;
  alerts: number;
  quickActions: Array<{
    id: string;
    label: string;
    route: string;
    icon: string;
  }>;
}
