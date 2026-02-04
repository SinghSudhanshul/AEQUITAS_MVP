// ============================================
// TOP NAV COMPONENT
// Global Navigation Bar
// ============================================

import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Components
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { RegimeDetectionBadge } from '@/components/wings/lobby/RegimeDetectionBadge';
// import { Button } from '@/components/ui/button';

// Stores
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamification.store';
import { useCrisisStore } from '@/store/crisis.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface TopNavProps {
  className?: string;
  onMenuToggle?: () => void;
  onCommandPalette?: () => void;
  showSidebarToggle?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const TopNav: React.FC<TopNavProps> = ({
  className,
  onMenuToggle,
  showSidebarToggle = true,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { xp } = useGamificationStore();
  const { paranoiaMode, toggleParanoiaMode } = useCrisisStore();
  const { playSound } = useSoundEffects();

  const handleLogout = useCallback(() => {
    playSound('briefcase_close');
    logout();
    navigate('/login');
  }, [logout, navigate, playSound]);

  const handleCommandPalette = useCallback(() => {
    playSound('click');
    // Trigger Cmd+K
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    window.dispatchEvent(event);
  }, [playSound]);

  return (
    <header
      className={cn(
        'h-16 bg-surface/80 backdrop-blur-md border-b border-glass-border',
        'flex items-center justify-between px-4 lg:px-6',
        'sticky top-0 z-40',
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        {showSidebarToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-glass-white rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-off-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Logo (Mobile) */}
        <Link to="/app" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center">
            <span className="font-bold text-sm text-rich-black">A</span>
          </div>
        </Link>

        {/* Command Palette Trigger */}
        <button
          onClick={handleCommandPalette}
          className={cn(
            'hidden lg:flex items-center gap-2 px-3 py-1.5',
            'bg-glass-white border border-glass-border rounded-lg',
            'text-sm text-muted hover:text-off-white hover:border-precision-teal/30',
            'transition-all'
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
          <span className="ml-4 text-xs bg-charcoal px-1.5 py-0.5 rounded">⌘K</span>
        </button>
      </div>

      {/* Center Section - Regime Badge */}
      <div className="hidden lg:flex items-center">
        <RegimeDetectionBadge size="default" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-off-white">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-muted">
              {user?.rank || 'Associate'}
            </p>
          </div>
          <PersonaAvatar persona="system" size="sm" />
        </div>

        {/* Paranoia Mode Toggle */}
        <button
          onClick={() => {
            playSound('toggle');
            toggleParanoiaMode();
          }}
          className={cn(
            'p-2 rounded-lg transition-all',
            paranoiaMode
              ? 'bg-crisis-red/20 text-crisis-red'
              : 'bg-glass-white text-muted hover:text-off-white'
          )}
          title={paranoiaMode ? 'Exit Paranoia Mode' : 'Enter Paranoia Mode'}
        >
          <span className="text-lg">{paranoiaMode ? '🚨' : '🛡️'}</span>
        </button>

        {/* Notifications */}
        <button className="p-2 bg-glass-white rounded-lg text-muted hover:text-off-white transition-colors relative">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-crisis-red rounded-full text-[10px] text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* XP Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-glass-white rounded-lg">
          <span className="text-achievement-gold">⭐</span>
          <span className="text-sm font-medium text-off-white">{xp.toLocaleString()}</span>
        </div>

        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 hover:bg-glass-white rounded-lg transition-colors">
            <PersonaAvatar persona="system" size="sm" />
            <span className="hidden lg:block text-sm font-medium text-off-white">
              {user?.firstName || 'User'}
            </span>
            <svg className="hidden lg:block w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-surface border border-glass-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <Link
              to="/app/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-off-white hover:bg-glass-white"
            >
              <span>⚙️</span> Settings
            </Link>
            <Link
              to="/app/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-off-white hover:bg-glass-white"
            >
              <span>👤</span> Profile
            </Link>
            <hr className="my-2 border-glass-border" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-crisis-red hover:bg-crisis-red/10"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
