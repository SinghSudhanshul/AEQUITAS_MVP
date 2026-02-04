// ============================================
// UI STORE
// UI State (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;

  // Theme
  theme: 'dark' | 'light';
  paranoiaMode: boolean;

  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown> | null;

  // Notifications
  notifications: Notification[];

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setParanoiaMode: (enabled: boolean) => void;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'dark',
      paranoiaMode: false,
      activeModal: null,
      modalData: null,
      notifications: [],

      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

      setTheme: (theme) => set({ theme }),

      setParanoiaMode: (enabled) => set({ paranoiaMode: enabled }),

      openModal: (modalId, data) => set({
        activeModal: modalId,
        modalData: data || null
      }),

      closeModal: () => set({
        activeModal: null,
        modalData: null
      }),

      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          { ...notification, id: Date.now().toString() },
        ],
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

export default useUIStore;
