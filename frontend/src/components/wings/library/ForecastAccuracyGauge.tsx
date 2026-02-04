'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { ForecastAccuracyGauge as GaugeType } from '@/types/wings/library';

interface ForecastAccuracyGaugeProps {
  accuracy?: GaugeType;
  showHistory?: boolean;
  className?: string;
}

const mockAccuracy: GaugeType = {
  overall: 87.5,
  p5Accuracy: 92.3,
  p50Accuracy: 88.1,
  p95Accuracy: 82.4,
  trend: 'improving',
  historyDays: 30,
};

export const ForecastAccuracyGauge = React.memo(function ForecastAccuracyGauge({ accuracy = mockAccuracy, showHistory = true, className }: ForecastAccuracyGaugeProps) {
  const getAccuracyColor = (value: number) => {
    if (value >= 90) return { text: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (value >= 80) return { text: 'text-amber-400', bg: 'bg-amber-500' };
    return { text: 'text-red-400', bg: 'bg-red-500' };
  };

  const trendIcons = {
    improving: <TrendingUp className="h-4 w-4 text-emerald-400" />,
    declining: <TrendingDown className="h-4 w-4 text-red-400" />,
    stable: <Minus className="h-4 w-4 text-slate-400" />,
  };

  const overallColor = getAccuracyColor(accuracy.overall);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-white">Forecast Accuracy</h3>
            <p className="text-sm text-slate-400">Last {accuracy.historyDays} days</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {trendIcons[accuracy.trend]}
          <span className="text-sm text-slate-400 capitalize">{accuracy.trend}</span>
        </div>
      </div>

      {/* Main gauge */}
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-64 h-40">
          {/* Background arc */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="text-white/10" />
          {/* Progress arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#accuracyGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251"
            initial={{ strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 251 - (accuracy.overall / 100) * 251 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('text-4xl font-bold', overallColor.text)}>
            {accuracy.overall.toFixed(1)}%
          </motion.span>
          <p className="text-sm text-slate-400">Overall</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'P5', value: accuracy.p5Accuracy },
          { label: 'P50', value: accuracy.p50Accuracy },
          { label: 'P95', value: accuracy.p95Accuracy },
        ].map(item => {
          const color = getAccuracyColor(item.value);
          return (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
              <span className="text-xs text-slate-400">{item.label} Accuracy</span>
              <p className={cn('mt-1 text-xl font-bold', color.text)}>{item.value.toFixed(1)}%</p>
            </div>
          );
        })}
      </div>

      {accuracy.overall < 85 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertCircle className="h-5 w-5 text-amber-400" />
          <p className="text-sm text-amber-400">Accuracy below 85% threshold. Consider recalibrating models.</p>
        </div>
      )}
    </div>
  );
});

export default ForecastAccuracyGauge;
