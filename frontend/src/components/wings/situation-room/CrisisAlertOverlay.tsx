'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Clock, TrendingDown, Volume2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import type { CrisisAlert } from '@/types/wings/situation-room';

interface CrisisAlertOverlayProps {
  alert?: CrisisAlert | null;
  onAcknowledge?: () => void;
  onEscalate?: () => void;
  className?: string;
}

const mockAlert: CrisisAlert = {
  id: 'crisis-1',
  type: 'margin_breach',
  severity: 'critical',
  title: 'CRITICAL: Margin Threshold Exceeded',
  message: 'Goldman Sachs margin has exceeded 95%. Immediate action required to prevent liquidation.',
  broker: 'Goldman Sachs',
  timestamp: new Date().toISOString(),
  impact: { financialRisk: 2500000, timeToAction: '15 minutes' },
  suggestedActions: ['Reduce positions by $500K', 'Add emergency collateral', 'Contact prime broker'],
};

const severityConfig = {
  warning: { color: 'border-amber-500', bg: 'from-amber-950/95 to-amber-900/90', icon: 'text-amber-400' },
  critical: { color: 'border-red-500', bg: 'from-red-950/95 to-red-900/90', icon: 'text-red-400' },
  emergency: { color: 'border-red-600', bg: 'from-red-900/95 to-red-800/90', icon: 'text-red-300' },
};

export const CrisisAlertOverlay = React.memo(function CrisisAlertOverlay({ alert = mockAlert, onAcknowledge, onEscalate, className }: CrisisAlertOverlayProps) {
  const [isVisible, setIsVisible] = React.useState(!!alert);
  const { playSound } = useSoundEffects();

  React.useEffect(() => {
    if (alert) {
      setIsVisible(true);
      playSound('crisis');
    }
  }, [alert, playSound]);

  if (!alert) return null;

  const severity = severityConfig[alert.severity];

  const handleAcknowledge = () => {
    setIsVisible(false);
    onAcknowledge?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm', className)}
        >
          {/* Pulsing background */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-red-500/10"
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={cn(
              'relative w-full max-w-2xl rounded-2xl border-2 shadow-2xl',
              severity.color,
              `bg-gradient-to-br ${severity.bg}`
            )}
          >
            {/* Animated top bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/30"
                  >
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase text-red-400 tracking-wider">
                        {alert.severity} ALERT
                      </span>
                      <Volume2 className="h-4 w-4 text-red-400 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{alert.title}</h2>
                  </div>
                </div>
                <button onClick={handleAcknowledge} className="text-slate-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Message */}
              <p className="text-lg text-slate-200 mb-6">{alert.message}</p>

              {/* Impact */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg bg-red-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    <span className="text-sm text-red-300">Financial Risk</span>
                  </div>
                  <p className="text-2xl font-bold text-white">${(alert.impact.financialRisk / 1000000).toFixed(2)}M</p>
                </div>
                <div className="rounded-lg bg-amber-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-amber-400" />
                    <span className="text-sm text-amber-300">Time to Action</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{alert.impact.timeToAction}</p>
                </div>
              </div>

              {/* Suggested actions */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Recommended Actions:</h4>
                <div className="space-y-2">
                  {alert.suggestedActions.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button onClick={handleAcknowledge} className="flex-1 bg-white text-slate-900 hover:bg-slate-100">
                  <Shield className="mr-2 h-5 w-5" />
                  Acknowledge & Take Action
                </Button>
                <Button variant="outline" onClick={onEscalate} className="border-red-500 text-red-400 hover:bg-red-500/10">
                  Escalate to Senior
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default CrisisAlertOverlay;
