// ============================================
// APP SHELL COMPONENT
// Main Layout with 9-Wing Sidebar
// ============================================

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WING_ORDER } from '@/config/wings';
// import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamification.store';
import { useCrisisStore } from '@/store/crisis.store';
import { TopNav } from '@/components/layout/TopNav';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ParanoiaModeLayout } from '@/components/layout/ParanoiaModeLayout';
import { SidebarWingNav } from '@/components/layout/SidebarWingNav';
import { CommandPalette, useCommandPalette } from '@/components/shared/CommandPalette';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

export interface AppShellProps {
  children?: React.ReactNode;
  className?: string;
}

// ============================================
// RESIZE HANDLE
// ============================================

interface ResizeHandleProps {
  onResize: (width: number) => void;
  minWidth: number;
  maxWidth: number;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize, minWidth, maxWidth }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(maxWidth, Math.max(minWidth, e.clientX));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize, minWidth, maxWidth]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        'absolute top-0 right-0 w-1 h-full cursor-ew-resize group',
        'hover:bg-precision-teal/30 transition-colors',
        isDragging && 'bg-precision-teal/50'
      )}
    >
      <div className={cn(
        'absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2',
        'w-3 h-8 bg-glass-border rounded-full',
        'opacity-0 group-hover:opacity-100 transition-opacity',
        isDragging && 'opacity-100 bg-precision-teal'
      )} />
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const AppShell: React.FC<AppShellProps> = ({ children, className }) => {
  // State
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Stores
  // const { user } = useAuthStore();
  const { rank } = useGamificationStore();
  const { paranoiaMode } = useCrisisStore();

  // Hooks
  const location = useLocation();
  const { playSound } = useSoundEffects();
  const commandPalette = useCommandPalette();

  // Derived state
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Get current wing from route
  const currentWing = WING_ORDER.find((wingId) =>
    location.pathname.includes(`/wings/${wingId}`)
  );

  // Handle sidebar toggle
  const handleSidebarToggle = useCallback(() => {
    playSound('click');
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, [isMobile, playSound]);

  // Handle sidebar resize
  const handleSidebarResize = useCallback((width: number) => {
    setSidebarWidth(width);
    if (width < 120) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // If in paranoia mode, render crisis layout
  if (paranoiaMode) {
    return (
      <>
        <ParanoiaModeLayout>
          {children || <Outlet />}
        </ParanoiaModeLayout>
        <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />
      </>
    );
  }

  return (
    <div className={cn('min-h-screen bg-rich-black', className)}>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-50',
          'bg-surface/95 backdrop-blur-md',
          'border-r border-glass-border',
          'transition-all duration-300 ease-in-out',
          // Desktop
          'hidden lg:block',
          sidebarCollapsed ? 'w-[72px]' : 'w-[var(--sidebar-width)]',
          // Mobile
          mobileSidebarOpen && 'block w-[280px]',
          !mobileSidebarOpen && 'lg:block'
        )}
        style={{
          '--sidebar-width': `${sidebarWidth}px`,
        } as React.CSSProperties}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-glass-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚖️</span>
              <span className="font-bold text-off-white">Aequitas</span>
            </div>
          )}

          {sidebarCollapsed && (
            <span className="text-2xl mx-auto">⚖️</span>
          )}

          <button
            onClick={handleSidebarToggle}
            className={cn(
              'p-1.5 rounded-lg text-muted hover:text-off-white hover:bg-glass-white transition-colors',
              sidebarCollapsed && 'mx-auto'
            )}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {sidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Wing Navigation */}
        <SidebarWingNav
          collapsed={sidebarCollapsed}
          currentWing={currentWing}
          userRank={rank}
        />

        {/* Resize Handle (Desktop only) */}
        {!sidebarCollapsed && (
          <ResizeHandle
            onResize={handleSidebarResize}
            minWidth={72}
            maxWidth={400}
          />
        )}
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'min-h-screen',
          'transition-all duration-300 ease-in-out',
          // Desktop margin
          'lg:ml-[var(--sidebar-width)]',
          sidebarCollapsed && 'lg:ml-[72px]'
        )}
        style={{
          '--sidebar-width': `${sidebarWidth}px`,
        } as React.CSSProperties}
      >
        {/* Top Navigation */}
        <TopNav
          onMenuToggle={handleSidebarToggle}
          onCommandPalette={commandPalette.open}
        />

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          {children || <Outlet />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Command Palette */}
      <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />
    </div>
  );
};

// ============================================
// SIDEBAR WING NAV
// ============================================

SidebarWingNav.displayName = 'SidebarWingNav';

export default AppShell;
