'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import type { FeatureImportanceData } from '@/types/wings/library';

interface FeatureImportanceBarChartProps {
  data?: FeatureImportanceData[];
  model?: string;
  className?: string;
}

const mockData: FeatureImportanceData[] = [
  { feature: 'rolling_avg_30d', importance: 0.24, direction: 'positive', description: '30-day rolling average' },
  { feature: 'margin_utilization', importance: 0.19, direction: 'positive', description: 'Current margin %' },
  { feature: 'vix_level', importance: 0.15, direction: 'negative', description: 'VIX volatility index' },
  { feature: 'sector_correlation', importance: 0.12, direction: 'negative', description: 'Cross-sector correlation' },
  { feature: 'day_of_week', importance: 0.09, direction: 'positive', description: 'Day of week encoding' },
  { feature: 'position_count', importance: 0.08, direction: 'positive', description: 'Number of positions' },
  { feature: 'broker_concentration', importance: 0.07, direction: 'negative', description: 'Broker HHI' },
  { feature: 'seasonality', importance: 0.06, direction: 'positive', description: 'Seasonal component' },
];

export const FeatureImportanceBarChart = React.memo(function FeatureImportanceBarChart({ data = mockData, model = 'Quantile GBT', className }: FeatureImportanceBarChartProps) {
  const [selectedFeature, setSelectedFeature] = React.useState<FeatureImportanceData | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white">Feature Importance</h3>
            <p className="text-sm text-slate-400">{model} model</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 100, right: 20 }}>
            <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
            <YAxis type="category" dataKey="feature" stroke="#64748b" fontSize={10} width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]} onClick={(d) => setSelectedFeature(d)}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.direction === 'positive' ? '#10b981' : '#ef4444'}
                  className="cursor-pointer hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-400">Positive correlation</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownRight className="h-4 w-4 text-red-400" />
          <span className="text-slate-400">Negative correlation</span>
        </div>
      </div>

      {/* Selected feature info */}
      {selectedFeature && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-cyan-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">{selectedFeature.feature}</h4>
              <p className="text-sm text-slate-400">{selectedFeature.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold text-cyan-400">{(selectedFeature.importance * 100).toFixed(1)}%</span>
                <span className={cn('text-sm', selectedFeature.direction === 'positive' ? 'text-emerald-400' : 'text-red-400')}>
                  {selectedFeature.direction === 'positive' ? '↑ Positive' : '↓ Negative'} impact
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default FeatureImportanceBarChart;
