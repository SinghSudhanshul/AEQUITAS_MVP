'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, Video, Bell, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CalendarEvent } from '@/types/wings/donnas-desk';

interface CalendarIntegrationProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Morning Standup', time: '09:00', duration: 30, type: 'meeting', attendees: 5, location: 'Zoom', isRecurring: true },
  { id: '2', title: 'Goldman Review Call', time: '10:30', duration: 60, type: 'external', attendees: 3, location: 'Teams', priority: 'high' },
  { id: '3', title: 'Strategy Planning', time: '14:00', duration: 90, type: 'meeting', attendees: 8, location: 'Conference Room A' },
  { id: '4', title: 'Settlement Deadline', time: '17:00', duration: 0, type: 'deadline', priority: 'high' },
];

const typeConfig = {
  meeting: { color: 'border-blue-500', bg: 'bg-blue-500/10', icon: Users },
  external: { color: 'border-purple-500', bg: 'bg-purple-500/10', icon: Video },
  deadline: { color: 'border-red-500', bg: 'bg-red-500/10', icon: Bell },
  reminder: { color: 'border-amber-500', bg: 'bg-amber-500/10', icon: Clock },
};

export const CalendarIntegration = React.memo(function CalendarIntegration({ events = mockEvents, onEventClick, className }: CalendarIntegrationProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const upcomingDeadlines = events.filter(e => e.type === 'deadline');

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Today's Schedule</h3>
            <p className="text-sm text-slate-400">{today}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />Add Event
        </Button>
      </div>

      {upcomingDeadlines.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <Bell className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-400">{upcomingDeadlines.length} deadline(s) today</span>
        </div>
      )}

      <div className="space-y-3">
        {events.map((event, idx) => {
          const type = typeConfig[event.type] || typeConfig.meeting;
          const TypeIcon = type.icon;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onEventClick?.(event)}
              className={cn(
                'rounded-xl border-l-4 p-4 cursor-pointer hover:bg-white/5 transition-colors',
                type.color,
                type.bg
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold text-white">{event.time}</p>
                    {event.duration > 0 && (
                      <p className="text-xs text-slate-400">{event.duration}m</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{event.title}</h4>
                      {event.priority === 'high' && (
                        <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">Priority</span>
                      )}
                      {event.isRecurring && (
                        <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">Daily</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                      {event.attendees && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />{event.attendees}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1">
                          {event.location.includes('Zoom') || event.location.includes('Teams') ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <TypeIcon className={cn('h-5 w-5', type.color.replace('border-', 'text-'))} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default CalendarIntegration;
