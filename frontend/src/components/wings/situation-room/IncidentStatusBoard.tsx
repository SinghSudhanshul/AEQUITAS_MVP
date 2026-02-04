'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Radio, AlertTriangle, Shield, CheckCircle2, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { IncidentStatus } from '@/types/wings/situation-room';

interface IncidentStatusBoardProps {
  incidents?: IncidentStatus[];
  onResolve?: (incident: IncidentStatus) => void;
  className?: string;
}

const mockIncidents: IncidentStatus[] = [
  { id: '1', title: 'Goldman Margin Breach', severity: 'critical', status: 'active', startTime: new Date(Date.now() - 1800000).toISOString(), assignee: 'Trading Desk', progress: 65 },
  { id: '2', title: 'API Latency Spike', severity: 'high', status: 'investigating', startTime: new Date(Date.now() - 900000).toISOString(), assignee: 'Tech Team', progress: 30 },
  { id: '3', title: 'Settlement Delay', severity: 'medium', status: 'monitoring', startTime: new Date(Date.now() - 600000).toISOString(), assignee: 'Operations', progress: 80 },
];

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
};

const statusConfig = {
  active: { label: 'Active', icon: Zap, color: 'text-red-400' },
  investigating: { label: 'Investigating', icon: Radio, color: 'text-amber-400' },
  monitoring: { label: 'Monitoring', icon: Shield, color: 'text-blue-400' },
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400' },
};

export const IncidentStatusBoard = React.memo(function IncidentStatusBoard({ incidents = mockIncidents, onResolve, className }: IncidentStatusBoardProps) {
  const activeCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: activeCount > 0 ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: activeCount > 0 ? Infinity : 0, duration: 1.5 }}
            className={cn('flex h-10 w-10 items-center justify-center rounded-lg', activeCount > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20')}
          >
            <Radio className={cn('h-5 w-5', activeCount > 0 ? 'text-red-400' : 'text-emerald-400')} />
          </motion.div>
          <div>
            <h3 className="font-semibold text-white">Incident Status Board</h3>
            <p className="text-sm text-slate-400">{activeCount} active incident{activeCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {incidents.map((incident, idx) => {
          const sev = severityConfig[incident.severity];
          const stat = statusConfig[incident.status];
          const StatusIcon = stat.icon;
          const elapsed = Math.floor((Date.now() - new Date(incident.startTime).getTime()) / 60000);

          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn('rounded-xl border p-4', sev.border, sev.bg)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={incident.status === 'active' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: incident.status === 'active' ? Infinity : 0, duration: 1 }}
                    className={cn('flex h-10 w-10 items-center justify-center rounded-full', sev.bg)}
                  >
                    <AlertTriangle className={cn('h-5 w-5', sev.color)} />
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{incident.title}</h4>
                      <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', sev.bg, sev.color)}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <StatusIcon className={cn('h-4 w-4', stat.color)} />
                        <span>{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{elapsed}m ago</span>
                      </div>
                      <span>Assigned: {incident.assignee}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 w-48">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Resolution Progress</span>
                        <span className="text-slate-400">{incident.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className={cn('h-full', incident.progress >= 80 ? 'bg-emerald-500' : incident.progress >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                          initial={{ width: 0 }}
                          animate={{ width: `${incident.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {incident.status !== 'resolved' && (
                  <Button size="sm" variant="outline" onClick={() => onResolve?.(incident)}>
                    Resolve
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default IncidentStatusBoard;
