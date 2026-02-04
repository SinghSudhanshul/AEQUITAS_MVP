'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Shield, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { MarginCallWarning } from '@/types/wings/treasury';

interface MarginCallWarningBannerProps {
  warning?: MarginCallWarning;
  onTakeAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const mockWarning: MarginCallWarning = {
  id: 'mc-1',
  broker: 'Goldman Sachs',
  account: 'Prime',
  currentMargin: 82,
  thresholdMargin: 85,
  projectedMargin: 89,
  timeToThreshold: '2h 15m',
  requiredAction: 'Reduce positions by $500K or add $200K collateral',
  severity: 'high',
};

const severityConfig = {
  low: { color: 'border-blue-500', bg: 'from-blue-950/90 to-blue-900/80', icon: 'text-blue-400' },
  medium: { color: 'border-amber-500', bg: 'from-amber-950/90 to-amber-900/80', icon: 'text-amber-400' },
  high: { color: 'border-red-500', bg: 'from-red-950/90 to-red-900/80', icon: 'text-red-400' },
};

export const MarginCallWarningBanner = React.memo(function MarginCallWarningBanner({ warning = mockWarning, onTakeAction, onDismiss, className }: MarginCallWarningBannerProps) {
  const severity = severityConfig[warning.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-xl border-2',
        severity.color,
        `bg-gradient-to-br ${severity.bg}`,
        className
      )}
    >
      {/* Animated warning bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

      <div className="p-6">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20"
          >
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium uppercase text-red-400">MARGIN WARNING</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{warning.timeToThreshold} to threshold</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{warning.broker} - {warning.account}</h3>

            {/* Margin progress */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Margin</span>
                <span className="font-medium text-white">{warning.currentMargin}%</span>
              </div>
              <div className="relative">
                <Progress value={warning.currentMargin} max={100} className="h-3" />
                <div className="absolute top-0 h-full w-0.5 bg-red-500" style={{ left: `${warning.thresholdMargin}%` }} title={`Threshold: ${warning.thresholdMargin}%`} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span className="text-red-400">Threshold: {warning.thresholdMargin}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Projected */}
            <div className="mt-4 rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Projected: {warning.projectedMargin}%</span>
              </div>
              <p className="text-sm text-slate-300">{warning.requiredAction}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <Button onClick={onTakeAction} className="flex-1 bg-white text-slate-900 hover:bg-slate-100">
                <Shield className="mr-2 h-4 w-4" />
                Take Action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={onDismiss}>Acknowledge</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default MarginCallWarningBanner;
