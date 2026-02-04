'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, User, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { LitigationTimelineEvent } from '@/types/wings/war-room';

interface LitigationTimelineProps {
  events?: LitigationTimelineEvent[];
  onEventClick?: (event: LitigationTimelineEvent) => void;
  className?: string;
}

const mockEvents: LitigationTimelineEvent[] = [
  { id: '1', title: 'Initial Complaint Filed', date: new Date(Date.now() - 86400000 * 30).toISOString(), type: 'milestone', status: 'completed', description: 'Filed formal complaint with regulatory body' },
  { id: '2', title: 'Discovery Period Opens', date: new Date(Date.now() - 86400000 * 20).toISOString(), type: 'deadline', status: 'completed', description: 'Begin evidence collection phase' },
  { id: '3', title: 'Document Production Due', date: new Date(Date.now() - 86400000 * 5).toISOString(), type: 'deadline', status: 'completed', description: 'Submit all requested documents' },
  { id: '4', title: 'Deposition Schedule', date: new Date(Date.now() + 86400000 * 5).toISOString(), type: 'hearing', status: 'upcoming', description: 'Key witness depositions scheduled' },
  { id: '5', title: 'Motion Hearing', date: new Date(Date.now() + 86400000 * 15).toISOString(), type: 'hearing', status: 'upcoming', description: 'Summary judgment motion hearing' },
  { id: '6', title: 'Trial Date', date: new Date(Date.now() + 86400000 * 45).toISOString(), type: 'milestone', status: 'upcoming', description: 'Trial commencement' },
];

const typeConfig = {
  milestone: { color: 'text-purple-400', bg: 'bg-purple-500', icon: Flag },
  deadline: { color: 'text-amber-400', bg: 'bg-amber-500', icon: Calendar },
  hearing: { color: 'text-blue-400', bg: 'bg-blue-500', icon: Calendar },
  filing: { color: 'text-emerald-400', bg: 'bg-emerald-500', icon: Calendar },
};

export const LitigationTimeline = React.memo(function LitigationTimeline({ events = mockEvents, onEventClick, className }: LitigationTimelineProps) {
  const today = Date.now();
  const nextEvent = events.find(e => new Date(e.date).getTime() > today);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-semibold text-white">Litigation Timeline</h3>
            <p className="text-sm text-slate-400">Key dates and milestones</p>
          </div>
        </div>
        {nextEvent && (
          <div className="text-right">
            <span className="text-xs text-slate-400">Next Event</span>
            <p className="text-sm font-medium text-white">{nextEvent.title}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative rounded-xl border border-white/10 bg-navy-900/50 p-6">
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-white/10" />

        <div className="space-y-6">
          {events.map((event, idx) => {
            const type = typeConfig[event.type] || typeConfig.milestone;
            const TypeIcon = type.icon;
            const isCompleted = event.status === 'completed';
            const isUpcoming = event.status === 'upcoming';
            const daysAway = Math.ceil((new Date(event.date).getTime() - today) / 86400000);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onEventClick?.(event)}
                className="relative flex items-start gap-6 cursor-pointer group"
              >
                {/* Timeline dot */}
                <div className={cn(
                  'relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2',
                  isCompleted ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/30 bg-navy-900',
                  type.bg.replace('bg-', 'border-')
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <div className={cn('h-2 w-2 rounded-full', type.bg)} />
                  )}
                </div>

                {/* Content */}
                <div className={cn(
                  'flex-1 rounded-lg border p-4 transition-colors',
                  isUpcoming && daysAway <= 7 ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10 bg-white/5',
                  'group-hover:bg-white/10'
                )}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TypeIcon className={cn('h-4 w-4', type.color)} />
                        <h4 className="font-medium text-white">{event.title}</h4>
                        <span className={cn('rounded-full px-2 py-0.5 text-xs capitalize', isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400')}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{event.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      {isUpcoming && (
                        <span className={cn('text-xs', daysAway <= 7 ? 'text-amber-400' : 'text-slate-400')}>
                          {daysAway === 0 ? 'Today' : `in ${daysAway}d`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default LitigationTimeline;
