'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CashFlowWaterfallData } from '@/types/wings/treasury';

interface CashFlowWaterfallProps {
  data?: CashFlowWaterfallData[];
  className?: string;
}

const generateMockData = (): CashFlowWaterfallData[] => {
  let runningTotal = 2000000;
  const items = [
    { label: 'Opening', delta: 0 },
    { label: 'Settlements', delta: 350000 },
    { label: 'Margin Calls', delta: -180000 },
    { label: 'New Positions', delta: -420000 },
    { label: 'Redemptions', delta: 150000 },
    { label: 'Fees', delta: -45000 },
    { label: 'Interest', delta: 22000 },
    { label: 'Projected', delta: 0 },
  ];

  return items.map((item, idx) => {
    const start = idx === 0 ? 0 : runningTotal;
    runningTotal += item.delta;
    return {
      name: item.label,
      start: idx === 0 ? 0 : start,
      end: runningTotal,
      delta: item.delta,
      isTotal: idx === 0 || idx === items.length - 1,
    };
  });
};

export const CashFlowWaterfall = React.memo(function CashFlowWaterfall({ data, className }: CashFlowWaterfallProps) {
  const chartData = data || generateMockData();
  const finalValue = chartData[chartData.length - 1].end;
  const initialValue = chartData[0].end;
  const totalChange = finalValue - initialValue;
  const isPositive = totalChange >= 0;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-teal-400" />
          <div>
            <h3 className="font-semibold text-white">Cash Flow Waterfall</h3>
            <p className="text-sm text-slate-400">Daily movement analysis</p>
          </div>
        </div>
        <div className={cn('flex items-center gap-2', isPositive ? 'text-emerald-400' : 'text-red-400')}>
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">{isPositive ? '+' : ''}${(totalChange / 1000).toFixed(0)}K</span>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {chartData.filter(d => !d.isTotal).map((item) => (
            <div key={item.name} className={cn(
              'rounded-lg px-3 py-2 text-center min-w-[100px]',
              item.delta >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
            )}>
              <span className="text-xs text-slate-400 block">{item.name}</span>
              <span className={cn('text-sm font-bold', item.delta >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {item.delta >= 0 ? '+' : ''}${(item.delta / 1000).toFixed(0)}K
              </span>
            </div>
          ))}
        </div>

        {/* Cumulative line chart */}
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'Balance']}
            />
            <Area type="monotone" dataKey="end" stroke="#14b8a6" strokeWidth={2} fill="url(#cashFlowGradient)" />
            <ReferenceLine y={2000000} stroke="#64748b" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <span className="text-xs text-slate-400">Opening</span>
          <p className="text-lg font-bold text-white">${(initialValue / 1000000).toFixed(2)}M</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <span className="text-xs text-slate-400">Net Flow</span>
          <p className={cn('text-lg font-bold', isPositive ? 'text-emerald-400' : 'text-red-400')}>
            {isPositive ? '+' : ''}${(totalChange / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <span className="text-xs text-slate-400">Projected</span>
          <p className="text-lg font-bold text-white">${(finalValue / 1000000).toFixed(2)}M</p>
        </div>
      </div>
    </div>
  );
});

export default CashFlowWaterfall;
