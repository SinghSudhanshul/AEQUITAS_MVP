// ============================================
// METRIC CARD COMPONENT
// Data Display for Institutional Trading
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { GlassPanel } from './GlassPanel';

// ============================================
// VARIANTS
// ============================================

const metricCardVariants = cva(
  'relative overflow-hidden',
  {
    variants: {
      size: {
        sm: 'min-w-[120px]',
        default: 'min-w-[160px]',
        lg: 'min-w-[200px]',
        xl: 'min-w-[280px]',
        full: 'w-full',
      },

      trend: {
        up: '',
        down: '',
        neutral: '',
        none: '',
      },
    },
    defaultVariants: {
      size: 'default',
      trend: 'none',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface MetricCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
  VariantProps<typeof metricCardVariants> {
  /** Metric title/label */
  title: React.ReactNode;
  /** Main value to display */
  value: React.ReactNode;
  /** Previous value for comparison */
  previousValue?: number | string;
  /** Unit suffix (e.g., %, $, bps) */
  unit?: string;
  /** Unit prefix (e.g., $) */
  prefix?: string;
  /** Change value */
  change?: number;
  /** Change type override */
  changeType?: 'positive' | 'negative' | 'neutral';
  /** Subtitle or description */
  subtitle?: React.ReactNode;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Sparkline data */
  sparklineData?: number[];
  /** Time period */
  period?: string;
  /** Accent color override */
  accentColor?: 'teal' | 'gold' | 'red' | 'blue';
  /** Show trend indicator */
  showTrend?: boolean;
  /** Interactive click handler */
  onClick?: () => void;
}

// ============================================
// TREND ARROW COMPONENT
// ============================================

interface TrendArrowProps {
  direction: 'up' | 'down' | 'neutral';
  className?: string;
}

const TrendArrow: React.FC<TrendArrowProps> = ({ direction, className }) => {
  if (direction === 'neutral') {
    return (
      <svg className={cn('w-4 h-4 text-muted', className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  }

  return (
    <svg
      className={cn(
        'w-4 h-4',
        direction === 'up' ? 'text-precision-teal' : 'text-crisis-red',
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {direction === 'up' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      )}
    </svg>
  );
};

// ============================================
// SPARKLINE COMPONENT
// ============================================

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 80,
  height = 24,
  color = '#0D9488',
  className,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Gradient area path
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill="url(#sparklineGradient)"
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="2"
        fill={color}
      />
    </svg>
  );
};

// ============================================
// LOADING SKELETON
// ============================================

export const MetricCardSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-3 w-20 bg-glass-white rounded" />
    <div className="h-8 w-28 bg-glass-white rounded" />
    <div className="h-3 w-16 bg-glass-white rounded" />
  </div>
);

// ============================================
// COMPONENT
// ============================================

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      size,
      trend,
      title,
      value,
      previousValue,
      unit,
      prefix,
      change,
      changeType,
      subtitle,
      icon,
      loading,
      sparklineData,
      period,
      accentColor = 'teal',
      showTrend = true,
      onClick,
      ...props
    },
    ref
  ) => {
    // Determine trend direction
    const getTrend = (): 'up' | 'down' | 'neutral' => {
      if (trend && trend !== 'none') return trend;
      if (change === undefined) return 'neutral';
      if (change > 0) return 'up';
      if (change < 0) return 'down';
      return 'neutral';
    };

    const trendDirection = getTrend();

    // Determine change color
    const getChangeColor = () => {
      const type = changeType || (
        change === undefined ? 'neutral' :
          change > 0 ? 'positive' :
            change < 0 ? 'negative' : 'neutral'
      );

      return {
        positive: 'text-precision-teal',
        negative: 'text-crisis-red',
        neutral: 'text-muted',
      }[type];
    };

    // Accent color mapping
    const accentColorMap = {
      teal: 'border-l-precision-teal',
      gold: 'border-l-achievement-gold',
      red: 'border-l-crisis-red',
      blue: 'border-l-institutional-blue',
    };

    const sparklineColorMap = {
      teal: '#0D9488',
      gold: '#D4AF37',
      red: '#C0392B',
      blue: '#1E3A5F',
    };

    return (
      <GlassPanel
        ref={ref}
        variant="default"
        padding="default"
        hover={onClick ? 'glow' : 'none'}
        className={cn(
          metricCardVariants({ size }),
          'border-l-4',
          accentColorMap[accentColor],
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <MetricCardSkeleton />
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                {title}
              </span>
              {icon && (
                <span className="text-muted">{icon}</span>
              )}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              {prefix && (
                <span className="text-lg font-semibold text-muted">
                  {prefix}
                </span>
              )}
              <span className="text-2xl font-bold text-off-white tracking-tight">
                {value}
              </span>
              {unit && (
                <span className="text-sm font-medium text-muted">
                  {unit}
                </span>
              )}
            </div>

            {/* Change / Sparkline Row */}
            <div className="flex items-center justify-between">
              {/* Change Indicator */}
              {change !== undefined && showTrend && (
                <div className={cn('flex items-center gap-1 text-xs font-medium', getChangeColor())}>
                  <TrendArrow direction={trendDirection} className="w-3 h-3" />
                  <span>
                    {change > 0 ? '+' : ''}{change.toFixed(2)}{unit || '%'}
                  </span>
                  {period && (
                    <span className="text-muted font-normal ml-1">{period}</span>
                  )}
                </div>
              )}

              {/* Sparkline */}
              {sparklineData && sparklineData.length > 0 && (
                <Sparkline
                  data={sparklineData}
                  color={sparklineColorMap[accentColor]}
                />
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-muted mt-1">
                {subtitle}
              </p>
            )}

            {/* Previous Value */}
            {previousValue !== undefined && (
              <p className="text-xs text-muted">
                Previous: {prefix}{previousValue}{unit}
              </p>
            )}
          </div>
        )}
      </GlassPanel>
    );
  }
);

MetricCard.displayName = 'MetricCard';

// ============================================
// METRIC CARD GROUP
// ============================================

interface MetricCardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const MetricCardGroup: React.FC<MetricCardGroupProps> = ({
  columns = 4,
  className,
  children,
  ...props
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div
      className={cn('grid gap-4', gridCols[columns], className)}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================
// PRESET METRIC CARDS
// ============================================

export const PriceMetricCard: React.FC<Omit<MetricCardProps, 'prefix'>> = (props) => (
  <MetricCard prefix="$" accentColor="gold" {...props} />
);

export const PercentMetricCard: React.FC<Omit<MetricCardProps, 'unit'>> = (props) => (
  <MetricCard unit="%" accentColor="teal" {...props} />
);

export const BasisPointsMetricCard: React.FC<Omit<MetricCardProps, 'unit'>> = (props) => (
  <MetricCard unit=" bps" accentColor="blue" {...props} />
);

// ============================================
// EXPORTS
// ============================================

export { Sparkline };
export default MetricCard;
