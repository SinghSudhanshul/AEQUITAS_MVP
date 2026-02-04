// ============================================
// BADGE COMPONENT
// Power Suit Design System
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================
// VARIANTS
// ============================================

const badgeVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'rounded-full',
    'font-semibold',
    'transition-all duration-200',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-glass-white text-off-white border border-glass-border',
        primary: 'bg-institutional-blue text-off-white',
        secondary: 'bg-surface text-muted border border-glass-border',
        success: 'bg-precision-teal/20 text-precision-teal border border-precision-teal/30',
        warning: 'bg-achievement-gold/20 text-achievement-gold border border-achievement-gold/30',
        error: 'bg-crisis-red/20 text-crisis-red border border-crisis-red/30',
        info: 'bg-institutional-blue/20 text-institutional-blue border border-institutional-blue/30',
        premium: 'bg-gradient-to-r from-achievement-gold to-achievement-gold/80 text-rich-black',
        outline: 'bg-transparent border-2 border-glass-border text-off-white',
        glass: 'bg-glass-white backdrop-blur-md text-off-white border border-glass-border',

        // Rank badges
        'rank-junior': 'bg-silver/20 text-silver border border-silver/30',
        'rank-senior': 'bg-achievement-gold/20 text-achievement-gold border border-achievement-gold/30',
        'rank-partner': 'bg-platinum/20 text-platinum border border-platinum/30',
        'rank-managing': 'bg-gradient-to-r from-achievement-gold to-platinum text-rich-black',

        // Status badges
        'status-active': 'bg-precision-teal/20 text-precision-teal animate-pulse',
        'status-inactive': 'bg-muted/20 text-muted',
        'status-pending': 'bg-achievement-gold/20 text-achievement-gold',
        'status-crisis': 'bg-crisis-red text-white animate-pulse',
      },

      size: {
        sm: 'text-[10px] px-1.5 py-0.5 h-4',
        default: 'text-xs px-2 py-0.5 h-5',
        lg: 'text-sm px-3 py-1 h-6',
        xl: 'text-base px-4 py-1.5 h-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: 'green' | 'yellow' | 'red' | 'blue';
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

// ============================================
// DOT COMPONENT
// ============================================

interface DotProps {
  color: 'green' | 'yellow' | 'red' | 'blue';
  pulse?: boolean;
}

const Dot: React.FC<DotProps> = ({ color, pulse }) => {
  const colorClasses = {
    green: 'bg-precision-teal',
    yellow: 'bg-achievement-gold',
    red: 'bg-crisis-red',
    blue: 'bg-institutional-blue',
  };

  return (
    <span
      className={cn(
        'w-1.5 h-1.5 rounded-full',
        colorClasses[color],
        pulse && 'animate-pulse'
      )}
    />
  );
};

// ============================================
// COMPONENT
// ============================================

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dot,
      dotColor = 'green',
      icon,
      removable,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          'gap-1',
          className
        )}
        {...props}
      >
        {dot && <Dot color={dotColor} pulse={variant?.toString().includes('active')} />}
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 shrink-0 rounded-full p-0.5 hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-off-white"
          >
            <svg
              className="h-2.5 w-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================
// BADGE GROUP
// ============================================

interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  children: React.ReactNode;
}

const BadgeGroup: React.FC<BadgeGroupProps> = ({
  max = 3,
  children,
  className,
  ...props
}) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const overflowCount = childArray.length - max;

  return (
    <div className={cn('flex flex-wrap gap-1', className)} {...props}>
      {visibleChildren}
      {overflowCount > 0 && (
        <Badge variant="outline" size="sm">
          +{overflowCount}
        </Badge>
      )}
    </div>
  );
};

// ============================================
// NOTIFICATION BADGE
// ============================================

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
  children: React.ReactNode;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  className,
  children,
}) => {
  const displayCount = count > max ? `${max}+` : count;
  const showBadge = count > 0;

  return (
    <div className={cn('relative inline-flex', className)}>
      {children}
      {showBadge && (
        <span
          className={cn(
            'absolute -top-1 -right-1',
            'min-w-[18px] h-[18px]',
            'flex items-center justify-center',
            'rounded-full',
            'bg-crisis-red text-white',
            'text-[10px] font-bold',
            'px-1',
            'animate-in fade-in zoom-in duration-200'
          )}
        >
          {displayCount}
        </span>
      )}
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export { Badge, BadgeGroup, NotificationBadge, badgeVariants };
export default Badge;
