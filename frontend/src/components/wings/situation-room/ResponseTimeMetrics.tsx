'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Timer, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResponseTimeData } from '@/types/wings/situation-room';

interface ResponseTimeMetricsProps {
  data?: ResponseTimeData[];
  targetTime?: number;
  className?: string;
}

const mockData: ResponseTimeData[] = [
  { category: 'Detection', current: 25, previous: 32, target: 30 },
  { category: 'Assessment', current: 45, previous: 52, target: 60 },
  { category: 'Decision', current: 18, previous: 25, target: 30 },
  { category: 'Execution', current: 90, previous: 105, target: 120 },
  { category: 'Verification', current: 35, previous: 40, target: 45 },
];

export const ResponseTimeMetrics = React.memo(function ResponseTimeMetrics({ data = mockData, targetTime = 180, className }: ResponseTimeMetricsProps) {
  const totalCurrent = data.reduce((sum, d) => sum + d.current, 0);
  const totalPrevious = data.reduce((sum, d) => sum + d.previous, 0);
  const improvement = ((totalPrevious - totalCurrent) / totalPrevious) * 100;
  const onTarget = data.filter(d => d.current <= d.target).length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Timer className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white">Response Time Metrics</h3>
            <p className="text-sm text-slate-400">Crisis response performance</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Time</span>
            <p className="text-lg font-bold text-white">{totalCurrent}s</p>
          </div>
          <div className={cn('flex items-center gap-1', improvement > 0 ? 'text-emerald-400' : 'text-red-400')}>
            {improvement > 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            <span className="text-sm font-medium">{Math.abs(improvement).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <span className="text-xs text-slate-400">On Target</span>
          <p className="text-lg font-bold text-emerald-400">{onTarget}/{data.length}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <span className="text-xs text-slate-400">Target Time</span>
          <p className="text-lg font-bold text-white">{targetTime}s</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <span className="text-xs text-slate-400">Improvement</span>
          <p className={cn('text-lg font-bold', improvement > 0 ? 'text-emerald-400' : 'text-red-400')}>
            {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20 }}>
            <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v}s`} />
            <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={12} width={80} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number, name: string) => [`${value}s`, name === 'current' ? 'Current' : 'Target']}
            />
            <Bar dataKey="current" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.current <= entry.target ? '#10b981' : '#f59e0b'} />
              ))}
            </Bar>
            <Bar dataKey="target" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-500" />
          <span className="text-slate-400">On Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-500" />
          <span className="text-slate-400">Over Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-white/10" />
          <span className="text-slate-400">Target Time</span>
        </div>
      </div>
    </div>
  );
});

export default ResponseTimeMetrics;
