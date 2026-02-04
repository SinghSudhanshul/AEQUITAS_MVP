// ============================================
// TREASURY PAGE
// Wing 4: Financial Operations (Features 51-60)
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';
import { WINGS } from '@/config/wings';
import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { MetricCard } from '@/components/shared/MetricCard';
import { PersonaCard } from '@/components/shared/PersonaAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Stores
import { useGamificationStore } from '@/store/gamification.store';
// import { useCrisisStore } from '@/store/crisis.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface ForecastData {
  date: string;
  p5: number;
  p50: number;
  p95: number;
  actual?: number;
  confidence: number;
}

interface TransactionRecord {
  id: string;
  type: 'inflow' | 'outflow' | 'transfer';
  description: string;
  amount: number;
  currency: string;
  timestamp: string;
  counterparty: string;
  status: 'pending' | 'completed' | 'failed';
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_FORECASTS: ForecastData[] = [
  { date: '2024-01-15', p5: 850000, p50: 1200000, p95: 1450000, actual: 1180000, confidence: 0.94 },
  { date: '2024-01-16', p5: 780000, p50: 1100000, p95: 1350000, actual: 1050000, confidence: 0.91 },
  { date: '2024-01-17', p5: 920000, p50: 1250000, p95: 1500000, actual: 1300000, confidence: 0.88 },
  { date: '2024-01-18', p5: 700000, p50: 1000000, p95: 1200000, confidence: 0.85 },
  { date: '2024-01-19', p5: 650000, p50: 950000, p95: 1150000, confidence: 0.82 },
  { date: '2024-01-20', p5: 800000, p50: 1100000, p95: 1300000, confidence: 0.78 },
  { date: '2024-01-21', p5: 900000, p50: 1200000, p95: 1400000, confidence: 0.75 },
];

const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 't1',
    type: 'inflow',
    description: 'Client settlement',
    amount: 2500000,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    counterparty: 'Goldman Sachs',
    status: 'completed',
  },
  {
    id: 't2',
    type: 'outflow',
    description: 'Margin payment',
    amount: 750000,
    currency: 'USD',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    counterparty: 'Prime Broker',
    status: 'completed',
  },
  {
    id: 't3',
    type: 'transfer',
    description: 'Internal rebalancing',
    amount: 1000000,
    currency: 'USD',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    counterparty: 'Treasury Account',
    status: 'pending',
  },
];

// ============================================
// PAGE HEADER
// ============================================

const TreasuryHeader: React.FC = () => {
  const wing = WINGS.treasury;
  // const { marketRegime } = useCrisisStore();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{wing.icon}</span>
          <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
            {wing.name}
          </h1>
          <Badge variant={wing.tier === 'premium' ? 'premium' : 'default'}>
            PREMIUM
          </Badge>
        </div>
        <p className="text-muted">
          {wing.description}. Monitor liquidity, forecasts, and financial operations.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline">📥 Export Report</Button>
        <Button variant="default">📊 Generate Forecast</Button>
      </div>
    </div>
  );
};

// ============================================
// DAILY LIQUIDITY FORECAST CARD
// ============================================

interface LiquidityForecastCardProps {
  forecasts: ForecastData[];
}

