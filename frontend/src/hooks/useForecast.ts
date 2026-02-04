// ============================================
// FORECAST HOOK
// Forecast Data Fetching & Management
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useForecastStore } from '@/store/forecastStore';
import { forecastService } from '@/services/forecast.service';
// import type { Forecast, ForecastHistory } from '@/types/forecast';

interface UseForecastOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in ms
}

export const useForecast = (options: UseForecastOptions = {}) => {
  const { autoRefresh = false, refreshInterval = 60000 } = options;

  const {
    currentForecast,
    history,
    regime,
    setCurrentForecast,
    setHistory,
    setRegime,
  } = useForecastStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current forecast
  const fetchCurrentForecast = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const forecast = await forecastService.getCurrentForecast();
      setCurrentForecast(forecast);
      return forecast;
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch forecast');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentForecast]);

  // Fetch forecast history
  const fetchHistory = useCallback(async (days: number = 30) => {
    setIsLoading(true);
    setError(null);
    try {
      const historyData = await forecastService.getHistory(days);
      setHistory(historyData);
      return historyData;
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch history');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setHistory]);

  // Fetch market regime
  const fetchRegime = useCallback(async () => {
    try {
      const regimeData = await forecastService.getMarketRegime();
      setRegime(regimeData);
      return regimeData;
    } catch (err) {
      console.error('Failed to fetch regime:', err);
      return null;
    }
  }, [setRegime]);

  // Get forecast by date
  const getForecastByDate = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const forecast = await forecastService.getForecastByDate(date);
      return forecast;
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch forecast');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    fetchCurrentForecast();
    fetchRegime();

    const interval = setInterval(() => {
      fetchCurrentForecast();
      fetchRegime();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchCurrentForecast, fetchRegime]);

  return {
    currentForecast,
    history,
    regime,
    isLoading,
    error,
    fetchCurrentForecast,
    fetchHistory,
    fetchRegime,
    getForecastByDate,
    refresh: fetchCurrentForecast,
  };
};

export default useForecast;
