// ============================================
// DOCUMENT TITLE HOOK
// Dynamic Page Title Management
// ============================================

import { useEffect, useRef } from 'react';

// ============================================
// TYPES
// ============================================

export interface UseDocumentTitleOptions {
  /** Reset title to original when component unmounts */
  restoreOnUnmount?: boolean;
  /** Append to base title instead of replacing */
  append?: boolean;
  /** Include notification count in title */
  includeNotificationCount?: boolean;
}

// ============================================
// CONFIGURATION
// ============================================

const BASE_TITLE = 'Aequitas LV-COP';
const SEPARATOR = ' | ';
const CRISIS_PREFIX = '⚠️ ';

// ============================================
// HOOK IMPLEMENTATION
// ============================================

/**
 * useDocumentTitle
 * 
 * Manages the document.title with support for:
 * - Dynamic updates
 * - Crisis mode prefix
 * - Notification counts
 * - Cleanup on unmount
 * 
 * @param title - The title to set
 * @param options - Configuration options
 * 
 * @example
 * ```tsx
 * // Simple usage
 * useDocumentTitle('Dashboard');
 * // Result: "Dashboard | Aequitas LV-COP"
 * 
 * // With notification count
 * useDocumentTitle('Dashboard', { includeNotificationCount: true });
 * // Result: "(3) Dashboard | Aequitas LV-COP"
 * 
 * // No restore on unmount
 * useDocumentTitle('Settings', { restoreOnUnmount: false });
 * ```
 */
export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {}
): void {
  const {
    restoreOnUnmount = true,
    append = true,
    includeNotificationCount = false,
  } = options;

  const originalTitle = useRef<string>(document.title);
  const previousTitle = useRef<string>(title);

  useEffect(() => {
    // Store original title on first mount
    if (originalTitle.current === BASE_TITLE) {
      originalTitle.current = document.title;
    }

    // Build the new title
    let newTitle = title;

    if (append && title !== BASE_TITLE) {
      newTitle = `${title}${SEPARATOR}${BASE_TITLE}`;
    }

    // Add notification count if enabled
    if (includeNotificationCount) {
      // We don't import the store directly to avoid circular deps
      // Instead, we read from sessionStorage or a global
      const countStr = sessionStorage.getItem('unread-notification-count');
      const count = countStr ? parseInt(countStr, 10) : 0;

      if (count > 0) {
        newTitle = `(${count}) ${newTitle}`;
      }
    }

    // Check for crisis mode
    const isCrisisMode = document.body.classList.contains('crisis-mode') ||
      sessionStorage.getItem('paranoia-mode') === 'true';

    if (isCrisisMode) {
      newTitle = `${CRISIS_PREFIX}${newTitle}`;
    }

    // Set the title
    document.title = newTitle;
    previousTitle.current = title;

    // Cleanup
    return () => {
      if (restoreOnUnmount) {
        document.title = originalTitle.current;
      }
    };
  }, [title, append, includeNotificationCount, restoreOnUnmount]);
}

// ============================================
// ADDITIONAL HOOKS
// ============================================

/**
 * useNotificationTitle
 * 
 * Updates the document title to show unread notification count
 * 
 * @param count - Number of unread notifications
 */
export function useNotificationTitle(count: number): void {
  useEffect(() => {
    sessionStorage.setItem('unread-notification-count', String(count));

    // Trigger title update
    const currentTitle = document.title;
    const cleanTitle = currentTitle.replace(/^\(\d+\)\s*/, '');

    if (count > 0) {
      document.title = `(${count}) ${cleanTitle}`;
    } else {
      document.title = cleanTitle;
    }
  }, [count]);
}

/**
 * useCrisisTitle
 * 
 * Adds crisis indicator to document title during paranoia mode
 * 
 * @param isActive - Whether crisis mode is active
 */
export function useCrisisTitle(isActive: boolean): void {
  useEffect(() => {
    sessionStorage.setItem('paranoia-mode', String(isActive));

    const currentTitle = document.title;
    const cleanTitle = currentTitle.replace(new RegExp(`^${CRISIS_PREFIX}`), '');

    if (isActive) {
      document.title = `${CRISIS_PREFIX}${cleanTitle}`;
    } else {
      document.title = cleanTitle;
    }
  }, [isActive]);
}

/**
 * usePageTracking
 * 
 * Tracks page views for analytics when title changes
 * 
 * @param pageName - Name of the page for analytics
 */
export function usePageTracking(pageName: string): void {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }

    // Also dispatch custom event for internal analytics
    window.dispatchEvent(
      new CustomEvent('analytics:page_view', {
        detail: {
          pageName,
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
        },
      })
    );
  }, [pageName]);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Sets the document title directly (for non-React contexts)
 */
export function setDocumentTitle(title: string, includeBase = true): void {
  document.title = includeBase ? `${title}${SEPARATOR}${BASE_TITLE}` : title;
}

/**
 * Gets the base title
 */
export function getBaseTitle(): string {
  return BASE_TITLE;
}

/**
 * Flashes the document title (for notifications)
 */
export function flashDocumentTitle(
  message: string,
  originalTitle: string,
  intervalMs = 1000,
  durationMs = 5000
): () => void {
  let isOriginal = true;
  let elapsed = 0;

  const interval = setInterval(() => {
    document.title = isOriginal ? message : originalTitle;
    isOriginal = !isOriginal;
    elapsed += intervalMs;

    if (elapsed >= durationMs) {
      clearInterval(interval);
      document.title = originalTitle;
    }
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
    document.title = originalTitle;
  };
}

// ============================================
// TYPE DECLARATIONS
// ============================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default useDocumentTitle;
