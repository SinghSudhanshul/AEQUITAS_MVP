// ============================================
// CARD COMPONENT
// Power Suit Design System
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================
// CARD VARIANTS
// ============================================

const cardVariants = cva(
  // Base styles
  [
    'rounded-xl',
    'transition-all duration-300 ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-surface',
          'border border-glass-border',
          'shadow-md',
        ].join(' '),

        glass: [
          'bg-glass-white backdrop-blur-md',
          'border border-glass-border',
          'shadow-glass',
        ].join(' '),

        glow: [
          'bg-glass-white/90 backdrop-blur-xl',
          'border-2 border-precision-teal/50',
          'shadow-lg shadow-precision-teal/20',
        ].join(' '),

        elevated: [
          'bg-surface',
          'border border-glass-border',
          'shadow-lg hover:shadow-xl',
        ].join(' '),

        outline: [
          'bg-transparent',
          'border-2 border-glass-border',
        ].join(' '),

        premium: [
          'bg-gradient-to-br from-surface to-rich-black',
          'border border-achievement-gold/30',
          'shadow-lg shadow-achievement-gold/10',
        ].join(' '),

        crisis: [
          'bg-rich-black',
          'border-2 border-crisis-red/50',
          'shadow-lg shadow-crisis-red/20',
        ].join(' '),

        interactive: [
          'bg-surface',
          'border border-glass-border',
          'shadow-md hover:shadow-lg',
          'hover:border-precision-teal/30',
          'cursor-pointer',
          'active:scale-[0.99]',
        ].join(' '),

        metric: [
          'bg-glass-white backdrop-blur-md',
          'border border-glass-border',
          'shadow-md',
          // Subtle left border accent
          'border-l-4 border-l-precision-teal',
        ].join(' '),
      },

      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

// ============================================
// CARD
// ============================================

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  hoverable?: boolean;
  focusable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hoverable, focusable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding }),
        hoverable && 'hover:border-precision-teal/30 hover:shadow-lg',
        focusable && 'focus:outline-none focus:ring-2 focus:ring-precision-teal focus:ring-offset-2 focus:ring-offset-rich-black',
        className
      )}
      tabIndex={focusable ? 0 : undefined}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// ============================================
// CARD HEADER
// ============================================

const cardHeaderVariants = cva(
  'flex flex-col space-y-1.5',
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
      border: {
        none: '',
        bottom: 'border-b border-glass-border',
      },
    },
    defaultVariants: {
      padding: 'default',
      border: 'none',
    },
  }
);

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardHeaderVariants> { }

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding, border, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ padding, border }), className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

// ============================================
// CARD TITLE
// ============================================

const cardTitleVariants = cva(
  'font-semibold leading-none tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-base',
        default: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
      },
      color: {
        default: 'text-off-white',
        muted: 'text-muted',
        accent: 'text-precision-teal',
        gold: 'text-achievement-gold',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
    },
  }
);

export interface CardTitleProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
  VariantProps<typeof cardTitleVariants> {
  asChild?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, color, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(cardTitleVariants({ size, color }), className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

// ============================================
// CARD DESCRIPTION
// ============================================

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> { }

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// ============================================
// CARD CONTENT
// ============================================

const cardContentVariants = cva('', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-3 pt-0',
      default: 'p-4 pt-0',
      lg: 'p-6 pt-0',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
});

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardContentVariants> { }

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ padding }), className)}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

// ============================================
// CARD FOOTER
// ============================================

const cardFooterVariants = cva(
  'flex items-center',
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-3 pt-0',
        default: 'p-4 pt-0',
        lg: 'p-6 pt-0',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
      },
      border: {
        none: '',
        top: 'border-t border-glass-border pt-4 mt-4',
      },
    },
    defaultVariants: {
      padding: 'default',
      justify: 'start',
      border: 'none',
    },
  }
);

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardFooterVariants> { }

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding, justify, border, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ padding, justify, border }), className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

// ============================================
// CARD BADGE (for status indicators)
// ============================================

const cardBadgeVariants = cva(
  'absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-glass-white text-off-white',
        success: 'bg-precision-teal/20 text-precision-teal',
        warning: 'bg-achievement-gold/20 text-achievement-gold',
        error: 'bg-crisis-red/20 text-crisis-red',
        info: 'bg-institutional-blue/20 text-institutional-blue',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof cardBadgeVariants> { }

const CardBadge = React.forwardRef<HTMLSpanElement, CardBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(cardBadgeVariants({ variant }), className)}
      {...props}
    />
  )
);
CardBadge.displayName = 'CardBadge';

// ============================================
// EXPORTS
// ============================================

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardBadge,
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardContentVariants,
  cardFooterVariants,
  cardBadgeVariants,
};

export default Card;
