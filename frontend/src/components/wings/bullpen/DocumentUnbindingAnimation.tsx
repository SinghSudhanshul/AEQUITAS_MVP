'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentUnbindingState } from '@/types/wings/bullpen';

interface DocumentUnbindingAnimationProps {
  document?: DocumentUnbindingState;
  onComplete?: () => void;
  className?: string;
}

export const DocumentUnbindingAnimation = React.memo(function DocumentUnbindingAnimation({ document, onComplete, className }: DocumentUnbindingAnimationProps) {
  const [state, setState] = React.useState<DocumentUnbindingState>(document || {
    isAnimating: false, documentId: '', fileName: 'Q4_Positions.csv', pageCount: 12, currentPage: 0, progress: 0
  });

  const startUnbinding = () => {
    setState(prev => ({ ...prev, isAnimating: true, progress: 0, currentPage: 0 }));
    const interval = setInterval(() => {
      setState(prev => {
        const newPage = prev.currentPage + 1;
        const newProgress = (newPage / prev.pageCount) * 100;
        if (newPage >= prev.pageCount) {
          clearInterval(interval);
          setTimeout(() => { setState(p => ({ ...p, isAnimating: false })); onComplete?.(); }, 500);
        }
        return { ...prev, currentPage: newPage, progress: newProgress };
      });
    }, 200);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Layers className="h-5 w-5 text-amber-400" />
        <div>
          <h3 className="font-semibold text-white">Document Processing</h3>
          <p className="text-sm text-slate-400">Visual unbinding animation</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center h-64 rounded-xl border border-white/10 bg-navy-900/50 overflow-hidden">
        <div className="relative">
          {Array.from({ length: Math.min(5, state.pageCount - state.currentPage) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, rotate: 0, opacity: 1 }}
              animate={state.isAnimating && i === 0 ? { x: 200, rotate: 15, opacity: 0 } : {}}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute w-32 h-44 rounded-lg border shadow-lg flex items-center justify-center',
                i === 0 ? 'bg-white border-slate-300 z-10' : 'bg-slate-100 border-slate-200'
              )}
              style={{ transform: `translateX(${i * 4}px) translateY(${i * 4}px) rotate(${i * 2}deg)`, zIndex: 10 - i }}
            >
              <FileText className="h-8 w-8 text-slate-400" />
            </motion.div>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">{state.fileName}</span>
            <span className="text-white">{state.currentPage} / {state.pageCount}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full bg-amber-500" initial={{ width: 0 }} animate={{ width: `${state.progress}%` }} />
          </div>
        </div>
      </div>

      <button onClick={startUnbinding} disabled={state.isAnimating} className={cn('w-full py-3 rounded-lg font-medium transition-colors', state.isAnimating ? 'bg-white/10 text-slate-400' : 'bg-amber-500 text-white hover:bg-amber-600')}>
        {state.isAnimating ? 'Processing...' : 'Start Unbinding'}
      </button>
    </div>
  );
});

export default DocumentUnbindingAnimation;
