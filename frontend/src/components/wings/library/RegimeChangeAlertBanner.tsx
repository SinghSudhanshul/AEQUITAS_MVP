'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RegimeChangeAlert } from '@/types/wings/library';

interface RegimeChangeAlertBannerProps {
  alert?: RegimeChangeAlert;
  onDismiss?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

const regimeConfig = {
  steady: { color: 'border-emerald-500 bg-emerald-500/10', icon: TrendingUp, iconColor: 'text-emerald-400', label: 'Steady' },
  elevated: { color: 'border-amber-500 bg-amber-500/10', icon: AlertTriangle, iconColor: 'text-amber-400', label: 'Elevated' },
  crisis: { color: 'border-red-500 bg-red-500/10', icon: TrendingDown, iconColor: 'text-red-400', label: 'Crisis' },
};

const mockAlert: RegimeChangeAlert = {
  id: 'regime-1',
  timestamp: new Date().toISOString(),
  fromRegime: 'steady',
  toRegime: 'elevated',
  probability: 0.78,
  triggers: ['VIX spike above 25', 'Sector correlation increase', 'Volume anomaly detected'],
  impact: 'medium',
  recommendation: 'Consider reducing position sizes and increasing hedge ratios.',
};

export const RegimeChangeAlertBanner = React.memo(function RegimeChangeAlertBanner({ alert = mockAlert, onDismiss, onViewDetails, className }: RegimeChangeAlertBannerProps) {
  const fromConfig = regimeConfig[alert.fromRegime];
  const toConfig = regimeConfig[alert.toRegime];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-xl border-2',
        toConfig.color,
        className
      )}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className={cn('absolute inset-0', alert.toRegime === 'crisis' ? 'bg-red-500' : 'bg-amber-500')}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className={cn('flex h-12 w-12 items-center justify-center rounded-full', toConfig.color.replace('bg-', 'bg-').replace('/10', '/20'))}
            >
              <toConfig.icon className={cn('h-6 w-6', toConfig.iconColor)} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-400">AI REGIME DETECTION</span>
              </div>
              <h3 className="mt-1 text-lg font-bold text-white">
                Regime Change Detected
              </h3>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className={cn('rounded-full px-2 py-0.5 font-medium', fromConfig.color.replace('border-', 'bg-').replace(/bg-.*?\/10/, 'bg-white/10'))}>
                  {fromConfig.label}
                </span>
                <span className="text-slate-400">→</span>
                <span className={cn('rounded-full px-2 py-0.5 font-medium', toConfig.color)}>{toConfig.label}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300">{(alert.probability * 100).toFixed(0)}% confidence</span>
              </div>
            </div>
          </div>
          <button onClick={onDismiss} className="text-slate-400 hover:text-white">×</button>
        </div>

        {/* Triggers */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {alert.triggers.map((trigger, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <BarChart3 className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-300">{trigger}</span>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="mt-4 rounded-lg bg-white/5 p-3">
          <p className="text-sm text-slate-300">
            <span className="font-medium text-white">Recommendation: </span>
            {alert.recommendation}
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={onViewDetails} className="flex-1 rounded-lg bg-white text-slate-900 py-2 font-medium hover:bg-slate-100 transition-colors">
            View Details
          </button>
          <button onClick={onDismiss} className="rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/5 transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default RegimeChangeAlertBanner;
