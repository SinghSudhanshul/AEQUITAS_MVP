'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Target, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { QuantileCalibrationData } from '@/types/wings/library';

interface QuantileCalibrationWizardProps {
  data?: QuantileCalibrationData;
  onRecalibrate?: () => void;
  className?: string;
}

const mockData: QuantileCalibrationData = {
  currentCalibration: { p5: 0.048, p25: 0.24, p50: 0.498, p75: 0.76, p95: 0.94 },
  expectedCalibration: { p5: 0.05, p25: 0.25, p50: 0.50, p75: 0.75, p95: 0.95 },
  lastCalibrated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  needsRecalibration: true,
  calibrationScore: 87.5,
};

export const QuantileCalibrationWizard = React.memo(function QuantileCalibrationWizard({ data = mockData, onRecalibrate, className }: QuantileCalibrationWizardProps) {
  const quantiles = ['p5', 'p25', 'p50', 'p75', 'p95'] as const;

  const getDeviationColor = (current: number, expected: number) => {
    const deviation = Math.abs(current - expected);
    if (deviation < 0.01) return 'text-emerald-400';
    if (deviation < 0.03) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair className="h-5 w-5 text-pink-400" />
          <div>
            <h3 className="font-semibold text-white">Quantile Calibration</h3>
            <p className="text-sm text-slate-400">Last calibrated: {new Date(data.lastCalibrated).toLocaleDateString()}</p>
          </div>
        </div>
        {data.needsRecalibration && (
          <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-400">Recalibration Suggested</span>
          </div>
        )}
      </div>

      {/* Calibration score */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Calibration Score</span>
          <span className={cn('text-2xl font-bold', data.calibrationScore >= 90 ? 'text-emerald-400' : data.calibrationScore >= 80 ? 'text-amber-400' : 'text-red-400')}>
            {data.calibrationScore.toFixed(1)}%
          </span>
        </div>
        <Progress value={data.calibrationScore} variant="prestige" />
      </div>

      {/* Quantile comparison */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <h4 className="font-medium text-white mb-4">Quantile Comparison</h4>
        <div className="space-y-3">
          {quantiles.map(q => {
            const current = data.currentCalibration[q];
            const expected = data.expectedCalibration[q];
            const deviation = (current - expected) * 100;

            return (
              <div key={q} className="flex items-center gap-4">
                <span className="w-12 text-sm font-medium text-slate-400 uppercase">{q}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Current: {(current * 100).toFixed(1)}%</span>
                    <span className="text-slate-400">Expected: {(expected * 100).toFixed(1)}%</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-white/10">
                    <div className="absolute h-full bg-white/30 rounded-full" style={{ width: `${expected * 100}%` }} />
                    <motion.div
                      className={cn('absolute h-full rounded-full', Math.abs(deviation) < 1 ? 'bg-emerald-500' : Math.abs(deviation) < 3 ? 'bg-amber-500' : 'bg-red-500')}
                      initial={{ width: 0 }}
                      animate={{ width: `${current * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <span className={cn('w-16 text-right text-sm font-medium', getDeviationColor(current, expected))}>
                  {deviation >= 0 ? '+' : ''}{deviation.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={onRecalibrate} className="w-full">
        <Target className="mr-2 h-4 w-4" />
        Run Recalibration
      </Button>
    </div>
  );
});

export default QuantileCalibrationWizard;
