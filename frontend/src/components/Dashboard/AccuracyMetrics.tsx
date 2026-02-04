// ============================================
// ACCURACY METRICS COMPONENT
// Performance Tracking Display
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MetricData {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface AccuracyMetricsProps {
  metrics?: MetricData[];
}

const defaultMetrics: MetricData[] = [
  { label: 'Daily Accuracy', value: 94.2, target: 90, unit: '%', trend: 'up' },
  { label: 'MAPE', value: 3.8, target: 5, unit: '%', trend: 'down' },
  { label: 'Direction Accuracy', value: 97.1, target: 95, unit: '%', trend: 'stable' },
  { label: 'Crisis Accuracy', value: 89.5, target: 85, unit: '%', trend: 'up' },
];

export const AccuracyMetrics: React.FC<AccuracyMetricsProps> = ({ metrics = defaultMetrics }) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isLowerBetter: boolean = false) => {
    if (trend === 'stable') return 'text-muted';
    const isGood = isLowerBetter ? trend === 'down' : trend === 'up';
    return isGood ? 'text-steady-green' : 'text-elevated-amber';
  };

  const getPerformanceColor = (value: number, target: number, isLowerBetter: boolean = false) => {
    const isMetTarget = isLowerBetter ? value <= target : value >= target;
    return isMetTarget ? 'text-steady-green' : 'text-elevated-amber';
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>📊</span>
          Accuracy Metrics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {metrics.map((metric, index) => {
          const isLowerBetter = metric.label === 'MAPE';
          const performanceColor = getPerformanceColor(metric.value, metric.target, isLowerBetter);
          const trendColor = getTrendColor(metric.trend, isLowerBetter);

          // Calculate progress for visual bar
          const progress = isLowerBetter
            ? Math.max(0, Math.min(100, ((metric.target * 2 - metric.value) / (metric.target * 2)) * 100))
            : Math.min(100, (metric.value / metric.target) * 100);

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${performanceColor}`}>
                    {metric.value}{metric.unit}
                  </span>
                  <span className={`text-sm ${trendColor}`}>
                    {getTrendIcon(metric.trend)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-gradient-to-r from-steady-green to-precision-teal' : 'bg-gradient-to-r from-institutional-blue to-precision-teal'
                    }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted">
                <span>Target: {metric.target}{metric.unit}</span>
                {progress >= 100 && <span className="text-steady-green">✓ Achieved</span>}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="pt-4 border-t border-glass-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Overall Performance</span>
            <span className="font-semibold text-steady-green">Excellent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccuracyMetrics;
