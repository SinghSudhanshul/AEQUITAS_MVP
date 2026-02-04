'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Activity, User, Clock, Shield, AlertTriangle, Eye, Download, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AccessLogEntry } from '@/types/wings/vault';

interface AccessLogViewerProps {
  logs?: AccessLogEntry[];
  onFilterChange?: (filter: string) => void;
  className?: string;
}

const mockLogs: AccessLogEntry[] = [
  { id: '1', user: 'Harvey AI', action: 'view', resource: 'Master Position File', timestamp: new Date(Date.now() - 1800000).toISOString(), success: true, ipAddress: '10.0.1.45' },
  { id: '2', user: 'john.doe@firm.com', action: 'download', resource: 'Settlement Records 2024', timestamp: new Date(Date.now() - 3600000).toISOString(), success: true, ipAddress: '192.168.1.100' },
  { id: '3', user: 'external_audit', action: 'view', resource: 'Regulatory Filings', timestamp: new Date(Date.now() - 7200000).toISOString(), success: true, ipAddress: '203.0.113.50' },
  { id: '4', user: 'unknown', action: 'access', resource: 'Broker Credentials', timestamp: new Date(Date.now() - 10800000).toISOString(), success: false, ipAddress: '198.51.100.23', failReason: 'Insufficient permissions' },
];

const actionConfig = {
  view: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Eye },
  download: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Download },
  access: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Lock },
  modify: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: Shield },
};

export const AccessLogViewer = React.memo(function AccessLogViewer({ logs = mockLogs, onFilterChange, className }: AccessLogViewerProps) {
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? logs : filter === 'failed' ? logs.filter(l => !l.success) : logs.filter(l => l.action === filter);

  const handleFilterChange = (f: string) => {
    setFilter(f);
    onFilterChange?.(f);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white">Access Logs</h3>
            <p className="text-sm text-slate-400">Security audit trail</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Export Logs</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'view', 'download', 'access', 'failed'].map(f => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
              filter === f ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10',
              f === 'failed' && 'text-red-400'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filtered.map((log, idx) => {
          const action = actionConfig[log.action] || actionConfig.access;
          const ActionIcon = action.icon;

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={cn(
                'rounded-lg border p-4',
                log.success ? 'border-white/10 bg-white/5' : 'border-red-500/30 bg-red-500/5'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', log.success ? action.bg : 'bg-red-500/20')}>
                    {log.success ? (
                      <ActionIcon className={cn('h-5 w-5', action.color)} />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{log.user}</span>
                      <span className={cn('text-sm capitalize', action.color)}>{log.action}</span>
                      <span className="text-sm text-slate-400">{log.resource}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                    {!log.success && log.failReason && (
                      <p className="text-sm text-red-400 mt-1">{log.failReason}</p>
                    )}
                  </div>
                </div>
                <div className={cn('rounded-full px-2 py-1 text-xs', log.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')}>
                  {log.success ? 'Success' : 'Failed'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default AccessLogViewer;
