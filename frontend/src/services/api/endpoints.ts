// ============================================
// AEQUITAS LV-COP API ENDPOINTS
// Centralized Endpoint Definitions
// ============================================

/**
 * All API endpoints are defined here for easy maintenance and type safety.
 * Use these constants instead of hardcoding URLs in services.
 */

// ============================================
// BASE CONFIGURATION
// ============================================

export const API_VERSION = 'v1';
export const API_BASE = `/api/${API_VERSION}`;

// ============================================
// ENDPOINT BUILDERS
// ============================================

type EndpointBuilder<T extends string[]> = (...args: { [K in keyof T]: string }) => string;

function createEndpoint(path: string): string {
  return `${API_BASE}${path}`;
}

function createDynamicEndpoint<T extends string[]>(
  template: string
): EndpointBuilder<T> {
  return (...args: string[]) => {
    let result = `${API_BASE}${template}`;
    args.forEach((arg, index) => {
      result = result.replace(`$${index + 1}`, arg);
    });
    return result;
  };
}

// ============================================
// AUTH ENDPOINTS
// ============================================

export const AUTH = {
  LOGIN: createEndpoint('/auth/login'),
  LOGOUT: createEndpoint('/auth/logout'),
  REGISTER: createEndpoint('/auth/register'),
  REFRESH: createEndpoint('/auth/refresh'),
  FORGOT_PASSWORD: createEndpoint('/auth/forgot-password'),
  RESET_PASSWORD: createEndpoint('/auth/reset-password'),
  VERIFY_EMAIL: createEndpoint('/auth/verify-email'),
  RESEND_VERIFICATION: createEndpoint('/auth/resend-verification'),

  // Auth0 integration
  AUTH0_CALLBACK: createEndpoint('/auth/auth0/callback'),
  AUTH0_LINK: createEndpoint('/auth/auth0/link'),

  // Biometric
  BIOMETRIC_REGISTER: createEndpoint('/auth/biometric/register'),
  BIOMETRIC_VERIFY: createEndpoint('/auth/biometric/verify'),

  // Session management
  SESSIONS: createEndpoint('/auth/sessions'),
  SESSION_BY_ID: createDynamicEndpoint<[string]>('/auth/sessions/$1'),
  REVOKE_ALL_SESSIONS: createEndpoint('/auth/sessions/revoke-all'),
} as const;

// ============================================
// USER ENDPOINTS
// ============================================

export const USERS = {
  ME: createEndpoint('/users/me'),
  UPDATE_PROFILE: createEndpoint('/users/me/profile'),
  UPDATE_PASSWORD: createEndpoint('/users/me/password'),
  UPDATE_PREFERENCES: createEndpoint('/users/me/preferences'),
  UPDATE_AVATAR: createEndpoint('/users/me/avatar'),
  DELETE_ACCOUNT: createEndpoint('/users/me'),

  // Gamification
  XP: createEndpoint('/users/me/xp'),
  ACHIEVEMENTS: createEndpoint('/users/me/achievements'),
  RANK: createEndpoint('/users/me/rank'),
  LEADERBOARD: createEndpoint('/users/leaderboard'),

  // By ID (admin)
  BY_ID: createDynamicEndpoint<[string]>('/users/$1'),
  LIST: createEndpoint('/users'),
} as const;

// ============================================
// ORGANIZATION ENDPOINTS
// ============================================

export const ORGANIZATIONS = {
  CURRENT: createEndpoint('/organizations/current'),
  UPDATE: createEndpoint('/organizations/current'),
  MEMBERS: createEndpoint('/organizations/current/members'),
  MEMBER_BY_ID: createDynamicEndpoint<[string]>('/organizations/current/members/$1'),
  INVITE: createEndpoint('/organizations/current/invite'),
  ACCEPT_INVITE: createEndpoint('/organizations/accept-invite'),
  SETTINGS: createEndpoint('/organizations/current/settings'),
  BILLING: createEndpoint('/organizations/current/billing'),

  // Admin
  LIST: createEndpoint('/organizations'),
  BY_ID: createDynamicEndpoint<[string]>('/organizations/$1'),
} as const;

