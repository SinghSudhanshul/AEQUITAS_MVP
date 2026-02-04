// ============================================
// ANALYTICS SERVICE
// Analytics & Reporting API Calls
// ============================================

import apiClient from './api/client';

interface AccuracyMetrics {
  period: string;
  accuracy: number;
  mape: number;
  directionAccuracy: number;
  forecastCount: number;
}

interface RegimeStats {
  regime: 'steady' | 'elevated' | 'crisis';
  accuracy: number;
  mape: number;
  forecastCount: number;
  avgConfidence: number;
  daysInRegime: number;
}

interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  dataType: 'forecasts' | 'accuracy' | 'positions' | 'all';
  dateRange: '7d' | '30d' | '90d' | 'ytd' | 'all';
}

export const analyticsService = {
  // Get accuracy metrics for different periods
  async getAccuracyMetrics(): Promise<AccuracyMetrics[]> {
    if (import.meta.env.DEV) {
      return [
        { period: 'This Week', accuracy: 94.2, mape: 3.8, directionAccuracy: 97.1, forecastCount: 5 },
        { period: 'Last Week', accuracy: 93.8, mape: 4.1, directionAccuracy: 96.5, forecastCount: 5 },
        { period: 'This Month', accuracy: 93.5, mape: 4.3, directionAccuracy: 96.2, forecastCount: 22 },
        { period: 'Last Month', accuracy: 92.1, mape: 5.2, directionAccuracy: 95.8, forecastCount: 20 },
        { period: 'YTD', accuracy: 93.2, mape: 4.5, directionAccuracy: 96.0, forecastCount: 22 },
        { period: 'All Time', accuracy: 91.8, mape: 5.5, directionAccuracy: 94.5, forecastCount: 365 },
      ];
    }

    const response = await apiClient.get<AccuracyMetrics[]>('/analytics/accuracy');
    return response.data;
  },

  // Get accuracy breakdown by regime
  async getRegimeBreakdown(): Promise<RegimeStats[]> {
    if (import.meta.env.DEV) {
      return [
        { regime: 'steady', accuracy: 95.2, mape: 3.1, forecastCount: 280, avgConfidence: 94.5, daysInRegime: 280 },
        { regime: 'elevated', accuracy: 89.8, mape: 6.2, forecastCount: 65, avgConfidence: 82.3, daysInRegime: 65 },
        { regime: 'crisis', accuracy: 84.5, mape: 9.8, forecastCount: 20, avgConfidence: 71.2, daysInRegime: 20 },
      ];
    }

    const response = await apiClient.get<RegimeStats[]>('/analytics/regime-breakdown');
    return response.data;
  },

  // Get accuracy trend over time
  async getAccuracyTrend(period: string = '30d'): Promise<{
    date: string;
    accuracy: number;
    mape: number;
  }[]> {
    if (import.meta.env.DEV) {
      const trend = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trend.push({
          date: date.toISOString().split('T')[0],
          accuracy: 90 + Math.random() * 8,
          mape: 3 + Math.random() * 4,
        });
      }
      return trend;
    }

    const response = await apiClient.get<{
      date: string;
      accuracy: number;
      mape: number;
    }[]>(`/analytics/trend?period=${period}`);
    return response.data;
  },

  // Export data
  async exportData(options: ExportOptions): Promise<Blob> {
    if (import.meta.env.DEV) {
      // Return mock blob for development
      const mockData = JSON.stringify({ message: 'Export mock data' });
      return new Blob([mockData], { type: 'application/json' });
    }

    // ApiClient doesn't support responseType explicitly in get generic, but we can hack it or use fetch directly
    // Ideally use apiClient.getBlob if it existed.
    // Assuming backend returns blob url? No it returns blob.
    // Let's use fetch for blobs as apiClient wrapper might expect JSON.
    // Or if apiClient handles it. 
    // Let's use fetch for now for safety on blobs.
    const token = localStorage.getItem('auth_token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const response = await fetch(`${baseUrl}/analytics/export?${new URLSearchParams(options as any)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.blob();
  },

  // Generate report
  async generateReport(type: 'weekly' | 'monthly' | 'custom', options?: {
    startDate?: string;
    endDate?: string;
    format?: 'pdf' | 'xlsx';
  }): Promise<Blob> {
    const token = localStorage.getItem('auth_token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const response = await fetch(`${baseUrl}/analytics/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ type, ...options })
    });
    return response.blob();
  },

  // Get dashboard summary
  async getDashboardSummary(): Promise<{
    todaysForecast: number;
    accuracy7d: number;
    regime: 'steady' | 'elevated' | 'crisis';
    uploadsToday: number;
    lastUploadAt: string;
  }> {
    if (import.meta.env.DEV) {
      return {
        todaysForecast: 247500000,
        accuracy7d: 94.2,
        regime: 'steady',
        uploadsToday: 1,
        lastUploadAt: new Date().toISOString(),
      };
    }

    const response = await apiClient.get<{
      todaysForecast: number;
      accuracy7d: number;
      regime: 'steady' | 'elevated' | 'crisis';
      uploadsToday: number;
      lastUploadAt: string;
    }>('/analytics/dashboard');
    return response.data;
  },
};

export default analyticsService;
