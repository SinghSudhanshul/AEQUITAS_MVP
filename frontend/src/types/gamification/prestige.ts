// ============================================
// PRESTIGE TYPES
// End-Game Progression System
// ============================================

/**
 * Prestige levels (after reaching Name Partner)
 */
export type PrestigeLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Prestige tier names
 */
export const PRESTIGE_NAMES: Record<PrestigeLevel, string> = {
  0: 'Rising Star',
  1: 'Wall Street Legend',
  2: 'Market Oracle',
  3: 'Crisis Master',
  4: 'Institutional Titan',
  5: 'Supreme Closer',
};

/**
 * Prestige state
 */
export interface PrestigeState {
  userId: string;
  prestigeLevel: PrestigeLevel;
  prestigeName: string;

  // Progress to next prestige
  currentCycleXP: number;
  xpRequiredForPrestige: number;
  canPrestige: boolean;

  // Prestige bonuses
  xpMultiplier: number;
  unlocks: PrestigeUnlock[];

  // History
  prestigeHistory: PrestigeHistoryEntry[];
}

/**
 * Prestige unlock
 */
export interface PrestigeUnlock {
  id: string;
  name: string;
  description: string;
  type: 'skin' | 'feature' | 'title' | 'badge' | 'effect';
  prestigeRequired: PrestigeLevel;
  unlocked: boolean;
}

/**
 * Prestige history entry
 */
export interface PrestigeHistoryEntry {
  level: PrestigeLevel;
  achievedAt: string;
  totalXpAtPrestige: number;
  timeToAchieve: number; // days from previous
}

/**
 * Prestige ceremony (when user prestiges)
 */
export interface PrestigeCeremony {
  userId: string;
  newPrestigeLevel: PrestigeLevel;
  prestigeName: string;

  // Rewards
  newUnlocks: PrestigeUnlock[];
  newXpMultiplier: number;

  // Celebration
  harveyMessage: string;
  donnaMessage: string;
  celebrationEffect: string;
  soundEffect: string;
}

/**
 * Prestige leaderboard entry
 */
export interface PrestigeLeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  prestigeLevel: PrestigeLevel;
  totalPrestigeXP: number;
  achievementsCount: number;
  isCurrentUser: boolean;
}

/**
 * Prestige requirements
 */
export interface PrestigeRequirements {
  targetLevel: PrestigeLevel;
  xpRequired: number;
  achievementsRequired: string[];
  rankRequired: string;
  timePlayedDays: number;
  specialConditions?: string[];
}
