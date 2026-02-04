'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, ArrowRight, Building2, Clock, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SettlementCalendarEvent } from '@/types/wings/treasury';

interface SettlementCalendarProps {
  events?: SettlementCalendarEvent[];
  onEventClick?: (event: SettlementCalendarEvent) => void;
  className?: string;
}

const mockEvents: SettlementCalendarEvent[] = [
  { id: '1', date: new Date().toISOString(), broker: 'Goldman Sachs', type: 'settlement', amount: 450000, status: 'pending' },
  { id: '2', date: new Date(Date.now() + 86400000).toISOString(), broker: 'Morgan Stanley', type: 'margin', amount: 125000, status: 'scheduled' },
  { id: '3', date: new Date(Date.now() + 172800000).toISOString(), broker: 'JP Morgan', type: 'settlement', amount: 380000, status: 'scheduled' },
  { id: '4', date: new Date(Date.now() - 86400000).toISOString(), broker: 'Citadel', type: 'dividend', amount: 52000, status: 'completed' },
];

const statusConfig = {
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Clock },
  scheduled: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Calendar },
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: Check },
  failed: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertCircle },
};

const typeColors = {
  settlement: 'border-l-blue-500',
  margin: 'border-l-amber-500',
  dividend: 'border-l-emerald-500',
  fee: 'border-l-slate-500',
};

export const SettlementCalendar = React.memo(function SettlementCalendar({ events = mockEvents, onEventClick, className }: SettlementCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const today = new Date().toDateString();

  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = new Date(event.date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, SettlementCalendarEvent[]>);

  const upcomingTotal = events.filter(e => e.status !== 'completed').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-white">Settlement Calendar</h3>
            <p className="text-sm text-slate-400">Upcoming financial events</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Upcoming Total</span>
          <p className="text-lg font-bold text-white">${(upcomingTotal / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Timeline view */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4 space-y-4">
        {Object.entries(groupedEvents).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()).map(([dateKey, dayEvents]) => {
          const isToday = dateKey === today;
          const isPast = new Date(dateKey) < new Date(today);

          return (
            <div key={dateKey}>
              <div className={cn('text-sm font-medium mb-2', isToday ? 'text-amber-400' : isPast ? 'text-slate-500' : 'text-slate-300')}>
                {isToday ? 'Today' : new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="space-y-2">
                {dayEvents.map((event, idx) => {
                  const status = statusConfig[event.status];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        'flex items-center justify-between rounded-lg border-l-4 bg-white/5 p-3 cursor-pointer hover:bg-white/10 transition-colors',
                        typeColors[event.type]
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', status.bg)}>
                          <StatusIcon className={cn('h-4 w-4', status.color)} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{event.broker}</p>
                          <p className="text-xs text-slate-400 capitalize">{event.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">${(event.amount / 1000).toFixed(0)}K</p>
                        <span className={cn('text-xs capitalize', status.color)}>{event.status}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className={cn('h-3 w-1 rounded', color.replace('border-l-', 'bg-'))} />
            <span className="text-slate-400 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SettlementCalendar;
