// ============================================
// RANK BADGE COMPONENT
// Junior Associate → Name Partner Progression
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { RANKS } from '@/config/gamification';
import { useGamificationStore } from '@/store/gamification.store';

// ============================================
// VARIANTS
// ============================================

const rankBadgeVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-1.5',
    'font-semibold',
    'transition-all duration-300',
    'border',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'text-[10px] px-1.5 py-0.5 rounded',
        sm: 'text-xs px-2 py-0.5 rounded-md',
        default: 'text-sm px-3 py-1 rounded-lg',
        lg: 'text-base px-4 py-1.5 rounded-lg',
        xl: 'text-lg px-5 py-2 rounded-xl',
      },

      variant: {
        default: '',
        outlined: 'bg-transparent',
        filled: '',
        glass: 'backdrop-blur-md',
        premium: 'shadow-lg',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

// ============================================
// RANK COLORS
// ============================================

const RANK_STYLES: Record<string, {
  bg: string;
  border: string;
  text: string;
  glow?: string;
  gradient?: string;
}> = {
  'Junior Associate': {
    bg: 'bg-silver/20',
    border: 'border-silver/40',
    text: 'text-silver',
  },
  'Associate': {
    bg: 'bg-silver/30',
    border: 'border-silver/50',
    text: 'text-silver',
  },
  'Senior Associate': {
    bg: 'bg-institutional-blue/20',
    border: 'border-institutional-blue/40',
    text: 'text-institutional-blue',
  },
  'Junior Partner': {
    bg: 'bg-achievement-gold/20',
    border: 'border-achievement-gold/40',
    text: 'text-achievement-gold',
  },
  'Partner': {
    bg: 'bg-achievement-gold/30',
    border: 'border-achievement-gold/50',
    text: 'text-achievement-gold',
    glow: 'shadow-achievement-gold/20',
  },
  'Senior Partner': {
    bg: 'bg-platinum/20',
    border: 'border-platinum/40',
    text: 'text-platinum',
    glow: 'shadow-platinum/20',
  },
  'Managing Partner': {
    bg: 'bg-gradient-to-r from-achievement-gold/30 to-platinum/30',
    border: 'border-achievement-gold/50',
    text: 'text-achievement-gold',
    glow: 'shadow-achievement-gold/30',
    gradient: 'bg-gradient-to-r from-achievement-gold to-platinum',
  },
  'Name Partner': {
    bg: 'bg-gradient-to-r from-rich-black to-institutional-blue',
    border: 'border-achievement-gold',
    text: 'text-achievement-gold',
    glow: 'shadow-lg shadow-achievement-gold/40',
    gradient: 'bg-gradient-to-r from-achievement-gold via-platinum to-achievement-gold',
  },
};

// ============================================
// TYPES
// ============================================

export interface RankBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof rankBadgeVariants> {
  /** Rank name override (uses store if not provided) */
  rank?: string;
  /** Show rank icon */
  showIcon?: boolean;
  /** Animate on hover */
  animated?: boolean;
  /** Show tooltip with rank benefits */
  showTooltip?: boolean;
  /** Interactive click handler */
  onClick?: () => void;
}

// ============================================
// RANK ICON
// ============================================

const RankIcon: React.FC<{ rank: string; className?: string }> = ({ rank, className }) => {
  const rankConfig = Object.values(RANKS).find(
    (r) => r.name.toLowerCase() === rank?.toLowerCase()
  );

  return (
    <span className={className}>
      {rankConfig?.icon || '🛡️'}
    </span>
  );
};

// ============================================
// COMPONENT
// ============================================

export const RankBadge = React.forwardRef<HTMLSpanElement, RankBadgeProps>(
  (
    {
      className,
      size,
      variant,
      rank: rankProp,
      showIcon = true,
      animated = true,
      showTooltip = false,
      onClick,
      ...props
    },
    ref
  ) => {
    // Get rank from store if not provided
    const storeRank = useGamificationStore((state) => state.rank);
    const rank = rankProp ?? storeRank;

    // Get rank styling
    const rankStyle = RANK_STYLES[rank] || RANK_STYLES['Junior Associate'];
    const rankConfig = Object.values(RANKS).find(
      (r) => r.name.toLowerCase() === rank?.toLowerCase()
    );

    // Build class names
    const classes = cn(
      rankBadgeVariants({ size, variant }),
      rankStyle.bg,
      rankStyle.border,
      rankStyle.text,
      rankStyle.glow && `shadow-lg ${rankStyle.glow}`,
      animated && 'hover:scale-105 cursor-pointer',
      onClick && 'cursor-pointer',
      className
    );

    // Tooltip content
    const tooltipContent = rankConfig?.benefits?.join(' • ') || '';

    return (
      <span
        ref={ref}
        className={classes}
        title={showTooltip ? tooltipContent : undefined}
        onClick={onClick}
        {...props}
      >
        {showIcon && <RankIcon rank={rank} />}
        <span>{rank}</span>
      </span>
    );
  }
);

RankBadge.displayName = 'RankBadge';

// ============================================
// RANK PROGRESSION TRACKER
// ============================================

interface RankProgressionTrackerProps {
  currentRank?: string;
  showAll?: boolean;
  className?: string;
}

export const RankProgressionTracker: React.FC<RankProgressionTrackerProps> = ({
  currentRank: currentRankProp,
  showAll = true,
  className,
}) => {
  const storeRank = useGamificationStore((state) => state.rank);
  const currentXP = useGamificationStore((state) => state.xp);
  const currentRank = currentRankProp ?? storeRank;

  const ranks = Object.values(RANKS);
  const currentRankIndex = ranks.findIndex(
    (r) => r.name.toLowerCase() === currentRank?.toLowerCase()
  );

  // Visible ranks (current - 1 to current + 2)
  const visibleRanks = showAll
    ? ranks
    : ranks.slice(
      Math.max(0, currentRankIndex - 1),
      Math.min(ranks.length, currentRankIndex + 3)
    );

  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-semibold text-off-white mb-4">Rank Progression</h4>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-glass-border" />

        {/* Ranks */}
        <div className="space-y-4">
          {visibleRanks.map((rank) => {
            const isAchieved = currentXP >= rank.minXP;
            const isCurrent = rank.name === currentRank;

            return (
              <div
                key={rank.id}
                className={cn(
                  'relative flex items-center gap-4 pl-10',
                  !isAchieved && 'opacity-50'
                )}
              >
                {/* Node */}
                <div
                  className={cn(
                    'absolute left-2.5 w-3 h-3 rounded-full border-2',
                    isCurrent ? 'bg-precision-teal border-precision-teal scale-125' :
                      isAchieved ? 'bg-achievement-gold border-achievement-gold' :
                        'bg-surface border-glass-border'
                  )}
                />

                {/* Rank Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{rank.icon}</span>
                    <span className={cn(
                      'font-semibold',
                      isCurrent ? 'text-precision-teal' :
                        isAchieved ? 'text-achievement-gold' :
                          'text-muted'
                    )}>
                      {rank.name}
                    </span>
                    {isCurrent && (
                      <span className="text-xs bg-precision-teal/20 text-precision-teal px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {rank.minXP.toLocaleString()} XP required
                  </p>
                </div>

                {/* Checkmark for achieved */}
                {isAchieved && !isCurrent && (
                  <svg className="w-5 h-5 text-precision-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// RANK COMPARISON WIDGET
// ============================================

interface RankComparisonWidgetProps {
  className?: string;
}

export const RankComparisonWidget: React.FC<RankComparisonWidgetProps> = ({ className }) => {
  const { rank, xp } = useGamificationStore();

  const ranks = Object.values(RANKS);
  const currentRankIndex = ranks.findIndex(
    (r) => r.name.toLowerCase() === rank?.toLowerCase()
  );

  const currentRankConfig = ranks[currentRankIndex];
  const nextRankConfig = ranks[currentRankIndex + 1];

  if (!currentRankConfig) return null;

  const xpToNextRank = nextRankConfig
    ? nextRankConfig.minXP - xp
    : 0;

  return (
    <div className={cn(
      'bg-glass-white backdrop-blur-md rounded-xl border border-glass-border p-4',
      className
    )}>
      {/* Current Rank */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide">Current Rank</p>
          <RankBadge rank={rank} size="lg" className="mt-1" />
        </div>
        <div className="text-4xl">{currentRankConfig.icon}</div>
      </div>

      {/* Benefits */}
      <div className="mb-4">
        <p className="text-xs text-muted uppercase tracking-wide mb-2">Benefits</p>
        <div className="flex flex-wrap gap-1.5">
          {currentRankConfig.benefits?.map((benefit, i) => (
            <span
              key={i}
              className="text-xs bg-glass-white text-off-white px-2 py-0.5 rounded-full"
            >
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Next Rank */}
      {nextRankConfig && (
        <div className="pt-4 border-t border-glass-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">Next Rank</p>
              <p className="font-semibold text-off-white flex items-center gap-2 mt-1">
                <span>{nextRankConfig.icon}</span>
                <span>{nextRankConfig.name}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">XP Needed</p>
              <p className="font-bold text-precision-teal">
                {xpToNextRank.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MINI RANK BADGE (for compact displays)
// ============================================

interface MiniRankBadgeProps {
  rank?: string;
  className?: string;
}

export const MiniRankBadge: React.FC<MiniRankBadgeProps> = ({ rank: rankProp, className }) => {
  const storeRank = useGamificationStore((state) => state.rank);
  const rank = rankProp ?? storeRank;
  const rankStyle = RANK_STYLES[rank] || RANK_STYLES['Junior Associate'];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
        rankStyle.bg,
        rankStyle.border,
        rankStyle.text,
        className
      )}
    >
      <RankIcon rank={rank} className="text-xs" />
      {rank?.split(' ').map((w) => w[0]).join('')}
    </span>
  );
};

// ============================================
// EXPORTS
// ============================================

export { RankIcon, rankBadgeVariants };
export default RankBadge;
