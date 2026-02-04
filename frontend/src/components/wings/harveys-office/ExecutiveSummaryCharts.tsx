'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortfolioData } from '@/types/wings/harveys-office';

interface ExecutiveSummaryChartsProps {
  data?: PortfolioData[];
  className?: string;
}

const mockData: PortfolioData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  portfolioValue: 10000000 + Math.random() * 500000 - 250000 + i * 20000,
  margin: 70 + Math.random() * 15 + (i > 20 ? 5 : 0),
  pnl: Math.random() * 100000 - 30000,
}));

export const ExecutiveSummaryCharts = React.memo(function ExecutiveSummaryCharts({ data = mockData, className }: ExecutiveSummaryChartsProps) {
  const latestValue = data[data.length - 1]?.portfolioValue || 0;
  const previousValue = data[data.length - 2]?.portfolioValue || latestValue;
  const change = latestValue - previousValue;
  const changePercent = (change / previousValue) * 100;

  const totalPnL = data.reduce((sum, d) => sum + d.pnl, 0);
  const avgMargin = data.reduce((sum, d) => sum + d.margin, 0) / data.length;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-white">Executive Summary</h3>
            <p className="text-sm text-slate-400">30-day performance</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/50 to-navy-900/50 p-4">
          <span className="text-xs text-slate-400">Portfolio Value</span>
          <p className="text-xl font-bold text-white">${(latestValue / 1000000).toFixed(2)}M</p>
          <div className={cn('flex items-center gap-1 text-sm', change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%</span>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/50 to-navy-900/50 p-4">
          <span className="text-xs text-slate-400">30-Day P&L</span>
          <p className={cn('text-xl font-bold', totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {totalPnL >= 0 ? '+' : ''}${(totalPnL / 1000).toFixed(0)}K
          </p>
          <span className="text-sm text-slate-500">Cumulative</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/50 to-navy-900/50 p-4">
          <span className="text-xs text-slate-400">Avg Margin</span>
          <p className={cn('text-xl font-bold', avgMargin > 80 ? 'text-amber-400' : 'text-white')}>
            {avgMargin.toFixed(1)}%
          </p>
          <span className="text-sm text-slate-500">Period average</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/50 to-navy-900/50 p-4">
          <span className="text-xs text-slate-400">Target Status</span>
          <p className="text-xl font-bold text-emerald-400">On Track</p>
          <span className="text-sm text-slate-500">Q1 Goals</span>
        </div>
      </div>

      {/* Main chart */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="execGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
            <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Value']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area type="monotone" dataKey="portfolioValue" stroke="#10b981" fill="url(#execGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default ExecutiveSummaryCharts;
