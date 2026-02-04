'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { RiskMitigationAction } from '@/types/wings/treasury';

interface RiskMitigationPanelProps {
  actions?: RiskMitigationAction[];
  onExecute?: (action: RiskMitigationAction) => void;
  className?: string;
}

const mockActions: RiskMitigationAction[] = [
  { id: '1', type: 'reduce_exposure', broker: 'Goldman Sachs', description: 'Reduce positions by $200K to lower margin', impact: 'Margin: 82% → 75%', urgency: 'high', status: 'recommended' },
  { id: '2', type: 'add_collateral', broker: 'Barclays', description: 'Add $100K collateral to avoid margin call', impact: 'Available: +$100K', urgency: 'high', status: 'pending' },
  { id: '3', type: 'rebalance', broker: 'Multi-broker', description: 'Transfer $150K from MS to JPM for optimization', impact: 'Cost savings: $2.5K/month', urgency: 'medium', status: 'scheduled' },
];

const urgencyConfig = {
  low: { color: 'text-blue-400', bg: 'border-blue-500/30 bg-blue-500/5' },
  medium: { color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/5' },
  high: { color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/5' },
};

const statusIcons = {
  recommended: AlertCircle,
  pending: Clock,
  scheduled: Clock,
  completed: CheckCircle2,
};

export const RiskMitigationPanel = React.memo(function RiskMitigationPanel({ actions = mockActions, onExecute, className }: RiskMitigationPanelProps) {
  const highPriority = actions.filter(a => a.urgency === 'high');

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-red-400" />
          <div>
            <h3 className="font-semibold text-white">Risk Mitigation</h3>
            <p className="text-sm text-slate-400">Recommended actions</p>
          </div>
        </div>
        {highPriority.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-400">{highPriority.length} urgent</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {actions.map((action, idx) => {
          const urgency = urgencyConfig[action.urgency];
          const StatusIcon = statusIcons[action.status];

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn('rounded-xl border p-4', urgency.bg)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', action.urgency === 'high' ? 'bg-red-500/20' : 'bg-white/10')}>
                    <StatusIcon className={cn('h-5 w-5', urgency.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-medium uppercase', urgency.color)}>{action.urgency} Priority</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{action.broker}</span>
                    </div>
                    <p className="mt-1 font-medium text-white">{action.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">{action.impact}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" disabled={action.status === 'completed'} onClick={() => onExecute?.(action)}>
                  Execute
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default RiskMitigationPanel;
