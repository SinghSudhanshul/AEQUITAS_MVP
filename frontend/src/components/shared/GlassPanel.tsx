// ============================================
// GLASS PANEL COMPONENT
// Premium Glassmorphism Container
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================
// VARIANTS
// ============================================

const glassPanelVariants = cva(
  // Base glassmorphism styles
  [
    'rounded-xl',
    'backdrop-blur-md',
    'border',
    'transition-all duration-300',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-glass-white',
          'border-glass-border',
          'shadow-glass',
        ].join(' '),

        light: [
          'bg-white/5',
          'border-white/10',
          'shadow-sm',
        ].join(' '),

        medium: [
          'bg-white/10',
          'border-white/15',
          'shadow-lg',
        ].join(' '),

        heavy: [
          'bg-white/15',
          'border-white/20',
          'shadow-xl',
        ].join(' '),

        frosted: [
          'bg-gradient-to-br from-white/10 to-white/5',
          'border-white/15',
          'shadow-glass',
          'backdrop-blur-xl',
        ].join(' '),

        premium: [
          'bg-gradient-to-br from-white/10 via-white/5 to-transparent',
          'border-achievement-gold/20',
          'shadow-lg shadow-achievement-gold/5',
        ].join(' '),

        surface: [
          'bg-surface',
          'border-glass-border',
          'shadow-md',
        ].join(' '),

        floating: [
          'bg-glass-white',
          'border-glass-border',
          'shadow-2xl',
          'hover:shadow-3xl hover:scale-[1.01]',
        ].join(' '),

        crisis: [
          'bg-black/80',
          'border-crisis-red/30',
          'shadow-lg shadow-crisis-red/10',
        ].join(' '),
      },

      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-3',
        default: 'p-4',
        md: 'p-5',
        lg: 'p-6',
        xl: 'p-8',
      },

      rounded: {
        default: 'rounded-xl',
        none: 'rounded-none',
        sm: 'rounded-lg',
        lg: 'rounded-2xl',
        full: 'rounded-3xl',
      },

      hover: {
        none: '',
        lift: 'hover:translate-y-[-2px] hover:shadow-xl',
        glow: 'hover:shadow-lg hover:shadow-precision-teal/20 hover:border-precision-teal/30',
        scale: 'hover:scale-[1.02]',
        brighten: 'hover:bg-white/15',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      rounded: 'default',
      hover: 'none',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface GlassPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof glassPanelVariants> {
  /** Decorative gradient overlay */
  gradient?: boolean;
  /** Gradient direction */
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
  /** Gradient colors */
  gradientFrom?: string;
  gradientTo?: string;
  /** Border accent color */
  accentBorder?: 'left' | 'right' | 'top' | 'bottom' | 'none';
  accentColor?: string;
  /** Blur intensity */
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Is this an interactive element */
  interactive?: boolean;
  /** Loading state */
  loading?: boolean;
}

// ============================================
// LOADING OVERLAY
// ============================================

const LoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-rich-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

// ============================================
// COMPONENT
// ============================================

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      variant,
      padding,
      rounded,
      hover,
      gradient,
      gradientDirection = 'to-br',
      gradientFrom,
      gradientTo,
      accentBorder = 'none',
      accentColor,
      blur,
      interactive,
      loading,
      children,
      ...props
    },
    ref
  ) => {
    // Blur classes
    const blurClasses: Record<NonNullable<typeof blur>, string> = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
      '2xl': 'backdrop-blur-2xl',
      '3xl': 'backdrop-blur-[40px]',
    };

    // Accent border classes
    const accentBorderClasses: Record<NonNullable<typeof accentBorder>, string> = {
      none: '',
      left: `border-l-4 ${accentColor || 'border-l-precision-teal'}`,
      right: `border-r-4 ${accentColor || 'border-r-precision-teal'}`,
      top: `border-t-4 ${accentColor || 'border-t-precision-teal'}`,
      bottom: `border-b-4 ${accentColor || 'border-b-precision-teal'}`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          glassPanelVariants({ variant, padding, rounded, hover }),
          blur && blurClasses[blur],
          accentBorder !== 'none' && accentBorderClasses[accentBorder],
          interactive && 'cursor-pointer',
          loading && 'relative',
          className
        )}
        style={{
          ...(gradient && {
            background: `linear-gradient(${gradientDirection.replace('to-', 'to ')}, ${gradientFrom || 'rgba(255,255,255,0.1)'}, ${gradientTo || 'transparent'})`,
          }),
        }}
        {...props}
      >
        {loading && <LoadingOverlay />}
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

// ============================================
// GLASS DIVIDER
// ============================================

interface GlassDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const GlassDivider: React.FC<GlassDividerProps> = ({
  orientation = 'horizontal',
  className,
}) => (
  <div
    className={cn(
      'bg-glass-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className
    )}
  />
);

// ============================================
// GLASS OVERLAY
// ============================================

interface GlassOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  onClose?: () => void;
}

const GlassOverlay: React.FC<GlassOverlayProps> = ({
  visible,
  onClose,
  children,
  className,
  ...props
}) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'bg-black/60 backdrop-blur-sm',
        'flex items-center justify-center',
        'animate-in fade-in duration-200',
        className
      )}
      onClick={onClose}
      {...props}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// ============================================
// PRESET PANELS
// ============================================

export const DashboardPanel: React.FC<GlassPanelProps> = (props) => (
  <GlassPanel variant="default" hover="glow" {...props} />
);

export const MetricPanel: React.FC<GlassPanelProps> = (props) => (
  <GlassPanel variant="medium" accentBorder="left" {...props} />
);

export const FloatingPanel: React.FC<GlassPanelProps> = (props) => (
  <GlassPanel variant="frosted" hover="lift" {...props} />
);

export const CrisisPanel: React.FC<GlassPanelProps> = (props) => (
  <GlassPanel variant="crisis" {...props} />
);

// ============================================
// EXPORTS
// ============================================

export {
  GlassPanel,
  GlassDivider,
  GlassOverlay,
  glassPanelVariants,
};

export default GlassPanel;
