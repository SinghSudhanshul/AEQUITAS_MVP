// ============================================
// MOBILE BOTTOM NAV
// Bottom Navigation for Mobile Devices
// ============================================

import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WINGS, WingId, isWingUnlocked } from '@/config/wings';

// Stores
import { useGamificationStore } from '@/store/gamification.store';
import { useAuthStore } from '@/store/authStore';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface MobileBottomNavProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isLocked?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const location = useLocation();
  const { playSound } = useSoundEffects();
  const { rank } = useGamificationStore();
  const { subscriptionTier } = useAuthStore();

  // Build navigation items from primary wings
  const navItems: NavItem[] = useMemo(() => {
    const primaryWings: WingId[] = ['lobby', 'bullpen', 'treasury', 'donnas-desk', 'harveys-office'];

    return primaryWings.map((wingId) => {
      const wing = WINGS[wingId];
      const isUnlocked = isWingUnlocked(wingId, rank, subscriptionTier || 'free');

      return {
        id: wingId,
        label: wing.name.replace('The ', '').replace("'s", ''),
        icon: wing.icon,
        path: wing.path,
        isLocked: !isUnlocked,
      };
    });
  }, [rank, subscriptionTier]);

  return (
    <nav
      className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0 z-50',
        'bg-surface/95 backdrop-blur-lg border-t border-glass-border',
        'safe-area-inset',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <NavLink
              key={item.id}
              to={item.isLocked ? '#' : item.path}
              onClick={(e) => {
                if (item.isLocked) {
                  e.preventDefault();
                  playSound('error');
                } else {
                  playSound('click');
                }
              }}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full py-2 relative',
                'transition-all duration-200',
                isActive
                  ? 'text-precision-teal'
                  : item.isLocked
                    ? 'text-muted/50'
                    : 'text-muted hover:text-off-white'
              )}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-precision-teal rounded-b-full" />
              )}

              {/* Icon */}
              <span className={cn(
                'text-xl mb-0.5 transition-transform',
                isActive && 'scale-110'
              )}>
                {item.isLocked ? '🔒' : item.icon}
              </span>

              {/* Label */}
              <span className="text-[10px] font-medium truncate max-w-[60px]">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

// ============================================
// FLOATING ACTION BUTTON (Optional)
// ============================================

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  className,
}) => {
  const { playSound } = useSoundEffects();

  return (
    <button
      onClick={() => {
        playSound('click');
        onClick();
      }}
      className={cn(
        'lg:hidden fixed bottom-20 right-4 z-50',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-br from-precision-teal to-institutional-blue',
        'flex items-center justify-center',
        'shadow-lg shadow-precision-teal/30',
        'active:scale-95 transition-transform',
        className
      )}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default MobileBottomNav;
