'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { LiquidityForecastCard as CardType } from '@/types/wings/treasury';

interface LiquidityForecastCardProps {
  forecast?: CardType;
  onRefresh?: () => void;
  className?: string;
}

const mockForecast: CardType = {
  p50: 2450000,
  p5: 1820000,
  p95: 3100000,
  change24h: 4.2,
  regime: 'steady',
  lastUpdated: new Date().toISOString(),
  confidence: 87.5,
};

const regimeConfig = {
  steady: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Steady' },
  elevated: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Elevated' },
  crisis: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Crisis' },
};

export const LiquidityForecastCard = React.memo(function LiquidityForecastCard({ forecast = mockForecast, onRefresh, className }: LiquidityForecastCardProps) {
  const regime = regimeConfig[forecast.regime];
  const isPositive = forecast.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-xl border border-white/10 bg-gradient-to-br from-navy-900/90 to-navy-800/80 backdrop-blur-xl p-6', className)}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
            <DollarSign className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Liquidity Forecast</h3>
            <p className="text-sm text-slate-400">Next 24 hours</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Main forecast value */}
      <div className="text-center mb-6">
        <span className="text-sm text-slate-400">P50 Forecast</span>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-white mt-1"
        >
          ${(forecast.p50 / 1000000).toFixed(2)}M
        </motion.div>
        <div className={cn('flex items-center justify-center gap-1 mt-2', isPositive ? 'text-emerald-400' : 'text-red-400')}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="font-medium">{isPositive ? '+' : ''}{forecast.change24h.toFixed(1)}%</span>
          <span className="text-slate-400 text-sm">24h</span>
        </div>
      </div>

      {/* Range */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <span className="text-xs text-slate-400">P5 (Low)</span>
          <p className="text-lg font-bold text-red-400">${(forecast.p5 / 1000000).toFixed(2)}M</p>
        </div>
        <div className="text-center border-x border-white/10">
          <span className="text-xs text-slate-400">P50 (Median)</span>
          <p className="text-lg font-bold text-white">${(forecast.p50 / 1000000).toFixed(2)}M</p>
        </div>
        <div className="text-center">
          <span className="text-xs text-slate-400">P95 (High)</span>
          <p className="text-lg font-bold text-emerald-400">${(forecast.p95 / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      {/* Regime and confidence */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Regime:</span>
          <span className={cn('rounded-full px-3 py-1 text-xs font-medium', regime.bg, regime.color)}>
            {regime.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Confidence:</span>
          <span className={cn('font-medium', forecast.confidence >= 85 ? 'text-emerald-400' : 'text-amber-400')}>
            {forecast.confidence.toFixed(0)}%
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Updated {new Date(forecast.lastUpdated).toLocaleTimeString()}
      </p>
    </motion.div>
  );
});

export default LiquidityForecastCard;
