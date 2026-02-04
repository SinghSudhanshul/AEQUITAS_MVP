'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResidualDiagnosticsData } from '@/types/wings/library';

interface ResidualDiagnosticsPlotProps {
  data?: ResidualDiagnosticsData[];
  model?: string;
  className?: string;
}

const generateMockData = (): ResidualDiagnosticsData[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    predicted: 2000000 + Math.random() * 1000000,
    residual: (Math.random() - 0.5) * 200000,
    standardized: (Math.random() - 0.5) * 4,
    isOutlier: Math.random() > 0.95,
  }));
};

export const ResidualDiagnosticsPlot = React.memo(function ResidualDiagnosticsPlot({ data, model = 'Quantile GBT', className }: ResidualDiagnosticsPlotProps) {
  const plotData = data || generateMockData();
  const outliers = plotData.filter(d => d.isOutlier).length;
  const meanResidual = plotData.reduce((sum, d) => sum + d.residual, 0) / plotData.length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-violet-400" />
          <div>
            <h3 className="font-semibold text-white">Residual Diagnostics</h3>
            <p className="text-sm text-slate-400">{model} model errors</p>
          </div>
        </div>
        {outliers > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-400">{outliers} outliers</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 40 }}>
            <XAxis dataKey="predicted" stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} name="Predicted" />
            <YAxis dataKey="residual" stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} name="Residual" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number) => [`$${(value / 1000).toFixed(1)}K`, '']}
            />
            <Scatter data={plotData}>
              {plotData.map((entry, index) => (
                <Cell key={index} fill={entry.isOutlier ? '#ef4444' : '#8b5cf6'} opacity={entry.isOutlier ? 1 : 0.6} />
              ))}
            </Scatter>
            {/* Zero line */}
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#475569" strokeDasharray="4" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Mean Residual', value: `$${(meanResidual / 1000).toFixed(1)}K` },
          { label: 'Std Dev', value: `$${(Math.sqrt(plotData.reduce((sum, d) => sum + d.residual ** 2, 0) / plotData.length) / 1000).toFixed(1)}K` },
          { label: 'Outliers', value: outliers.toString() },
          { label: 'Data Points', value: plotData.length.toString() },
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

export default ResidualDiagnosticsPlot;
