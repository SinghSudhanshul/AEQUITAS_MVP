'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Clock, User, Tag, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { LegalCase } from '@/types/wings/war-room';

interface CaseFileBrowserProps {
  cases?: LegalCase[];
  onSelectCase?: (caseFile: LegalCase) => void;
  className?: string;
}

const mockCases: LegalCase[] = [
  { id: '1', title: 'Goldman Position Dispute', type: 'dispute', status: 'active', priority: 'high', assignee: 'Harvey AI', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date().toISOString(), tags: ['margin', 'position'] },
  { id: '2', title: 'Regulatory Inquiry Q4', type: 'regulatory', status: 'pending', priority: 'medium', assignee: 'Legal Team', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(), tags: ['SEC', 'disclosure'] },
  { id: '3', title: 'Settlement Negotiation MS', type: 'settlement', status: 'review', priority: 'high', assignee: 'Partners', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: new Date().toISOString(), tags: ['settlement', 'negotiation'] },
];

const typeConfig = {
  dispute: { color: 'text-red-400', bg: 'bg-red-500/20', icon: Scale },
  regulatory: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: FileText },
  settlement: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: FileText },
  litigation: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Scale },
};

const statusColors = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  review: 'bg-blue-500',
  closed: 'bg-slate-500',
};

const priorityColors = { low: 'text-blue-400', medium: 'text-amber-400', high: 'text-red-400' };

export const CaseFileBrowser = React.memo(function CaseFileBrowser({ cases = mockCases, onSelectCase, className }: CaseFileBrowserProps) {
  const [filter, setFilter] = React.useState<string>('all');
  const filtered = filter === 'all' ? cases : cases.filter(c => c.status === filter);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Case Files</h3>
            <p className="text-sm text-slate-400">Active legal matters</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />New Case
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'pending', 'review', 'closed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
              filter === s ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Case list */}
      <div className="space-y-3">
        {filtered.map((caseFile, idx) => {
          const type = typeConfig[caseFile.type] || typeConfig.litigation;
          const TypeIcon = type.icon;

          return (
            <motion.div
              key={caseFile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectCase?.(caseFile)}
              className="rounded-xl border border-white/10 bg-navy-900/50 p-4 cursor-pointer hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', type.bg)}>
                    <TypeIcon className={cn('h-6 w-6', type.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{caseFile.title}</h4>
                      <div className={cn('h-2 w-2 rounded-full', statusColors[caseFile.status])} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className={cn('capitalize', type.color)}>{caseFile.type}</span>
                      <span className={cn(priorityColors[caseFile.priority])}>{caseFile.priority} priority</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />{caseFile.assignee}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />Updated {new Date(caseFile.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {caseFile.tags.map(tag => (
                        <span key={tag} className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default CaseFileBrowser;
