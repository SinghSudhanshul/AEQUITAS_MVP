// ============================================
// BUTTON COMPONENT
// Power Suit Design System
// ============================================

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// VARIANTS
// ============================================

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-lg',
    'text-sm font-semibold tracking-wide',
    'ring-offset-background',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    // Active state scale
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-institutional-blue text-off-white',
          'hover:bg-institutional-blue/90',
          'shadow-md hover:shadow-lg',
          'border border-institutional-blue/50',
        ].join(' '),

        destructive: [
          'bg-crisis-red text-white',
          'hover:bg-crisis-red/90',
          'shadow-md hover:shadow-lg',
          'border border-crisis-red/50',
        ].join(' '),

        outline: [
          'border-2 border-glass-border',
          'bg-transparent text-off-white',
          'hover:bg-glass-white hover:border-precision-teal/50',
        ].join(' '),

        secondary: [
          'bg-surface text-off-white',
          'hover:bg-surface/80',
          'border border-glass-border',
        ].join(' '),

        ghost: [
          'text-muted',
          'hover:bg-glass-white hover:text-off-white',
        ].join(' '),

        link: [
          'text-precision-teal underline-offset-4',
          'hover:underline',
        ].join(' '),

        glass: [
          'bg-glass-white backdrop-blur-md',
          'text-off-white',
          'border border-glass-border',
          'hover:bg-white/15 hover:border-precision-teal/30',
          'shadow-glass',
        ].join(' '),

        premium: [
          'bg-gradient-to-r from-achievement-gold to-achievement-gold/80',
          'text-rich-black font-bold',
          'hover:from-achievement-gold/90 hover:to-achievement-gold/70',
          'shadow-lg hover:shadow-xl',
          'border border-achievement-gold/50',
        ].join(' '),

        crisis: [
          'bg-crisis-red text-white',
          'animate-pulse',
          'hover:animate-none hover:bg-crisis-red/80',
          'border-2 border-white/30',
          'shadow-lg shadow-crisis-red/30',
        ].join(' '),

        harvey: [
          'bg-institutional-blue text-off-white',
          'hover:bg-rich-black',
          'border-2 border-achievement-gold/50',
          'shadow-md hover:shadow-lg hover:shadow-achievement-gold/20',
        ].join(' '),

        donna: [
          'bg-precision-teal/20 text-precision-teal',
          'hover:bg-precision-teal hover:text-rich-black',
          'border border-precision-teal/50',
        ].join(' '),
        closeDeal: [
          'bg-gradient-to-r from-institutional-blue to-rich-black',
          'text-off-white font-bold tracking-wider uppercase',
          'border-2 border-achievement-gold',
          'shadow-lg shadow-achievement-gold/20',
          'hover:shadow-achievement-gold/40 hover:scale-[1.02]',
        ].join(' '),
      },

      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        xl: 'h-14 px-8 py-4 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },

      rounded: {
        default: 'rounded-lg',
        full: 'rounded-full',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  soundEnabled?: boolean;
}

// ============================================
// LOADING SPINNER
// ============================================

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('animate-spin h-4 w-4', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// ============================================
// COMPONENT
// ============================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      soundEnabled = true,
      disabled,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { playSound } = useSoundEffects();

    const isDisabled = disabled || loading;

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (soundEnabled && !isDisabled) {
          playSound('click');
        }
        onClick?.(e);
      },
      [onClick, playSound, soundEnabled, isDisabled]
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

// ============================================
// EXPORTS
// ============================================

export { Button, buttonVariants };
export default Button;
