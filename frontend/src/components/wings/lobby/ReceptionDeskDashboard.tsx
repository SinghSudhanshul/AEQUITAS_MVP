'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Home, TrendingUp, TrendingDown, Bell, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGamificationStore } from '@/stores/gamification';
import type { ReceptionDeskData } from '@/types/wings/lobby';

interface ReceptionDeskDashboardProps {
  data?: ReceptionDeskData;
  onQuickAction?: (actionId: string) => void;
  className?: string;
}

const mockData: ReceptionDeskData = {
  welcomeMessage: "Welcome back, Counselor. Here's your morning brief.",
  userName: 'Harvey',
  userRank: 'Senior Partner',
  todaysForecast: 2450000,
  pendingTasks: 5,
  alerts: 2,
  quickActions: [
    { id: 'forecast', label: 'View Forecast', route: '/app/library', icon: 'chart' },
    { id: 'tasks', label: 'My Tasks', route: '/app/bullpen', icon: 'list' },
    { id: 'alerts', label: 'Alerts', route: '/app/situation-room', icon: 'bell' },
    { id: 'strategy', label: 'Strategy', route: '/app/harveys-office', icon: 'target' },
  ],
};

export const ReceptionDeskDashboard = React.memo(function ReceptionDeskDashboard({ data = mockData, onQuickAction, className }: ReceptionDeskDashboardProps) {
  const { user, xp, level, rank } = useGamificationStore();
  const isPositive = true;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-900/95 to-navy-800/90 p-6 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20">
              <Home className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome, {data.userName}</h2>
              <p className="text-slate-400">{data.welcomeMessage}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-sm font-medium text-amber-400">{rank || data.userRank}</span>
                <span className="text-sm text-slate-500">Level {level}</span>
                <span className="text-sm text-emerald-400">{xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-400">Today's Forecast</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">${(data.todaysForecast / 1000000).toFixed(2)}M</span>
              {isPositive ? <TrendingUp className="h-5 w-5 text-emerald-400" /> : <TrendingDown className="h-5 w-5 text-red-400" />}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
          <div className="flex items-center justify-between">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">{data.pendingTasks}</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">Pending Tasks</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between">
            <Bell className="h-5 w-5 text-amber-400" />
            <span className="text-2xl font-bold text-white">{data.alerts}</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">Active Alerts</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-2xl font-bold text-white">98%</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">Accuracy Rate</p>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {data.quickActions.map((action, idx) => (
            <motion.button key={action.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }} onClick={() => onQuickAction?.(action.id)} className="group flex items-center justify-between rounded-lg border border-white/10 bg-navy-900/30 p-4 text-left transition-all hover:border-amber-500/30 hover:bg-navy-800/50">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="font-medium text-white">{action.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Harvey quote */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="border-l-2 border-amber-500/50 pl-4">
        <p className="text-sm italic text-slate-400">"I don't have dreams, I have goals."</p>
        <p className="mt-1 text-xs font-medium text-amber-500/60">— Harvey Specter</p>
      </motion.div>
    </div>
  );
});

export default ReceptionDeskDashboard;
