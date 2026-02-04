'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, AlertCircle, CheckCircle2, RefreshCw, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { ML13ModelCard as ModelCardType } from '@/types/wings/library';

interface ML13ModelCarouselProps {
  models?: ModelCardType[];
  onModelSelect?: (model: ModelCardType) => void;
  className?: string;
}

const mockModels: ModelCardType[] = [
  { id: 'quantile-gbt', name: 'Quantile GBT', description: 'Gradient boosted trees for quantile regression', version: '2.1.0', status: 'active', accuracy: 92.3, lastTrained: new Date().toISOString(), features: ['positions', 'market', 'regime'] },
  { id: 'lstm-seq', name: 'LSTM Sequence', description: 'Long short-term memory for time series', version: '1.8.2', status: 'active', accuracy: 88.7, lastTrained: new Date().toISOString(), features: ['historical', 'seasonality'] },
  { id: 'regime-hmm', name: 'Regime HMM', description: 'Hidden Markov model for regime detection', version: '3.0.1', status: 'active', accuracy: 85.4, lastTrained: new Date().toISOString(), features: ['volatility', 'correlation'] },
  { id: 'ensemble-meta', name: 'Ensemble Meta', description: 'Meta-learner combining all models', version: '1.2.0', status: 'training', accuracy: 94.1, lastTrained: new Date().toISOString(), features: ['all'] },
];

const statusConfig = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle2 },
  training: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: RefreshCw },
  error: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertCircle },
  inactive: { color: 'text-slate-400', bg: 'bg-slate-500/20', icon: Cpu },
};

export const ML13ModelCarousel = React.memo(function ML13ModelCarousel({ models = mockModels, onModelSelect, className }: ML13ModelCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-semibold text-white">ML Model Suite</h3>
            <p className="text-sm text-slate-400">13 production models</p>
          </div>
        </div>
        <Button variant="outline" size="sm">View All Models</Button>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {models.map((model, idx) => {
            const status = statusConfig[model.status];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={model.id}
                whileHover={{ y: -4 }}
                onClick={() => { setActiveIndex(idx); onModelSelect?.(model); }}
                className={cn(
                  'min-w-[280px] rounded-xl border p-4 cursor-pointer transition-all',
                  activeIndex === idx ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-navy-900/50 hover:border-white/20'
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', status.bg)}>
                    <StatusIcon className={cn('h-5 w-5', status.color, model.status === 'training' && 'animate-spin')} />
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', status.bg, status.color)}>
                    {model.status}
                  </span>
                </div>

                {/* Info */}
                <h4 className="font-semibold text-white">{model.name}</h4>
                <p className="mt-1 text-sm text-slate-400 line-clamp-2">{model.description}</p>
                <p className="mt-2 text-xs text-slate-500">v{model.version}</p>

                {/* Accuracy */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Accuracy</span>
                    <span className={cn('font-medium', model.accuracy >= 90 ? 'text-emerald-400' : model.accuracy >= 80 ? 'text-amber-400' : 'text-red-400')}>
                      {model.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={cn('h-full', model.accuracy >= 90 ? 'bg-emerald-500' : model.accuracy >= 80 ? 'bg-amber-500' : 'bg-red-500')}
                      initial={{ width: 0 }}
                      animate={{ width: `${model.accuracy}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {model.features.slice(0, 3).map(f => (
                    <span key={f} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">{f}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2">
        {models.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn('h-2 w-2 rounded-full transition-all', activeIndex === idx ? 'bg-purple-500 w-6' : 'bg-white/20')}
          />
        ))}
      </div>
    </div>
  );
});

export default ML13ModelCarousel;
