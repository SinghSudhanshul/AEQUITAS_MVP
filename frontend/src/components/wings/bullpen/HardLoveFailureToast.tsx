'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import type { HardLoveFailureToast as ToastType } from '@/types/wings/bullpen';

interface HardLoveFailureToastProps {
  toast?: ToastType;
  onDismiss?: () => void;
  onAction?: () => void;
  className?: string;
}

const harveyQuotes = [
  "Winners don't make excuses when the other side plays the game.",
  "I don't play the odds, I play the man.",
  "Anyone can do my job, but no one can be me.",
  "When you're backed against the wall, break the goddamn thing down.",
];

export const HardLoveFailureToast = React.memo(function HardLoveFailureToast({ toast, onDismiss, onAction, className }: HardLoveFailureToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const { playSound } = useSoundEffects();

  const defaultToast: ToastType = {
    id: '1',
    type: 'error',
    title: 'Forecast Accuracy Below Threshold',
    message: 'Your last 5 forecasts have been below 85% accuracy. Time to recalibrate.',
    harveyQuote: harveyQuotes[Math.floor(Math.random() * harveyQuotes.length)],
    actionRequired: true,
    suggestedAction: 'Review Calibration',
    timestamp: new Date().toISOString(),
  };

  const data = toast || defaultToast;

  React.useEffect(() => {
    playSound('warning');
  }, [playSound]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={cn(
            'relative overflow-hidden rounded-xl border shadow-2xl',
            data.type === 'error' ? 'border-red-500/30 bg-gradient-to-br from-red-950/90 to-red-900/80' : 'border-amber-500/30 bg-gradient-to-br from-amber-950/90 to-amber-900/80',
            className
          )}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

          <div className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', data.type === 'error' ? 'bg-red-500/20' : 'bg-amber-500/20')}>
                  <AlertTriangle className={cn('h-6 w-6', data.type === 'error' ? 'text-red-400' : 'text-amber-400')} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{data.title}</h4>
                  <p className="mt-1 text-sm text-slate-300">{data.message}</p>
                </div>
              </div>
              <button onClick={handleDismiss} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 border-l-2 border-amber-500/50 pl-4">
              <p className="text-sm italic text-slate-300">"{data.harveyQuote}"</p>
              <p className="mt-1 text-xs font-medium text-amber-500/60">— Harvey Specter</p>
            </div>

            {data.actionRequired && (
              <div className="mt-4 flex gap-3">
                <Button onClick={onAction} className="flex-1 bg-white text-slate-900 hover:bg-slate-100">
                  {data.suggestedAction}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleDismiss}>Dismiss</Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default HardLoveFailureToast;
