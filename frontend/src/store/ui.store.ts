// ============================================
// ZUSTAND STORES
// ============================================

// UI Store
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  paranoiaMode: boolean;
  currentWing: string;
  theme: 'default' | 'crisis' | 'premium';
  soundEnabled: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setParanoiaMode: (enabled: boolean) => void;
  setCurrentWing: (wingId: string) => void;
  setTheme: (theme: 'default' | 'crisis' | 'premium') => void;
  toggleSound: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  paranoiaMode: false,
  currentWing: 'lobby',
  theme: 'default',
  soundEnabled: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setParanoiaMode: (enabled) => set({ paranoiaMode: enabled, theme: enabled ? 'crisis' : 'default' }),
  setCurrentWing: (wingId) => set({ currentWing: wingId }),
  setTheme: (theme) => set({ theme }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
