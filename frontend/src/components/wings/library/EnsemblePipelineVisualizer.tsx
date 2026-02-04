'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Layers, GitBranch, Check, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { EnsemblePipelineStage } from '@/types/wings/library';

interface EnsemblePipelineVisualizerProps {
  stages?: EnsemblePipelineStage[];
  currentStage?: number;
  className?: string;
}

const mockStages: EnsemblePipelineStage[] = [
  { id: 'ingest', name: 'Data Ingestion', description: 'Load positions and market data', status: 'completed', duration: 1.2, output: { rows: 15420 } },
  { id: 'preprocess', name: 'Preprocessing', description: 'Clean and normalize features', status: 'completed', duration: 0.8, output: { features: 128 } },
  { id: 'quantile', name: 'Quantile Models', description: 'Run GBT and LSTM models', status: 'running', duration: 2.5, output: { models: 5 } },
  { id: 'regime', name: 'Regime Detection', description: 'HMM regime classification', status: 'pending', output: {} },
  { id: 'ensemble', name: 'Ensemble Blend', description: 'Meta-learner combination', status: 'pending', output: {} },
  { id: 'output', name: 'Output Generation', description: 'Generate forecasts and alerts', status: 'pending', output: {} },
];

const statusConfig = {
  completed: { color: 'border-emerald-500', bg: 'bg-emerald-500', icon: Check, iconColor: 'text-emerald-400' },
  running: { color: 'border-amber-500', bg: 'bg-amber-500', icon: Clock, iconColor: 'text-amber-400' },
  pending: { color: 'border-slate-500', bg: 'bg-slate-500', icon: Clock, iconColor: 'text-slate-400' },
  error: { color: 'border-red-500', bg: 'bg-red-500', icon: AlertCircle, iconColor: 'text-red-400' },
};

export const EnsemblePipelineVisualizer = React.memo(function EnsemblePipelineVisualizer({ stages = mockStages, currentStage = 2, className }: EnsemblePipelineVisualizerProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Layers className="h-5 w-5 text-blue-400" />
        <div>
          <h3 className="font-semibold text-white">Ensemble Pipeline</h3>
          <p className="text-sm text-slate-400">Real-time model orchestration</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
        {/* Pipeline stages */}
        <div className="relative">
          {stages.map((stage, idx) => {
            const status = statusConfig[stage.status];
            const StatusIcon = status.icon;
            const isActive = stage.status === 'running';

            return (
              <div key={stage.id} className="relative flex items-start gap-4 pb-8 last:pb-0">
                {/* Connector line */}
                {idx < stages.length - 1 && (
                  <div className={cn(
                    'absolute left-[19px] top-10 h-full w-0.5',
                    stage.status === 'completed' ? 'bg-emerald-500' : 'bg-white/10'
                  )} />
                )}

                {/* Status icon */}
                <motion.div
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
                  className={cn(
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2',
                    status.color,
                    stage.status === 'completed' ? 'bg-emerald-500/20' : 'bg-navy-900'
                  )}
                >
                  <StatusIcon className={cn('h-5 w-5', status.iconColor, isActive && 'animate-spin')} />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={cn('font-medium', stage.status === 'pending' ? 'text-slate-400' : 'text-white')}>
                      {stage.name}
                    </h4>
                    {stage.duration && (
                      <span className="text-xs text-slate-500">{stage.duration}s</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{stage.description}</p>

                  {/* Output metrics */}
                  {Object.keys(stage.output).length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {Object.entries(stage.output).map(([key, value]) => (
                        <span key={key} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Pipeline Progress</span>
            <span className="text-white">{Math.round((currentStage / stages.length) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStage / stages.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default EnsemblePipelineVisualizer;
