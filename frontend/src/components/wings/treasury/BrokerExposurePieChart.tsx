'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BrokerExposureData } from '@/types/wings/treasury';

interface BrokerExposurePieChartProps {
  data?: BrokerExposureData[];
  className?: string;
}

const mockData: BrokerExposureData[] = [
  { broker: 'Goldman Sachs', exposure: 850000, percentage: 32, margin: 78, color: '#3b82f6' },
  { broker: 'Morgan Stanley', exposure: 620000, percentage: 23, margin: 65, color: '#10b981' },
  { broker: 'JP Morgan', exposure: 540000, percentage: 20, margin: 72, color: '#f59e0b' },
  { broker: 'Citadel', exposure: 420000, percentage: 16, margin: 58, color: '#8b5cf6' },
  { broker: 'Others', exposure: 240000, percentage: 9, margin: 45, color: '#64748b' },
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export const BrokerExposurePieChart = React.memo(function BrokerExposurePieChart({ data = mockData, className }: BrokerExposurePieChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const totalExposure = data.reduce((sum, d) => sum + d.exposure, 0);
  const highMarginBroker = data.find(d => d.margin >= 75);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Broker Exposure</h3>
            <p className="text-sm text-slate-400">Position distribution</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-slate-400">Total</span>
          <p className="text-lg font-bold text-white">${(totalExposure / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      {highMarginBroker && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-amber-400">{highMarginBroker.broker} margin at {highMarginBroker.margin}%</span>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              dataKey="exposure"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.broker}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                  stroke={activeIndex === index ? '#fff' : 'transparent'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'Exposure']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map((entry) => (
          <div key={entry.broker} className="flex items-center justify-between rounded-lg bg-white/5 p-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-slate-300">{entry.broker}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-white">${(entry.exposure / 1000).toFixed(0)}K</span>
              <span className={cn('ml-2 text-xs', entry.margin >= 75 ? 'text-amber-400' : 'text-slate-400')}>
                {entry.margin}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default BrokerExposurePieChart;
