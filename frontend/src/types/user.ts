// ============================================
// USER TYPE DEFINITIONS
// ============================================

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization: Organization;
  xp: number;
  rank: string;
  avatarUrl?: string;
  phone?: string;
  department?: string;
  displayName: string;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export type UserRole =
  | 'junior'      // Junior Associate (0-999 XP)
  | 'associate'   // Associate (1000-4999 XP)
  | 'senior'      // Senior Associate (5000-14999 XP)
  | 'partner'     // Partner (15000-29999 XP)
  | 'managing'    // Managing Partner (30000+ XP)
  | 'admin';      // System Administrator

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  soundEffects: boolean;
  reducedMotion: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    forecastAlerts: boolean;
    regimeChanges: boolean;
  };
  dashboard: {
    defaultView: string;
    refreshInterval: number;
  };
}

export const RANK_THRESHOLDS = {
  'Junior Associate': 0,
  'Associate': 1000,
  'Senior Associate': 5000,
  'Partner': 15000,
  'Managing Partner': 30000,
} as const;

export const getRankFromXP = (xp: number): string => {
  const ranks = Object.entries(RANK_THRESHOLDS).reverse();
  for (const [rank, threshold] of ranks) {
    if (xp >= threshold) return rank;
  }
  return 'Junior Associate';
};

export const getXPToNextRank = (xp: number): { nextRank: string; xpNeeded: number } | null => {
  const thresholds = Object.entries(RANK_THRESHOLDS);
  for (const [rank, threshold] of thresholds) {
    if (xp < threshold) {
      return { nextRank: rank, xpNeeded: threshold - xp };
    }
  }
  return null; // Already at max rank
};
