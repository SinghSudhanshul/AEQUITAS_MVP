// ============================================
// TOAST COMPONENT
// Notification Toasts with Persona Integration
// ============================================

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { PERSONAS } from '@/config/narrative';

// ============================================
// TYPES
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'persona';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persona?: 'harvey' | 'donna' | 'louis';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: ToastData[];
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  showPersonaToast: (options: PersonaToastOptions) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

interface PersonaToastOptions {
  persona: 'harvey' | 'donna' | 'louis';
  title: string;
  message?: string;
  duration?: number;
  action?: ToastData['action'];
}

// ============================================
// CONTEXT
// ============================================

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return dummy functions if outside provider
    return {
      toasts: [],
      showToast: () => { },
      showPersonaToast: () => { },
      hideToast: () => { },
      clearToasts: () => { },
    };
  }
  return context;
};

// ============================================
// PROVIDER
// ============================================

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss
    if ((newToast.duration || 0) > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const showPersonaToast = useCallback((options: PersonaToastOptions) => {
    showToast({
      type: 'persona',
      persona: options.persona,
      title: options.title,
      message: options.message,
      duration: options.duration ?? 6000,
      action: options.action,
    });
  }, [showToast]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, showPersonaToast, hideToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
};

// ============================================
// TOAST CONTAINER
// ============================================

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

// ============================================
// TOAST COMPONENT
// ============================================

interface ToastProps {
  toast: ToastData;
  onDismiss: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  };

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'border-spring-green bg-spring-green/10';
      case 'error':
        return 'border-crisis-red bg-crisis-red/10';
      case 'warning':
        return 'border-achievement-gold bg-achievement-gold/10';
      case 'info':
        return 'border-institutional-blue bg-institutional-blue/10';
      case 'persona':
        return 'border-precision-teal bg-precision-teal/10';
      default:
        return 'border-glass-border bg-glass-white';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return null;
    }
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg',
        'transition-all duration-200 ease-out',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
        getTypeStyles(),
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon or Persona Avatar */}
        {toast.type === 'persona' && toast.persona ? (
          <PersonaAvatar persona={toast.persona} size="sm" />
        ) : (
          <span className="text-xl">{getIcon()}</span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-off-white">{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-muted mt-0.5">{toast.message}</p>
          )}

          {/* Action */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-xs font-medium text-precision-teal hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="p-1 text-muted hover:text-off-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ============================================
// PERSONA TOAST - SPECIAL VARIANT
// ============================================

interface PersonaToastProps {
  persona: 'harvey' | 'donna' | 'louis';
  title: string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

export const PersonaToast: React.FC<PersonaToastProps> = ({
  persona,
  title,
  message,
  onDismiss,
  className,
}) => {
  const personaConfig = PERSONAS[persona.toUpperCase() as keyof typeof PERSONAS];

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl border border-precision-teal/30 bg-precision-teal/10',
        'backdrop-blur-md shadow-lg',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <PersonaAvatar persona={persona} size="sm" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-medium text-precision-teal">
              {personaConfig?.name || persona}
            </span>
          </div>
          <p className="font-semibold text-sm text-off-white">{title}</p>
          {message && (
            <p className="text-xs text-muted mt-0.5 italic">"{message}"</p>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-muted hover:text-off-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default Toast;
