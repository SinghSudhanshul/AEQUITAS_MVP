import { create } from 'zustand';

export type RegimeType = 'steady' | 'elevated' | 'crisis';

interface MarketState {
  regime: RegimeType;
  vix: number;
  creditSpread: number;
  repoRate: number;
  lastUpdated: string;

  // Actions
  setRegime: (regime: RegimeType) => void;
  updateMarketData: (data: Partial<MarketState>) => void;
  simulateCrisis: () => void;
  resetToSteady: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  regime: 'steady',
  vix: 18.5,
  creditSpread: 120,
  repoRate: 5.33,
  lastUpdated: new Date().toISOString(),

  setRegime: (regime) => set({ regime }),

  updateMarketData: (data) => set((state) => ({
    ...state,
    ...data,
    lastUpdated: new Date().toISOString()
  })),

  simulateCrisis: () => set({
    regime: 'crisis',
    vix: 45.2,
    creditSpread: 350,
    repoRate: 8.5,
    lastUpdated: new Date().toISOString(),
  }),

  resetToSteady: () => set({
    regime: 'steady',
    vix: 18.5,
    creditSpread: 120,
    repoRate: 5.33,
    lastUpdated: new Date().toISOString(),
  }),
}));
