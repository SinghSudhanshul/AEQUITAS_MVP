'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Play, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { PlaybookStep } from '@/types/wings/situation-room';

interface PlaybookExecutionTrackerProps {
  steps?: PlaybookStep[];
  onExecuteStep?: (step: PlaybookStep) => void;
  className?: string;
}

const mockSteps: PlaybookStep[] = [
  { id: '1', name: 'Acknowledge Alert', description: 'Confirm receipt and initiate response', status: 'completed', assignee: 'System', duration: 5, completedAt: new Date(Date.now() - 300000).toISOString() },
  { id: '2', name: 'Assess Impact', description: 'Evaluate financial exposure and risk', status: 'completed', assignee: 'Harvey AI', duration: 30, completedAt: new Date(Date.now() - 270000).toISOString() },
  { id: '3', name: 'Notify Stakeholders', description: 'Alert senior management and compliance', status: 'in_progress', assignee: 'Donna AI', duration: 15 },
  { id: '4', name: 'Execute Mitigation', description: 'Implement risk reduction measures', status: 'pending', assignee: 'Trading Desk', duration: 60 },
  { id: '5', name: 'Document Actions', description: 'Record all actions for audit trail', status: 'pending', assignee: 'Compliance', duration: 30 },
  { id: '6', name: 'Post-Incident Review', description: 'Analyze response and update procedures', status: 'pending', assignee: 'Team Lead', duration: 45 },
];

const statusConfig = {
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500', icon: CheckCircle2 },
  in_progress: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500', icon: Play },
  pending: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500', icon: Clock },
  failed: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500', icon: AlertCircle },
};

export const PlaybookExecutionTracker = React.memo(function PlaybookExecutionTracker({ steps = mockSteps, onExecuteStep, className }: PlaybookExecutionTrackerProps) {
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;
  const totalTime = steps.reduce((sum, s) => sum + s.duration, 0);
  const elapsedTime = steps.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Playbook Execution</h3>
            <p className="text-sm text-slate-400">Crisis response procedures</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-slate-400">Progress</span>
          <p className="text-lg font-bold text-white">{completedSteps}/{steps.length} Steps</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Elapsed / Estimated</span>
          <span className="text-white">{elapsedTime}s / {totalTime}s</span>
        </div>
        <Progress value={progress} variant="prestige" />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const status = statusConfig[step.status];
          const StatusIcon = status.icon;
          const isActive = step.status === 'in_progress';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'rounded-lg border p-4',
                isActive ? status.border : 'border-white/10',
                status.bg
              )}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2',
                    status.border,
                    step.status === 'completed' ? 'bg-emerald-500/30' : 'bg-transparent'
                  )}
                >
                  <StatusIcon className={cn('h-5 w-5', status.color)} />
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{step.name}</h4>
                    <span className="text-xs text-slate-500">~{step.duration}s</span>
                  </div>
                  <p className="text-sm text-slate-400">{step.description}</p>
                  <span className="text-xs text-slate-500">Assigned: {step.assignee}</span>
                </div>

                {step.status === 'pending' && (
                  <Button size="sm" variant="outline" onClick={() => onExecuteStep?.(step)}>
                    Start
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
                {step.status === 'completed' && step.completedAt && (
                  <span className="text-xs text-emerald-400">
                    {new Date(step.completedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default PlaybookExecutionTracker;
