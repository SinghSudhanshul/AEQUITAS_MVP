// ============================================
// CONSTANTS
// Application-wide Constants
// ============================================

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// Timeouts and Intervals
export const API_TIMEOUT = 30000; // 30 seconds
export const FORECAST_REFRESH_INTERVAL = 60000; // 1 minute
export const REALTIME_UPDATE_INTERVAL = 15000; // 15 seconds
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = ['.csv', '.xlsx'];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// XP and Ranking
export const XP_ACTIONS = {
  LOGIN: 10,
  UPLOAD: 50,
  VIEW_FORECAST: 5,
  DOWNLOAD_REPORT: 25,
  INVITE_USER: 100,
  COMPLETE_ONBOARDING: 500,
  ACCURACY_BONUS_90: 100,
  ACCURACY_BONUS_95: 250,
} as const;

export const RANK_LEVELS = [
  { name: 'Junior Associate', xp: 0, icon: '👤' },
  { name: 'Associate', xp: 1000, icon: '💼' },
  { name: 'Senior Associate', xp: 5000, icon: '⭐' },
  { name: 'Partner', xp: 15000, icon: '🏆' },
  { name: 'Managing Partner', xp: 30000, icon: '👑' },
] as const;

// Wings Configuration
export const WINGS = [
  { id: 'lobby', name: 'The Lobby', icon: '🏛️', path: '/app/lobby', requiredXP: 0 },
  { id: 'bullpen', name: 'The Bullpen', icon: '💼', path: '/app/bullpen', requiredXP: 0 },
  { id: 'library', name: 'The Library', icon: '📚', path: '/app/library', requiredXP: 1000 },
  { id: 'treasury', name: 'The Treasury', icon: '💰', path: '/app/treasury', requiredXP: 2500 },
  { id: 'situation-room', name: 'Situation Room', icon: '🚨', path: '/app/situation-room', requiredXP: 5000 },
  { id: 'war-room', name: 'The War Room', icon: '⚔️', path: '/app/war-room', requiredXP: 10000 },
  { id: 'donnas-desk', name: "Donna's Desk", icon: '👩‍💼', path: '/app/donnas-desk', requiredXP: 15000 },
  { id: 'harveys-office', name: "Harvey's Office", icon: '👔', path: '/app/harveys-office', requiredXP: 25000 },
  { id: 'vault', name: 'The Vault', icon: '🔐', path: '/app/vault', requiredXP: 30000 },
] as const;

// Regime Thresholds
export const REGIME_THRESHOLDS = {
  VIX_ELEVATED: 25,
  VIX_CRISIS: 40,
  CREDIT_SPREAD_ELEVATED: 1.5,
  CREDIT_SPREAD_CRISIS: 3.0,
} as const;

// Color Tokens (matching Tailwind config)
export const COLORS = {
  richBlack: '#050D17',
  darkNavy: '#0A1A2F',
  charcoal: '#1A2332',
  institutionalBlue: '#003366',
  precisionTeal: '#0D9488',
  offWhite: '#F8F9FA',
  muted: '#94A3B8',
  steadyGreen: '#27AE60',
  elevatedAmber: '#F39C12',
  crisisRed: '#C0392B',
  achievementGold: '#D4AF37',
} as const;

// Achievement Badges
export const ACHIEVEMENTS = [
  { id: 'first_upload', name: 'First Upload', icon: '📤', description: 'Upload your first position file' },
  { id: 'week_streak', name: 'Week Streak', icon: '🔥', description: '7 consecutive days of uploads' },
  { id: 'accuracy_star', name: 'Accuracy Star', icon: '⭐', description: 'Achieve 95%+ accuracy' },
  { id: 'crisis_survivor', name: 'Crisis Survivor', icon: '🛡️', description: 'Navigate through a crisis regime' },
  { id: 'partner_material', name: 'Partner Material', icon: '🏆', description: 'Reach Partner rank' },
] as const;
