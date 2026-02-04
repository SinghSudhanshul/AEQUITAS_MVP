'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, PlayCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ContextualHelpTooltip } from '@/types/wings/bullpen';

interface ContextualHelpTooltipsProps {
  tooltips?: ContextualHelpTooltip[];
  className?: string;
}

const mockTooltips: ContextualHelpTooltip[] = [
  { id: '1', target: 'forecast-chart', title: 'Understanding Forecasts', content: 'The P50 line shows our median prediction. The shaded area represents the confidence interval between P5 and P95.', placement: 'right', trigger: 'hover', hasVideo: true, videoUrl: '/videos/forecast-guide.mp4' },
  { id: '2', target: 'regime-badge', title: 'Market Regimes', content: 'We use three regimes: Steady (normal), Elevated (caution), and Crisis (high alert). The badge color reflects the current state.', placement: 'bottom', trigger: 'hover', hasVideo: false },
  { id: '3', target: 'xp-bar', title: 'Experience Points', content: 'Earn XP by completing tasks, reviewing forecasts, and making decisions. Level up to unlock new features!', placement: 'bottom', trigger: 'hover', hasVideo: false },
];

export const ContextualHelpTooltips = React.memo(function ContextualHelpTooltips({ tooltips = mockTooltips, className }: ContextualHelpTooltipsProps) {
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);
  const [showGuide, setShowGuide] = React.useState(false);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Help Center</h3>
            <p className="text-sm text-slate-400">Contextual tooltips and guides</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowGuide(!showGuide)}>
          {showGuide ? 'Hide Guide' : 'Show Guide'}
        </Button>
      </div>

      <AnimatePresence>
        {showGuide && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
            {tooltips.map((tooltip, idx) => (
              <motion.div
                key={tooltip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  'rounded-lg border p-4 cursor-pointer transition-all',
                  activeTooltip === tooltip.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                )}
                onClick={() => setActiveTooltip(activeTooltip === tooltip.id ? null : tooltip.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                      <HelpCircle className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="font-medium text-white">{tooltip.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tooltip.hasVideo && <PlayCircle className="h-4 w-4 text-slate-400" />}
                    <ChevronRight className={cn('h-4 w-4 text-slate-400 transition-transform', activeTooltip === tooltip.id && 'rotate-90')} />
                  </div>
                </div>
                <AnimatePresence>
                  {activeTooltip === tooltip.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-sm text-slate-300">{tooltip.content}</p>
                      {tooltip.hasVideo && (
                        <Button variant="outline" size="sm" className="mt-3">
                          <PlayCircle className="mr-2 h-4 w-4" />Watch Video
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-lg border border-white/5 bg-white/5 p-4">
        <p className="text-sm text-slate-400"><span className="font-medium text-rose-400">Donna:</span> "I've added some helpful tips throughout the platform. Just hover over the help icons when you need guidance."</p>
      </div>
    </div>
  );
});

export default ContextualHelpTooltips;
