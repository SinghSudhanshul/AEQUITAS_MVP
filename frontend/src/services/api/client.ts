// ============================================
// AEQUITAS LV-COP API CLIENT
// Native Fetch Implementation (No External Deps)
// ============================================

import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notification.store';
import { QUOTES } from '@/config/narrative';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  meta: ApiMeta;
}

export interface ApiMeta {
  requestId: string;
  timestamp: string;
  duration: number;
  version: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  metadata?: { startTime: number };
}

// ============================================
// DEFAULT CONFIG
// ============================================

const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// ============================================
// API CLIENT CLASS
// ============================================

class ApiClient {
  private config: ApiClientConfig;
  private refreshPromise: Promise<string> | null = null;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const startTime = performance.now();
    const requestId = this.generateRequestId();

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('X-Request-ID', requestId);

    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      let response = await this.fetchWithTimeout(url, fetchOptions);

      // Handle 401 Unauthorized (Token Refresh)
      if (response.status === 401 && !url.includes('/auth/refresh')) {
        try {
          const newToken = await this.handleTokenRefresh();
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await this.fetchWithTimeout(url, { ...fetchOptions, headers });
        } catch (error) {
          return this.handleError(error as Error, 401);
        }
      }

      // Handle Rate Limiting (429) - Simple retry logic omitted for brevity in fetch version unless needed
      if (response.status === 429) {
        // handle rate limit
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        data: data as T,
        success: true,
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
          duration: performance.now() - startTime,
          version: response.headers.get('x-api-version') || '1.0',
        },
      };

    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  private async fetchWithTimeout(url: string, options: RequestOptions): Promise<Response> {
    const { timeout = this.config.timeout } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  // ============================================
  // ERROR HANDLERS
  // ============================================

  private async handleTokenRefresh(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshTokenRequest();
    try {
      const token = await this.refreshPromise;
      this.refreshPromise = null;
      return token;
    } catch (e) {
      this.refreshPromise = null;
      throw e;
    }
  }

  private async refreshTokenRequest(): Promise<string> {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) throw new Error('No refresh token');

    const response = await fetch(`${this.config.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      useAuthStore.getState().logout();
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    const { access_token, refresh_token } = data;
    const user = useAuthStore.getState().user;

    if (user) {
      useAuthStore.getState().setSession(user, access_token, refresh_token);
    }
    return access_token;
  }

  private handleError(error: Error, status: number = 0): Promise<never> {
    const message = error.message;

    let title = 'Error';
    let persona: 'harvey' | 'donna' = 'harvey';
    let quote = QUOTES.HARVEY.ERROR;

    if (status === 403) {
      title = 'Access Denied';
      quote = QUOTES.HARVEY.ERROR;
    } else if (status === 404) {
      title = 'Not Found';
      persona = 'donna';
      quote = QUOTES.DONNA.PROACTIVE;
    }

    useNotificationStore.getState().addNotification({
      type: 'error',
      title,
      message,
      persona,
      quote,
    });

    // Normalize error
    return Promise.reject({
      code: `HTTP_${status}`,
      message,
      details: { status }
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  private generateRequestId(): string {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // delay method removed as it was unused

  // ============================================
  // PUBLIC API METHODS
  // ============================================

  async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  async upload<T>(
    url: string,
    formData: FormData,
    _onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    // Note: Fetch doesn't support upload progress natively like XHR/Axios
    // We'll just perform a basic fetch for now.
    const fullUrl = `${this.config.baseURL}${url}`;
    const accessToken = useAuthStore.getState().accessToken;

    const headers = new Headers();
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    // Do NOT set Content-Type for FormData, let browser set it with boundary

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return {
        data: data as T,
        success: true,
        meta: {
          requestId: this.generateRequestId(),
          timestamp: new Date().toISOString(),
          duration: 0,
          version: '1.0'
        }
      };
    } catch (e) {
      return this.handleError(e as Error);
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
