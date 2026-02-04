// ============================================
// GLASSMORPHISM TYPES
// Glass Effect Configuration
// ============================================

/**
 * Glass intensity levels
 */
export type GlassIntensity = 'subtle' | 'light' | 'medium' | 'heavy' | 'ultra';

/**
 * Glass blur amounts (px)
 */
export const GLASS_BLUR: Record<GlassIntensity, number> = {
  subtle: 4,
  light: 8,
  medium: 12,
  heavy: 16,
  ultra: 24,
};

/**
 * Glass background opacity
 */
export const GLASS_OPACITY: Record<GlassIntensity, number> = {
  subtle: 0.05,
  light: 0.1,
  medium: 0.15,
  heavy: 0.2,
  ultra: 0.3,
};

/**
 * Glass effect configuration
 */
export interface GlassEffect {
  intensity: GlassIntensity;
  blur: number;
  opacity: number;
  borderWidth: number;
  borderOpacity: number;
  saturation: number;
}

/**
 * Glass card props
 */
export interface GlassCardProps {
  intensity?: GlassIntensity;
  gradient?: boolean;
  glow?: boolean;
  glowColor?: string;
  hoverEffect?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Glass panel configuration
 */
export interface GlassPanelConfig {
  background: string;
  blur: string;
  border: string;
  shadow: string;
}

/**
 * Generate glass effect CSS
 */
export interface GlassStyleOutput {
  background: string;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  border: string;
  boxShadow?: string;
}

/**
 * Preset glass configurations
 */
export interface GlassPresets {
  card: GlassEffect;
  modal: GlassEffect;
  sidebar: GlassEffect;
  navbar: GlassEffect;
  tooltip: GlassEffect;
  dropdown: GlassEffect;
}

/**
 * Glass gradient options
 */
export interface GlassGradient {
  direction: 'to-b' | 'to-r' | 'to-br' | 'to-bl';
  fromColor: string;
  fromOpacity: number;
  toColor: string;
  toOpacity: number;
}

/**
 * Animated glass effect
 */
export interface AnimatedGlassEffect extends GlassEffect {
  shimmer: boolean;
  shimmerDuration: number;
  pulseOnHover: boolean;
}
