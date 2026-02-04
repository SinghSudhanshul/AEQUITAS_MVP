'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGamificationStore } from '@/stores/gamification';
import type { BillableHourEntry, BillableHourSummary } from '@/types/wings/bullpen';

interface BillableHourTrackerProps {
  entries?: BillableHourEntry[];
  onStartTimer?: () => void;
  onStopTimer?: () => void;
  className?: string;
}

export const BillableHourTracker = React.memo(function BillableHourTracker({ entries = [], onStartTimer, onStopTimer, className }: BillableHourTrackerProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [taskDescription, setTaskDescription] = React.useState('');
  const { addXP } = useGamificationStore();

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (isRunning) {
      addXP(Math.floor(elapsed / 60) * 5, 'Time tracked');
      onStopTimer?.();
    } else {
      onStartTimer?.();
    }
    setIsRunning(!isRunning);
  };

  const summary: BillableHourSummary = {
    userId: 'current',
    period: 'This Week',
    totalHours: 38.5,
    billableHours: 32.5,
    nonBillableHours: 6,
    utilizationRate: 84.4,
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Timer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-gradient-to-br from-navy-900/95 to-navy-800/90 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', isRunning ? 'bg-emerald-500/20' : 'bg-white/10')}>
              <Clock className={cn('h-6 w-6', isRunning ? 'text-emerald-400' : 'text-slate-400')} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Time Tracker</h3>
              <p className="text-sm text-slate-400">{isRunning ? 'Timer running...' : 'Click start to begin'}</p>
            </div>
          </div>
          <motion.span animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }} transition={{ repeat: isRunning ? Infinity : 0, duration: 1 }} className="font-mono text-4xl font-bold text-white">
            {formatTime(elapsed)}
          </motion.span>
        </div>
        <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="What are you working on?" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none mb-4" />
        <div className="flex gap-3">
          <Button onClick={handleToggle} className={cn('flex-1', isRunning ? 'bg-red-500 hover:bg-red-600' : '')}>
            {isRunning ? <><Pause className="mr-2 h-4 w-4" />Stop</> : <><Play className="mr-2 h-4 w-4" />Start</>}
          </Button>
          <Button variant="outline" onClick={() => { setElapsed(0); setIsRunning(false); }}>Reset</Button>
        </div>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: summary.totalHours, icon: Clock, color: 'text-white' },
          { label: 'Billable', value: summary.billableHours, icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Non-Billable', value: summary.nonBillableHours, icon: Clock, color: 'text-slate-400' },
          { label: 'Utilization', value: `${summary.utilizationRate}%`, icon: TrendingUp, color: 'text-amber-400' },
        ].map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="rounded-lg border border-white/10 bg-navy-900/50 p-4">
            <div className="flex items-center justify-between">
              <stat.icon className={cn('h-4 w-4', stat.color)} />
            </div>
            <div className={cn('mt-2 text-2xl font-bold', stat.color)}>{stat.value}</div>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Donna message */}
      <div className="rounded-lg border border-white/5 bg-white/5 p-4">
        <p className="text-sm text-slate-400"><span className="font-medium text-rose-400">Donna:</span> "You're on track this week. Keep it up and you'll hit your target by Thursday."</p>
      </div>
    </div>
  );
});

export default BillableHourTracker;
