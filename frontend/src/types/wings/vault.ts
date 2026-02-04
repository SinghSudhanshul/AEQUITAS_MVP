// ============================================
// VAULT WING TYPES
// Security & Compliance (Features 81-90)
// ============================================

/**
 * OTP vault input state
 */
export interface OTPVaultInputState {
  digits: string[];
  isValid: boolean;
  isVerifying: boolean;
  attemptsRemaining: number;
  lockedUntil?: string;
  method: 'sms' | 'email' | 'authenticator' | 'hardware_key';
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
}

/**
 * Seven year audit log summary
 */
export interface SevenYearAuditSummary {
  totalRecords: number;
  oldestRecord: string;
  newestRecord: string;
  storageUsedGb: number;
  retentionPolicy: string;
  complianceStatus: 'compliant' | 'at_risk' | 'non_compliant';
  yearlyBreakdown: YearlyAuditBreakdown[];
}

/**
 * Yearly audit breakdown
 */
export interface YearlyAuditBreakdown {
  year: number;
  records: number;
  sizeGb: number;
  archived: boolean;
}

/**
 * TLS security indicator
 */
export interface TLSSecurityIndicator {
  protocol: string;
  cipherSuite: string;
  certificateIssuer: string;
  certificateExpiry: string;
  keyExchange: string;
  securityLevel: 'excellent' | 'good' | 'fair' | 'poor';
  warnings: string[];
  lastChecked: string;
}

/**
 * Post-quantum cryptography badge
 */
export interface PostQuantumCryptoBadge {
  enabled: boolean;
  algorithm: string;
  keySize: number;
  securityLevel: number;
  implementationStatus: 'testing' | 'staging' | 'production';
  lastRotation: string;
  nextRotation: string;
}

/**
 * Audit record auto-summary
 */
export interface AuditAutoSummary {
  id: string;
  period: string;
  generatedAt: string;
  summary: string;
  keyActions: string[];
  anomalies: AuditAnomaly[];
  riskScore: number;
  recommendations: string[];
}

/**
 * Audit anomaly
 */
export interface AuditAnomaly {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  investigated: boolean;
  resolution?: string;
}

/**
 * Biometric recovery flow state
 */
export interface BiometricRecoveryState {
  currentStep: number;
  totalSteps: number;
  method: 'security_questions' | 'email' | 'phone' | 'admin_approval';
  verified: boolean;
  attemptsRemaining: number;
  expiresAt: string;
}

/**
 * In-context compliance badge
 */
export interface ComplianceBadge {
  id: string;
  regulation: string;
  article?: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
  lastAudit: string;
  nextAudit: string;
  evidence: string[];
  tooltip: string;
}

/**
 * Granular permission
 */
export interface GranularPermission {
  resource: string;
  actions: PermissionAction[];
  conditions: PermissionCondition[];
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

/**
 * Permission action
 */
export interface PermissionAction {
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'approve';
  allowed: boolean;
  reason?: string;
}

/**
 * Permission condition
 */
export interface PermissionCondition {
  type: 'time' | 'location' | 'device' | 'approval' | 'custom';
  operator: 'eq' | 'neq' | 'in' | 'not_in' | 'between';
  value: unknown;
}

/**
 * Granular permissions matrix
 */
export interface PermissionsMatrix {
  roles: string[];
  resources: string[];
  permissions: Record<string, Record<string, PermissionAction[]>>;
}

/**
 * Hybrid edge processing badge
 */
export interface HybridEdgeProcessingBadge {
  enabled: boolean;
  mode: 'cloud_only' | 'edge_preferred' | 'edge_only' | 'hybrid';
  edgeNodes: EdgeNode[];
  dataSovereignty: string[];
  latencyMs: number;
  bandwidthSavedPercent: number;
}

/**
 * Edge node
 */
export interface EdgeNode {
  id: string;
  location: string;
  status: 'active' | 'degraded' | 'offline';
  dataProcessed: number;
  lastSync: string;
}

/**
 * Integrity benchmark
 */
export interface IntegrityBenchmark {
  overallScore: number;
  categories: IntegrityCategory[];
  lastRun: string;
  nextScheduled: string;
  issues: IntegrityIssue[];
  recommendations: string[];
}

/**
 * Integrity category
 */
export interface IntegrityCategory {
  name: string;
  score: number;
  maxScore: number;
  status: 'pass' | 'warning' | 'fail';
  details: string;
}

/**
 * Integrity issue
 */
export interface IntegrityIssue {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  remediation: string;
  deadline?: string;
  assignee?: string;
  resolved: boolean;
}

/**
 * Security dashboard summary
 */
export interface SecurityDashboardSummary {
  overallSecurityScore: number;
  complianceScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeAlerts: number;
  resolvedToday: number;
  mfaAdoption: number;
  encryptionCoverage: number;
  lastPenTest: string;
}
