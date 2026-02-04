'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Cloud, Check, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { BackupInfo } from '@/types/wings/vault';

interface BackupStatusProps {
  backups?: BackupInfo[];
  onTriggerBackup?: () => void;
  className?: string;
}

const mockBackups: BackupInfo[] = [
  { id: '1', type: 'full', location: 'Primary DC', status: 'completed', timestamp: new Date(Date.now() - 3600000).toISOString(), size: '2.4 GB', retention: 30 },
  { id: '2', type: 'incremental', location: 'Cloud (AWS)', status: 'completed', timestamp: new Date(Date.now() - 7200000).toISOString(), size: '145 MB', retention: 14 },
  { id: '3', type: 'full', location: 'Secondary DC', status: 'in_progress', timestamp: new Date().toISOString(), size: '0 B', retention: 30, progress: 67 },
  { id: '4', type: 'snapshot', location: 'Local', status: 'scheduled', timestamp: new Date(Date.now() + 3600000).toISOString(), retention: 7 },
];

const typeConfig = {
  full: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Database },
  incremental: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Server },
  snapshot: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: Cloud },
};

const statusConfig = {
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Completed' },
  in_progress: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'In Progress' },
  scheduled: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Scheduled' },
  failed: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Failed' },
};

export const BackupStatus = React.memo(function BackupStatus({ backups = mockBackups, onTriggerBackup, className }: BackupStatusProps) {
  const lastSuccess = backups.find(b => b.status === 'completed');
  const inProgressCount = backups.filter(b => b.status === 'in_progress').length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Backup Status</h3>
            <p className="text-sm text-slate-400">Data protection overview</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onTriggerBackup} disabled={inProgressCount > 0}>
          <RefreshCw className={cn('mr-2 h-4 w-4', inProgressCount > 0 && 'animate-spin')} />
          {inProgressCount > 0 ? 'In Progress...' : 'Backup Now'}
        </Button>
      </div>

      {/* Last successful backup */}
      {lastSuccess && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <Check className="h-5 w-5 text-emerald-400" />
          <div>
            <span className="text-sm text-emerald-400">Last successful backup</span>
            <p className="text-white font-medium">
              {new Date(lastSuccess.timestamp).toLocaleString()} • {lastSuccess.size}
            </p>
          </div>
        </div>
      )}

      {/* Backup list */}
      <div className="space-y-3">
        {backups.map((backup, idx) => {
          const type = typeConfig[backup.type] || typeConfig.full;
          const TypeIcon = type.icon;
          const status = statusConfig[backup.status];

          return (
            <motion.div
              key={backup.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-white/10 bg-navy-900/50 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', type.bg)}>
                    <TypeIcon className={cn('h-5 w-5', type.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('font-medium text-white capitalize')}>{backup.type} Backup</span>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs', status.bg, status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{backup.location}</span>
                      {backup.size && <span>{backup.size}</span>}
                      <span>Retention: {backup.retention}d</span>
                    </div>

                    {backup.status === 'in_progress' && backup.progress !== undefined && (
                      <div className="mt-3 w-48">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-blue-400">{backup.progress}%</span>
                        </div>
                        <Progress value={backup.progress} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {backup.status === 'scheduled' ? (
                      <span>Scheduled: {new Date(backup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    ) : (
                      <span>{new Date(backup.timestamp).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default BackupStatus;
