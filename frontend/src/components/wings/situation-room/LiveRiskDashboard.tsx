'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LiveRiskMetric } from '@/types/wings/situation-room';

interface LiveRiskDashboardProps {
  metrics?: LiveRiskMetric[];
  className?: string;
}

const mockMetrics: LiveRiskMetric[] = [
  { id: 'var', name: 'Value at Risk', value: 1250000, previousValue: 1180000, threshold: 1500000, unit: 'currency', status: 'warning' },
  { id: 'volatility', name: 'Portfolio Volatility', value: 18.5, previousValue: 16.2, threshold: 25, unit: 'percentage', status: 'elevated' },
  { id: 'leverage', name: 'Effective Leverage', value: 2.8, previousValue: 2.5, threshold: 4, unit: 'ratio', status: 'normal' },
  { id: 'liquidity', name: 'Liquidity Score', value: 72, previousValue: 78, threshold: 60, unit: 'score', status: 'normal' },
  { id: 'concentration', name: 'Concentration Risk', value: 35, previousValue: 32, threshold: 40, unit: 'percentage', status: 'warning' },
  { id: 'correlation', name: 'Correlation Factor', value: 0.68, previousValue: 0.55, threshold: 0.8, unit: 'ratio', status: 'elevated' },
];

const statusConfig = {
  normal: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  elevated: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  warning: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
};

const formatValue = (value: number, unit: string) => {
  switch (unit) {
    case 'currency': return `$${(value / 1000000).toFixed(2)}M`;
    case 'percentage': return `${value.toFixed(1)}%`;
    case 'ratio': return value.toFixed(2);
    case 'score': return value.toFixed(0);
    default: return value.toString();
  }
};

export const LiveRiskDashboard = React.memo(function LiveRiskDashboard({ metrics = mockMetrics, className }: LiveRiskDashboardProps) {
  const criticalCount = metrics.filter(m => m.status === 'critical' || m.status === 'warning').length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
            <Activity className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Live Risk Monitor</h3>
            <p className="text-sm text-slate-400">Real-time risk metrics</p>
          </div>
        </div>
        {criticalCount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2"
          >
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">{criticalCount} Alerts</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, idx) => {
          const status = statusConfig[metric.status];
          const change = metric.value - metric.previousValue;
          const changePercent = (change / metric.previousValue) * 100;
          const isNegativeChange = metric.id === 'liquidity' ? change < 0 : change > 0;
          const thresholdPercent = (metric.value / metric.threshold) * 100;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn('rounded-xl border p-4', status.border, status.bg)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm text-slate-400">{metric.name}</span>
                <Zap className={cn('h-4 w-4', status.color)} />
              </div>

              <p className={cn('text-2xl font-bold', status.color)}>
                {formatValue(metric.value, metric.unit)}
              </p>

              <div className="flex items-center gap-2 mt-2">
                {isNegativeChange ? (
                  <TrendingUp className="h-4 w-4 text-red-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-emerald-400" />
                )}
                <span className={cn('text-sm', isNegativeChange ? 'text-red-400' : 'text-emerald-400')}>
                  {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                </span>
              </div>

              {/* Threshold bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Threshold</span>
                  <span className="text-slate-400">{formatValue(metric.threshold, metric.unit)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={cn('h-full', thresholdPercent >= 100 ? 'bg-red-500' : thresholdPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500')}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(thresholdPercent, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default LiveRiskDashboard;
