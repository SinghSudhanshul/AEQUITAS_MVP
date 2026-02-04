'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Check, AlertCircle, Clock, FileText, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { DocumentReviewItem } from '@/types/wings/war-room';

interface DocumentReviewQueueProps {
  documents?: DocumentReviewItem[];
  onReview?: (doc: DocumentReviewItem) => void;
  className?: string;
}

const mockDocuments: DocumentReviewItem[] = [
  { id: '1', title: 'Position Reconciliation Report', type: 'report', priority: 'high', status: 'pending', pages: 45, assignee: 'Legal Team', dueDate: new Date(Date.now() + 86400000).toISOString() },
  { id: '2', title: 'Settlement Agreement Draft', type: 'contract', priority: 'high', status: 'in_review', pages: 28, assignee: 'Harvey AI', dueDate: new Date(Date.now() + 172800000).toISOString(), progress: 65 },
  { id: '3', title: 'Regulatory Response Letter', type: 'correspondence', priority: 'medium', status: 'pending', pages: 8, assignee: 'Compliance', dueDate: new Date(Date.now() + 86400000 * 3).toISOString() },
  { id: '4', title: 'Evidence Exhibit Bundle', type: 'evidence', priority: 'low', status: 'completed', pages: 120, assignee: 'Paralegal', dueDate: new Date(Date.now() - 86400000).toISOString() },
];

const typeIcons = {
  report: FileText,
  contract: Scale,
  correspondence: FileText,
  evidence: FileSearch,
};

const statusConfig = {
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Pending' },
  in_review: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'In Review' },
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Complete' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Rejected' },
};

export const DocumentReviewQueue = React.memo(function DocumentReviewQueue({ documents = mockDocuments, onReview, className }: DocumentReviewQueueProps) {
  const pendingCount = documents.filter(d => d.status === 'pending').length;
  const inReviewCount = documents.filter(d => d.status === 'in_review').length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileSearch className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Document Review Queue</h3>
            <p className="text-sm text-slate-400">{pendingCount} pending, {inReviewCount} in review</p>
          </div>
        </div>
      </div>

      {/* Queue items */}
      <div className="space-y-3">
        {documents.map((doc, idx) => {
          const TypeIcon = typeIcons[doc.type] || FileText;
          const status = statusConfig[doc.status];
          const daysUntilDue = Math.ceil((new Date(doc.dueDate).getTime() - Date.now()) / 86400000);
          const isOverdue = daysUntilDue < 0;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'rounded-xl border p-4',
                doc.priority === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-navy-900/50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', status.bg)}>
                    <TypeIcon className={cn('h-5 w-5', status.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{doc.title}</h4>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs', status.bg, status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="capitalize">{doc.type}</span>
                      <span>{doc.pages} pages</span>
                      <span>Assigned: {doc.assignee}</span>
                    </div>

                    {doc.status === 'in_review' && doc.progress !== undefined && (
                      <div className="mt-3 w-48">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Review Progress</span>
                          <span className="text-slate-400">{doc.progress}%</span>
                        </div>
                        <Progress value={doc.progress} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={cn('flex items-center gap-1 text-sm', isOverdue ? 'text-red-400' : daysUntilDue <= 1 ? 'text-amber-400' : 'text-slate-400')}>
                    <Clock className="h-4 w-4" />
                    <span>{isOverdue ? 'Overdue' : daysUntilDue === 0 ? 'Due today' : `${daysUntilDue}d`}</span>
                  </div>
                  {doc.status !== 'completed' && (
                    <Button size="sm" variant="outline" onClick={() => onReview?.(doc)}>
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default DocumentReviewQueue;
