'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, AlertCircle, Clock, Shield, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { ComplianceChecklistItem } from '@/types/wings/war-room';

interface ComplianceChecklistProps {
  items?: ComplianceChecklistItem[];
  onToggleItem?: (item: ComplianceChecklistItem) => void;
  className?: string;
}

const mockItems: ComplianceChecklistItem[] = [
  { id: '1', title: 'Document Retention Verified', category: 'discovery', status: 'completed', priority: 'high', notes: 'All documents preserved per legal hold' },
  { id: '2', title: 'Privilege Review Complete', category: 'privilege', status: 'completed', priority: 'high', notes: 'Attorney-client privilege marked' },
  { id: '3', title: 'Expert Witness Disclosed', category: 'disclosure', status: 'in_progress', priority: 'medium', notes: 'Awaiting final report', progress: 75 },
  { id: '4', title: 'Settlement Authority Obtained', category: 'approval', status: 'pending', priority: 'high', notes: 'Pending board approval' },
  { id: '5', title: 'Insurance Notification', category: 'insurance', status: 'completed', priority: 'low', notes: 'D&O carrier notified' },
  { id: '6', title: 'Regulatory Filing Prepared', category: 'regulatory', status: 'pending', priority: 'medium', notes: 'Draft under review' },
];

const categoryIcons = {
  discovery: FileText,
  privilege: Shield,
  disclosure: AlertCircle,
  approval: Check,
  insurance: Shield,
  regulatory: Scale,
};

const statusConfig = {
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500', icon: Check },
  in_progress: { color: 'text-blue-400', bg: 'bg-blue-500', icon: Clock },
  pending: { color: 'text-amber-400', bg: 'bg-amber-500', icon: Clock },
  blocked: { color: 'text-red-400', bg: 'bg-red-500', icon: AlertCircle },
};

const priorityColors = { low: 'border-slate-500', medium: 'border-amber-500', high: 'border-red-500' };

export const ComplianceChecklist = React.memo(function ComplianceChecklist({ items = mockItems, onToggleItem, className }: ComplianceChecklistProps) {
  const completedCount = items.filter(i => i.status === 'completed').length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-white">Compliance Checklist</h3>
            <p className="text-sm text-slate-400">Litigation requirements</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-white">{completedCount}/{items.length}</span>
          <p className="text-xs text-slate-400">Complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Overall Progress</span>
          <span className={cn('font-medium', progress >= 80 ? 'text-emerald-400' : 'text-amber-400')}>
            {progress.toFixed(0)}%
          </span>
        </div>
        <Progress value={progress} variant="prestige" />
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item, idx) => {
          const CategoryIcon = categoryIcons[item.category] || FileText;
          const status = statusConfig[item.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={cn(
                'rounded-lg border-l-4 bg-navy-900/50 p-4',
                priorityColors[item.priority]
              )}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onToggleItem?.(item)}
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
                    item.status === 'completed'
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-white/30 bg-transparent hover:border-white/50'
                  )}
                >
                  {item.status === 'completed' && <Check className="h-4 w-4 text-white" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryIcon className={cn('h-4 w-4', status.color)} />
                    <span className={cn('font-medium', item.status === 'completed' ? 'text-slate-400 line-through' : 'text-white')}>
                      {item.title}
                    </span>
                    <span className={cn('rounded-full px-2 py-0.5 text-xs capitalize', status.bg + '/20', status.color)}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{item.notes}</p>

                  {item.status === 'in_progress' && item.progress !== undefined && (
                    <div className="mt-2 w-32">
                      <Progress value={item.progress} className="h-1" />
                    </div>
                  )}
                </div>

                <span className={cn('text-xs capitalize', priorityColors[item.priority].replace('border-', 'text-'))}>
                  {item.priority}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default ComplianceChecklist;
