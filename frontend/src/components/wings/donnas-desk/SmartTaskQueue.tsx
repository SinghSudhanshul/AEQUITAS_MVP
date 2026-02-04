'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Play, ArrowRight, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { DonnaTask } from '@/types/wings/donnas-desk';

interface SmartTaskQueueProps {
  tasks?: DonnaTask[];
  onRunTask?: (task: DonnaTask) => void;
  className?: string;
}

const mockTasks: DonnaTask[] = [
  { id: '1', title: 'Generate Morning Briefing', status: 'completed', priority: 'high', estimatedTime: 30, completedAt: new Date(Date.now() - 3600000).toISOString(), result: 'Briefing sent to 3 team members' },
  { id: '2', title: 'Monitor Goldman Margin Levels', status: 'running', priority: 'high', estimatedTime: 0, progress: 100, isRecurring: true },
  { id: '3', title: 'Prepare Settlement Documents', status: 'queued', priority: 'medium', estimatedTime: 15 },
  { id: '4', title: 'Schedule Strategy Meeting', status: 'queued', priority: 'low', estimatedTime: 5 },
  { id: '5', title: 'Review Compliance Checklist', status: 'queued', priority: 'medium', estimatedTime: 10 },
];

const statusConfig = {
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle2 },
  running: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Play },
  queued: { color: 'text-slate-400', bg: 'bg-slate-500/20', icon: Clock },
  failed: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertCircle },
};

const priorityColors = { low: 'border-slate-500', medium: 'border-amber-500', high: 'border-rose-500' };

export const SmartTaskQueue = React.memo(function SmartTaskQueue({ tasks = mockTasks, onRunTask, className }: SmartTaskQueueProps) {
  const runningCount = tasks.filter(t => t.status === 'running').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-rose-400" />
          <div>
            <h3 className="font-semibold text-white">Smart Task Queue</h3>
            <p className="text-sm text-slate-400">Donna's automated workflows</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-blue-400">{runningCount} running</span>
          <span className="text-emerald-400">{completedCount} done</span>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task, idx) => {
          const status = statusConfig[task.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={cn(
                'rounded-xl border-l-4 bg-navy-900/50 p-4',
                priorityColors[task.priority]
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={task.status === 'running' ? { rotate: 360 } : {}}
                    transition={{ repeat: task.status === 'running' ? Infinity : 0, duration: 2, ease: 'linear' }}
                    className={cn('flex h-10 w-10 items-center justify-center rounded-full', status.bg)}
                  >
                    <StatusIcon className={cn('h-5 w-5', status.color)} />
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn('font-medium', task.status === 'completed' ? 'text-slate-400' : 'text-white')}>
                        {task.title}
                      </span>
                      {task.isRecurring && (
                        <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">Recurring</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      {task.estimatedTime > 0 && <span>~{task.estimatedTime}s</span>}
                      {task.result && <span className="text-emerald-400">{task.result}</span>}
                    </div>
                  </div>
                </div>

                {task.status === 'queued' && (
                  <Button size="sm" variant="outline" onClick={() => onRunTask?.(task)}>
                    Run <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
                {task.status === 'running' && task.progress !== undefined && (
                  <div className="w-24">
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full">
        View All Automated Tasks
      </Button>
    </div>
  );
});

export default SmartTaskQueue;
