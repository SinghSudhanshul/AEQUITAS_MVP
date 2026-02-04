// ============================================
// ACHIEVEMENT BADGE COMPONENT
// The Closer, The Fixer, The Genius
// ============================================

import * as React from 'react';
import { useState, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ACHIEVEMENTS } from '@/config/gamification';
import { useGamificationStore } from '@/store/gamification.store';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';
import { GlassPanel } from '@/components/shared/GlassPanel';

// ============================================
// VARIANTS
// ============================================

const achievementBadgeVariants = cva(
  // Base styles
  [
    'relative inline-flex flex-col items-center justify-center',
    'transition-all duration-300',
    'overflow-hidden',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-12 h-12',
        default: 'w-16 h-16',
        lg: 'w-20 h-20',
        xl: 'w-24 h-24',
        '2xl': 'w-32 h-32',
      },

      shape: {
        circle: 'rounded-full',
        square: 'rounded-xl',
        hexagon: 'clip-hexagon',
        shield: 'clip-shield',
      },

      rarity: {
        common: '',
        rare: '',
        epic: '',
        legendary: '',
      },
    },
    defaultVariants: {
      size: 'default',
      shape: 'circle',
      rarity: 'common',
    },
  }
);

// ============================================
// RARITY STYLES
// ============================================

const RARITY_STYLES = {
  common: {
    bg: 'bg-glass-white',
    border: 'border-glass-border',
    glow: '',
    ring: 'ring-silver/30',
  },
  rare: {
    bg: 'bg-institutional-blue/20',
    border: 'border-institutional-blue/50',
    glow: 'shadow-institutional-blue/20',
    ring: 'ring-institutional-blue/50',
  },
  epic: {
    bg: 'bg-achievement-gold/20',
    border: 'border-achievement-gold/50',
    glow: 'shadow-lg shadow-achievement-gold/30',
    ring: 'ring-achievement-gold/50',
  },
  legendary: {
    bg: 'bg-gradient-to-br from-achievement-gold/30 to-crisis-red/20',
    border: 'border-achievement-gold',
    glow: 'shadow-xl shadow-achievement-gold/40',
    ring: 'ring-achievement-gold',
  },
};

// ============================================
// TYPES
// ============================================

export interface AchievementBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof achievementBadgeVariants> {
  /** Achievement ID */
  achievementId: string;
  /** Whether achievement is unlocked */
  unlocked?: boolean;
  /** Show tooltip with details */
  showTooltip?: boolean;
  /** Show progress for locked achievements */
  showProgress?: boolean;
  /** Current progress (0-100) */
  progress?: number;
  /** Interactive mode */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
}

// ============================================
// LOCKED OVERLAY
// ============================================

const LockedOverlay: React.FC<{ progress?: number }> = ({ progress }) => (
  <div className="absolute inset-0 bg-rich-black/70 backdrop-blur-sm flex items-center justify-center">
    <div className="text-center">
      <svg className="w-6 h-6 text-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      {progress !== undefined && progress > 0 && (
        <span className="text-[10px] text-muted mt-1 block">{progress}%</span>
      )}
    </div>
  </div>
);

// ============================================
// CELEBRATION ANIMATION
// ============================================

const CelebrationRays: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-achievement-gold to-transparent opacity-0 animate-ray"
        style={{
          transform: `rotate(${i * 45}deg) translateY(-100%)`,
          animationDelay: `${i * 50}ms`,
        }}
      />
    ))}
  </div>
);

// ============================================
// COMPONENT
// ============================================

export const AchievementBadge = React.forwardRef<HTMLDivElement, AchievementBadgeProps>(
  (
    {
      className,
      size,
      shape,
      rarity: rarityProp,
      achievementId,
      unlocked: unlockedProp,
      showTooltip = true,
      showProgress = true,
      progress = 0,
      interactive = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const [showCelebration, setShowCelebration] = useState(false);
    const { playSound } = useSoundEffects();

    // Get achievement config
    const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS];

    // Check if unlocked from store if not provided
    const storeAchievements = useGamificationStore((state) => state.achievements);
    const unlocked = unlockedProp ?? storeAchievements.includes(achievementId);

    // Determine rarity (mock logic - should come from config)
    const rarity = rarityProp || 'common';
    const rarityStyle = RARITY_STYLES[rarity];

    const handleClick = useCallback(() => {
      if (interactive && unlocked) {
        playSound('click');
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1000);
      }
      onClick?.();
    }, [interactive, unlocked, playSound, onClick]);

    if (!achievement) {
      return (
        <div className={cn(
          achievementBadgeVariants({ size, shape }),
          'bg-glass-white border border-glass-border text-muted',
          className
        )}>
          <span className="text-2xl">❓</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          achievementBadgeVariants({ size, shape, rarity }),
          'border-2',
          rarityStyle.bg,
          rarityStyle.border,
          unlocked && rarityStyle.glow,
          interactive && 'cursor-pointer hover:scale-110 active:scale-95',
          !unlocked && 'grayscale',
          className
        )}
        onClick={handleClick}
        title={showTooltip ? `${achievement.name}: ${achievement.description}` : undefined}
        {...props}
      >
        {/* Icon */}
        <span className={cn(
          'text-2xl',
          size === 'sm' && 'text-lg',
          size === 'lg' && 'text-3xl',
          size === 'xl' && 'text-4xl',
          size === '2xl' && 'text-5xl',
        )}>
          {achievement.icon}
        </span>

        {/* Locked Overlay */}
        {!unlocked && <LockedOverlay progress={showProgress ? progress : undefined} />}

        {/* Celebration Animation */}
        {showCelebration && <CelebrationRays />}

        {/* Rarity Ring (for epic/legendary) */}
        {unlocked && (rarity === 'epic' || rarity === 'legendary') && (
          <div className={cn(
            'absolute inset-0 rounded-full animate-pulse',
            'ring-2 ring-inset',
            rarityStyle.ring
          )} />
        )}
      </div>
    );
  }
);

