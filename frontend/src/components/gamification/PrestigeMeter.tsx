// ============================================
// PRESTIGE METER COMPONENT
// Performance Prestige Visualization
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface PrestigeMeterProps {
  label: string;
  value: number;
  maxValue?: number;
  targetValue?: number;
  icon?: string;
  color?: 'teal' | 'gold' | 'green' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showTarget?: boolean;
  animated?: boolean;
  className?: string;
}

export const PrestigeMeter: React.FC<PrestigeMeterProps> = ({
  label,
  value,
  maxValue = 100,
  targetValue,
  icon,
  color = 'teal',
  size = 'md',
  showPercentage = true,
  showTarget = true,
  animated = true,
  className,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const isAboveTarget = targetValue !== undefined && value >= targetValue;

  const colorClasses = {
    teal: {
      bg: 'bg-precision-teal',
      text: 'text-precision-teal',
      glow: 'shadow-glow-teal',
    },
    gold: {
      bg: 'bg-achievement-gold',
      text: 'text-achievement-gold',
      glow: 'shadow-[0_0_20px_rgba(212,175,55,0.3)]',
    },
    green: {
      bg: 'bg-steady-green',
      text: 'text-steady-green',
      glow: 'shadow-[0_0_20px_rgba(39,174,96,0.3)]',
    },
    blue: {
      bg: 'bg-institutional-blue',
      text: 'text-institutional-blue',
      glow: 'shadow-glow-blue',
    },
  };

  const sizeClasses = {
    sm: { meter: 'h-2', text: 'text-xs', value: 'text-lg' },
    md: { meter: 'h-3', text: 'text-sm', value: 'text-2xl' },
    lg: { meter: 'h-4', text: 'text-base', value: 'text-3xl' },
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className={sizeClasses[size].text}>{icon}</span>}
          <span className={cn('font-medium text-muted', sizeClasses[size].text)}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-bold',
            sizeClasses[size].value,
            isAboveTarget ? colorClasses[color].text : 'text-off-white'
          )}>
            {value.toFixed(1)}
            {showPercentage && <span className="text-muted">%</span>}
          </span>
          {showTarget && targetValue !== undefined && (
            <span className={cn('text-muted', sizeClasses[size].text)}>
              / {targetValue}%
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={cn(
        'relative w-full bg-charcoal rounded-full overflow-hidden border border-glass-border',
        sizeClasses[size].meter
      )}>
        {/* Target Line */}
        {targetValue !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-off-white/50 z-10"
            style={{ left: `${(targetValue / maxValue) * 100}%` }}
          />
        )}

        {/* Progress Fill */}
        <div
          className={cn(
            'h-full rounded-full',
            colorClasses[color].bg,
            isAboveTarget && colorClasses[color].glow,
            animated && 'transition-all duration-1000 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* Animated shine */}
        {animated && percentage > 0 && (
          <div
            className="absolute top-0 h-full w-4 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"
            style={{ animationDuration: '2s' }}
          />
        )}
      </div>

      {/* Status Indicator */}
      {targetValue !== undefined && (
        <div className={cn('flex items-center gap-1', sizeClasses[size].text)}>
          {isAboveTarget ? (
            <>
              <span className="text-steady-green">✓</span>
              <span className="text-steady-green">Target exceeded</span>
              <span className="text-muted">
                (+{(value - targetValue).toFixed(1)}%)
              </span>
            </>
          ) : (
            <>
              <span className="text-elevated-amber">○</span>
              <span className="text-muted">
                {(targetValue - value).toFixed(1)}% to target
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Multiple Prestige Meters
export const PrestigeMetersGroup: React.FC<{
  meters: Array<Omit<PrestigeMeterProps, 'size'>>;
  size?: 'sm' | 'md' | 'lg';
}> = ({ meters, size = 'md' }) => {
  return (
    <div className="grid gap-6">
      {meters.map((meter, index) => (
        <PrestigeMeter key={index} {...meter} size={size} />
      ))}
    </div>
  );
};

export default PrestigeMeter;