// ============================================
// FORECAST ENDPOINTS
// ============================================

export const FORECASTS = {
  // Daily forecasts
  DAILY: createEndpoint('/forecasts/daily'),
  DAILY_BY_DATE: createDynamicEndpoint<[string]>('/forecasts/daily/$1'),
  DAILY_RANGE: createEndpoint('/forecasts/daily/range'),

  // Real-time (premium)
  REALTIME: createEndpoint('/forecasts/realtime'),
  REALTIME_LATEST: createEndpoint('/forecasts/realtime/latest'),

  // History
  HISTORY: createEndpoint('/forecasts/history'),

  // Accuracy
  ACCURACY: createEndpoint('/forecasts/accuracy'),
  ACCURACY_BY_REGIME: createEndpoint('/forecasts/accuracy/by-regime'),
  ACCURACY_TREND: createEndpoint('/forecasts/accuracy/trend'),

  // Expert overrides
  OVERRIDE: createEndpoint('/forecasts/override'),
  OVERRIDE_HISTORY: createEndpoint('/forecasts/override/history'),
} as const;

// ============================================
// POSITION ENDPOINTS
// ============================================

export const POSITIONS = {
  LIST: createEndpoint('/positions'),
  CURRENT: createEndpoint('/positions/current'),
  UPLOAD: createEndpoint('/positions/upload'),
  UPLOAD_HISTORY: createEndpoint('/positions/upload/history'),
  BY_ID: createDynamicEndpoint<[string]>('/positions/$1'),
  BY_BROKER: createDynamicEndpoint<[string]>('/positions/broker/$1'),
  SUMMARY: createEndpoint('/positions/summary'),
  VALIDATE: createEndpoint('/positions/validate'),
} as const;

// ============================================
// TRANSACTION ENDPOINTS
// ============================================

export const TRANSACTIONS = {
  LIST: createEndpoint('/transactions'),
  BY_ID: createDynamicEndpoint<[string]>('/transactions/$1'),
  UPLOAD: createEndpoint('/transactions/upload'),
  RECENT: createEndpoint('/transactions/recent'),
  BY_DATE: createDynamicEndpoint<[string]>('/transactions/date/$1'),
  SUMMARY: createEndpoint('/transactions/summary'),
} as const;

// ============================================
// MARKET DATA ENDPOINTS
// ============================================

export const MARKET = {
  REGIME: createEndpoint('/market/regime'),
  REGIME_HISTORY: createEndpoint('/market/regime/history'),
  INDICATORS: createEndpoint('/market/indicators'),
  VIX: createEndpoint('/market/vix'),
  CREDIT_SPREADS: createEndpoint('/market/credit-spreads'),
  REPO_RATES: createEndpoint('/market/repo-rates'),
  WEATHER: createEndpoint('/market/weather'),
} as const;

// ============================================
// BROKER INTEGRATION ENDPOINTS
// ============================================

export const BROKERS = {
  LIST: createEndpoint('/brokers'),
  CONNECT: createEndpoint('/brokers/connect'),
  DISCONNECT: createDynamicEndpoint<[string]>('/brokers/$1/disconnect'),
  STATUS: createDynamicEndpoint<[string]>('/brokers/$1/status'),
  SYNC: createDynamicEndpoint<[string]>('/brokers/$1/sync'),
  SYNC_ALL: createEndpoint('/brokers/sync-all'),

  // Specific brokers
  GOLDMAN_SACHS: {
    CONNECT: createEndpoint('/brokers/goldman-sachs/connect'),
    POSITIONS: createEndpoint('/brokers/goldman-sachs/positions'),
  },
  MORGAN_STANLEY: {
    CONNECT: createEndpoint('/brokers/morgan-stanley/connect'),
    POSITIONS: createEndpoint('/brokers/morgan-stanley/positions'),
  },
  JP_MORGAN: {
    CONNECT: createEndpoint('/brokers/jp-morgan/connect'),
    POSITIONS: createEndpoint('/brokers/jp-morgan/positions'),
  },
} as const;

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

