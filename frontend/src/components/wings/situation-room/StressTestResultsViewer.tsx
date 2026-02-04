'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StressTestResult } from '@/types/wings/situation-room';

interface StressTestResultsViewerProps {
  results?: StressTestResult;
  className?: string;
}

const mockResults: StressTestResult = {
  scenarioName: 'Market Crash -30%',
  runDate: new Date().toISOString(),
  duration: 45,
  metrics: {
    portfolioImpact: -2850000,
    maxDrawdown: -35.2,
    marginBreaches: 3,
    liquidityShortfall: 450000,
    recoveryTime: 72,
  },
  timeline: Array.from({ length: 20 }, (_, i) => ({
    hour: i,
    portfolioValue: 10000000 - (i < 5 ? i * 400000 : 2000000 - (i - 5) * 100000),
    marginLevel: 70 + (i < 5 ? i * 5 : 25 - (i - 5) * 1.5),
  })),
  status: 'failed',
};

export const StressTestResultsViewer = React.memo(function StressTestResultsViewer({ results = mockResults, className }: StressTestResultsViewerProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-orange-400" />
          <div>
            <h3 className="font-semibold text-white">{results.scenarioName}</h3>
            <p className="text-sm text-slate-400">Stress test results</p>
          </div>
        </div>
        <div className={cn(
          'rounded-full px-4 py-1 text-sm font-medium',
          results.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        )}>
          {results.status === 'passed' ? 'PASSED' : 'FAILED'}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Portfolio Impact', value: `$${(results.metrics.portfolioImpact / 1000000).toFixed(2)}M`, color: 'text-red-400' },
          { label: 'Max Drawdown', value: `${results.metrics.maxDrawdown.toFixed(1)}%`, color: 'text-red-400' },
          { label: 'Margin Breaches', value: results.metrics.marginBreaches.toString(), color: results.metrics.marginBreaches > 0 ? 'text-amber-400' : 'text-emerald-400' },
          { label: 'Liquidity Gap', value: `$${(results.metrics.liquidityShortfall / 1000).toFixed(0)}K`, color: 'text-amber-400' },
          { label: 'Recovery Time', value: `${results.metrics.recoveryTime}h`, color: 'text-blue-400' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
            <span className="text-xs text-slate-400">{metric.label}</span>
            <p className={cn('text-lg font-bold', metric.color)}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={results.timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={10} label={{ value: 'Hours', position: 'bottom', fill: '#64748b' }} />
            <YAxis yAxisId="left" stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <ReferenceLine yAxisId="right" y={85} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Margin Limit', fill: '#ef4444', fontSize: 10 }} />
            <Line yAxisId="left" type="monotone" dataKey="portfolioValue" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="marginLevel" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs justify-center">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-blue-500" />
          <span className="text-slate-400">Portfolio Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-amber-500" />
          <span className="text-slate-400">Margin Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-red-500 border-dashed" />
          <span className="text-slate-400">Margin Limit</span>
        </div>
      </div>

      {results.status === 'failed' && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="text-sm text-red-400">
            This scenario resulted in margin breaches. Review and strengthen contingency plans.
          </p>
        </div>
      )}
    </div>
  );
});

export default StressTestResultsViewer;
