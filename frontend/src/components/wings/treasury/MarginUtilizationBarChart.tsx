'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { GaugeCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MarginUtilizationData } from '@/types/wings/treasury';

interface MarginUtilizationBarChartProps {
  data?: MarginUtilizationData[];
  threshold?: number;
  className?: string;
}

const mockData: MarginUtilizationData[] = [
  { broker: 'Goldman', utilization: 82, limit: 100, available: 180000 },
  { broker: 'MS', utilization: 65, limit: 100, available: 350000 },
  { broker: 'JPM', utilization: 72, limit: 100, available: 280000 },
  { broker: 'Citadel', utilization: 58, limit: 100, available: 420000 },
  { broker: 'Barclays', utilization: 91, limit: 100, available: 90000 },
];

const getBarColor = (value: number, threshold: number) => {
  if (value >= threshold) return '#ef4444';
  if (value >= threshold - 10) return '#f59e0b';
  return '#10b981';
};

export const MarginUtilizationBarChart = React.memo(function MarginUtilizationBarChart({ data = mockData, threshold = 85, className }: MarginUtilizationBarChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const overThreshold = data.filter(d => d.utilization >= threshold);
  const avgUtilization = data.reduce((sum, d) => sum + d.utilization, 0) / data.length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GaugeCircle className="h-5 w-5 text-orange-400" />
          <div>
            <h3 className="font-semibold text-white">Margin Utilization</h3>
            <p className="text-sm text-slate-400">By broker account</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400">Average</span>
            <p className={cn('text-lg font-bold', avgUtilization >= threshold ? 'text-red-400' : 'text-emerald-400')}>
              {avgUtilization.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {overThreshold.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-400">{overThreshold.length} broker(s) above {threshold}% threshold</span>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="broker" stroke="#64748b" fontSize={12} width={60} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number) => [`${value}%`, 'Utilization']}
            />
            <ReferenceLine x={threshold} stroke="#ef4444" strokeDasharray="3 3" />
            <Bar dataKey="utilization" radius={[0, 4, 4, 0]} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={getBarColor(entry.utilization, threshold)}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-5 gap-2">
        {data.map((d) => (
          <div key={d.broker} className={cn(
            'rounded-lg border p-2 text-center',
            d.utilization >= threshold ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-white/5'
          )}>
            <span className="text-xs text-slate-400">Available</span>
            <p className="text-sm font-bold text-white">${(d.available / 1000).toFixed(0)}K</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default MarginUtilizationBarChart;
