// ============================================
// XP PROGRESS BAR COMPONENT
// Animated Experience & Rank Progression
// ============================================

import * as React from 'react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useGamificationStore } from '@/store/gamification.store';
import { RANKS, getRankForXP, getNextRank } from '@/config/gamification';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// VARIANTS
// ============================================

const progressBarVariants = cva(
  'relative overflow-hidden rounded-full transition-all duration-500',
  {
    variants: {
      size: {
        sm: 'h-2',
        default: 'h-3',
        lg: 'h-4',
        xl: 'h-6',
      },
      variant: {
        default: 'bg-rich-black/50',
        glass: 'bg-glass-white backdrop-blur-sm',
        solid: 'bg-surface',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'glass',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface XPProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof progressBarVariants> {
  /** Show XP numbers */
  showXP?: boolean;
  /** Show rank info */
  showRank?: boolean;
  /** Show next rank milestone */
  showMilestone?: boolean;
  /** Animate on XP gain */
  animateGains?: boolean;
  /** Compact mode for top nav */
  compact?: boolean;
  /** Custom XP value (overrides store) */
  xp?: number;
  /** Show level up celebration */
  showLevelUp?: boolean;
}

// ============================================
// XP GAIN ANIMATION
// ============================================

interface XPGainPopupProps {
  amount: number;
  onComplete: () => void;
}

const XPGainPopup: React.FC<XPGainPopupProps> = ({ amount, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute -top-6 right-0 animate-bounce-up">
      <span className="text-xs font-bold text-precision-teal whitespace-nowrap">
        +{amount} XP
      </span>
    </div>
  );
};

// ============================================
// LEVEL UP CELEBRATION
// ============================================

interface LevelUpCelebrationProps {
  newRank: string;
  onComplete: () => void;
}

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ newRank, onComplete }) => {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    playSound('rank_up');
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete, playSound]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-scale-up">
        <div className="bg-gradient-to-r from-achievement-gold to-achievement-gold/80 text-rich-black px-8 py-4 rounded-2xl shadow-2xl">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold mb-1">RANK UP!</h3>
            <p className="text-lg font-semibold">{newRank}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// RANK ICON COMPONENT
// ============================================

interface RankIconProps {
  rank: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const RankIcon: React.FC<RankIconProps> = ({ rank, size = 'default', className }) => {
  const rankConfig = Object.values(RANKS).find(
    (r) => r.name.toLowerCase() === rank?.toLowerCase()
  );

  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <span className={cn(sizeClasses[size], className)}>
      {rankConfig?.icon || '🛡️'}
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const XPProgressBar = React.forwardRef<HTMLDivElement, XPProgressBarProps>(
  (
    {
      className,
      size,
      variant,
      showXP = true,
      showRank = true,
      showMilestone = true,
      animateGains = true,
      compact = false,
      xp: customXP,
      showLevelUp = true,
      ...props
    },
    ref
  ) => {
    // Store state
    const storeXP = useGamificationStore((state) => state.xp);
    const storeRank = useGamificationStore((state) => state.rank);

    // Use custom XP if provided, otherwise use store
    const currentXP = customXP ?? storeXP;

    // Local state for animations
    const [previousXP, setPreviousXP] = useState(currentXP);
    const [xpGain, setXPGain] = useState<number | null>(null);
    const [showingLevelUp, setShowingLevelUp] = useState(false);
    const [previousRank, setPreviousRank] = useState(storeRank);

    // Calculate progress
    const currentRank = useMemo(() => getRankForXP(currentXP), [currentXP]);
    const nextRank = useMemo(() => getNextRank(currentRank), [currentRank]);

    // Calculate XP range for current rank
    const currentRankConfig = useMemo(() =>
      Object.values(RANKS).find((r) => r.name === currentRank),
      [currentRank]
    );

    const nextRankConfig = useMemo(() =>
      nextRank ? Object.values(RANKS).find((r) => r.name === nextRank) : null,
      [nextRank]
    );

    const minXP = currentRankConfig?.minXP ?? 0;
    const maxXP = nextRankConfig?.minXP ?? currentRankConfig?.maxXP ?? 10000;
    const xpInCurrentRank = currentXP - minXP;
    const xpNeededForNextRank = maxXP - minXP;
    const progress = Math.min((xpInCurrentRank / xpNeededForNextRank) * 100, 100);

    // Handle XP changes
    useEffect(() => {
      if (animateGains && currentXP > previousXP) {
        const gain = currentXP - previousXP;
        setXPGain(gain);
      }
      setPreviousXP(currentXP);
    }, [currentXP, previousXP, animateGains]);

    // Handle rank changes
    useEffect(() => {
      if (showLevelUp && currentRank !== previousRank && previousRank) {
        setShowingLevelUp(true);
      }
      setPreviousRank(currentRank);
    }, [currentRank, previousRank, showLevelUp]);

    const handleXPGainComplete = useCallback(() => {
      setXPGain(null);
    }, []);

    const handleLevelUpComplete = useCallback(() => {
      setShowingLevelUp(false);
    }, []);

    // Compact mode for top nav
    if (compact) {
      return (
        <div className={cn('flex items-center gap-2', className)} ref={ref} {...props}>
          <RankIcon rank={currentRank} size="sm" />
          <div className="flex-1 min-w-[80px]">
            <div className={cn(progressBarVariants({ size: 'sm', variant }))}>
              <div
                className="h-full bg-gradient-to-r from-precision-teal to-precision-teal/80 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {showXP && (
            <span className="text-xs font-mono text-muted">
              {currentXP.toLocaleString()}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {/* XP Gain Popup */}
        {xpGain !== null && (
          <XPGainPopup amount={xpGain} onComplete={handleXPGainComplete} />
        )}

        {/* Level Up Celebration */}
        {showingLevelUp && (
          <LevelUpCelebration newRank={currentRank} onComplete={handleLevelUpComplete} />
        )}

        {/* Header Info */}
        {(showRank || showXP) && (
          <div className="flex items-center justify-between mb-2">
            {/* Current Rank */}
            {showRank && (
              <div className="flex items-center gap-2">
                <RankIcon rank={currentRank} />
                <span className="text-sm font-semibold text-off-white">
                  {currentRank}
                </span>
              </div>
            )}

            {/* XP Counter */}
            {showXP && (
              <div className="text-right">
                <span className="text-sm font-mono text-precision-teal">
                  {currentXP.toLocaleString()}
                </span>
                <span className="text-xs text-muted ml-1">XP</span>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className={cn(progressBarVariants({ size, variant }))}>
          {/* Glass Inner Border */}
          <div className="absolute inset-0 rounded-full border border-glass-border" />

          {/* Progress Fill */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              'bg-gradient-to-r from-precision-teal via-precision-teal to-achievement-gold/50',
              'shadow-[0_0_10px_rgba(13,148,136,0.4)]'
            )}
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>

          {/* Milestone Markers */}
          {size !== 'sm' && (
            <>
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-1 h-1 bg-glass-border rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-1 h-1 bg-glass-border rounded-full" />
              <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-1 h-1 bg-glass-border rounded-full" />
            </>
          )}
        </div>

        {/* Milestone Info */}
        {showMilestone && nextRank && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted">
              {xpInCurrentRank.toLocaleString()} / {xpNeededForNextRank.toLocaleString()} XP
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span>Next:</span>
              <RankIcon rank={nextRank} size="sm" />
              <span className="text-off-white">{nextRank}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

XPProgressBar.displayName = 'XPProgressBar';

// ============================================
// MINI XP BAR (for cards and widgets)
// ============================================

interface MiniXPBarProps {
  xp: number;
  maxXP?: number;
  showLabel?: boolean;
  className?: string;
}

export const MiniXPBar: React.FC<MiniXPBarProps> = ({
  xp,
  maxXP = 100,
  showLabel = false,
  className,
}) => {
  const progress = Math.min((xp / maxXP) * 100, 100);

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted">
          <span>{xp} XP</span>
          <span>{maxXP} XP</span>
        </div>
      )}
      <div className="h-1.5 bg-rich-black/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-precision-teal rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ============================================
// XP SUMMARY WIDGET
// ============================================

interface XPSummaryWidgetProps {
  className?: string;
}

export const XPSummaryWidget: React.FC<XPSummaryWidgetProps> = ({ className }) => {
  const { xp, rank, loginStreak } = useGamificationStore();
  const nextRank = getNextRank(rank);

  return (
    <div className={cn(
      'bg-glass-white backdrop-blur-md rounded-xl border border-glass-border p-4',
      className
    )}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-achievement-gold to-achievement-gold/50 flex items-center justify-center">
          <RankIcon rank={rank} size="lg" />
        </div>
        <div>
          <h3 className="font-bold text-off-white">{rank}</h3>
          <p className="text-sm text-muted">{xp.toLocaleString()} XP Total</p>
        </div>
      </div>

      <XPProgressBar showRank={false} />

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-glass-border">
        <div>
          <p className="text-xs text-muted">Login Streak</p>
          <p className="text-lg font-bold text-achievement-gold">{loginStreak} days</p>
        </div>
        <div>
          <p className="text-xs text-muted">Next Rank</p>
          <p className="text-lg font-bold text-precision-teal">{nextRank || 'Max!'}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ANIMATIONS (add to globals.css)
// ============================================

// @keyframes shimmer {
//   100% { transform: translateX(100%); }
// }
// @keyframes bounce-up {
//   0% { transform: translateY(0); opacity: 1; }
//   100% { transform: translateY(-20px); opacity: 0; }
// }
// @keyframes scale-up {
//   0% { transform: scale(0.5); opacity: 0; }
//   50% { transform: scale(1.1); }
//   100% { transform: scale(1); opacity: 1; }
// }

// ============================================
// EXPORTS
// ============================================

export { RankIcon, progressBarVariants };
export default XPProgressBar;
