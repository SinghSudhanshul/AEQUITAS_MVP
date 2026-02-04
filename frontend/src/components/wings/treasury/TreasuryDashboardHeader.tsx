'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Shield, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TreasuryDashboardStats } from '@/types/wings/treasury';

interface TreasuryDashboardHeaderProps {
  stats?: TreasuryDashboardStats;
  className?: string;
}

const mockStats: TreasuryDashboardStats = {
  totalLiquidity: 2450000,
  liquidityChange: 4.2,
  marginUtilization: 68.5,
  marginChange: -2.1,
  pendingSettlements: 875000,
  availableCredit: 1200000,
};

export const TreasuryDashboardHeader = React.memo(function TreasuryDashboardHeader({ stats = mockStats, className }: TreasuryDashboardHeaderProps) {
  const cards = [
    {
      label: 'Total Liquidity',
      value: `$${(stats.totalLiquidity / 1000000).toFixed(2)}M`,
      change: stats.liquidityChange,
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
    },
    {
      label: 'Margin Utilization',
      value: `${stats.marginUtilization.toFixed(1)}%`,
      change: stats.marginChange,
      icon: BarChart3,
      color: stats.marginUtilization > 80 ? 'text-red-400' : 'text-amber-400',
      bg: stats.marginUtilization > 80 ? 'bg-red-500/20' : 'bg-amber-500/20',
    },
    {
      label: 'Pending Settlements',
      value: `$${(stats.pendingSettlements / 1000).toFixed(0)}K`,
      icon: Wallet,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
    },
    {
      label: 'Available Credit',
      value: `$${(stats.availableCredit / 1000000).toFixed(2)}M`,
      icon: Shield,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
    },
  ];

  return (
    <div className={cn('grid grid-cols-4 gap-4', className)}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isPositive = card.change != null && card.change >= 0;

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-xl border border-white/10 bg-gradient-to-br from-navy-900/90 to-navy-800/80 p-5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', card.bg)}>
                <Icon className={cn('h-5 w-5', card.color)} />
              </div>
              {card.change != null && (
                <div className={cn('flex items-center gap-1', isPositive ? 'text-emerald-400' : 'text-red-400')}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{isPositive ? '+' : ''}{card.change.toFixed(1)}%</span>
                </div>
              )}
            </div>
            <span className="text-sm text-slate-400">{card.label}</span>
            <p className={cn('text-2xl font-bold mt-1', card.color)}>{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
});

export default TreasuryDashboardHeader;
