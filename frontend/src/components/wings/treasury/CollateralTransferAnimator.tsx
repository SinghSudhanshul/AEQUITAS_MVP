'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, ArrowRight, Building2, DollarSign, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CollateralTransfer } from '@/types/wings/treasury';

interface CollateralTransferAnimatorProps {
  transfer?: CollateralTransfer;
  onConfirm?: () => void;
  className?: string;
}

const mockTransfer: CollateralTransfer = {
  id: 'tr-1',
  fromBroker: 'Goldman Sachs',
  toBroker: 'Morgan Stanley',
  amount: 250000,
  status: 'pending',
  estimatedTime: '2h 30m',
  createdAt: new Date().toISOString(),
};

export const CollateralTransferAnimator = React.memo(function CollateralTransferAnimator({ transfer = mockTransfer, onConfirm, className }: CollateralTransferAnimatorProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState(transfer.status);

  const startTransfer = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStatus('in_transit');
      setTimeout(() => {
        setCurrentStatus('completed');
        setIsAnimating(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
        <div>
          <h3 className="font-semibold text-white">Collateral Transfer</h3>
          <p className="text-sm text-slate-400">Inter-broker movement</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
        {/* Transfer visualization */}
        <div className="flex items-center justify-between mb-8">
          {/* From */}
          <div className="flex-1 text-center">
            <div className={cn(
              'mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl border-2',
              currentStatus === 'pending' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-500 bg-slate-500/20'
            )}>
              <Building2 className={cn('h-8 w-8', currentStatus === 'pending' ? 'text-blue-400' : 'text-slate-400')} />
            </div>
            <p className="font-medium text-white">{transfer.fromBroker}</p>
            <p className="text-sm text-slate-400">Source</p>
          </div>

          {/* Transfer animation */}
          <div className="flex-1 flex items-center justify-center relative h-20">
            <div className="absolute inset-x-4 h-0.5 bg-white/10" />
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"
                >
                  <DollarSign className="h-6 w-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            {!isAnimating && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </div>
            )}
          </div>

          {/* To */}
          <div className="flex-1 text-center">
            <div className={cn(
              'mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl border-2',
              currentStatus === 'completed' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-500 bg-slate-500/20'
            )}>
              {currentStatus === 'completed' ? (
                <Check className="h-8 w-8 text-emerald-400" />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <p className="font-medium text-white">{transfer.toBroker}</p>
            <p className="text-sm text-slate-400">Destination</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <DollarSign className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xs text-slate-400">Amount</span>
            <p className="text-lg font-bold text-white">${(transfer.amount / 1000).toFixed(0)}K</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <Clock className="h-5 w-5 text-amber-400 mx-auto mb-1" />
            <span className="text-xs text-slate-400">Est. Time</span>
            <p className="text-lg font-bold text-white">{transfer.estimatedTime}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <motion.div
              animate={currentStatus === 'in_transit' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              className={cn(
                'h-5 w-5 rounded-full mx-auto mb-1',
                currentStatus === 'pending' ? 'bg-amber-500' : currentStatus === 'in_transit' ? 'bg-blue-500' : 'bg-emerald-500'
              )}
            />
            <span className="text-xs text-slate-400">Status</span>
            <p className="text-lg font-bold capitalize text-white">{currentStatus.replace('_', ' ')}</p>
          </div>
        </div>

        <Button onClick={startTransfer} disabled={isAnimating || currentStatus === 'completed'} className="w-full">
          {currentStatus === 'completed' ? 'Transfer Complete' : isAnimating ? 'Transferring...' : 'Initiate Transfer'}
        </Button>
      </div>
    </div>
  );
});

export default CollateralTransferAnimator;
