'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ============================================
// PROGRESS BAR VARIANTS
// ============================================

const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-white/10',
        prestige: 'bg-gradient-to-r from-navy-900/80 to-navy-800/60 border border-amber-500/20',
        xp: 'bg-navy-900/50 border border-white/10',
        health: 'bg-navy-900/50',
        loading: 'bg-white/5',
      },
      size: {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const indicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-white',
        prestige: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600',
        xp: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600',
        health: 'bg-gradient-to-r from-green-500 to-green-400',
        loading: 'bg-gradient-to-r from-slate-500 via-white to-slate-500 animate-shimmer bg-[length:200%_100%]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// ============================================
// BASIC PROGRESS COMPONENT
// ============================================

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  VariantProps<typeof progressVariants> {
  indicatorClassName?: string;
  showValue?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, indicatorClassName, showValue, animated = true, ...props }, ref) => {
  // Animated value for smooth transitions
  const springValue = useSpring(value || 0, { stiffness: 100, damping: 20 });
  const displayValue = animated ? springValue : { get: () => value || 0 };

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ variant, size }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(indicatorVariants({ variant }), indicatorClassName)}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 text-xs text-slate-400">
          {Math.round(value || 0)}%
        </span>
      )}
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

// ============================================
// PRESTIGE METER (CIRCULAR GAUGE)
// ============================================

interface PrestigeMeterProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  label?: string;
  sublabel?: string;
  glowColor?: string;
  animated?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { size: 80, strokeWidth: 6, fontSize: 'text-lg' },
  md: { size: 120, strokeWidth: 8, fontSize: 'text-2xl' },
  lg: { size: 160, strokeWidth: 10, fontSize: 'text-3xl' },
  xl: { size: 200, strokeWidth: 12, fontSize: 'text-4xl' },
};

const PrestigeMeter = React.memo(function PrestigeMeter({
  value,
  maxValue = 100,
  size = 'md',
  showLabel = true,
  label,
  sublabel,
  glowColor = '#f59e0b',
  animated = true,
  className,
}: PrestigeMeterProps) {
  const config = sizeConfig[size];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const normalizedValue = Math.min(Math.max(value / maxValue, 0), 1);
  const springProgress = useSpring(normalizedValue * 100, { stiffness: 50, damping: 15 });
  const animatedOffset = useTransform(springProgress, (v) =>
    circumference - (v / 100) * circumference
  );

  const percentage = Math.round(normalizedValue * 100);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: glowColor }}
      />

      <svg
        width={config.size}
        height={config.size}
        className="rotate-[-90deg]"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-white/10"
        />

        {/* Progress circle */}
        <motion.circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#prestigeGradient)"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: animated ? animatedOffset : circumference - normalizedValue * circumference,
          }}
          className="drop-shadow-lg"
          filter="url(#glow)"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="prestigeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Center content */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn('font-bold text-white', config.fontSize)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {percentage}%
          </motion.span>
          {label && (
            <span className="text-xs font-medium text-slate-400">{label}</span>
          )}
          {sublabel && (
            <span className="text-xs text-slate-500">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================
// XP PROGRESS BAR
// ============================================

interface XPProgressBarProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
  rank?: string;
  animated?: boolean;
  showDetails?: boolean;
  className?: string;
}

const XPProgressBar = React.memo(function XPProgressBar({
  currentXP,
  xpToNextLevel,
  level,
  rank,
  animated = true,
  showDetails = true,
  className,
}: XPProgressBarProps) {
  const percentage = Math.min((currentXP / xpToNextLevel) * 100, 100);
  const springProgress = useSpring(percentage, { stiffness: 100, damping: 20 });

  return (
    <div className={cn('space-y-2', className)}>
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Level {level}</span>
            {rank && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                {rank}
              </span>
            )}
          </div>
          <span className="text-slate-400">
            {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </span>
        </div>
      )}

      <div className="relative h-3 overflow-hidden rounded-full bg-navy-900/50 border border-white/10">
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]" />

        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"
          style={{
            width: animated ? springProgress.get() + '%' : percentage + '%',
          }}
          initial={{ width: 0 }}
          animate={{ width: percentage + '%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/50 to-emerald-500/50 blur-sm" />

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>

        {/* Level markers */}
        <div className="absolute inset-0 flex">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// ============================================
// HEALTH BAR (FOR STATUS INDICATORS)
// ============================================

interface HealthBarProps {
  value: number;
  maxValue?: number;
  status?: 'healthy' | 'warning' | 'critical';
  label?: string;
  animated?: boolean;
  className?: string;
}

const statusColors = {
  healthy: 'from-green-500 to-green-400',
  warning: 'from-amber-500 to-amber-400',
  critical: 'from-red-500 to-red-400',
};

const HealthBar = React.memo(function HealthBar({
  value,
  maxValue = 100,
  status = 'healthy',
  label,
  animated = true,
  className,
}: HealthBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  // Auto-determine status if not provided
  const derivedStatus = status || (
    percentage >= 70 ? 'healthy' :
      percentage >= 30 ? 'warning' :
        'critical'
  );

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">{label}</span>
          <span className={cn(
            'font-medium',
            derivedStatus === 'healthy' && 'text-green-400',
            derivedStatus === 'warning' && 'text-amber-400',
            derivedStatus === 'critical' && 'text-red-400',
          )}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div className="relative h-2 overflow-hidden rounded-full bg-navy-900/50">
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r',
            statusColors[derivedStatus]
          )}
          initial={{ width: 0 }}
          animate={{ width: animated ? percentage + '%' : percentage + '%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Pulse effect for critical status */}
        {derivedStatus === 'critical' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/30"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
});

// ============================================
// LOADING PROGRESS (INDETERMINATE)
// ============================================

interface LoadingProgressProps {
  className?: string;
}

const LoadingProgress = React.memo(function LoadingProgress({
  className,
}: LoadingProgressProps) {
  return (
    <div className={cn('relative h-1 w-full overflow-hidden rounded-full bg-white/5', className)}>
      <motion.div
        className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{
          x: ['-100%', '400%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
});

// ============================================
// EXPORTS
// ============================================

export {
  Progress,
  PrestigeMeter,
  XPProgressBar,
  HealthBar,
  LoadingProgress,
  progressVariants,
};
