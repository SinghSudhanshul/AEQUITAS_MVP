'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, AlertTriangle, Clock, User, ArrowRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DecisionItem } from '@/types/wings/harveys-office';

interface DecisionQueueProps {
  items?: DecisionItem[];
  onDecide?: (item: DecisionItem, decision: 'approve' | 'reject') => void;
  className?: string;
}

const mockItems: DecisionItem[] = [
  { id: '1', title: 'Goldman Collateral Transfer', type: 'financial', amount: 250000, requester: 'Treasury', urgency: 'high', summary: 'Transfer $250K from MS to Goldman to improve margin', impact: 'Reduces Goldman margin by 8%' },
  { id: '2', title: 'Settlement Offer Acceptance', type: 'legal', requester: 'War Room', urgency: 'high', summary: 'Accept $850K settlement for Q4 dispute', impact: 'Closes case favorably, saves legal fees' },
  { id: '3', title: 'New Hedge Strategy', type: 'trading', amount: 150000, requester: 'Analysis Team', urgency: 'medium', summary: 'Implement protective puts on AAPL position', impact: 'Limits downside to 5%' },
];

const typeConfig = {
  financial: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: Shield },
  legal: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: FileText },
  trading: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: AlertTriangle },
  operational: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Clock },
};

const urgencyColors = { low: 'text-blue-400', medium: 'text-amber-400', high: 'text-red-400' };

export const DecisionQueue = React.memo(function DecisionQueue({ items = mockItems, onDecide, className }: DecisionQueueProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Awaiting Your Decision</h3>
            <p className="text-sm text-slate-400">{items.length} items need approval</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const type = typeConfig[item.type] || typeConfig.operational;
          const TypeIcon = type.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                'rounded-xl border p-5',
                item.urgency === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-navy-900/50'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', type.bg)}>
                    <TypeIcon className={cn('h-6 w-6', type.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-white">{item.title}</h4>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs uppercase', urgencyColors[item.urgency])}>
                        {item.urgency}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className={cn('capitalize', type.color)}>{item.type}</span>
                      {item.amount && <span className="text-emerald-400">${(item.amount / 1000).toFixed(0)}K</span>}
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />{item.requester}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3">{item.summary}</p>

              <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                <ArrowRight className="h-4 w-4" />
                <span className="text-emerald-400">{item.impact}</span>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onDecide?.(item, 'reject')}>
                  Reject
                </Button>
                <Button onClick={() => onDecide?.(item, 'approve')} className="bg-emerald-500 hover:bg-emerald-600">
                  <Check className="mr-2 h-4 w-4" />Approve
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default DecisionQueue;
