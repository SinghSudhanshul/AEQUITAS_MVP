// ============================================
// ACHIEVEMENT TYPES
// Badges & Accomplishments
// ============================================

/**
 * Achievement categories
 */
export type AchievementCategory =
  | 'onboarding'     // Getting started
  | 'forecasting'    // Forecast-related
  | 'accuracy'       // Accuracy milestones
  | 'crisis'         // Crisis management
  | 'trading'        // Trading decisions
  | 'social'         // Collaboration
  | 'mastery'        // Expert-level feats
  | 'special';       // Limited-time & rare

/**
 * Achievement rarity
 */
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;

  // Visual
  icon: string;
  badgeUrl: string;
  color: string;

  // Requirements
  requirement: AchievementRequirement;

  // Rewards
  xpReward: number;
  titleUnlocked?: string;
  skinUnlocked?: string;

  // Narrative
  harveyQuote: string;
  secretHint?: string;

  // Metadata
  hidden: boolean;
  repeatable: boolean;
  maxCompletions?: number;
}

/**
 * Achievement requirement
 */
export interface AchievementRequirement {
  type: 'count' | 'streak' | 'threshold' | 'event' | 'combination';
  metric: string;
  target: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  conditions?: string[];
}

/**
 * User achievement progress
 */
export interface AchievementProgress {
  achievementId: string;
  userId: string;
  currentProgress: number;
  targetProgress: number;
  progressPercentage: number;
  unlocked: boolean;
  unlockedAt?: string;
  completionCount: number;
}

/**
 * Achievement unlock event
 */
export interface AchievementUnlock {
  achievementId: string;
  achievement: Achievement;
  userId: string;
  unlockedAt: string;
  xpAwarded: number;
  isFirstTime: boolean;
  celebrationConfig: {
    sound: string;
    animation: string;
    duration: number;
  };
}

/**
 * Achievement showcase (featured achievements)
 */
export interface AchievementShowcase {
  userId: string;
  featured: Achievement[];
  totalUnlocked: number;
  totalAvailable: number;
  completionPercentage: number;
  rarest: Achievement;
}

/**
 * Named achievements (The Closer, The Fixer, etc.)
 */
export const NAMED_ACHIEVEMENTS = {
  THE_CLOSER: 'the_closer',           // Complete 100 accurate forecasts
  THE_FIXER: 'the_fixer',             // Recover from 5 crisis events
  THE_GENIUS: 'the_genius',           // Achieve 95%+ accuracy for a month
  THE_RAINMAKER: 'the_rainmaker',     // Generate $10M+ in value
  THE_SURVIVOR: 'the_survivor',       // Maintain position during crisis
  THE_VISIONARY: 'the_visionary',     // Predict 3 regime changes
  THE_DIPLOMAT: 'the_diplomat',       // Collaborate with 10 team members
  THE_PERFECTIONIST: 'the_perfectionist', // 30-day accuracy streak
} as const;

export type NamedAchievementId = typeof NAMED_ACHIEVEMENTS[keyof typeof NAMED_ACHIEVEMENTS];
