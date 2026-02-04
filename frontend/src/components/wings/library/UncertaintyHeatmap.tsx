'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Thermometer, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UncertaintyHeatmapData } from '@/types/wings/library';

interface UncertaintyHeatmapProps {
  data?: UncertaintyHeatmapData[];
  className?: string;
}

const mockData: UncertaintyHeatmapData[] = [
  { broker: 'Goldman Sachs', account: 'Prime', uncertainty: 0.15, value: 850000 },
  { broker: 'Goldman Sachs', account: 'Hedge', uncertainty: 0.22, value: 420000 },
  { broker: 'Morgan Stanley', account: 'Prime', uncertainty: 0.08, value: 620000 },
  { broker: 'Morgan Stanley', account: 'Prop', uncertainty: 0.35, value: 180000 },
  { broker: 'JP Morgan', account: 'Prime', uncertainty: 0.12, value: 540000 },
  { broker: 'JP Morgan', account: 'Algo', uncertainty: 0.28, value: 290000 },
  { broker: 'Citadel', account: 'HFT', uncertainty: 0.45, value: 150000 },
  { broker: 'Citadel', account: 'Market', uncertainty: 0.18, value: 380000 },
];

const getHeatColor = (uncertainty: number) => {
  if (uncertainty <= 0.1) return 'bg-emerald-500';
  if (uncertainty <= 0.2) return 'bg-emerald-400';
  if (uncertainty <= 0.3) return 'bg-amber-400';
  if (uncertainty <= 0.4) return 'bg-orange-500';
  return 'bg-red-500';
};

export const UncertaintyHeatmap = React.memo(function UncertaintyHeatmap({ data = mockData, className }: UncertaintyHeatmapProps) {
  const [selectedCell, setSelectedCell] = React.useState<UncertaintyHeatmapData | null>(null);
  const brokers = [...new Set(data.map(d => d.broker))];
  const accounts = [...new Set(data.map(d => d.account))];

  const getCell = (broker: string, account: string) => data.find(d => d.broker === broker && d.account === account);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Grid3X3 className="h-5 w-5 text-orange-400" />
          <div>
            <h3 className="font-semibold text-white">Uncertainty Heatmap</h3>
            <p className="text-sm text-slate-400">Forecast confidence by segment</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-slate-400">Low uncertainty</span>
        <div className="flex gap-1">
          <div className="h-4 w-8 rounded bg-emerald-500" />
          <div className="h-4 w-8 rounded bg-emerald-400" />
          <div className="h-4 w-8 rounded bg-amber-400" />
          <div className="h-4 w-8 rounded bg-orange-500" />
          <div className="h-4 w-8 rounded bg-red-500" />
        </div>
        <span className="text-slate-400">High uncertainty</span>
      </div>

      {/* Heatmap grid */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm text-slate-400">Broker</th>
              {accounts.map(a => (
                <th key={a} className="p-2 text-center text-sm text-slate-400">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brokers.map(broker => (
              <tr key={broker}>
                <td className="p-2 text-sm font-medium text-white">{broker}</td>
                {accounts.map(account => {
                  const cell = getCell(broker, account);
                  if (!cell) return <td key={account} className="p-2"><div className="h-12 w-16 rounded bg-white/5" /></td>;
                  return (
                    <td key={account} className="p-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedCell(cell)}
                        className={cn(
                          'h-12 w-16 rounded flex items-center justify-center cursor-pointer transition-all',
                          getHeatColor(cell.uncertainty),
                          selectedCell === cell && 'ring-2 ring-white'
                        )}
                      >
                        <span className="text-sm font-bold text-white">{(cell.uncertainty * 100).toFixed(0)}%</span>
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected cell details */}
      {selectedCell && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <Thermometer className="h-5 w-5 text-orange-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">{selectedCell.broker} - {selectedCell.account}</h4>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Uncertainty Level</span>
                  <p className={cn('font-bold', selectedCell.uncertainty > 0.3 ? 'text-red-400' : 'text-emerald-400')}>
                    {(selectedCell.uncertainty * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Position Value</span>
                  <p className="font-bold text-white">${(selectedCell.value / 1000).toFixed(0)}K</p>
                </div>
              </div>
              {selectedCell.uncertainty > 0.3 && (
                <div className="mt-3 flex items-center gap-2 text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">High uncertainty - review recommended</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default UncertaintyHeatmap;