export const ANALYTICS = {
  DASHBOARD: createEndpoint('/analytics/dashboard'),
  ACCURACY: createEndpoint('/analytics/accuracy'),
  USAGE: createEndpoint('/analytics/usage'),
  PERFORMANCE: createEndpoint('/analytics/performance'),
  CHURN_RISK: createEndpoint('/analytics/churn-risk'),

  // Reports
  REPORTS: createEndpoint('/analytics/reports'),
  REPORT_BY_ID: createDynamicEndpoint<[string]>('/analytics/reports/$1'),
  GENERATE_REPORT: createEndpoint('/analytics/reports/generate'),

  // Export
  EXPORT: createEndpoint('/analytics/export'),
} as const;

// ============================================
// CRISIS / SITUATION ROOM ENDPOINTS
// ============================================

export const CRISIS = {
  STATUS: createEndpoint('/crisis/status'),
  SCENARIOS: createEndpoint('/crisis/scenarios'),
  SCENARIO_BY_ID: createDynamicEndpoint<[string]>('/crisis/scenarios/$1'),
  SIMULATE: createEndpoint('/crisis/simulate'),
  SIMULATION_RESULTS: createDynamicEndpoint<[string]>('/crisis/simulate/$1/results'),

  // Monte Carlo
  MONTE_CARLO: createEndpoint('/crisis/monte-carlo'),
  MONTE_CARLO_RESULTS: createDynamicEndpoint<[string]>('/crisis/monte-carlo/$1'),

  // Paranoia mode
  PARANOIA_TRIGGER: createEndpoint('/crisis/paranoia/trigger'),
  PARANOIA_STATUS: createEndpoint('/crisis/paranoia/status'),
  PARANOIA_DISMISS: createEndpoint('/crisis/paranoia/dismiss'),
} as const;

// ============================================
// AI AGENT ENDPOINTS
// ============================================

export const AGENTS = {
  // Harvey
  HARVEY: {
    CHAT: createEndpoint('/agents/harvey/chat'),
    STRATEGY: createEndpoint('/agents/harvey/strategy'),
    EXECUTE: createEndpoint('/agents/harvey/execute'),
    HISTORY: createEndpoint('/agents/harvey/history'),
  },

  // Donna
  DONNA: {
    CHAT: createEndpoint('/agents/donna/chat'),
    NUDGE: createEndpoint('/agents/donna/nudge'),
    SCHEDULE: createEndpoint('/agents/donna/schedule'),
    BRIEFING: createEndpoint('/agents/donna/briefing'),
    COORDINATE: createEndpoint('/agents/donna/coordinate'),
  },

  // General
  PREFERENCES: createEndpoint('/agents/preferences'),
  INTERACTION_HISTORY: createEndpoint('/agents/interactions'),
} as const;

// ============================================
// AUDIT & COMPLIANCE ENDPOINTS
// ============================================

export const AUDIT = {
  LOGS: createEndpoint('/audit/logs'),
  LOG_BY_ID: createDynamicEndpoint<[string]>('/audit/logs/$1'),
  SEARCH: createEndpoint('/audit/logs/search'),
  EXPORT: createEndpoint('/audit/logs/export'),

  // Compliance
  COMPLIANCE_STATUS: createEndpoint('/audit/compliance/status'),
  COMPLIANCE_CHECKS: createEndpoint('/audit/compliance/checks'),

  // Security
  SECURITY_EVENTS: createEndpoint('/audit/security/events'),
  SECURITY_SUMMARY: createEndpoint('/audit/security/summary'),
} as const;

// ============================================
// BILLING ENDPOINTS
// ============================================

