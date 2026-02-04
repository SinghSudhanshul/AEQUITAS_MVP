// ============================================
// THEME TYPES
// Design System Configuration
// ============================================

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Dashboard skins (unlockable)
 */
export type DashboardSkin =
  | 'default'
  | 'corner_office'
  | 'rainmaker'
  | 'name_partner'
  | 'crisis_mode';

/**
 * Color scheme
 */
export interface ColorScheme {
  // Base colors
  background: string;
  surface: string;
  surfaceHover: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Accent colors
  primary: string;
  primaryHover: string;
  secondary: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Regime-specific
  steady: string;
  elevated: string;
  crisis: string;

  // Border & glass
  border: string;
  glassWhite: string;
  glassBorder: string;
}

/**
 * Typography scale
 */
export interface TypographyScale {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

/**
 * Spacing scale
 */
export interface SpacingScale {
  px: string;
  0.5: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
}

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
  name: string;
  mode: ThemeMode;
  skin: DashboardSkin;
  colors: ColorScheme;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glass: string;
  };
  animations: {
    fast: string;
    normal: string;
    slow: string;
  };
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: ThemeConfig;
  mode: ThemeMode;
  skin: DashboardSkin;
  setMode: (mode: ThemeMode) => void;
  setSkin: (skin: DashboardSkin) => void;
  toggleMode: () => void;
}
