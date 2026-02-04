'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sun, Coffee, Moon, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGamificationStore } from '@/stores/gamification';
import type { DailyStandupNotification as DailyStandupType } from '@/types/wings/lobby';

// ============================================
// DAILY STANDUP NOTIFICATION COMPONENT
// Feature 8: Daily Briefing Notification
// ============================================

interface DailyStandupNotificationProps {
  notification?: DailyStandupType;
  onDismiss?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const timeGreetings = {
  morning: { icon: <Coffee className="h-5 w-5" />, greeting: 'Good morning' },
  afternoon: { icon: <Sun className="h-5 w-5" />, greeting: 'Good afternoon' },
  evening: { icon: <Moon className="h-5 w-5" />, greeting: 'Good evening' },
};

const mockNotification: DailyStandupType = {
  id: 'standup-today',
  date: new Date().toISOString(),
  forecasts: {
    todayP50: 2450000,
    change: 3.2,
    regime: 'steady',
  },
  alerts: 2,
  tasks: 5,
  harveyMessage: "Let's win the day. You've got the tools, now use them.",
  donnaMessage: "I've prepared your morning brief. Three things need attention.",
};

export const DailyStandupNotification = React.memo(function DailyStandupNotification({
  notification = mockNotification,
  onDismiss,
  onViewDetails,
  className,
}: DailyStandupNotificationProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const timeOfDay = getTimeOfDay();
  const timeConfig = timeGreetings[timeOfDay];
  const { user } = useGamificationStore();

  const isPositiveChange = notification.forecasts.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10',
        'bg-gradient-to-br from-navy-900/95 to-navy-800/90',
        'backdrop-blur-xl shadow-2xl',
        className
      )}
    >
      {/* Accent gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              {timeConfig.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {timeConfig.greeting}, {user?.displayName || 'Counselor'}
              </h3>
              <p className="text-sm text-slate-400">
                {format(new Date(notification.date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-slate-400 hover:text-white"
          >
            Dismiss
          </Button>
        </div>

        {/* Metrics row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {/* Today's Forecast */}
          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Today's Forecast</span>
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">
                ${(notification.forecasts.todayP50 / 1000000).toFixed(2)}M
              </span>
              <span className={cn(
                'ml-2 text-sm font-medium',
                isPositiveChange ? 'text-emerald-400' : 'text-red-400'
              )}>
                {isPositiveChange ? '+' : ''}{notification.forecasts.change}%
              </span>
            </div>
            <div className="mt-1">
              <span className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                notification.forecasts.regime === 'steady' && 'bg-emerald-500/20 text-emerald-400',
                notification.forecasts.regime === 'elevated' && 'bg-amber-500/20 text-amber-400',
                notification.forecasts.regime === 'crisis' && 'bg-red-500/20 text-red-400',
              )}>
                {notification.forecasts.regime.charAt(0).toUpperCase() + notification.forecasts.regime.slice(1)} Regime
              </span>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Active Alerts</span>
              <AlertCircle className={cn(
                'h-4 w-4',
                notification.alerts > 0 ? 'text-amber-400' : 'text-slate-500'
              )} />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{notification.alerts}</span>
              <span className="ml-2 text-sm text-slate-400">
                {notification.alerts === 1 ? 'alert' : 'alerts'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {notification.alerts > 0 ? 'Review recommended' : 'All clear'}
            </p>
          </div>

          {/* Tasks */}
          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Pending Tasks</span>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{notification.tasks}</span>
              <span className="ml-2 text-sm text-slate-400">
                {notification.tasks === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {notification.tasks > 0 ? 'Due today' : 'Nothing pending'}
            </p>
          </div>
        </div>

        {/* Donna's message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-lg border border-white/5 bg-white/5 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20">
              <span className="text-sm font-bold text-rose-400">D</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Donna says:</p>
              <p className="mt-1 text-sm text-slate-300">{notification.donnaMessage}</p>
            </div>
          </div>
        </motion.div>

        {/* Harvey's quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 border-l-2 border-amber-500/50 pl-4"
        >
          <p className="text-sm italic text-slate-400">"{notification.harveyMessage}"</p>
          <p className="mt-1 text-xs font-medium text-amber-500/60">— Harvey Specter</p>
        </motion.div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button onClick={onViewDetails} className="flex-1">
            View Full Brief
          </Button>
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
            {notification.alerts > 0 ? 'Review Alerts' : 'View Tasks'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

export default DailyStandupNotification;
