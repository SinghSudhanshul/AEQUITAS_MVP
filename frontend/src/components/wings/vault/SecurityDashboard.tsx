'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { SecurityMetrics } from '@/types/wings/vault';

interface SecurityDashboardProps {
  metrics?: SecurityMetrics;
  className?: string;
}

const defaultMetrics: SecurityMetrics = {
  overallScore: 87,
  encryptionStatus: 'aes-256',
  activeUsers: 12,
  pendingReviews: 3,
  lastAudit: new Date(Date.now() - 86400000 * 7).toISOString(),
  threatLevel: 'low',
  complianceStatus: {
    soc2: true,
    gdpr: true,
    hipaa: false,
    pci: true,
  },
};

const threatColors = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  high: { color: 'text-red-400', bg: 'bg-red-500/20' },
  critical: { color: 'text-red-500', bg: 'bg-red-500/30' },
};

export const SecurityDashboard = React.memo(function SecurityDashboard({ metrics = defaultMetrics, className }: SecurityDashboardProps) {
  const threat = threatColors[metrics.threatLevel];
  const complianceCount = Object.values(metrics.complianceStatus).filter(Boolean).length;
  const complianceTotal = Object.keys(metrics.complianceStatus).length;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-white">Security Dashboard</h3>
            <p className="text-sm text-slate-400">System security overview</p>
          </div>
        </div>
        <div className={cn('flex items-center gap-2 rounded-full px-4 py-2', threat.bg)}>
          <div className={cn('h-2 w-2 rounded-full animate-pulse', metrics.threatLevel === 'low' ? 'bg-emerald-500' : 'bg-red-500')} />
          <span className={cn('text-sm font-medium uppercase', threat.color)}>
            {metrics.threatLevel} Threat
          </span>
        </div>
      </div>

      {/* Security Score */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-navy-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">Overall Security Score</span>
          <span className={cn(
            'text-3xl font-bold',
            metrics.overallScore >= 80 ? 'text-emerald-400' : metrics.overallScore >= 60 ? 'text-amber-400' : 'text-red-400'
          )}>
            {metrics.overallScore}/100
          </span>
        </div>
        <Progress value={metrics.overallScore} variant="prestige" className="h-3" />
        <p className="text-xs text-slate-500 mt-2">
          {metrics.overallScore >= 80 ? 'Excellent security posture' : 'Improvements recommended'}
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
          <Lock className="h-6 w-6 text-emerald-400 mb-2" />
          <span className="text-xs text-slate-400">Encryption</span>
          <p className="text-lg font-bold text-white uppercase">{metrics.encryptionStatus}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
          <Users className="h-6 w-6 text-blue-400 mb-2" />
          <span className="text-xs text-slate-400">Active Users</span>
          <p className="text-lg font-bold text-white">{metrics.activeUsers}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className={cn(
          'rounded-xl border p-4',
          metrics.pendingReviews > 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10 bg-navy-900/50'
        )}>
          <AlertTriangle className={cn('h-6 w-6 mb-2', metrics.pendingReviews > 0 ? 'text-amber-400' : 'text-slate-400')} />
          <span className="text-xs text-slate-400">Pending Reviews</span>
          <p className={cn('text-lg font-bold', metrics.pendingReviews > 0 ? 'text-amber-400' : 'text-white')}>
            {metrics.pendingReviews}
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
          <Clock className="h-6 w-6 text-purple-400 mb-2" />
          <span className="text-xs text-slate-400">Last Audit</span>
          <p className="text-lg font-bold text-white">
            {Math.floor((Date.now() - new Date(metrics.lastAudit).getTime()) / 86400000)}d ago
          </p>
        </motion.div>
      </div>

      {/* Compliance */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Compliance Status</h4>
          <span className="text-sm text-slate-400">{complianceCount}/{complianceTotal} passed</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(metrics.complianceStatus).map(([framework, passed]) => (
            <div key={framework} className={cn(
              'flex items-center justify-between rounded-lg p-3',
              passed ? 'bg-emerald-500/10' : 'bg-red-500/10'
            )}>
              <span className="text-sm font-medium text-white uppercase">{framework}</span>
              {passed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full">
        Run Security Scan
      </Button>
    </div>
  );
});

export default SecurityDashboard;
