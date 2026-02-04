// ============================================
// REGIME DETECTION BADGE
// Feature 3: Market Regime Indicator
// ============================================

import * as React from 'react';
import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useCrisisStore, type MarketRegime } from '@/store/crisis.store';
import { GlassPanel } from '@/components/shared/GlassPanel';
// import { useMarketData } from '@/hooks/data/useMarketData';

// ============================================
// REGIME CONFIGURATION
// ============================================

const REGIME_CONFIG: Record<MarketRegime, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  recommendations: string[];
}> = {
  calm: {
    label: 'Calm',
    icon: '🌤️',
    color: 'text-precision-teal',
    bgColor: 'bg-precision-teal/20',
    borderColor: 'border-precision-teal/30',
    description: 'Market is stable with low volatility',
    recommendations: [
      'Execute standard rebalancing',
      'Review long-term positions',
      'Consider risk-seeking strategies',
    ],
  },
  volatile: {
    label: 'Volatile',
    icon: '⚡',
    color: 'text-achievement-gold',
    bgColor: 'bg-achievement-gold/20',
    borderColor: 'border-achievement-gold/30',
    description: 'Elevated volatility detected',
    recommendations: [
      'Tighten stop-losses',
      'Reduce position sizes',
      'Monitor correlation shifts',
    ],
  },
  crisis: {
    label: 'Crisis',
    icon: '🔥',
    color: 'text-crisis-red',
    bgColor: 'bg-crisis-red/20',
    borderColor: 'border-crisis-red/30',
    description: 'Extreme market stress detected',
    recommendations: [
      'Activate defensive protocols',
      'Halt new position entry',
      'Enable paranoia mode',
    ],
  },
  recovery: {
    label: 'Recovery',
    icon: '🌱',
    color: 'text-spring-green',
    bgColor: 'bg-spring-green/20',
    borderColor: 'border-spring-green/30',
    description: 'Market recovering from stress',
    recommendations: [
      'Gradual position rebuilding',
      'Look for value opportunities',
      'Monitor for false recoveries',
    ],
  },
  unknown: {
    label: 'Analyzing',
    icon: '🔄',
    color: 'text-muted',
    bgColor: 'bg-glass-white',
    borderColor: 'border-glass-border',
    description: 'Determining market regime...',
    recommendations: [],
  },
};

// ============================================
// VARIANTS
// ============================================

const regimeBadgeVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold border transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'text-xs px-2 py-0.5 rounded',
        default: 'text-sm px-3 py-1 rounded-lg',
        lg: 'text-base px-4 py-1.5 rounded-lg',
        xl: 'text-lg px-5 py-2 rounded-xl',
      },
      variant: {
        badge: '',
        pill: 'rounded-full',
        outlined: 'bg-transparent',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'badge',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface RegimeDetectionBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof regimeBadgeVariants> {
  /** Override regime (uses store if not provided) */
  regime?: MarketRegime;
  /** Show icon */
  showIcon?: boolean;
  /** Animate pulse effect */
  pulse?: boolean;
  /** Interactive - shows tooltip/popover */
  interactive?: boolean;
  /** Show detailed view */
  expanded?: boolean;
}

// ============================================
// PULSE ANIMATION
// ============================================

const PulseRing: React.FC<{ regime: MarketRegime }> = ({ regime }) => {
  if (regime === 'calm' || regime === 'unknown') return null;

  const config = REGIME_CONFIG[regime];

  return (
    <span
      className={cn(
        'absolute inset-0 rounded-full',
        'animate-ping opacity-30',
        config.bgColor
      )}
    />
  );
};

// ============================================
// MAIN BADGE COMPONENT
// ============================================

export const RegimeDetectionBadge = React.forwardRef<HTMLDivElement, RegimeDetectionBadgeProps>(
  (
    {
      className,
      size,
      variant,
      regime: regimeProp,
      showIcon = true,
      pulse = true,
      interactive = false,
      expanded = false,
      ...props
    },
    ref
  ) => {
    const storeRegime = useCrisisStore((state) => state.marketRegime);
    const regime = regimeProp ?? storeRegime;
    const config = REGIME_CONFIG[regime];

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          regimeBadgeVariants({ size, variant }),
          config.bgColor,
          config.borderColor,
          config.color,
          interactive && 'cursor-pointer hover:scale-105',
          className
        )}
        {...props}
      >
        {pulse && <PulseRing regime={regime} />}

        {showIcon && (
          <span className="relative z-10">{config.icon}</span>
        )}

        <span className="relative z-10">{config.label}</span>
      </div>
    );
  }
);

