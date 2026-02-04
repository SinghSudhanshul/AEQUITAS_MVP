'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamificationStore } from '@/stores/gamification';
import type { MicroCelebration } from '@/types/wings/bullpen';

interface MicroCelebrationsProps {
  celebration?: MicroCelebration;
  onComplete?: () => void;
  className?: string;
}

const celebrationTypes = {
  level_up: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20', title: 'Level Up!' },
  achievement: { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/20', title: 'Achievement Unlocked!' },
  streak: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/20', title: 'Streak!' },
  rank_up: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/20', title: 'Rank Up!' },
  milestone: { icon: Medal, color: 'text-blue-400', bg: 'bg-blue-500/20', title: 'Milestone!' },
};

export const MicroCelebrations = React.memo(function MicroCelebrations({ celebration, onComplete, className }: MicroCelebrationsProps) {
  const [visible, setVisible] = React.useState(false);
  const [current, setCurrent] = React.useState<MicroCelebration | null>(null);

  const triggerCelebration = React.useCallback((c: MicroCelebration) => {
    setCurrent(c);
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);
  }, [onComplete]);

  React.useEffect(() => {
    if (celebration) triggerCelebration(celebration);
  }, [celebration, triggerCelebration]);

  const type = current?.type || 'achievement';
  const config = celebrationTypes[type];
  const Icon = config.icon;

  return (
    <>
      {/* Demo triggers */}
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Micro Celebrations</h3>
            <p className="text-sm text-slate-400">Gamified reward animations</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Object.entries(celebrationTypes).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => triggerCelebration({
                id: Date.now().toString(),
                type: key as MicroCelebration['type'],
                title: cfg.title,
                message: `You've earned a ${key.replace('_', ' ')}!`,
                xpEarned: Math.floor(Math.random() * 100) + 50,
                timestamp: new Date().toISOString(),
              })}
              className={cn('flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10', cfg.color)}
            >
              <cfg.icon className="h-6 w-6" />
              <span className="text-xs text-slate-300 capitalize">{key.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Celebration Overlay */}
      {visible && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Confetti-like particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={cn('absolute h-3 w-3 rounded-full', i % 3 === 0 ? 'bg-amber-400' : i % 3 === 1 ? 'bg-emerald-400' : 'bg-blue-400')}
            />
          ))}

          {/* Main celebration card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="rounded-2xl border border-white/20 bg-gradient-to-br from-navy-900/95 to-navy-800/90 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={cn('mx-auto flex h-20 w-20 items-center justify-center rounded-full', config.bg)}
              >
                <Icon className={cn('h-10 w-10', config.color)} />
              </motion.div>
              <h2 className="mt-4 text-2xl font-bold text-white">{current.title}</h2>
              <p className="mt-2 text-slate-300">{current.message}</p>
              {current.xpEarned && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-lg font-bold text-emerald-400"
                >
                  +{current.xpEarned} XP
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
});

export default MicroCelebrations;
