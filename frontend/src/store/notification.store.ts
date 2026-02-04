// ============================================
// NOTIFICATION STORE
// Toast & Notification Queue Management
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUOTES } from '@/config/narrative';

// ============================================
// TYPES & INTERFACES
// ============================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPersona = 'harvey' | 'donna' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  persona?: NotificationPersona;
  quote?: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // Auto-dismiss after ms, 0 = never
  sound?: string; // Sound effect to play
}

export interface NotificationPreferences {
  enabled: boolean;
  soundEnabled: boolean;
  harveyEnabled: boolean;
  donnaEnabled: boolean;
  crisisAlertsEnabled: boolean;
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string;
  maxVisible: number;
  defaultDuration: number;
}

interface NotificationState {
  // Current notifications
  notifications: Notification[];
  toasts: Notification[]; // Currently visible toasts

  // Preferences
  preferences: NotificationPreferences;

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
  dismissNotification: (id: string) => void;
  dismissAllToasts: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  clearOld: (olderThanDays: number) => void;

  // Toast management
  showToast: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
  hideToast: (id: string) => void;

  // Preferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;

  // Computed
  getUnreadCount: () => number;
  getRecentNotifications: (count: number) => Notification[];
}

// ============================================
// DEFAULT PREFERENCES
// ============================================

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  soundEnabled: true,
  harveyEnabled: true,
  donnaEnabled: true,
  crisisAlertsEnabled: true,
  maxVisible: 5,
  defaultDuration: 5000,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(): string {
  return `notif_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

function isQuietHours(start?: string, end?: string): boolean {
  if (!start || !end) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  if (startTime < endTime) {
    return currentTime >= startTime && currentTime < endTime;
  } else {
    // Crosses midnight
    return currentTime >= startTime || currentTime < endTime;
  }
}

function getPersonaQuote(
  persona: NotificationPersona | undefined,
  type: NotificationType
): string | undefined {
  if (!persona || persona === 'system') return undefined;

  if (persona === 'harvey') {
    switch (type) {
      case 'success':
        return QUOTES.HARVEY.MILESTONE;
      case 'error':
        return QUOTES.HARVEY.ERROR;
      case 'warning':
        return QUOTES.HARVEY.HIGH_VOLATILITY;
      default:
        return QUOTES.HARVEY.CONFIRMATION;
    }
  }

  if (persona === 'donna') {
    switch (type) {
      case 'success':
        return QUOTES.DONNA.PROACTIVE;
      case 'error':
        return QUOTES.DONNA.COMFORT;
      case 'info':
        return QUOTES.DONNA.MORNING;
      default:
        return QUOTES.DONNA.SCHEDULING;
    }
  }

  return undefined;
}

function playNotificationSound(sound?: string, enabled?: boolean): void {
  if (!enabled || !sound) return;

  try {
    const audio = new Audio(`/sounds/${sound}`);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Audio blocked, ignore
    });
  } catch {
    // Sound not available
  }
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // ============================================
      // INITIAL STATE
      // ============================================

      notifications: [],
      toasts: [],
      preferences: DEFAULT_PREFERENCES,

      // ============================================
      // NOTIFICATION ACTIONS
      // ============================================

      addNotification: (notificationData) => {
        const { preferences, toasts } = get();

        // Check if notifications are enabled
        if (!preferences.enabled) return;

        // Check quiet hours
        if (isQuietHours(preferences.quietHoursStart, preferences.quietHoursEnd)) {
          // Only allow crisis alerts during quiet hours
          if (notificationData.type !== 'error') return;
        }

        // Check persona preferences
        if (notificationData.persona === 'harvey' && !preferences.harveyEnabled) {
          notificationData.persona = 'system';
          notificationData.quote = undefined;
        }
        if (notificationData.persona === 'donna' && !preferences.donnaEnabled) {
          notificationData.persona = 'system';
          notificationData.quote = undefined;
        }

        // Generate notification
        const notification: Notification = {
          id: generateId(),
          timestamp: new Date(),
          read: false,
          dismissed: false,
          duration: notificationData.duration ?? preferences.defaultDuration,
          ...notificationData,
          quote: notificationData.quote ?? getPersonaQuote(notificationData.persona, notificationData.type),
        };

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100), // Keep last 100
        }));

        // Show as toast if not too many visible
        if (toasts.length < preferences.maxVisible) {
          get().showToast(notificationData);
        }

        // Play sound
        if (preferences.soundEnabled) {
          const soundMap: Record<NotificationType, string> = {
            success: 'success_chord.mp3',
            error: 'elevator_chime.mp3',
            warning: 'paper_rustle.mp3',
            info: 'keyboard_click.mp3',
          };
          playNotificationSound(
            notificationData.sound ?? soundMap[notification.type],
            preferences.soundEnabled
          );
        }
      },

      dismissNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, dismissed: true } : n
          ),
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      dismissAllToasts: () => {
        set({ toasts: [] });
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      clearAll: () => {
        set({ notifications: [], toasts: [] });
      },

      clearOld: (olderThanDays) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - olderThanDays);

        set((state) => ({
          notifications: state.notifications.filter(
            (n) => new Date(n.timestamp) > cutoff
          ),
        }));
      },

      // ============================================
      // TOAST ACTIONS
      // ============================================

      showToast: (toastData) => {
        const { preferences } = get();

        const toast: Notification = {
          id: generateId(),
          timestamp: new Date(),
          read: false,
          dismissed: false,
          duration: toastData.duration ?? preferences.defaultDuration,
          ...toastData,
          quote: toastData.quote ?? getPersonaQuote(toastData.persona, toastData.type),
        };

        set((state) => {
          // Limit visible toasts
          const newToasts = [toast, ...state.toasts].slice(0, preferences.maxVisible);
          return { toasts: newToasts };
        });

        // Auto-dismiss after duration
        if (toast.duration && toast.duration > 0) {
          setTimeout(() => {
            get().hideToast(toast.id);
          }, toast.duration);
        }
      },

      hideToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      // ============================================
      // PREFERENCES
      // ============================================

      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }));
      },

      // ============================================
      // COMPUTED VALUES
      // ============================================

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read && !n.dismissed).length;
      },

      getRecentNotifications: (count) => {
        return get()
          .notifications
          .filter((n) => !n.dismissed)
          .slice(0, count);
      },
    }),
    {
      name: 'aequitas-notifications',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50), // Only persist last 50
        preferences: state.preferences,
      }),
    }
  )
);

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export function showSuccessToast(title: string, message: string): void {
  useNotificationStore.getState().showToast({
    type: 'success',
    title,
    message,
    persona: 'donna',
  });
}

export function showErrorToast(title: string, message: string): void {
  useNotificationStore.getState().showToast({
    type: 'error',
    title,
    message,
    persona: 'harvey',
  });
}

export function showWarningToast(title: string, message: string): void {
  useNotificationStore.getState().showToast({
    type: 'warning',
    title,
    message,
  });
}

export function showInfoToast(title: string, message: string): void {
  useNotificationStore.getState().showToast({
    type: 'info',
    title,
    message,
    persona: 'donna',
  });
}

export function showHarveyNotification(
  type: NotificationType,
  title: string,
  message: string
): void {
  useNotificationStore.getState().addNotification({
    type,
    title,
    message,
    persona: 'harvey',
  });
}

export function showDonnaNotification(
  type: NotificationType,
  title: string,
  message: string
): void {
  useNotificationStore.getState().addNotification({
    type,
    title,
    message,
    persona: 'donna',
  });
}

export default useNotificationStore;
