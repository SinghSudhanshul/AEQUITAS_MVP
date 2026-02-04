'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, Info, X, Clock, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DonnaNotification } from '@/types/wings/donnas-desk';

interface NotificationCenterProps {
  notifications?: DonnaNotification[];
  onDismiss?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  className?: string;
}

const mockNotifications: DonnaNotification[] = [
  { id: '1', type: 'alert', title: 'Margin Alert', message: 'Goldman margin at 82%, approaching threshold', timestamp: new Date(Date.now() - 300000).toISOString(), read: false, priority: 'high' },
  { id: '2', type: 'success', title: 'Task Completed', message: 'Morning briefing sent to all team members', timestamp: new Date(Date.now() - 600000).toISOString(), read: false },
  { id: '3', type: 'info', title: 'Meeting Reminder', message: 'Strategy call in 30 minutes', timestamp: new Date(Date.now() - 900000).toISOString(), read: true },
  { id: '4', type: 'alert', title: 'Settlement Due', message: 'Q4 settlement deadline in 48 hours', timestamp: new Date(Date.now() - 1200000).toISOString(), read: false, priority: 'medium' },
];

const typeConfig = {
  alert: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: AlertTriangle },
  success: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle2 },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Info },
  error: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
};

export const NotificationCenter = React.memo(function NotificationCenter({ notifications = mockNotifications, onDismiss, onMarkRead, className }: NotificationCenterProps) {
  const [filter, setFilter] = React.useState<string>('all');
  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-5 w-5 text-rose-400" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white"
              >
                {unreadCount}
              </motion.div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">Notifications</h3>
            <p className="text-sm text-slate-400">{unreadCount} unread</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Mark All Read</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'alert', 'success', 'info'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
              filter === f ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filtered.map((notification, idx) => {
          const type = typeConfig[notification.type] || typeConfig.info;
          const TypeIcon = type.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                notification.read ? 'border-white/10 bg-white/5' : 'border-white/20 bg-white/10',
                notification.priority === 'high' && 'border-rose-500/30'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', type.bg)}>
                  <TypeIcon className={cn('h-4 w-4', type.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn('font-medium', notification.read ? 'text-slate-400' : 'text-white')}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                    )}
                    {notification.priority === 'high' && (
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-400">High</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{notification.message}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                <button onClick={() => onDismiss?.(notification.id)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default NotificationCenter;
