// ============================================
// MAIN ENTRY POINT
// React 18 with Strict Mode
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Styles
import './index.css';
import './App.css';

// ============================================
// ERROR BOUNDARY
// ============================================

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Application Error:', error, errorInfo);

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Send to Sentry, LogRocket, etc.
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface border border-glass-border rounded-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-crisis-red/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-crisis-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-off-white mb-2">
              Something went wrong
            </h1>

            {/* Message */}
            <p className="text-muted text-sm mb-6">
              An unexpected error occurred. Our team has been notified.
            </p>

            {/* Error Details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-rich-black rounded-lg text-left">
                <p className="text-xs text-crisis-red font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-precision-teal/20 text-precision-teal rounded-lg font-medium text-sm hover:bg-precision-teal/30 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-glass-white text-off-white rounded-lg font-medium text-sm hover:bg-glass-white/80 transition-colors"
              >
                Go Home
              </button>
            </div>

            {/* Harvey Quote */}
            <p className="text-xs text-muted italic mt-6">
              "When you get knocked down, you get back up." — Harvey Specter
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

function reportWebVitals() {
  if (import.meta.env.PROD) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}

// ============================================
// MOUNT APPLICATION
// ============================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is a <div id="root"></div> in your index.html'
  );
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Report web vitals
reportWebVitals();

// ============================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

// ============================================
// HOT MODULE REPLACEMENT (Development)
// ============================================

if (import.meta.hot) {
  import.meta.hot.accept();
}
