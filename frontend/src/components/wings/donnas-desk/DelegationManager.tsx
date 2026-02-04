'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, Settings, Shield, Bell, Clock, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DelegationRule } from '@/types/wings/donnas-desk';

interface DelegationManagerProps {
  rules?: DelegationRule[];
  onEditRule?: (rule: DelegationRule) => void;
  className?: string;
}

const mockRules: DelegationRule[] = [
  { id: '1', name: 'Morning Briefings', trigger: 'Daily at 8:00 AM', action: 'Generate and send briefing', delegateTo: 'automated', status: 'active', lastRun: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', name: 'Margin Alerts', trigger: 'Margin > 80%', action: 'Notify team and suggest action', delegateTo: 'automated', status: 'active', lastRun: new Date(Date.now() - 1800000).toISOString() },
  { id: '3', name: 'Document Review', trigger: 'New document uploaded', action: 'Initial review and categorization', delegateTo: 'paralegal', status: 'active' },
  { id: '4', name: 'Weekend Coverage', trigger: 'Weekend hours', action: 'Handle non-urgent requests', delegateTo: 'junior_associate', status: 'paused' },
];

const statusColors = {
  active: 'bg-emerald-500',
  paused: 'bg-amber-500',
  disabled: 'bg-slate-500',
};

export const DelegationManager = React.memo(function DelegationManager({ rules = mockRules, onEditRule, className }: DelegationManagerProps) {
  const activeCount = rules.filter(r => r.status === 'active').length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-semibold text-white">Delegation Rules</h3>
            <p className="text-sm text-slate-400">{activeCount} active automations</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />Configure
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              'rounded-xl border p-4',
              rule.status === 'active' ? 'border-purple-500/30 bg-purple-500/5' : 'border-white/10 bg-white/5'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  rule.status === 'active' ? 'bg-purple-500/20' : 'bg-white/10'
                )}>
                  <Zap className={cn('h-5 w-5', rule.status === 'active' ? 'text-purple-400' : 'text-slate-400')} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white">{rule.name}</h4>
                    <div className={cn('h-2 w-2 rounded-full', statusColors[rule.status])} />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <span className="rounded bg-white/10 px-2 py-0.5">{rule.trigger}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{rule.action}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span className="capitalize">{rule.delegateTo.replace('_', ' ')}</span>
                    </div>
                    {rule.lastRun && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Last: {new Date(rule.lastRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={() => onEditRule?.(rule)}>
                Edit
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default DelegationManager;
