// ============================================
// AUTH STORE
// User Authentication State Management
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================
// TYPES
// ============================================

import type { User } from '@/types/user';

export interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  subscriptionTier: 'free' | 'premium' | 'enterprise' | null;

  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePreferences: (prefs: Partial<User['preferences']>) => void;
  refreshSession: () => Promise<void>;
  checkAuth: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSession: (user: User | null, accessToken: string, refreshToken: string) => void;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
}

// ============================================
// MOCK USER
// ============================================

const MOCK_USER: User = {
  id: 'user_001',
  email: 'harvey.specter@aequitas.io',
  firstName: 'Harvey',
  lastName: 'Specter',
  displayName: 'Harvey Specter',
  role: 'admin',
  organization: {
    id: 'org_pearson_specter',
    name: 'Pearson Specter',
  },
  xp: 15500,
  rank: 'Partner',
  avatarUrl: '/avatars/harvey_specter.png',
  createdAt: '2024-01-01T00:00:00Z',
  lastLoginAt: new Date().toISOString(),
  preferences: {
    theme: 'dark',
    soundEffects: true,
    reducedMotion: false,
    notifications: {
      email: true,
      push: true,
      forecastAlerts: true,
      regimeChanges: true,
    },
    dashboard: {
      defaultView: 'overview',
      refreshInterval: 30,
    },
  },
};

// ============================================
// STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
      subscriptionTier: null,

      // ====================================
      // AUTH ACTIONS
      // ====================================

      setUser: (user) => {
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        });
      },

      login: async (email, _password) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock successful login
          set((state) => {
            state.user = { ...MOCK_USER, email };
            state.isAuthenticated = true;
            state.isLoading = false;
            state.accessToken = 'mock_access_token';
            state.refreshToken = 'mock_refresh_token';
            state.subscriptionTier = 'premium';
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Login failed';
          });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // TODO: Implement Google OAuth
          await new Promise((resolve) => setTimeout(resolve, 1500));

          set((state) => {
            state.user = MOCK_USER;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.accessToken = 'mock_google_token';
            state.subscriptionTier = 'premium';
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = 'Google login failed';
          });
          throw error;
        }
      },

      loginWithMicrosoft: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // TODO: Implement Microsoft OAuth
          await new Promise((resolve) => setTimeout(resolve, 1500));

          set((state) => {
            state.user = MOCK_USER;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.accessToken = 'mock_microsoft_token';
            state.subscriptionTier = 'enterprise';
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = 'Microsoft login failed';
          });
          throw error;
        }
      },

      logout: () => {
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.accessToken = null;
          state.refreshToken = null;
          state.subscriptionTier = null;
          state.error = null;
        });
      },

      signup: async (data) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock successful signup
          set((state) => {
            state.user = {
              ...MOCK_USER,
              id: `user_${Date.now()}`,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              displayName: `${data.firstName} ${data.lastName}`,
              createdAt: new Date().toISOString(),
            };
            state.isAuthenticated = true;
            state.isLoading = false;
            state.accessToken = 'mock_access_token';
            state.subscriptionTier = 'free';
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Signup failed';
          });
          throw error;
        }
      },

      resetPassword: async (_email) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set((state) => {
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = 'Password reset failed';
          });
          throw error;
        }
      },

      updateProfile: async (data) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => {
            if (state.user) {
              Object.assign(state.user, data);
            }
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = 'Profile update failed';
          });
          throw error;
        }
      },

      updatePreferences: (prefs) => {
        set((state) => {
          if (state.user) {
            Object.assign(state.user.preferences, prefs);
          }
        });
      },

      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => {
            state.accessToken = 'new_mock_access_token';
          });
        } catch (error) {
          // Refresh failed, logout user
          get().logout();
        }
      },

      checkAuth: () => {
        const { accessToken, user } = get();

        if (accessToken && user) {
          set((state) => {
            state.isAuthenticated = true;
          });
        } else {
          set((state) => {
            state.isAuthenticated = false;
          });
        }
      },

      setError: (error) => {
        set((state) => {
          state.error = error;
        });
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      setSession: (user, accessToken, refreshToken) => {
        set((state) => {
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = !!user;
        });
      },
    })),
    {
      name: 'aequitas-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        subscriptionTier: state.subscriptionTier,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================
// SELECTORS
// ============================================

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
export const selectSubscriptionTier = (state: AuthState) => state.subscriptionTier;

// ============================================
// EXPORTS
// ============================================

export default useAuthStore;
