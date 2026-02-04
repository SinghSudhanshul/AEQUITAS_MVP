'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, History, User, Clock, Eye, Download, GitBranch, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { MemoItem } from '@/types/wings/harveys-office';

interface MemoArchiveProps {
  memos?: MemoItem[];
  onViewMemo?: (memo: MemoItem) => void;
  className?: string;
}

const mockMemos: MemoItem[] = [
  { id: '1', title: 'Q4 Strategy Review', type: 'strategy', author: 'Harvey AI', date: new Date(Date.now() - 86400000).toISOString(), status: 'final', views: 12, version: 3 },
  { id: '2', title: 'Goldman Situation Analysis', type: 'analysis', author: 'Risk Team', date: new Date(Date.now() - 172800000).toISOString(), status: 'draft', views: 5, version: 1 },
  { id: '3', title: 'Settlement Recommendation', type: 'legal', author: 'War Room', date: new Date(Date.now() - 259200000).toISOString(), status: 'final', views: 28, version: 2 },
  { id: '4', title: 'Margin Optimization Plan', type: 'operations', author: 'Treasury', date: new Date(Date.now() - 345600000).toISOString(), status: 'archived', views: 45, version: 5 },
];

const typeConfig = {
  strategy: { color: 'text-purple-400', bg: 'bg-purple-500/20' },
  analysis: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
  legal: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  operations: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
};

const statusConfig = {
  draft: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  final: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  archived: { color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

export const MemoArchive = React.memo(function MemoArchive({ memos = mockMemos, onViewMemo, className }: MemoArchiveProps) {
  const [filter, setFilter] = React.useState<string>('all');
  const filtered = filter === 'all' ? memos : memos.filter(m => m.type === filter);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-slate-400" />
          <div>
            <h3 className="font-semibold text-white">Memo Archive</h3>
            <p className="text-sm text-slate-400">Historical documents</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />New Memo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'strategy', 'analysis', 'legal', 'operations'].map(f => (
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

      <div className="space-y-2">
        {filtered.map((memo, idx) => {
          const type = typeConfig[memo.type] || typeConfig.analysis;
          const status = statusConfig[memo.status];

          return (
            <motion.div
              key={memo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onViewMemo?.(memo)}
              className="rounded-xl border border-white/10 bg-navy-900/50 p-4 cursor-pointer hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', type.bg)}>
                    <FileText className={cn('h-5 w-5', type.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{memo.title}</h4>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs capitalize', status.bg, status.color)}>
                        {memo.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className={cn('capitalize', type.color)}>{memo.type}</span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />{memo.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{new Date(memo.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />{memo.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />v{memo.version}
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default MemoArchive;
