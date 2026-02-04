// ============================================
// REGIME INDICATOR COMPONENT
// Market Regime Status Display
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface RegimeIndicatorProps {
  regime: 'steady' | 'elevated' | 'crisis';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const regimeConfig = {
  steady: {
    label: 'Steady State',
    color: 'bg-steady-green',
    textColor: 'text-steady-green',
    borderColor: 'border-steady-green/30',
    bgColor: 'bg-steady-green/10',
    pulseClass: 'animate-pulse-steady',
    description: 'Normal market conditions',
  },
  elevated: {
    label: 'Elevated',
    color: 'bg-elevated-amber',
    textColor: 'text-elevated-amber',
    borderColor: 'border-elevated-amber/30',
    bgColor: 'bg-elevated-amber/10',
    pulseClass: 'animate-pulse-elevated',
    description: 'Heightened market volatility',
  },
  crisis: {
    label: 'Crisis Mode',
    color: 'bg-crisis-red',
    textColor: 'text-crisis-red',
    borderColor: 'border-crisis-red/30',
    bgColor: 'bg-crisis-red/10',
    pulseClass: 'animate-pulse-crisis',
    description: 'Critical market conditions',
  },
};

const sizeConfig = {
  sm: {
    dot: 'w-2 h-2',
    text: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    dot: 'w-3 h-3',
    text: 'text-sm',
    padding: 'px-3 py-1.5',
  },
  lg: {
    dot: 'w-4 h-4',
    text: 'text-base',
    padding: 'px-4 py-2',
  },
};

export const RegimeIndicator: React.FC<RegimeIndicatorProps> = ({
  regime,
  showLabel = true,
  size = 'md',
}) => {
  const config = regimeConfig[regime];
  const sizes = sizeConfig[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border backdrop-blur-sm',
        config.borderColor,
        config.bgColor,
        sizes.padding
      )}
      title={config.description}
    >
      {/* Animated Dot */}
      <span
        className={cn(
          'rounded-full',
          config.color,
          config.pulseClass,
          sizes.dot,
          'shadow-lg'
        )}
        style={{
          boxShadow: regime === 'crisis'
            ? '0 0 12px var(--color-crisis-red)'
            : regime === 'elevated'
              ? '0 0 10px var(--color-elevated-amber)'
              : '0 0 8px var(--color-steady-green)',
        }}
      />

      {/* Label */}
      {showLabel && (
        <span className={cn('font-semibold uppercase tracking-wide', config.textColor, sizes.text)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default RegimeIndicator;
