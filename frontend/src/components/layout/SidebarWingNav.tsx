// ============================================
// SIDEBAR WING NAV COMPONENT
// 9-Wing Navigation with Tier Gates
// ============================================

import * as React from 'react';
import { useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WINGS, WING_ORDER, isWingUnlocked, type WingId } from '@/config/wings';
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamification.store';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';
// import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import { MiniRankBadge } from '@/components/gamification/RankBadge';

// ============================================
// TYPES
// ============================================

export interface SidebarWingNavProps {
  collapsed?: boolean;
  currentWing?: WingId;
  userRank?: string;
  className?: string;
}

// ============================================
// WING NAV ITEM
// ============================================

interface WingNavItemProps {
  wingId: WingId;
  collapsed?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  lockedReason?: string;
}

const WingNavItem: React.FC<WingNavItemProps> = ({
  wingId,
  collapsed = false,
  isActive = false,
  isLocked = false,
  lockedReason,
}) => {
  const wing = WINGS[wingId];
  const { playSound } = useSoundEffects();
  const location = useLocation();

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      playSound('error');
      // Could show a toast here explaining why locked
    } else {
      playSound('click');
    }
  }, [isLocked, playSound]);

  if (!wing) return null;

  return (
    <NavLink
      to={wing.path}
      onClick={handleClick}
      className={({ isActive: routeActive }) => cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
        // Active state
        (routeActive || isActive)
          ? 'bg-glass-white text-off-white border-l-2 border-precision-teal'
          : 'text-muted hover:text-off-white hover:bg-glass-white/50',
        // Locked state
        isLocked && 'opacity-50 cursor-not-allowed',
        // Collapsed
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? wing.name : undefined}
    >
      {/* Wing Icon */}
      <span className={cn(
        'text-xl transition-transform duration-200',
        !collapsed && 'group-hover:scale-110',
        isLocked && 'grayscale'
      )}>
        {wing.icon}
      </span>

      {/* Wing Name (expanded only) */}
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <span className={cn(
            'font-medium text-sm',
            wing.persona ? `text-${wing.persona === 'harvey' ? 'achievement-gold' : 'precision-teal'}` : ''
          )}>
            {wing.shortName}
          </span>

          {/* Persona indicator */}
          {wing.persona && (
            <span className="ml-1.5 text-xs">
              {wing.persona === 'harvey' ? '👔' : '💅'}
            </span>
          )}
        </div>
      )}

      {/* Lock Icon */}
      {isLocked && !collapsed && (
        <svg className="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}

      {/* Tier Badge (expanded only) */}
      {!collapsed && !isLocked && wing.tier !== 'free' && (
        <span className={cn(
          'text-[10px] font-medium px-1.5 py-0.5 rounded',
          wing.tier === 'premium'
            ? 'bg-achievement-gold/20 text-achievement-gold'
            : 'bg-institutional-blue/20 text-institutional-blue'
        )}>
          {wing.tier === 'premium' ? 'PRO' : 'ENT'}
        </span>
      )}

      {/* Active Indicator */}
      {(isActive || location.pathname.includes(`/wings/${wingId}`)) && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-precision-teal rounded-r-full" />
      )}

      {/* Hover Tooltip (collapsed only) */}
      {collapsed && (
        <div className={cn(
          'absolute left-full ml-2 px-3 py-1.5',
          'bg-surface border border-glass-border rounded-lg shadow-xl',
          'opacity-0 group-hover:opacity-100 pointer-events-none',
          'transition-opacity whitespace-nowrap z-50'
        )}>
          <span className="text-sm font-medium text-off-white">{wing.name}</span>
          {isLocked && (
            <span className="block text-xs text-muted mt-0.5">
              {lockedReason || 'Locked'}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const SidebarWingNav: React.FC<SidebarWingNavProps> = ({
  collapsed = false,
  currentWing,
  className,
}) => {
  const { user, subscriptionTier } = useAuthStore();
  const { rank, loginStreak } = useGamificationStore();

  // Check wing unlock status
  const getWingLockStatus = (wingId: WingId): { locked: boolean; reason?: string } => {
    const tier = subscriptionTier || 'free';
    const isUnlocked = isWingUnlocked(wingId, rank, tier as 'free' | 'premium' | 'enterprise');

    if (isUnlocked) return { locked: false };

    const wing = WINGS[wingId];
    if (!wing) return { locked: true, reason: 'Unknown wing' };

    // Check if it's a rank issue or tier issue
    const rankLocked = wing.requiredRank !== 'junior_associate';
    const tierLocked = wing.tier !== 'free' && tier !== wing.tier && tier !== 'enterprise';

    if (tierLocked && rankLocked) {
      return { locked: true, reason: `Requires ${wing.tier} tier & ${wing.requiredRank.replace(/_/g, ' ')}` };
    } else if (tierLocked) {
      return { locked: true, reason: `Requires ${wing.tier} tier` };
    } else {
      return { locked: true, reason: `Requires ${wing.requiredRank.replace(/_/g, ' ')}` };
    }
  };

  return (
    <nav className={cn('flex flex-col h-[calc(100%-64px)]', className)}>
      {/* Wing List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Section: Main Wings */}
        {!collapsed && (
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 mb-2">
            Wings
          </p>
        )}

        {WING_ORDER.map((wingId) => {
          const { locked, reason } = getWingLockStatus(wingId);
          return (
            <WingNavItem
              key={wingId}
              wingId={wingId}
              collapsed={collapsed}
              isActive={currentWing === wingId}
              isLocked={locked}
              lockedReason={reason}
            />
          );
        })}
      </div>

      {/* User Section */}
      <div className={cn(
        'border-t border-glass-border p-3',
        collapsed && 'flex flex-col items-center'
      )}>
        {/* Streak Indicator */}
        {loginStreak > 0 && !collapsed && (
          <div className="flex items-center gap-2 mb-3 px-2">
            <span className="text-lg">🔥</span>
            <span className="text-xs text-muted">
              {loginStreak} day streak
            </span>
          </div>
        )}

        {loginStreak > 0 && collapsed && (
          <div className="mb-2" title={`${loginStreak} day streak`}>
            <span className="text-lg">🔥</span>
          </div>
        )}

        {/* XP Progress */}
        {!collapsed && (
          <div className="mb-3">
            <XPProgressBar
              compact
              showMilestone={false}
            />
          </div>
        )}

        {/* User Profile Link */}
        <NavLink
          to="/app/settings/profile"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors',
            isActive
              ? 'bg-glass-white'
              : 'hover:bg-glass-white/50',
            collapsed && 'justify-center'
          )}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-glass-white border border-glass-border flex items-center justify-center text-sm font-bold text-off-white shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0] || 'U'}
          </div>

          {/* User Info */}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-off-white truncate">
                {user?.displayName || 'User'}
              </p>
              <MiniRankBadge />
            </div>
          )}
        </NavLink>

        {/* Quick Links */}
        {!collapsed && (
          <div className="flex items-center justify-around mt-3 pt-3 border-t border-glass-border">
            <NavLink
              to="/app/settings"
              className="p-2 rounded-lg text-muted hover:text-off-white hover:bg-glass-white/50 transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </NavLink>
            <NavLink
              to="/app/achievements"
              className="p-2 rounded-lg text-muted hover:text-off-white hover:bg-glass-white/50 transition-colors"
              title="Achievements"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </NavLink>
            <button
              className="p-2 rounded-lg text-muted hover:text-off-white hover:bg-glass-white/50 transition-colors"
              title="Help"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        )}

        {/* Collapsed Quick Links */}
        {collapsed && (
          <div className="flex flex-col items-center gap-1 mt-3">
            <NavLink
              to="/app/settings"
              className="p-2 rounded-lg text-muted hover:text-off-white hover:bg-glass-white/50 transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SidebarWingNav;
