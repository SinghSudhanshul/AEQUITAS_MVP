'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Cpu, TrendingUp, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { StreamingForecastData } from '@/types/wings/library';

interface StreamingForecastSparklineProps {
  data?: StreamingForecastData[];
  onRefresh?: () => void;
  className?: string;
}

const generateMockData = (): StreamingForecastData[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString(),
    value: 2000000 + Math.sin(i / 5) * 200000 + Math.random() * 50000,
    isStreaming: i >= 45,
  }));
};

export const StreamingForecastSparkline = React.memo(function StreamingForecastSparkline({ data, onRefresh, className }: StreamingForecastSparklineProps) {
  const [sparkData, setSparkData] = React.useState(data || generateMockData());
  const [isLive, setIsLive] = React.useState(true);

  React.useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setSparkData(prev => {
        const newPoint: StreamingForecastData = {
          timestamp: new Date().toISOString(),
          value: prev[prev.length - 1].value + (Math.random() - 0.5) * 20000,
          isStreaming: true,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const minVal = Math.min(...sparkData.map(d => d.value));
  const maxVal = Math.max(...sparkData.map(d => d.value));
  const range = maxVal - minVal || 1;
  const latestValue = sparkData[sparkData.length - 1].value;

  const getY = (val: number) => 60 - ((val - minVal) / range) * 50;
  const pathData = sparkData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (sparkData.length - 1)) * 300} ${getY(d.value)}`).join(' ');

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
            <Zap className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Live Forecast Stream</h3>
            <p className="text-sm text-slate-400">Real-time P50 projection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400">LIVE</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)}>
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        {/* Sparkline SVG */}
        <div className="relative h-16 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 300 70" preserveAspectRatio="none">
            {/* Gradient */}
            <defs>
              <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path d={`${pathData} L 300 70 L 0 70 Z`} fill="url(#sparkFill)" />
            {/* Line */}
            <motion.path d={pathData} fill="none" stroke="url(#sparkGradient)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
            {/* Current point */}
            <motion.circle cx="300" cy={getY(latestValue)} r="4" fill="#06b6d4" animate={{ r: [4, 6, 4] }} transition={{ repeat: Infinity, duration: 1 }} />
          </svg>
        </div>

        {/* Value display */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-2xl font-bold text-white">${(latestValue / 1000000).toFixed(3)}M</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              <span>Ensemble v2.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StreamingForecastSparkline;
