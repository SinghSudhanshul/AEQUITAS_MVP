// ============================================
// GAMIFICATION STORE
// XP, Ranks, Achievements, Prestige
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  //   RANKS,
  getRankByXP,
} from '@/config/gamification';

// ============================================
// TYPES
// ============================================

export interface XPEvent {
  id: string;
  type: string;
  amount: number;
  reason?: string;
  timestamp: string;
}

export interface GamificationState {
  // XP & Rank
  xp: number;
  rank: string;

  // Level (1-100 within current rank)
  level: number;

  // Achievements
  achievements: string[];
  achievementProgress: Record<string, number>;

  // Prestige
  prestigeLevel: number;
  prestigePoints: number;

  // Streaks
  loginStreak: number;
  lastLoginDate: string | null;

  // Dashboard skins
  unlockedSkins: string[];
  currentSkin: string;

  // History
  xpHistory: XPEvent[];

  // Actions
  addXP: (amount: number, type: string, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  checkAchievements: () => void;
  resetProgress: () => void; // Prestige reset
  setSkin: (skinId: string) => void;
  checkLoginStreak: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

export const INITIAL_STATE: Omit<GamificationState, 'addXP' | 'unlockAchievement' | 'updateAchievementProgress' | 'checkAchievements' | 'resetProgress' | 'setSkin' | 'checkLoginStreak'> = {
  xp: 0,
  rank: 'junior_associate',
  level: 1,
  achievements: [],
  achievementProgress: {},
  prestigeLevel: 0,
  prestigePoints: 0,
  loginStreak: 1,
  lastLoginDate: new Date().toISOString(),
  unlockedSkins: ['default'],
  currentSkin: 'default',
  xpHistory: [],
};

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useGamificationStore = create<GamificationState>()(
  persist(
    immer((set, get) => ({
      ...INITIAL_STATE,

      // ============================================
      // ACTIONS
      // ============================================

      addXP: (amount, type, reason) => {
        set((state) => {
          // Apply prestige multiplier (10% per level)
          const multiplier = 1 + (state.prestigeLevel * 0.1);
          const adjustedAmount = Math.floor(amount * multiplier);

          state.xp += adjustedAmount;

          // Add to history
          state.xpHistory.unshift({
            id: crypto.randomUUID(),
            type,
            amount: adjustedAmount,
            reason,
            timestamp: new Date().toISOString(),
          });

          // Limit history
          if (state.xpHistory.length > 50) {
            state.xpHistory.pop();
          }

          // Check Rank
          const newRank = getRankByXP(state.xp);
          if (newRank && newRank.id !== state.rank) {
            state.rank = newRank.id;
            // Rank up celebration logic would go here or be triggered by effects
          }
        });

        get().checkAchievements();
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          if (!state.achievements.includes(achievementId)) {
            state.achievements.push(achievementId);
            // Award XP for achievement? (optional)
          }
        });
      },

      updateAchievementProgress: (achievementId, progress) => {
        set((state) => {
          state.achievementProgress[achievementId] = progress;
        });
        get().checkAchievements();
      },

      checkAchievements: () => {
        // Logic to check all achievements against current state
        // This would be complex in a real app, simplified here
        const state = get();

        // Example: Check login streak
        if (state.loginStreak >= 7 && !state.achievements.includes('streak_week')) {
          get().unlockAchievement('streak_week');
        }

        // Example: Check XP milestones
        if (state.xp >= 10000 && !state.achievements.includes('xp_10k')) {
          get().unlockAchievement('xp_10k');
        }
      },

      resetProgress: () => {
        set((state) => {
          // Prestige Reset
          state.prestigeLevel += 1;
          state.prestigePoints += 1; // Currency for prestige shop

          // Reset progress but keep skins and prestige stats
          state.xp = 0;
          state.rank = 'junior_associate';
          state.level = 1;
          state.achievements = [];
          state.achievementProgress = {};
          // Keep streaks? Maybe
        });
      },

      setSkin: (skinId) => {
        set((state) => {
          if (state.unlockedSkins.includes(skinId)) {
            state.currentSkin = skinId;
          }
        });
      },

      checkLoginStreak: () => {
        const now = new Date();
        const lastLogin = get().lastLoginDate ? new Date(get().lastLoginDate!) : null;

        if (lastLogin) {
          const diffDays = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

          set((state) => {
            if (diffDays === 1) {
              state.loginStreak += 1;
            } else if (diffDays > 1) {
              state.loginStreak = 1;
            }
            state.lastLoginDate = now.toISOString();
          });
        }
      },
    })),
    {
      name: 'aequitas-gamification',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        xp: state.xp,
        rank: state.rank,
        level: state.level,
        achievements: state.achievements,
        achievementProgress: state.achievementProgress,
        prestigeLevel: state.prestigeLevel,
        prestigePoints: state.prestigePoints,
        loginStreak: state.loginStreak,
        lastLoginDate: state.lastLoginDate,
        unlockedSkins: state.unlockedSkins,
        currentSkin: state.currentSkin,
        xpHistory: state.xpHistory,
      }),
    }
  )
);
