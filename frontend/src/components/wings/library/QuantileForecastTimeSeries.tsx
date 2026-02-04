'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { QuantileForecastTimeSeriesData } from '@/types/wings/library';

interface QuantileForecastTimeSeriesProps {
  data?: QuantileForecastTimeSeriesData[];
  timeRange?: '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void;
  className?: string;
}

const generateMockData = (days: number): QuantileForecastTimeSeriesData[] => {
  const data: QuantileForecastTimeSeriesData[] = [];
  const baseValue = 2000000;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const variation = Math.sin(i / 3) * 200000 + Math.random() * 100000;
    const p50 = baseValue + variation;

    data.push({
      date: date.toISOString().split('T')[0],
      p5: p50 * 0.7,
      p25: p50 * 0.85,
      p50,
      p75: p50 * 1.15,
      p95: p50 * 1.3,
      actual: i < days - 3 ? p50 + (Math.random() - 0.5) * 100000 : undefined,
    });
  }
  return data;
};

const formatValue = (value: number) => `$${(value / 1000000).toFixed(2)}M`;

export const QuantileForecastTimeSeries = React.memo(function QuantileForecastTimeSeries({ data, timeRange = '30d', onTimeRangeChange, className }: QuantileForecastTimeSeriesProps) {
  const [selectedRange, setSelectedRange] = React.useState(timeRange);
  const chartData = data || generateMockData(selectedRange === '7d' ? 7 : selectedRange === '30d' ? 30 : 90);

  const handleRangeChange = (range: '7d' | '30d' | '90d') => {
    setSelectedRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Quantile Forecast</h3>
            <p className="text-sm text-slate-400">Probabilistic liquidity projections</p>
          </div>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map(range => (
            <Button
              key={range}
              variant={selectedRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleRangeChange(range)}
              className={cn('px-3', selectedRange !== range && 'text-slate-400 hover:text-white')}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500" /><span className="text-slate-400">P50 (Median)</span></div>
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-300/50" /><span className="text-slate-400">P25-P75</span></div>
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-200/30" /><span className="text-slate-400">P5-P95</span></div>
        <div className="flex items-center gap-2"><div className="h-0.5 w-3 bg-emerald-500" /><span className="text-slate-400">Actual</span></div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="p5p95" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="p25p75" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number) => [formatValue(value), '']}
            />
            <Area type="monotone" dataKey="p95" stackId="1" stroke="none" fill="url(#p5p95)" />
            <Area type="monotone" dataKey="p5" stackId="2" stroke="none" fill="#0f172a" />
            <Area type="monotone" dataKey="p75" stackId="3" stroke="none" fill="url(#p25p75)" />
            <Area type="monotone" dataKey="p25" stackId="4" stroke="none" fill="#0f172a" />
            <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Latest P50', value: formatValue(chartData[chartData.length - 1].p50) },
          { label: 'P5 (Low)', value: formatValue(chartData[chartData.length - 1].p5) },
          { label: 'P95 (High)', value: formatValue(chartData[chartData.length - 1].p95) },
          { label: 'Range', value: formatValue(chartData[chartData.length - 1].p95 - chartData[chartData.length - 1].p5) },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <span className="text-xs text-slate-400">{stat.label}</span>
            <p className="mt-1 text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default QuantileForecastTimeSeries;