export const BILLING = {
  SUBSCRIPTION: createEndpoint('/billing/subscription'),
  UPGRADE: createEndpoint('/billing/upgrade'),
  DOWNGRADE: createEndpoint('/billing/downgrade'),
  CANCEL: createEndpoint('/billing/cancel'),
  INVOICES: createEndpoint('/billing/invoices'),
  INVOICE_BY_ID: createDynamicEndpoint<[string]>('/billing/invoices/$1'),
  PAYMENT_METHODS: createEndpoint('/billing/payment-methods'),
  ADD_PAYMENT_METHOD: createEndpoint('/billing/payment-methods'),
  REMOVE_PAYMENT_METHOD: createDynamicEndpoint<[string]>('/billing/payment-methods/$1'),
  USAGE: createEndpoint('/billing/usage'),

  // Stripe
  STRIPE_CHECKOUT: createEndpoint('/billing/stripe/checkout'),
  STRIPE_PORTAL: createEndpoint('/billing/stripe/portal'),
} as const;

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================

export const NOTIFICATIONS = {
  LIST: createEndpoint('/notifications'),
  BY_ID: createDynamicEndpoint<[string]>('/notifications/$1'),
  MARK_READ: createDynamicEndpoint<[string]>('/notifications/$1/read'),
  MARK_ALL_READ: createEndpoint('/notifications/read-all'),
  PREFERENCES: createEndpoint('/notifications/preferences'),
  UNSUBSCRIBE: createEndpoint('/notifications/unsubscribe'),
} as const;

// ============================================
// WEBSOCKET ENDPOINTS
// ============================================

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export const WEBSOCKET = {
  FORECASTS: `${WS_BASE}/forecasts`,
  MARKET: `${WS_BASE}/market`,
  NOTIFICATIONS: `${WS_BASE}/notifications`,
  CRISIS: `${WS_BASE}/crisis`,
  AGENTS: `${WS_BASE}/agents`,
} as const;

// ============================================
// FILE UPLOAD ENDPOINTS
// ============================================

export const UPLOADS = {
  POSITION_CSV: createEndpoint('/upload/positions'),
  TRANSACTION_CSV: createEndpoint('/upload/transactions'),
  DOCUMENT: createEndpoint('/upload/document'),
  AVATAR: createEndpoint('/upload/avatar'),

  // Presigned URLs for large files
  PRESIGNED_URL: createEndpoint('/upload/presigned-url'),
  CONFIRM_UPLOAD: createEndpoint('/upload/confirm'),
} as const;

// ============================================
// HEALTH & SYSTEM ENDPOINTS
// ============================================

export const SYSTEM = {
  HEALTH: createEndpoint('/health'),
  READY: createEndpoint('/health/ready'),
  LIVE: createEndpoint('/health/live'),
  VERSION: createEndpoint('/version'),
  METRICS: createEndpoint('/metrics'),
  STATUS: createEndpoint('/status'),
} as const;

// ============================================
// ADMIN ENDPOINTS
// ============================================

export const ADMIN = {
  USERS: createEndpoint('/admin/users'),
  USER_BY_ID: createDynamicEndpoint<[string]>('/admin/users/$1'),
  ORGANIZATIONS: createEndpoint('/admin/organizations'),
  ORGANIZATION_BY_ID: createDynamicEndpoint<[string]>('/admin/organizations/$1'),
  SYSTEM_HEALTH: createEndpoint('/admin/system/health'),
  SYSTEM_CONFIG: createEndpoint('/admin/system/config'),
  FEATURE_FLAGS: createEndpoint('/admin/feature-flags'),
  AUDIT_LOGS: createEndpoint('/admin/audit'),
  IMPERSONATE: createDynamicEndpoint<[string]>('/admin/impersonate/$1'),
} as const;

// ============================================
// EXPORT ALL ENDPOINTS
// ============================================

export const ENDPOINTS = {
  AUTH,
  USERS,
  ORGANIZATIONS,
  FORECASTS,
  POSITIONS,
  TRANSACTIONS,
  MARKET,
  BROKERS,
  ANALYTICS,
  CRISIS,
  AGENTS,
  AUDIT,
  BILLING,
  NOTIFICATIONS,
  WEBSOCKET,
  UPLOADS,
  SYSTEM,
  ADMIN,
} as const;

export default ENDPOINTS;
