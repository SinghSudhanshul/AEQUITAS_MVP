'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Settings2, TrendingUp, Sliders, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BacktestConfiguration, BacktestResult } from '@/types/wings/library';

interface BacktestControlPanelProps {
  config?: BacktestConfiguration;
  results?: BacktestResult;
  onRunBacktest?: (config: BacktestConfiguration) => void;
  className?: string;
}

const defaultConfig: BacktestConfiguration = {
  startDate: '2023-01-01',
  endDate: '2024-01-01',
  models: ['quantile-gbt', 'lstm-seq'],
  quantiles: [0.05, 0.25, 0.5, 0.75, 0.95],
  regimeMode: 'adaptive',
  validationSplit: 0.2,
};

const mockResults: BacktestResult = {
  overallAccuracy: 87.3,
  quantileAccuracies: { p5: 91.2, p25: 89.1, p50: 88.4, p75: 86.8, p95: 81.0 },
  regimeAccuracy: 78.5,
  sharpeRatio: 1.42,
  maxDrawdown: -12.4,
};

export const BacktestControlPanel = React.memo(function BacktestControlPanel({ config = defaultConfig, results = mockResults, onRunBacktest, className }: BacktestControlPanelProps) {
  const [formConfig, setFormConfig] = React.useState(config);
  const [isRunning, setIsRunning] = React.useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 2000));
    onRunBacktest?.(formConfig);
    setIsRunning(false);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LineChart className="h-5 w-5 text-orange-400" />
          <div>
            <h3 className="font-semibold text-white">Backtest Control</h3>
            <p className="text-sm text-slate-400">Historical model validation</p>
          </div>
        </div>
        <Button variant="outline" size="sm"><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-white">Configuration</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Start Date</label>
              <input type="date" value={formConfig.startDate} onChange={(e) => setFormConfig(p => ({ ...p, startDate: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">End Date</label>
              <input type="date" value={formConfig.endDate} onChange={(e) => setFormConfig(p => ({ ...p, endDate: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Regime Mode</label>
            <select value={formConfig.regimeMode} onChange={(e) => setFormConfig(p => ({ ...p, regimeMode: e.target.value as 'fixed' | 'adaptive' }))} className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white">
              <option value="fixed">Fixed</option>
              <option value="adaptive">Adaptive</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Validation Split: {(formConfig.validationSplit * 100).toFixed(0)}%</label>
            <input type="range" min="0.1" max="0.4" step="0.05" value={formConfig.validationSplit} onChange={(e) => setFormConfig(p => ({ ...p, validationSplit: parseFloat(e.target.value) }))} className="w-full" />
          </div>

          <Button onClick={handleRun} disabled={isRunning} className="w-full">
            {isRunning ? 'Running...' : 'Run Backtest'}
          </Button>
        </div>

        {/* Results */}
        <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="font-medium text-white">Results</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-slate-400">Overall Accuracy</span>
              <span className="text-xl font-bold text-emerald-400">{results.overallAccuracy.toFixed(1)}%</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Object.entries(results.quantileAccuracies).map(([k, v]) => (
                <div key={k} className="text-center p-2 rounded-lg bg-white/5">
                  <span className="text-xs text-slate-500 block">{k.toUpperCase()}</span>
                  <span className={cn('font-medium', v >= 85 ? 'text-emerald-400' : 'text-amber-400')}>{v.toFixed(0)}%</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-xs text-slate-400 block">Sharpe Ratio</span>
                <span className="text-lg font-bold text-white">{results.sharpeRatio.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-xs text-slate-400 block">Max Drawdown</span>
                <span className="text-lg font-bold text-red-400">{results.maxDrawdown.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BacktestControlPanel;
