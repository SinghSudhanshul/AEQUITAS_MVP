// ============================================
// AUTH HOOK
// Authentication State Management
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  password: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token && !user) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem('auth_token');
        }
      }
    };
    checkAuth();
  }, [setUser, user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials.email, credentials.password);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      navigate('/app');
      return true;
    } catch (err) {
      setError((err as Error).message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUser]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      navigate('/app');
      return true;
    } catch (err) {
      setError((err as Error).message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    storeLogout();
    navigate('/');
  }, [navigate, storeLogout]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      return true;
    } catch (err) {
      setError((err as Error).message || 'Password reset failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    clearError: () => setError(null),
  };
};

export default useAuth;
