// ============================================
// PARANOIA MODE LAYOUT
// Single-Column Crisis-Ready Layout
// ============================================

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Stores
import { useCrisisStore } from '@/store/crisis.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface ParanoiaModeLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ParanoiaModeLayout: React.FC<ParanoiaModeLayoutProps> = ({
  children,
  className,
}) => {
  const { paranoiaMode, deactivateParanoiaMode, marketRegime, alerts } = useCrisisStore();
  const { playSound } = useSoundEffects();

  // Play crisis alert on activation
  useEffect(() => {
    if (paranoiaMode) {
      playSound('crisis_alert');
    }
  }, [paranoiaMode, playSound]);

  if (!paranoiaMode) {
    return <>{children}</>;
  }

  const criticalAlerts = alerts.filter((a) => a.type === 'critical' || a.type === 'emergency');

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-b from-crisis-red/5 to-rich-black',
      className
    )}>
      {/* Crisis Header */}
      <div className="sticky top-0 z-50 bg-crisis-red/10 backdrop-blur-md border-b border-crisis-red/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🚨</span>
            <div>
              <h1 className="font-bold text-off-white">Paranoia Mode Active</h1>
              <p className="text-xs text-crisis-red">Crisis operations engaged</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              playSound('toggle');
              deactivateParanoiaMode();
            }}
            className="border-crisis-red/30 text-crisis-red hover:bg-crisis-red/10"
          >
            Exit Paranoia Mode
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <GlassPanel
            variant="crisis"
            padding="md"
            className="border-crisis-red/50 bg-crisis-red/10"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-off-white mb-1">
                  {criticalAlerts[0].title}
                </h3>
                <p className="text-sm text-muted">{criticalAlerts[0].message}</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Harvey Crisis Guidance */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <GlassPanel variant="default" padding="lg">
          <div className="flex items-start gap-4">
            <PersonaAvatar persona="harvey" size="lg" />
            <div>
              <Badge variant="premium" className="mb-2">STRATEGIC ADVISOR</Badge>
              <p className="text-off-white italic mb-2">
                "{QUOTES.HARVEY.CRISIS_START}"
              </p>
              <p className="text-xs text-precision-teal">— Harvey Specter</p>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Regime Status */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <GlassPanel variant="default" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {marketRegime === 'crisis' ? '🔥' :
                  marketRegime === 'volatile' ? '⚡' : '🌤️'}
              </span>
              <div>
                <p className="text-sm font-medium text-off-white">
                  Market Regime: <span className="text-crisis-red uppercase">{marketRegime}</span>
                </p>
                <p className="text-xs text-muted">Last updated: just now</p>
              </div>
            </div>
            <Badge variant={marketRegime === 'crisis' ? 'error' : 'warning'}>
              {marketRegime.toUpperCase()}
            </Badge>
          </div>
        </GlassPanel>
      </div>

      {/* Single Column Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {children}
      </div>

      {/* Quick Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-glass-border safe-area-inset">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="default" size="sm" className="w-full" leftIcon={<span>📊</span>}>
            View Positions
          </Button>
          <Button variant="outline" size="sm" className="w-full" leftIcon={<span>🎯</span>}>
            Risk Analysis
          </Button>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={deactivateParanoiaMode}
          >
            Deactivate Crisis Protocol
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CRISIS CARD COMPONENT
// ============================================

interface CrisisCardProps {
  title: string;
  value: string;
  icon: string;
  variant?: 'normal' | 'warning' | 'critical';
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export const CrisisCard: React.FC<CrisisCardProps> = ({
  title,
  value,
  icon,
  variant = 'normal',
  trend,
  className,
}) => {
  const variantStyles = {
    normal: 'border-glass-border',
    warning: 'border-achievement-gold/50 bg-achievement-gold/5',
    critical: 'border-crisis-red/50 bg-crisis-red/5',
  };

  return (
    <GlassPanel
      variant="default"
      padding="md"
      className={cn(variantStyles[variant], className)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted uppercase tracking-wide">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-off-white">{value}</span>
        {trend && (
          <span className={cn(
            'text-sm font-medium',
            trend.isPositive ? 'text-spring-green' : 'text-crisis-red'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </GlassPanel>
  );
};

export default ParanoiaModeLayout;