const DailyLiquidityForecastCard: React.FC<LiquidityForecastCardProps> = ({ forecasts }) => {
  const latestForecast = forecasts[forecasts.length - 1];
  const { addXP } = useGamificationStore();
  const { playSound } = useSoundEffects();

  const handleRefresh = () => {
    playSound('click');
    addXP(5, 'forecast_view', 'Refreshed liquidity forecast');
  };

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-off-white">Daily Liquidity Forecast</h3>
          <p className="text-xs text-muted">P5/P50/P95 quantile ranges</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          🔄 Refresh
        </Button>
      </div>

      {/* Current Forecast */}
      <div className="text-center mb-6 p-6 bg-glass-white rounded-xl">
        <p className="text-xs text-muted uppercase mb-2">Expected (P50)</p>
        <p className="text-4xl font-bold text-off-white">
          ${(latestForecast.p50 / 1000000).toFixed(2)}M
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-xs text-muted">
            P5: ${(latestForecast.p5 / 1000000).toFixed(2)}M
          </span>
          <span className="w-1 h-1 rounded-full bg-glass-border" />
          <span className="text-xs text-muted">
            P95: ${(latestForecast.p95 / 1000000).toFixed(2)}M
          </span>
        </div>
        <div className="mt-3">
          <span className={cn(
            'text-xs font-medium',
            latestForecast.confidence >= 0.9 ? 'text-spring-green' :
              latestForecast.confidence >= 0.8 ? 'text-achievement-gold' :
                'text-crisis-red'
          )}>
            {(latestForecast.confidence * 100).toFixed(0)}% confidence
          </span>
        </div>
      </div>

      {/* Quantile Visualization */}
      <div className="space-y-4">
        {forecasts.slice(-5).map((forecast) => (
          <div key={forecast.date}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted">{new Date(forecast.date).toLocaleDateString()}</span>
              <span className="text-off-white font-medium">
                ${(forecast.p50 / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="relative h-3 bg-rich-black rounded-full overflow-hidden">
              {/* P5-P95 Range */}
              <div
                className="absolute h-full bg-precision-teal/30 rounded-full"
                style={{
                  left: `${(forecast.p5 / forecast.p95) * 100 * 0.8}%`,
                  right: '0%',
                }}
              />
              {/* P50 Marker */}
              <div
                className="absolute h-full w-1 bg-precision-teal rounded-full"
                style={{
                  left: `${(forecast.p50 / forecast.p95) * 100 * 0.8}%`,
                }}
              />
              {/* Actual (if available) */}
              {forecast.actual && (
                <div
                  className="absolute h-full w-2 bg-spring-green rounded-full"
                  style={{
                    left: `${(forecast.actual / forecast.p95) * 100 * 0.8}%`,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-glass-border">
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="w-3 h-3 bg-precision-teal/30 rounded" /> P5-P95 Range
        </span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="w-3 h-3 bg-precision-teal rounded" /> P50
        </span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="w-3 h-3 bg-spring-green rounded" /> Actual
        </span>
      </div>
    </GlassPanel>
  );
};

// ============================================
// MARGIN REQUIREMENT MONITOR
// ============================================

interface MarginRequirementMonitorProps {
  currentMargin: number;
  requiredMargin: number;
  maintenanceMargin: number;
}

const MarginRequirementMonitor: React.FC<MarginRequirementMonitorProps> = ({
  currentMargin = 15000000,
  requiredMargin = 12000000,
  maintenanceMargin = 10000000,
}) => {
  const marginRatio = currentMargin / requiredMargin;
  const bufferPercentage = ((currentMargin - requiredMargin) / requiredMargin) * 100;

  const getStatus = () => {
    if (marginRatio >= 1.25) return { label: 'Healthy', color: 'text-spring-green', bg: 'bg-spring-green' };
    if (marginRatio >= 1.1) return { label: 'Adequate', color: 'text-precision-teal', bg: 'bg-precision-teal' };
    if (marginRatio >= 1) return { label: 'Warning', color: 'text-achievement-gold', bg: 'bg-achievement-gold' };
    return { label: 'Critical', color: 'text-crisis-red', bg: 'bg-crisis-red' };
  };

  const status = getStatus();

  return (
    <GlassPanel variant={marginRatio < 1 ? 'crisis' : 'default'} padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-off-white">Margin Monitor</h3>
        <Badge variant={marginRatio >= 1 ? 'success' : 'error'}>{status.label}</Badge>
      </div>

      {/* Current Margin */}
      <div className="mb-6">
        <p className="text-xs text-muted mb-1">Current Margin</p>
        <p className="text-3xl font-bold text-off-white">
          ${(currentMargin / 1000000).toFixed(2)}M
        </p>
        <p className={cn('text-sm font-medium', status.color)}>
          {bufferPercentage > 0 ? '+' : ''}{bufferPercentage.toFixed(1)}% vs required
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-8 bg-rich-black rounded-lg overflow-hidden mb-4">
        {/* Maintenance */}
        <div
          className="absolute h-full bg-crisis-red/20 border-r-2 border-crisis-red"
          style={{ width: `${(maintenanceMargin / currentMargin) * 100}%` }}
        />
        {/* Required */}
        <div
          className="absolute h-full bg-achievement-gold/20 border-r-2 border-achievement-gold"
          style={{ width: `${(requiredMargin / currentMargin) * 100}%` }}
        />
        {/* Current */}
        <div
          className={cn('absolute h-full', status.bg)}
          style={{ width: '100%', opacity: 0.3 }}
        />

        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span className="text-xs text-white font-medium z-10">Maint.</span>
          <span className="text-xs text-white font-medium z-10">Required</span>
          <span className="text-xs text-white font-medium z-10">Current</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 bg-glass-white rounded-lg">
          <p className="text-xs text-muted">Maintenance</p>
          <p className="text-sm font-medium text-crisis-red">${(maintenanceMargin / 1000000).toFixed(1)}M</p>
        </div>
        <div className="p-2 bg-glass-white rounded-lg">
          <p className="text-xs text-muted">Required</p>
          <p className="text-sm font-medium text-achievement-gold">${(requiredMargin / 1000000).toFixed(1)}M</p>
        </div>
        <div className="p-2 bg-glass-white rounded-lg">
          <p className="text-xs text-muted">Buffer</p>
          <p className={cn('text-sm font-medium', status.color)}>
            ${((currentMargin - requiredMargin) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </GlassPanel>
  );
};

// ============================================
// TRANSACTION HISTORY
// ============================================

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const { playSound } = useSoundEffects();

  const getTypeIcon = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'inflow': return '💵';
      case 'outflow': return '💸';
      case 'transfer': return '🔄';
    }
  };

  const getTypeColor = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'inflow': return 'text-spring-green';
      case 'outflow': return 'text-crisis-red';
      case 'transfer': return 'text-precision-teal';
    }
  };

  return (
    <GlassPanel variant="default" padding="none">
      <div className="p-4 border-b border-glass-border flex items-center justify-between">
        <h3 className="font-semibold text-off-white">Recent Transactions</h3>
        <Button variant="ghost" size="sm">View All</Button>
      </div>

      <div className="divide-y divide-glass-border">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => playSound('click')}
            className="p-4 hover:bg-glass-white/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{getTypeIcon(tx.type)}</span>
              <div className="flex-1">
                <p className="font-medium text-off-white text-sm">{tx.description}</p>
                <p className="text-xs text-muted">{tx.counterparty}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  'font-semibold',
                  getTypeColor(tx.type)
                )}>
                  {tx.type === 'outflow' ? '-' : ''}${(tx.amount / 1000000).toFixed(2)}M
                </p>
                <p className="text-xs text-muted">
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// SUB-MILLISECOND BADGE
// ============================================

const SubMillisecondBadge: React.FC<{ latency: number }> = ({ latency = 0.47 }) => (
  <GlassPanel variant="default" padding="default" className="text-center">
    <p className="text-xs text-muted uppercase mb-2">Execution Latency</p>
    <p className="text-3xl font-bold text-precision-teal">{latency}ms</p>
    <Badge variant="premium" className="mt-2">Sub-Millisecond</Badge>
  </GlassPanel>
);

// ============================================
// MAIN PAGE
// ============================================

const TreasuryPage: React.FC = () => {
  const { addXP } = useGamificationStore();

  // Page view XP
  React.useEffect(() => {
    addXP(10, 'page_view', 'Viewed Treasury');
  }, [addXP]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <TreasuryHeader />

      {/* Harvey Quote */}
      <div className="mb-8">
        <PersonaCard
          persona="harvey"
          quote={QUOTES.HARVEY.CALM_MARKET}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Liquidity"
          value="$15.2M"
          icon="💰"
          change={4.2}
        />
        <MetricCard
          title="Today's P&L"
          value="+$287K"
          icon="📈"
          change={2.1}
        />
        <MetricCard
          title="Open Positions"
          value="47"
          icon="📊"
        />
        <MetricCard
          title="Pending Settlements"
          value="$3.2M"
          icon="⏳"
          subtitle="Due in 24h"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Forecast Card */}
        <div className="lg:col-span-2">
          <DailyLiquidityForecastCard forecasts={MOCK_FORECASTS} />
        </div>

        {/* Margin Monitor */}
        <div className="space-y-6">
          <MarginRequirementMonitor
            currentMargin={15000000}
            requiredMargin={12000000}
            maintenanceMargin={10000000}
          />
          <SubMillisecondBadge latency={0.47} />
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory transactions={MOCK_TRANSACTIONS} />
    </div>
  );
};

export default TreasuryPage;
