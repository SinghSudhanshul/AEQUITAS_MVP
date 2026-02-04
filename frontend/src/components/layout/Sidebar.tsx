// ============================================
// SIDEBAR COMPONENT
// Premium Side Navigation
// ============================================

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarLink {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  locked?: boolean;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const mainLinks: SidebarLink[] = [
  { href: '/app', label: 'Dashboard', icon: '📊' },
  { href: '/app/forecasts', label: 'Forecasts', icon: '📈' },
  { href: '/app/upload', label: 'Upload Data', icon: '📤' },
  { href: '/app/analytics', label: 'Analytics', icon: '📉' },
];

const wingLinks: SidebarLink[] = [
  { href: '/app/lobby', label: 'The Lobby', icon: '🏛️' },
  { href: '/app/bullpen', label: 'The Bullpen', icon: '💼' },
  { href: '/app/library', label: 'The Library', icon: '📚' },
  { href: '/app/treasury', label: 'The Treasury', icon: '💰' },
  { href: '/app/situation-room', label: 'Situation Room', icon: '🚨' },
  { href: '/app/war-room', label: 'The War Room', icon: '⚔️' },
  { href: '/app/donnas-desk', label: "Donna's Desk", icon: '👩‍💼', badge: 'AI' },
  { href: '/app/harveys-office', label: "Harvey's Office", icon: '👔', badge: 'Premium' },
  { href: '/app/vault', label: 'The Vault', icon: '🔐', locked: true },
];

const settingsLinks: SidebarLink[] = [
  { href: '/app/settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  const location = useLocation();

  const renderLink = (link: SidebarLink) => {
    const isActive = location.pathname === link.href ||
      (link.href !== '/app' && location.pathname.startsWith(link.href));

    return (
      <NavLink
        key={link.href}
        to={link.href}
        className={({ isActive: navActive }) => cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          'hover:bg-glass-white group',
          isActive || navActive
            ? 'bg-institutional-blue/20 border-l-3 border-institutional-blue text-off-white'
            : 'text-muted',
          link.locked && 'opacity-50 cursor-not-allowed'
        )}
        onClick={(e) => link.locked && e.preventDefault()}
      >
        <span className="text-lg group-hover:scale-110 transition-transform">
          {link.icon}
        </span>
        {!isCollapsed && (
          <>
            <span className="flex-1 font-medium">{link.label}</span>
            {link.badge && (
              <span className={cn(
                'text-xs px-2 py-0.5 rounded',
                link.badge === 'AI' && 'bg-precision-teal/20 text-precision-teal',
                link.badge === 'Premium' && 'bg-achievement-gold/20 text-achievement-gold',
              )}>
                {link.badge}
              </span>
            )}
            {link.locked && (
              <span className="text-xs">🔒</span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside className={cn(
      'h-screen bg-glass-sidebar border-r border-glass-border flex flex-col transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-glass-border px-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-institutional-blue to-precision-teal flex items-center justify-center">
          <span className="text-xl font-bold text-off-white">Æ</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 text-xl font-bold text-off-white">Aequitas</span>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <div className="space-y-1">
          {mainLinks.map(renderLink)}
        </div>

        {/* Wings Section */}
        <div className="pt-4 mt-4 border-t border-glass-border">
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
              Wings
            </div>
          )}
          <div className="space-y-1">
            {wingLinks.map(renderLink)}
          </div>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-glass-border">
        {settingsLinks.map(renderLink)}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="p-4 text-muted hover:text-off-white transition-colors border-t border-glass-border"
      >
        {isCollapsed ? '→' : '←'}
      </button>
    </aside>
  );
};

export default Sidebar;
