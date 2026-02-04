'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GitCompare, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ModelComparisonData } from '@/types/wings/library';

interface ModelComparisonRadarProps {
  models?: ModelComparisonData[];
  className?: string;
}

const mockModels: ModelComparisonData[] = [
  { id: 'gbt', name: 'Quantile GBT', metrics: { accuracy: 92.3, speed: 85, stability: 88, interpretability: 70, robustness: 82 }, color: '#10b981' },
  { id: 'lstm', name: 'LSTM Seq', metrics: { accuracy: 88.7, speed: 60, stability: 75, interpretability: 45, robustness: 78 }, color: '#3b82f6' },
  { id: 'ensemble', name: 'Ensemble', metrics: { accuracy: 94.1, speed: 40, stability: 92, interpretability: 35, robustness: 90 }, color: '#f59e0b' },
];

const metricLabels = ['accuracy', 'speed', 'stability', 'interpretability', 'robustness'] as const;

export const ModelComparisonRadar = React.memo(function ModelComparisonRadar({ models = mockModels, className }: ModelComparisonRadarProps) {
  const [selectedModels, setSelectedModels] = React.useState<string[]>(models.map(m => m.id));

  const toggleModel = (id: string) => {
    setSelectedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const bestModel = models.reduce((best, m) => {
    const score = Object.values(m.metrics).reduce((a, b) => a + b, 0);
    const bestScore = Object.values(best.metrics).reduce((a, b) => a + b, 0);
    return score > bestScore ? m : best;
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompare className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-white">Model Comparison</h3>
            <p className="text-sm text-slate-400">Multi-metric analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1">
          <Award className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-amber-400">Best: {bestModel.name}</span>
        </div>
      </div>

      {/* Model toggles */}
      <div className="flex gap-2">
        {models.map(model => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
              selectedModels.includes(model.id) ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400'
            )}
          >
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: model.color }} />
            {model.name}
          </button>
        ))}
      </div>

      {/* Simplified radar as bar comparison */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <div className="space-y-4">
          {metricLabels.map(metric => (
            <div key={metric}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400 capitalize">{metric}</span>
              </div>
              <div className="space-y-1">
                {models.filter(m => selectedModels.includes(m.id)).map(model => (
                  <div key={model.id} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-slate-400">{model.name}</div>
                    <div className="flex-1 h-4 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: model.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${model.metrics[metric]}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-white">{model.metrics[metric]}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary table */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-800/50">
            <tr>
              <th className="px-4 py-2 text-left text-slate-400">Model</th>
              <th className="px-4 py-2 text-center text-slate-400">Avg Score</th>
              <th className="px-4 py-2 text-center text-slate-400">Best At</th>
            </tr>
          </thead>
          <tbody>
            {models.map(model => {
              const avgScore = Object.values(model.metrics).reduce((a, b) => a + b, 0) / 5;
              const bestMetric = Object.entries(model.metrics).reduce((a, b) => b[1] > a[1] ? b : a);
              return (
                <tr key={model.id} className="border-t border-white/5">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: model.color }} />
                    <span className="text-white">{model.name}</span>
                  </td>
                  <td className="px-4 py-2 text-center text-white font-medium">{avgScore.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-center text-slate-300 capitalize">{bestMetric[0]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ModelComparisonRadar;
