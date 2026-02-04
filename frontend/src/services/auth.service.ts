// ============================================
// AUTH SERVICE
// Authentication API Calls
// ============================================

import apiClient from './api/client';
import type { User } from '@/types/user';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  password: string;
}

export const authService = {
  // Login with email and password
  async login(email: string, password: string): Promise<LoginResponse> {
    // For demo/development, return mock data
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 1000));
      return {
        token: 'demo_token_' + Date.now(),
        user: {
          id: '1',
          email,
          firstName: 'Harvey',
          lastName: 'Specter',
          role: 'managing',
          organization: { id: '1', name: 'Pearson Hardman Capital' },
          xp: 25750,
          rank: 'Managing Partner',
          createdAt: new Date().toISOString(),
          displayName: 'Harvey Specter',
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
        },
      };
    }

    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  // Register new user
  async register(data: RegisterData): Promise<LoginResponse> {
    // For demo/development
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        token: 'demo_token_' + Date.now(),
        user: {
          id: '1',
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'junior',
          organization: { id: '1', name: data.organization },
          xp: 0,
          rank: 'Junior Associate',
          createdAt: new Date().toISOString(),
          displayName: `${data.firstName} ${data.lastName}`,
          preferences: {
            theme: 'light',
            soundEffects: true,
            reducedMotion: false,
            notifications: {
              email: true,
              push: true,
              forecastAlerts: false,
              regimeChanges: false,
            },
            dashboard: {
              defaultView: 'overview',
              refreshInterval: 60,
            },
          },
        },
      };
    }

    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    // For demo/development
    if (import.meta.env.DEV) {
      return {
        id: '1',
        email: 'harvey.specter@pearsonhardman.com',
        firstName: 'Harvey',
        lastName: 'Specter',
        role: 'managing',
        organization: { id: '1', name: 'Pearson Hardman Capital' },
        xp: 25750,
        rank: 'Managing Partner',
        createdAt: new Date().toISOString(),
        displayName: 'Harvey Specter',
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
    }

    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  // Logout (invalidate token on server)
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    }
  },

  // Request password reset
  async resetPassword(email: string): Promise<void> {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 1000));
      return;
    }

    await apiClient.post('/auth/reset-password', { email });
  },

  // Confirm password reset with token
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password/confirm', { token, newPassword });
  },

  // Refresh access token
  async refreshToken(): Promise<string> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    return response.data.token;
  },
};

export default authService;
