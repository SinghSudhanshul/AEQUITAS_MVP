// ============================================
// CRISIS STORE
// Crisis Mode & Market Regime Management
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================
// TYPES
// ============================================

export type MarketRegime = 'calm' | 'volatile' | 'crisis' | 'recovery' | 'unknown';

export interface RegimeHistoryEntry {
  id: string;
  regime: MarketRegime;
  startTime: string;
  endTime?: string;
  trigger?: string;
  confidence: number;
}

export interface CrisisAlert {
  id: string;
  type: 'warning' | 'critical' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface CrisisState {
  // Paranoia Mode
  paranoiaMode: boolean;
  paranoiaModeActivatedAt: string | null;

  // Market Regime
  marketRegime: MarketRegime;
  regimeConfidence: number;
  lastRegimeChange: string | null;
  regimeHistory: RegimeHistoryEntry[];

  // Alerts
  alerts: CrisisAlert[];
  unacknowledgedCount: number;

  // Volatility Metrics
  volatilityIndex: number;
  volatilityChange24h: number;

  // Actions
  toggleParanoiaMode: () => void;
  activateParanoiaMode: (reason?: string) => void;
  deactivateParanoiaMode: () => void;

  setMarketRegime: (regime: MarketRegime, confidence?: number, trigger?: string) => void;
  checkForCrisis: () => void;

  addAlert: (alert: Omit<CrisisAlert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlerts: () => void;

  updateVolatility: (index: number, change24h: number) => void;

  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  paranoiaMode: false,
  paranoiaModeActivatedAt: null as string | null,
  marketRegime: 'calm' as MarketRegime,
  regimeConfidence: 0.85,
  lastRegimeChange: null as string | null,
  regimeHistory: [] as RegimeHistoryEntry[],
  alerts: [] as CrisisAlert[],
  unacknowledgedCount: 0,
  volatilityIndex: 18.5,
  volatilityChange24h: 2.3,
};

// ============================================
// STORE
// ============================================

export const useCrisisStore = create<CrisisState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // ====================================
      // PARANOIA MODE
      // ====================================

      toggleParanoiaMode: () => {
        const { paranoiaMode } = get();
        if (paranoiaMode) {
          get().deactivateParanoiaMode();
        } else {
          get().activateParanoiaMode();
        }
      },

      activateParanoiaMode: (reason) => {
        set((state) => {
          state.paranoiaMode = true;
          state.paranoiaModeActivatedAt = new Date().toISOString();

          // Add alert
          state.alerts.unshift({
            id: `alert_${Date.now()}`,
            type: 'emergency',
            title: 'Paranoia Mode Activated',
            message: reason || 'Crisis mode engaged. Single-column defensive layout active.',
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
          state.unacknowledgedCount += 1;
        });
      },

      deactivateParanoiaMode: () => {
        set((state) => {
          state.paranoiaMode = false;
          state.paranoiaModeActivatedAt = null;
        });
      },

      // ====================================
      // MARKET REGIME
      // ====================================

      setMarketRegime: (regime, confidence = 0.85, trigger) => {
        set((state) => {
          const now = new Date().toISOString();

          // Close previous regime entry
          if (state.regimeHistory.length > 0) {
            const lastEntry = state.regimeHistory[0];
            if (!lastEntry.endTime) {
              lastEntry.endTime = now;
            }
          }

          // Add new regime entry
          state.regimeHistory.unshift({
            id: `regime_${Date.now()}`,
            regime,
            startTime: now,
            trigger,
            confidence,
          });

          // Keep only last 100 entries
          state.regimeHistory = state.regimeHistory.slice(0, 100);

          state.marketRegime = regime;
          state.regimeConfidence = confidence;
          state.lastRegimeChange = now;

          // Auto-activate paranoia mode for crisis
          if (regime === 'crisis' && !state.paranoiaMode) {
            state.paranoiaMode = true;
            state.paranoiaModeActivatedAt = now;

            state.alerts.unshift({
              id: `alert_${Date.now()}`,
              type: 'critical',
              title: 'Crisis Regime Detected',
              message: trigger || 'Market conditions indicate crisis. Defensive protocols recommended.',
              timestamp: now,
              acknowledged: false,
              actions: [
                { label: 'Review Positions', action: 'navigate:/app/wings/bullpen' },
                { label: 'Run Simulation', action: 'navigate:/app/wings/situation-room' },
              ],
            });
            state.unacknowledgedCount += 1;
          }
        });
      },

      checkForCrisis: () => {
        const { volatilityIndex, marketRegime } = get();

        // Simple crisis detection logic
        // In production, this would use real market data
        if (volatilityIndex > 30 && marketRegime !== 'crisis') {
          get().setMarketRegime('crisis', 0.9, 'High volatility detected (VIX > 30)');
        } else if (volatilityIndex > 20 && marketRegime === 'calm') {
          get().setMarketRegime('volatile', 0.85, 'Elevated volatility (VIX > 20)');
        } else if (volatilityIndex < 15 && marketRegime === 'volatile') {
          get().setMarketRegime('calm', 0.8, 'Volatility normalized');
        }
      },

      // ====================================
      // ALERTS
      // ====================================

      addAlert: (alertData) => {
        set((state) => {
          state.alerts.unshift({
            ...alertData,
            id: `alert_${Date.now()}`,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
          state.unacknowledgedCount += 1;
        });
      },

      acknowledgeAlert: (alertId) => {
        set((state) => {
          const alert = state.alerts.find((a) => a.id === alertId);
          if (alert && !alert.acknowledged) {
            alert.acknowledged = true;
            state.unacknowledgedCount = Math.max(0, state.unacknowledgedCount - 1);
          }
        });
      },

      clearAlerts: () => {
        set((state) => {
          state.alerts = [];
          state.unacknowledgedCount = 0;
        });
      },

      // ====================================
      // VOLATILITY
      // ====================================

      updateVolatility: (index, change24h) => {
        set((state) => {
          state.volatilityIndex = index;
          state.volatilityChange24h = change24h;
        });
      },

      // ====================================
      // RESET
      // ====================================

      reset: () => {
        set(initialState);
      },
    })),
    {
      name: 'aequitas-crisis',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        paranoiaMode: state.paranoiaMode,
        marketRegime: state.marketRegime,
        regimeHistory: state.regimeHistory.slice(0, 20),
        alerts: state.alerts.slice(0, 50),
      }),
    }
  )
);

// ============================================
// SELECTORS
// ============================================

export const selectParanoiaMode = (state: CrisisState) => state.paranoiaMode;
export const selectMarketRegime = (state: CrisisState) => state.marketRegime;
export const selectRegimeConfidence = (state: CrisisState) => state.regimeConfidence;
export const selectAlerts = (state: CrisisState) => state.alerts;
export const selectUnacknowledgedCount = (state: CrisisState) => state.unacknowledgedCount;
export const selectVolatilityIndex = (state: CrisisState) => state.volatilityIndex;

// ============================================
// EXPORTS
// ============================================

export default useCrisisStore;
