// ============================================
// RANK TYPES
// User Progression & Rank System
// ============================================

/**
 * All available ranks (Harvey Specter themed)
 */
export type RankId =
  | 'junior_associate'
  | 'associate'
  | 'senior_associate'
  | 'junior_partner'
  | 'partner'
  | 'senior_partner'
  | 'managing_partner'
  | 'name_partner';

/**
 * Rank tier classification
 */
export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/**
 * Rank definition
 */
export interface RankDefinition {
  id: RankId;
  name: string;
  tier: RankTier;
  level: number;
  xpRequired: number;

  // Visual
  icon: string;
  color: string;
  badgeUrl?: string;

  // Perks
  perks: RankPerk[];

  // Unlocks
  dashboardSkinUnlocked?: string;
  featuresUnlocked: string[];

  // Narrative
  harveyQuote: string;
  donnaQuote: string;
  description: string;
}

/**
 * Rank perk
 */
export interface RankPerk {
  id: string;
  name: string;
  description: string;
  icon: string;
}

/**
 * User's current rank progress
 */
export interface RankProgress {
  currentRank: RankDefinition;
  nextRank?: RankDefinition;
  xpProgress: number;
  xpRequired: number;
  progressPercentage: number;
  estimatedTimeToNextRank?: string;
}

/**
 * Rank promotion event
 */
export interface RankPromotion {
  userId: string;
  previousRank: RankId;
  newRank: RankId;
  promotedAt: string;
  celebrationSound: string;
  harveyMessage: string;
  donnaMessage: string;
}

/**
 * Rank history entry
 */
export interface RankHistoryEntry {
  rankId: RankId;
  achievedAt: string;
  timeInRank: number; // days
}
