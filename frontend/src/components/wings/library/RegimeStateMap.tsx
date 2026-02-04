'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Circle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RegimeStateMapData } from '@/types/wings/library';

interface RegimeStateMapProps {
  data?: RegimeStateMapData;
  className?: string;
}

const mockData: RegimeStateMapData = {
  currentRegime: 'elevated',
  probability: 0.78,
  transitionMatrix: {
    steady: { steady: 0.85, elevated: 0.12, crisis: 0.03 },
    elevated: { steady: 0.25, elevated: 0.60, crisis: 0.15 },
    crisis: { steady: 0.10, elevated: 0.30, crisis: 0.60 },
  },
  historicalRegimes: [
    { regime: 'steady', duration: 45 },
    { regime: 'elevated', duration: 12 },
    { regime: 'steady', duration: 78 },
    { regime: 'crisis', duration: 5 },
    { regime: 'elevated', duration: 8 },
  ],
};

const regimeConfig = {
  steady: { color: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-400' },
  elevated: { color: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-400' },
  crisis: { color: 'bg-red-500', border: 'border-red-500', text: 'text-red-400' },
};

export const RegimeStateMap = React.memo(function RegimeStateMap({ data = mockData, className }: RegimeStateMapProps) {
  const regimes = ['steady', 'elevated', 'crisis'] as const;
  const current = data.currentRegime;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <MapPin className="h-5 w-5 text-amber-400" />
        <div>
          <h3 className="font-semibold text-white">Regime State Map</h3>
          <p className="text-sm text-slate-400">Markov transition probabilities</p>
        </div>
      </div>

      {/* Current regime indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('rounded-xl border-2 p-4', regimeConfig[current].border, `${regimeConfig[current].color}/10`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={cn('h-4 w-4 rounded-full', regimeConfig[current].color)}
            />
            <div>
              <span className="text-sm text-slate-400">Current Regime</span>
              <h4 className={cn('text-xl font-bold capitalize', regimeConfig[current].text)}>{current}</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-400">Confidence</span>
            <p className="text-xl font-bold text-white">{(data.probability * 100).toFixed(0)}%</p>
          </div>
        </div>
      </motion.div>

      {/* Transition matrix */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <h4 className="font-medium text-white mb-3">Transition Probabilities</h4>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-navy-800/50">
              <tr>
                <th className="px-3 py-2 text-left text-slate-400">From → To</th>
                {regimes.map(r => (
                  <th key={r} className={cn('px-3 py-2 text-center capitalize', regimeConfig[r].text)}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regimes.map(from => (
                <tr key={from} className="border-t border-white/5">
                  <td className={cn('px-3 py-2 font-medium capitalize', regimeConfig[from].text)}>{from}</td>
                  {regimes.map(to => {
                    const prob = data.transitionMatrix[from][to];
                    return (
                      <td key={to} className="px-3 py-2 text-center">
                        <span className={cn(
                          'inline-block rounded px-2 py-0.5 text-xs font-medium',
                          prob >= 0.5 ? 'bg-white/20 text-white' : 'text-slate-400'
                        )}>
                          {(prob * 100).toFixed(0)}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical timeline */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <h4 className="font-medium text-white mb-3">Historical Regimes</h4>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {data.historicalRegimes.map((period, idx) => (
            <motion.div
              key={idx}
              initial={{ width: 0 }}
              animate={{ width: `${(period.duration / data.historicalRegimes.reduce((a, b) => a + b.duration, 0)) * 100}%` }}
              className={cn('h-full', regimeConfig[period.regime].color)}
              title={`${period.regime}: ${period.duration} days`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Oldest</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
});

export default RegimeStateMap;