AchievementBadge.displayName = 'AchievementBadge';

// ============================================
// ACHIEVEMENT CARD
// ============================================

interface AchievementCardProps {
  achievementId: string;
  unlocked?: boolean;
  progress?: number;
  className?: string;
  onView?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievementId,
  unlocked: unlockedProp,
  progress = 0,
  className,
  onView,
}) => {
  const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS];
  const storeAchievements = useGamificationStore((state) => state.achievements);
  const unlocked = unlockedProp ?? storeAchievements.includes(achievementId);

  if (!achievement) return null;

  return (
    <GlassPanel
      variant={unlocked ? 'premium' : 'default'}
      padding="default"
      hover="glow"
      className={cn(
        'relative overflow-hidden',
        !unlocked && 'opacity-75',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <AchievementBadge
          achievementId={achievementId}
          unlocked={unlocked}
          size="lg"
          interactive={false}
        />

        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-bold',
            unlocked ? 'text-achievement-gold' : 'text-off-white'
          )}>
            {achievement.name}
          </h4>
          <p className="text-sm text-muted mt-1">
            {achievement.description}
          </p>

          {/* Progress Bar */}
          {!unlocked && progress > 0 && (
            <div className="mt-3">
              <div className="h-1.5 bg-rich-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-precision-teal rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted mt-1">{progress}% complete</span>
            </div>
          )}

          {/* Unlocked Badge */}
          {unlocked && (
            <div className="flex items-center gap-1 mt-2 text-xs text-precision-teal">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlocked</span>
            </div>
          )}
        </div>
      </div>

      {/* View Details Button */}
      {onView && (
        <button
          onClick={onView}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-muted hover:text-off-white hover:bg-glass-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
    </GlassPanel>
  );
};

// ============================================
// ACHIEVEMENT GRID
// ============================================

interface AchievementGridProps {
  achievements?: string[];
  columns?: 3 | 4 | 5 | 6;
  showLocked?: boolean;
  className?: string;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements: achievementsProp,
  columns = 5,
  showLocked = true,
  className,
}) => {
  const storeAchievements = useGamificationStore((state) => state.achievements);

  // Use all achievements if not provided
  const achievementIds = achievementsProp ?? Object.keys(ACHIEVEMENTS);

  // Filter locked if needed
  const displayedAchievements = showLocked
    ? achievementIds
    : achievementIds.filter((id) => storeAchievements.includes(id));

  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {displayedAchievements.map((achievementId) => (
        <div key={achievementId} className="flex flex-col items-center gap-2">
          <AchievementBadge
            achievementId={achievementId}
            size="lg"
          />
          <span className="text-xs text-muted text-center truncate w-full">
            {ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS]?.name || 'Unknown'}
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// ACHIEVEMENT UNLOCK NOTIFICATION
// ============================================

interface AchievementUnlockNotificationProps {
  achievementId: string;
  onDismiss?: () => void;
  onView?: () => void;
}

export const AchievementUnlockNotification: React.FC<AchievementUnlockNotificationProps> = ({
  achievementId,
  onDismiss,
  onView,
}) => {
  const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS];
  const { playSound } = useSoundEffects();

  React.useEffect(() => {
    playSound('achievement');
  }, [playSound]);

  if (!achievement) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
      <GlassPanel variant="premium" className="flex items-center gap-4 min-w-[300px]">
        <AchievementBadge achievementId={achievementId} unlocked size="lg" />

        <div className="flex-1">
          <p className="text-xs text-achievement-gold uppercase tracking-wide">
            Achievement Unlocked!
          </p>
          <h4 className="font-bold text-off-white">{achievement.name}</h4>
          <p className="text-xs text-muted">{achievement.description}</p>
        </div>

        <div className="flex flex-col gap-2">
          {onView && (
            <button
              onClick={onView}
              className="text-xs text-precision-teal hover:underline"
            >
              View
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-muted hover:text-off-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </GlassPanel>
    </div>
  );
};

// ============================================
// ACHIEVEMENT SHOWCASE
// ============================================

interface AchievementShowcaseProps {
  featuredIds?: string[];
  maxDisplay?: number;
  className?: string;
}

export const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  featuredIds,
  maxDisplay = 5,
  className,
}) => {
  const storeAchievements = useGamificationStore((state) => state.achievements);

  // Get featured or most recent
  const displayIds = featuredIds || storeAchievements.slice(0, maxDisplay);
  const totalCount = storeAchievements.length;
  const totalPossible = Object.keys(ACHIEVEMENTS).length;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {displayIds.slice(0, maxDisplay).map((id) => (
        <AchievementBadge
          key={id}
          achievementId={id}
          unlocked
          size="sm"
          shape="circle"
        />
      ))}

      {totalCount > maxDisplay && (
        <span className="text-xs text-muted">
          +{totalCount - maxDisplay} more
        </span>
      )}

      <span className="text-xs text-muted ml-2">
        {totalCount}/{totalPossible}
      </span>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export { achievementBadgeVariants };
export default AchievementBadge;
