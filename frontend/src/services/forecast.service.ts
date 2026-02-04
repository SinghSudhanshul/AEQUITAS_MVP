// ============================================
// FORECAST SERVICE
// Forecast API Calls
// ============================================

import apiClient from './api/client';
import type { Forecast, ForecastHistory, MarketRegime } from '@/types/forecast';

export const forecastService = {
  // Get current day's forecast
  async getCurrentForecast(): Promise<Forecast> {
    // For demo/development
    if (import.meta.env.DEV) {
      return {
        id: 'FCT-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        predicted: 247500000,
        confidence: 94.2,
        range: { low: 235000000, high: 260000000 },
        regime: 'steady',
        generatedAt: new Date().toISOString(),
        breakdown: [
          { category: 'Settlement Obligations', amount: 125000000, percentage: 50.5 },
          { category: 'Margin Calls', amount: 45000000, percentage: 18.2 },
          { category: 'Trading Activity', amount: 52500000, percentage: 21.2 },
          { category: 'Corporate Actions', amount: 15000000, percentage: 6.1 },
          { category: 'Buffer Reserve', amount: 10000000, percentage: 4.0 },
        ],
      };
    }

    const response = await apiClient.get<Forecast>('/forecast/daily');
    return response.data;
  },

  // Get forecast for specific date
  async getForecastByDate(date: string): Promise<Forecast> {
    if (import.meta.env.DEV) {
      return {
        id: 'FCT-' + Date.now(),
        date,
        predicted: 245000000 + Math.random() * 20000000,
        confidence: 90 + Math.random() * 8,
        range: { low: 230000000, high: 265000000 },
        regime: 'steady',
        generatedAt: new Date().toISOString(),
        breakdown: [],
      };
    }

    const response = await apiClient.get<Forecast>(`/forecast/${date}`);
    return response.data;
  },

  // Get forecast history
  async getHistory(days: number = 30): Promise<ForecastHistory[]> {
    if (import.meta.env.DEV) {
      const history: ForecastHistory[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const predicted = 240000000 + Math.random() * 30000000;
        const actual = predicted * (0.95 + Math.random() * 0.1);
        history.push({
          date: date.toISOString().split('T')[0],
          predicted,
          actual,
          accuracy: 100 - Math.abs((predicted - actual) / actual * 100),
          regime: i < 5 ? 'steady' : i < 10 ? 'elevated' : 'steady',
        });
      }
      return history;
    }

    const response = await apiClient.get<ForecastHistory[]>(`/forecast/history?days=${days}`);
    return response.data;
  },

  // Get real-time forecast (WebSocket alternative)
  async getRealtimeForecast(): Promise<Forecast> {
    const response = await apiClient.get<Forecast>('/forecast/realtime');
    return response.data;
  },

  // Get current market regime
  async getMarketRegime(): Promise<MarketRegime> {
    if (import.meta.env.DEV) {
      return {
        current: 'steady',
        confidence: 92.5,
        indicators: {
          vix: 18.5,
          creditSpread: 0.85,
          repoRate: 5.25,
        },
        lastUpdated: new Date().toISOString(),
      };
    }

    const response = await apiClient.get<MarketRegime>('/market/regime');
    return response.data;
  },

  // Get accuracy metrics
  async getAccuracyMetrics(period: string = '30d'): Promise<{
    accuracy: number;
    mape: number;
    directionAccuracy: number;
    forecastCount: number;
  }> {
    if (import.meta.env.DEV) {
      return {
        accuracy: 94.2,
        mape: 3.8,
        directionAccuracy: 97.1,
        forecastCount: 30,
      };
    }

    const response = await apiClient.get<{
      accuracy: number;
      mape: number;
      directionAccuracy: number;
      forecastCount: number;
    }>(`/analytics/accuracy?period=${period}`);
    return response.data;
  },
};

export default forecastService;
