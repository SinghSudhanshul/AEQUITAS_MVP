'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, TrendingUp, Trophy, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeamPerformanceData } from '@/types/wings/harveys-office';

interface TeamPerformanceOverviewProps {
  data?: TeamPerformanceData[];
  className?: string;
}

const mockData: TeamPerformanceData[] = [
  { name: 'Analysis', score: 92, target: 85, deals: 15, xpEarned: 4500 },
  { name: 'Execution', score: 88, target: 90, deals: 12, xpEarned: 3200 },
  { name: 'Strategy', score: 95, target: 85, deals: 8, xpEarned: 5100 },
  { name: 'Compliance', score: 78, target: 80, deals: 22, xpEarned: 2800 },
];

const getBarColor = (score: number, target: number) => {
  return score >= target ? '#10b981' : '#f59e0b';
};

export const TeamPerformanceOverview = React.memo(function TeamPerformanceOverview({ data = mockData, className }: TeamPerformanceOverviewProps) {
  const avgScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;
  const totalDeals = data.reduce((sum, d) => sum + d.deals, 0);
  const totalXP = data.reduce((sum, d) => sum + d.xpEarned, 0);
  const topPerformer = [...data].sort((a, b) => b.score - a.score)[0];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Team Performance</h3>
            <p className="text-sm text-slate-400">Department metrics</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <TrendingUp className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
          <span className="text-xs text-slate-400">Avg Score</span>
          <p className="text-lg font-bold text-white">{avgScore.toFixed(0)}%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <Trophy className="h-5 w-5 text-amber-400 mx-auto mb-1" />
          <span className="text-xs text-slate-400">Total Deals</span>
          <p className="text-lg font-bold text-white">{totalDeals}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <Star className="h-5 w-5 text-purple-400 mx-auto mb-1" />
          <span className="text-xs text-slate-400">XP Earned</span>
          <p className="text-lg font-bold text-white">{(totalXP / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
          <Crown className="h-5 w-5 text-amber-400 mx-auto mb-1" />
          <span className="text-xs text-slate-400">Top Team</span>
          <p className="text-lg font-bold text-amber-400">{topPerformer.name}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              formatter={(value: number, name: string) => [`${value}%`, name === 'score' ? 'Score' : 'Target']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.score, entry.target)} />
              ))}
            </Bar>
            <Bar dataKey="target" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Details */}
      <div className="grid grid-cols-4 gap-2">
        {data.map((dept) => (
          <div key={dept.name} className={cn(
            'rounded-lg border p-3',
            dept.score >= dept.target ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'
          )}>
            <span className="text-xs text-slate-400">{dept.name}</span>
            <div className="flex items-baseline gap-1">
              <span className={cn('text-lg font-bold', dept.score >= dept.target ? 'text-emerald-400' : 'text-amber-400')}>
                {dept.score}%
              </span>
              <span className="text-xs text-slate-500">/ {dept.target}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TeamPerformanceOverview;
