// ============================================
// DESIGN TOKENS
// The Authority & Precision System
// ============================================

export const COLORS = {
  // Foundation
  richBlack: '#191111', // Deep charcoal, not pure black
  darkNavy: '#0A1A2F',  // Secondary depth layer
  surface: '#1E1E2E',   // Cards, inputs

  // Typography
  offWhite: '#E5E5E5',  // Primary text
  muted: '#94A3B8',     // Secondary text (60% opacity)

  // Accents
  institutionalBlue: '#003366', // Authority, primary actions
  precisionTeal: '#0D9488',     // Success, P95 band
  achievementGold: '#D4AF37',   // XP, badges, ranks

  // Status
  crisisRed: '#C0392B',   // P5 band, alerts, crisis
  elevatedAmber: '#F39C12', // Warning, elevated regime
  steadyGreen: '#27AE60',   // Steady regime
};

export const TYPOGRAPHY = {
  fontFamily: {
    interface: 'Inter, system-ui, sans-serif',
    data: 'Consolas, Monaco, monospace',
    heading: 'Inter, system-ui, sans-serif',
  },
  weights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  sizes: {
    xs: '12px', // Caption
    sm: '14px', // Body
    md: '16px', // h4
    lg: '20px', // h3
    xl: '24px', // h2
    xxl: '32px', // h1
  },
  lineHeight: {
    body: 1.5,
    heading: 1.2,
  },
};

export const GLASSMORPHISM = {
  panel: {
    background: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  // 7% opacity white, 12px blur
  drawer: {
    background: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(12px)',
  }
};

export const SPACING = {
  xs: '4px',   // micro-gaps
  sm: '8px',   // tight spacing
  md: '12px',  // standard padding
  lg: '16px',  // section spacing
  xl: '24px',  // major separation
  xxl: '32px', // viewport edges
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
};

export const Z_INDEX = {
  base: 0,
  panel: 10,
  header: 50,
  drawer: 100,
  modal: 200,
  toast: 300,
  tooltip: 400,
};
