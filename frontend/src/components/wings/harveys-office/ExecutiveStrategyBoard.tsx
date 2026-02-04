'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, ArrowRight, CheckCircle2, Clock, Zap, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { StrategicGoal } from '@/types/wings/harveys-office';

interface ExecutiveStrategyBoardProps {
  goals?: StrategicGoal[];
  onGoalClick?: (goal: StrategicGoal) => void;
  className?: string;
}

const mockGoals: StrategicGoal[] = [
  { id: '1', title: 'Reduce Margin Exposure', target: 'Under 70%', current: '82%', progress: 65, deadline: '2024-01-15', priority: 'high', status: 'in_progress' },
  { id: '2', title: 'Increase Liquidity Buffer', target: '$3M', current: '$2.45M', progress: 82, deadline: '2024-01-31', priority: 'medium', status: 'in_progress' },
  { id: '3', title: 'Close Goldman Settlement', target: 'Favorable terms', current: 'Negotiating', progress: 45, deadline: '2024-01-20', priority: 'high', status: 'in_progress' },
  { id: '4', title: 'Q4 Compliance Audit', target: 'Clean report', current: 'Completed', progress: 100, deadline: '2024-01-10', priority: 'medium', status: 'completed' },
];

const priorityColors = { low: 'border-blue-500', medium: 'border-amber-500', high: 'border-red-500' };
const statusConfig = {
  in_progress: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Clock },
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle2 },
  at_risk: { color: 'text-red-400', bg: 'bg-red-500/20', icon: Zap },
};

export const ExecutiveStrategyBoard = React.memo(function ExecutiveStrategyBoard({ goals = mockGoals, onGoalClick, className }: ExecutiveStrategyBoardProps) {
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const overallProgress = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Strategic Objectives</h3>
            <p className="text-sm text-slate-400">Executive priority dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm text-slate-400">Completed</span>
            <p className="text-lg font-bold text-emerald-400">{completedCount}/{goals.length}</p>
          </div>
          <div className="w-24">
            <Progress value={overallProgress} variant="prestige" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {goals.map((goal, idx) => {
          const status = statusConfig[goal.status];
          const StatusIcon = status.icon;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onGoalClick?.(goal)}
              className={cn(
                'rounded-xl border-l-4 bg-navy-900/50 p-5 cursor-pointer hover:bg-navy-800/50 transition-colors',
                priorityColors[goal.priority]
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn('h-5 w-5', status.color)} />
                  <span className={cn('text-xs font-medium uppercase', status.color)}>{goal.status.replace('_', ' ')}</span>
                </div>
                <span className={cn(
                  'text-xs',
                  daysLeft <= 0 ? 'text-red-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-slate-400'
                )}>
                  {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-2">{goal.title}</h4>

              <div className="flex items-center gap-4 text-sm mb-4">
                <div>
                  <span className="text-slate-500">Target:</span>
                  <span className="text-white ml-1">{goal.target}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <div>
                  <span className="text-slate-500">Current:</span>
                  <span className={cn('ml-1', goal.status === 'completed' ? 'text-emerald-400' : 'text-amber-400')}>
                    {goal.current}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className={cn('font-medium', goal.progress >= 80 ? 'text-emerald-400' : 'text-white')}>
                    {goal.progress}%
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default ExecutiveStrategyBoard;
