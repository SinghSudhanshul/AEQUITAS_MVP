// ============================================
// REGIME BADGE COMPONENT
// Market Regime Indicator (Steady/Elevated/Crisis)
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

type RegimeType = 'steady' | 'elevated' | 'crisis';

interface RegimeBadgeProps {
  regime: RegimeType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const regimeConfig = {
  steady: {
    label: 'STEADY',
    color: '#27AE60',
    bgClass: 'bg-steady-green/20',
    textClass: 'text-steady-green',
    dotClass: 'regime-dot--steady',
  },
  elevated: {
    label: 'ELEVATED',
    color: '#F39C12',
    bgClass: 'bg-elevated-amber/20',
    textClass: 'text-elevated-amber',
    dotClass: 'regime-dot--elevated',
  },
  crisis: {
    label: 'CRISIS',
    color: '#C0392B',
    bgClass: 'bg-crisis-red/20',
    textClass: 'text-crisis-red',
    dotClass: 'regime-dot--crisis',
  },
};

export const RegimeBadge: React.FC<RegimeBadgeProps> = ({
  regime,
  showLabel = true,
  size = 'md',
  className,
}) => {
  const config = regimeConfig[regime];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-caption',
    lg: 'px-4 py-1.5 text-body',
  };

  return (
    <div
      className={cn(
        'regime-badge',
        `regime-badge--${regime}`,
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('regime-dot', config.dotClass)} />
      {showLabel && (
        <span className="font-bold tracking-wide">{config.label}</span>
      )}
    </div>
  );
};

// Simple dot-only version for compact displays
export const RegimeDot: React.FC<{ regime: RegimeType; className?: string }> = ({
  regime,
  className
}) => {
  const config = regimeConfig[regime];

  return (
    <span
      className={cn('regime-dot', config.dotClass, className)}
      title={config.label}
    />
  );
};
