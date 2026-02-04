'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { LegalStrategy } from '@/types/wings/war-room';

interface StrategyBoardProps {
  strategies?: LegalStrategy[];
  onSelectStrategy?: (strategy: LegalStrategy) => void;
  className?: string;
}

const mockStrategies: LegalStrategy[] = [
  { id: '1', name: 'Aggressive Settlement', type: 'offensive', risk: 'medium', successProbability: 72, timeframe: '30 days', potentialOutcome: 850000, description: 'Push for early settlement with favorable terms' },
  { id: '2', name: 'Full Defense', type: 'defensive', risk: 'high', successProbability: 58, timeframe: '6 months', potentialOutcome: 1200000, description: 'Complete litigation with full discovery and trial' },
  { id: '3', name: 'Negotiated Resolution', type: 'balanced', risk: 'low', successProbability: 85, timeframe: '45 days', potentialOutcome: 650000, description: 'Balanced approach with structured negotiations' },
];

const typeConfig = {
  offensive: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: Sword },
  defensive: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: Shield },
  balanced: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: Target },
};

const riskColors = { low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-red-400' };

export const StrategyBoard = React.memo(function StrategyBoard({ strategies = mockStrategies, onSelectStrategy, className }: StrategyBoardProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleSelect = (strategy: LegalStrategy) => {
    setSelectedId(strategy.id);
    onSelectStrategy?.(strategy);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-semibold text-white">Strategy Board</h3>
            <p className="text-sm text-slate-400">Legal approach options</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {strategies.map((strategy, idx) => {
          const type = typeConfig[strategy.type];
          const TypeIcon = type.icon;
          const isSelected = selectedId === strategy.id;

          return (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(strategy)}
              className={cn(
                'rounded-xl border-2 p-5 cursor-pointer transition-all',
                isSelected ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-[1.02]' : type.border,
                type.bg
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', type.bg)}>
                  <TypeIcon className={cn('h-6 w-6', type.color)} />
                </div>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </motion.div>
                )}
              </div>

              <h4 className="text-lg font-bold text-white mb-2">{strategy.name}</h4>
              <p className="text-sm text-slate-400 mb-4">{strategy.description}</p>

              <div className="space-y-3">
                {/* Success probability */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Success Probability</span>
                    <span className={cn('font-medium', strategy.successProbability >= 70 ? 'text-emerald-400' : 'text-amber-400')}>
                      {strategy.successProbability}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={cn('h-full', strategy.successProbability >= 70 ? 'bg-emerald-500' : 'bg-amber-500')}
                      initial={{ width: 0 }}
                      animate={{ width: `${strategy.successProbability}%` }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded bg-white/5 p-2">
                    <span className="text-xs text-slate-500">Risk</span>
                    <p className={cn('text-sm font-medium capitalize', riskColors[strategy.risk])}>{strategy.risk}</p>
                  </div>
                  <div className="rounded bg-white/5 p-2">
                    <span className="text-xs text-slate-500">Time</span>
                    <p className="text-sm font-medium text-white">{strategy.timeframe}</p>
                  </div>
                  <div className="rounded bg-white/5 p-2">
                    <span className="text-xs text-slate-500">Value</span>
                    <p className="text-sm font-medium text-emerald-400">${(strategy.potentialOutcome / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedId && (
        <div className="flex justify-end">
          <Button className="bg-purple-500 hover:bg-purple-600">
            Adopt Selected Strategy
          </Button>
        </div>
      )}
    </div>
  );
});

export default StrategyBoard;
