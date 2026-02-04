// ============================================
// XP (EXPERIENCE POINTS) TYPES
// Gamification Core Mechanics
// ============================================

/**
 * XP event categories
 */
export type XPEventCategory =
  | 'forecast'      // Viewing/generating forecasts
  | 'upload'        // Uploading position data
  | 'analysis'      // Analyzing data
  | 'decision'      // Making trading decisions
  | 'learning'      // Completing tutorials
  | 'social'        // Team collaboration
  | 'achievement'   // Unlocking achievements
  | 'streak'        // Daily login streaks
  | 'crisis';       // Crisis mode actions

/**
 * XP reward event
 */
export interface XPEvent {
  eventId: string;
  userId: string;
  category: XPEventCategory;
  action: string;
  xpAwarded: number;
  multiplier?: number;
  bonusReason?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * XP progress state
 */
export interface XPProgress {
  userId: string;
  currentXP: number;
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  xpPercentage: number;

  // Streak bonuses
  currentStreak: number;
  streakMultiplier: number;

  // Daily/Weekly caps
  todayXP: number;
  todayLimit: number;
  weekXP: number;
  weekLimit: number;

  // Recent events
  recentEvents: XPEvent[];
}

/**
 * XP level thresholds
 */
export interface XPLevelThreshold {
  level: number;
  xpRequired: number;
  rankUnlocked?: string;
  featureUnlocked?: string;
  skinUnlocked?: string;
}

/**
 * XP reward configuration
 */
export interface XPRewardConfig {
  action: string;
  category: XPEventCategory;
  baseXP: number;
  maxDaily?: number;
  cooldownSeconds?: number;
  description: string;
}

/**
 * XP leaderboard entry
 */
export interface XPLeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  totalXP: number;
  level: number;
  isCurrentUser: boolean;
}

/**
 * XP leaderboard
 */
export interface XPLeaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: XPLeaderboardEntry[];
  currentUserRank?: number;
  totalParticipants: number;
}