RegimeDetectionBadge.displayName = 'RegimeDetectionBadge';

// ============================================
// REGIME STATUS CARD
// ============================================

interface RegimeStatusCardProps {
  className?: string;
  showRecommendations?: boolean;
  showConfidence?: boolean;
}

export const RegimeStatusCard: React.FC<RegimeStatusCardProps> = ({
  className,
  showRecommendations = true,
  showConfidence = true,
}) => {
  const { marketRegime, regimeConfidence, lastRegimeChange } = useCrisisStore();
  const config = REGIME_CONFIG[marketRegime];

  // Time since last regime change
  const timeSinceChange = useMemo(() => {
    if (!lastRegimeChange) return 'Unknown';
    const elapsed = Date.now() - new Date(lastRegimeChange).getTime();
    const hours = Math.floor(elapsed / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Recently';
  }, [lastRegimeChange]);

  return (
    <GlassPanel
      variant={marketRegime === 'crisis' ? 'crisis' : 'default'}
      padding="default"
      className={cn('relative overflow-hidden', className)}
    >
      {/* Background Glow */}
      <div
        className={cn(
          'absolute inset-0 opacity-10',
          config.bgColor
        )}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
              config.bgColor
            )}>
              {config.icon}
            </div>
            <div>
              <h3 className={cn('font-bold text-lg', config.color)}>
                {config.label} Regime
              </h3>
              <p className="text-xs text-muted">
                Changed {timeSinceChange}
              </p>
            </div>
          </div>

          {showConfidence && (
            <div className="text-right">
              <p className="text-xs text-muted uppercase">Confidence</p>
              <p className={cn('text-lg font-bold', config.color)}>
                {(regimeConfidence * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-off-white mb-4">
          {config.description}
        </p>

        {/* Confidence Bar */}
        {showConfidence && (
          <div className="mb-4">
            <div className="h-2 bg-rich-black/50 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', config.bgColor)}
                style={{ width: `${regimeConfidence * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Recommendations */}
        {showRecommendations && config.recommendations.length > 0 && (
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">
              Recommended Actions
            </p>
            <ul className="space-y-1.5">
              {config.recommendations.map((rec, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-off-white">
                  <span className={cn('w-1.5 h-1.5 rounded-full', config.bgColor)} />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </GlassPanel>
  );
};

// ============================================
// REGIME TIMELINE
// ============================================

interface RegimeTimelineProps {
  className?: string;
  limit?: number;
}

export const RegimeTimeline: React.FC<RegimeTimelineProps> = ({
  className,
  limit = 5,
}) => {
  const { regimeHistory } = useCrisisStore();

  // Get recent history
  const recentHistory = regimeHistory.slice(0, limit);

  if (recentHistory.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted', className)}>
        No regime history available
      </div>
    );
  }

  return (
    <div className={cn('space-y-0', className)}>
      {recentHistory.map((entry, index) => {
        const config = REGIME_CONFIG[entry.regime];
        const isLast = index === recentHistory.length - 1;

        return (
          <div key={entry.id} className="flex gap-3">
            {/* Timeline Node */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-3 h-3 rounded-full border-2',
                config.borderColor,
                index === 0 ? config.bgColor : 'bg-surface'
              )} />
              {!isLast && (
                <div className="w-0.5 flex-1 bg-glass-border min-h-[40px]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className={config.color}>{config.icon}</span>
                <span className={cn('font-medium text-sm', config.color)}>
                  {config.label}
                </span>
                <span className="text-xs text-muted">
                  {new Date(entry.startTime).toLocaleDateString()}
                </span>
              </div>
              {entry.trigger && (
                <p className="text-xs text-muted mt-1">
                  {entry.trigger}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// MINI REGIME INDICATOR
// ============================================

interface MiniRegimeIndicatorProps {
  className?: string;
}

export const MiniRegimeIndicator: React.FC<MiniRegimeIndicatorProps> = ({ className }) => {
  const { marketRegime } = useCrisisStore();
  const config = REGIME_CONFIG[marketRegime];

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-full',
        config.bgColor,
        config.borderColor,
        'border',
        className
      )}
    >
      <span className="text-sm">{config.icon}</span>
      <span className={cn('text-xs font-medium', config.color)}>
        {config.label}
      </span>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export { REGIME_CONFIG, regimeBadgeVariants };
export default RegimeDetectionBadge;
