// ============================================
// FORECAST STORE
// Forecast State (Zustand)
// ============================================

import { create } from 'zustand';
import type { Forecast, ForecastHistory, MarketRegime } from '@/types/forecast';

interface ForecastState {
  currentForecast: Forecast | null;
  history: ForecastHistory[];
  regime: MarketRegime | null;
  isLoading: boolean;
  lastFetched: string | null;

  // Actions
  setCurrentForecast: (forecast: Forecast | null) => void;
  setHistory: (history: ForecastHistory[]) => void;
  setRegime: (regime: MarketRegime | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useForecastStore = create<ForecastState>((set) => ({
  currentForecast: null,
  history: [],
  regime: null,
  isLoading: false,
  lastFetched: null,

  setCurrentForecast: (forecast) => set({
    currentForecast: forecast,
    lastFetched: new Date().toISOString(),
  }),

  setHistory: (history) => set({ history }),

  setRegime: (regime) => set({ regime }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set({
    currentForecast: null,
    history: [],
    regime: null,
    isLoading: false,
    lastFetched: null,
  }),
}));

export default useForecastStore;
