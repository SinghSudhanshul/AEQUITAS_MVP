// ============================================
// WAR ROOM PAGE
// Wing 6: Real-time Operations (Features 51-60)
// ============================================

import React, { useState, useEffect } from 'react';
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
import { useCrisisStore } from '@/store/crisis.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface LiveFeed {
  id: string;
  type: 'trade' | 'alert' | 'news' | 'system';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface Position {
  symbol: string;
  quantity: number;
  price: number;
  pnl: number;
  pnlPercent: number;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_POSITIONS: Position[] = [
  { symbol: 'AAPL', quantity: 500, price: 185.50, pnl: 2750, pnlPercent: 3.2 },
  { symbol: 'MSFT', quantity: 300, price: 392.80, pnl: 1840, pnlPercent: 1.6 },
  { symbol: 'GOOGL', quantity: 100, price: 148.25, pnl: -520, pnlPercent: -3.4 },
  { symbol: 'NVDA', quantity: 200, price: 625.40, pnl: 4200, pnlPercent: 3.5 },
  { symbol: 'TSLA', quantity: 150, price: 215.80, pnl: -980, pnlPercent: -2.9 },
];

const generateFeed = (): LiveFeed[] => {
  const messages = [
    { type: 'trade' as const, msg: 'Buy order executed: 100 AAPL @ $185.50' },
    { type: 'alert' as const, msg: 'Volatility spike detected in tech sector' },
    { type: 'news' as const, msg: 'Fed signals potential rate hold' },
    { type: 'system' as const, msg: 'Margin check completed successfully' },
    { type: 'trade' as const, msg: 'Sell order filled: 50 MSFT @ $392.80' },
    { type: 'alert' as const, msg: 'Position limit approaching for NVDA' },
  ];

  return messages.map((m, i) => ({
    id: `feed_${i}`,
    type: m.type,
    message: m.msg,
    timestamp: new Date(Date.now() - i * 60000 * Math.random() * 10).toISOString(),
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as LiveFeed['priority'],
  }));
};

// ============================================
// LIVE TICKER
// ============================================

const LiveTicker: React.FC = () => {
  const [ticks, setTicks] = useState([
    { symbol: 'VIX', value: 18.52, change: 1.24 },
    { symbol: 'SPX', value: 4892.31, change: 0.45 },
    { symbol: 'DXY', value: 103.82, change: -0.12 },
    { symbol: 'TNX', value: 4.15, change: 0.08 },
    { symbol: 'CL1', value: 78.45, change: 1.87 },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTicks((prev) =>
        prev.map((tick) => ({
          ...tick,
          value: tick.value + (Math.random() - 0.5) * tick.value * 0.001,
          change: tick.change + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 mb-8">
      {ticks.map((tick) => (
        <div
          key={tick.symbol}
          className="flex-shrink-0 px-4 py-2 bg-glass-white rounded-lg min-w-[120px]"
        >
          <span className="text-xs text-muted block">{tick.symbol}</span>
          <span className="text-lg font-bold text-off-white">{tick.value.toFixed(2)}</span>
          <span className={cn(
            'text-xs font-medium ml-1',
            tick.change >= 0 ? 'text-spring-green' : 'text-crisis-red'
          )}>
            {tick.change >= 0 ? '+' : ''}{tick.change.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// POSITION HEATMAP
// ============================================

const PositionHeatmap: React.FC<{ positions: Position[] }> = ({ positions }) => {
  const maxPnl = Math.max(...positions.map((p) => Math.abs(p.pnl)));

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-off-white">Position Heatmap</h3>
        <Badge variant="default">LIVE</Badge>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {positions.map((pos) => {
          const intensity = Math.abs(pos.pnl) / maxPnl;
          const isPositive = pos.pnl >= 0;

          return (
            <div
              key={pos.symbol}
              className={cn(
                'aspect-square rounded-lg p-3 flex flex-col items-center justify-center transition-all',
                isPositive
                  ? `bg-spring-green/${Math.round(intensity * 40 + 10)}`
                  : `bg-crisis-red/${Math.round(intensity * 40 + 10)}`
              )}
              style={{
                backgroundColor: isPositive
                  ? `rgba(0, 216, 180, ${intensity * 0.4 + 0.1})`
                  : `rgba(239, 68, 68, ${intensity * 0.4 + 0.1})`,
              }}
            >
              <span className="font-bold text-off-white">{pos.symbol}</span>
              <span className={cn(
                'text-sm font-semibold',
                isPositive ? 'text-spring-green' : 'text-crisis-red'
              )}>
                {isPositive ? '+' : ''}${(pos.pnl / 1000).toFixed(1)}K
              </span>
              <span className="text-[10px] text-muted">{pos.pnlPercent.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
};

// ============================================
// LIVE FEED
// ============================================

const LiveFeedPanel: React.FC<{ feeds: LiveFeed[] }> = ({ feeds }) => {
  const getTypeIcon = (type: LiveFeed['type']) => {
    switch (type) {
      case 'trade': return '📈';
      case 'alert': return '⚠️';
      case 'news': return '📰';
      case 'system': return '⚙️';
    }
  };

  const getPriorityColor = (priority: LiveFeed['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-crisis-red';
      case 'high': return 'border-l-achievement-gold';
      case 'medium': return 'border-l-precision-teal';
      default: return 'border-l-glass-border';
    }
  };

  return (
    <GlassPanel variant="default" padding="none" className="h-[400px] flex flex-col">
      <div className="p-4 border-b border-glass-border flex items-center justify-between">
        <h3 className="font-semibold text-off-white">Live Feed</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-spring-green rounded-full animate-pulse" />
          <span className="text-xs text-muted">Streaming</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-glass-border/50">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className={cn(
              'p-3 border-l-4',
              getPriorityColor(feed.priority)
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{getTypeIcon(feed.type)}</span>
              <div className="flex-1">
                <p className="text-sm text-off-white">{feed.message}</p>
                <p className="text-[10px] text-muted mt-1">
                  {new Date(feed.timestamp).toLocaleTimeString()}
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
// EXECUTION PANEL
// ============================================

const ExecutionPanel: React.FC = () => {
  const { playSound } = useSoundEffects();
  const { addXP } = useGamificationStore();
  const [executing, setExecuting] = useState(false);

  const handleExecute = async () => {
    playSound('click');
    setExecuting(true);

    await new Promise((r) => setTimeout(r, 1500));

    playSound('success_chord');
    addXP(25, 'trade_execution', 'Executed trading operation');
    setExecuting(false);
  };

  return (
    <GlassPanel variant="default" padding="lg">
      <h3 className="font-semibold text-off-white mb-4">Quick Execution</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button variant="outline" size="sm">📈 Buy</Button>
        <Button variant="outline" size="sm">📉 Sell</Button>
        <Button variant="outline" size="sm">⚖️ Rebalance</Button>
        <Button variant="outline" size="sm">🛑 Halt All</Button>
      </div>

      <Button
        variant="default"
        className="w-full"
        onClick={handleExecute}
        loading={executing}
        loadingText="Executing..."
      >
        ⚡ Execute Strategy
      </Button>

      <p className="text-[10px] text-muted text-center mt-3">
        +25 XP per execution
      </p>
    </GlassPanel>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const WarRoomPage: React.FC = () => {
  const wing = WINGS['war-room'];
  const { addXP } = useGamificationStore();
  const { paranoiaMode } = useCrisisStore();
  const [feeds, setFeeds] = useState<LiveFeed[]>([]);

  useEffect(() => {
    addXP(10, 'page_view', 'Visited War Room');
    setFeeds(generateFeed());
  }, [addXP]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{wing.icon}</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
              {wing.name}
            </h1>
            <Badge variant="premium">ENTERPRISE</Badge>
            {paranoiaMode && <Badge variant="error" className="animate-pulse">PARANOIA MODE</Badge>}
          </div>
          <p className="text-muted">{wing.description}. Real-time command center.</p>
        </div>
      </div>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Exposure" value="$47.2M" icon="💰" />
        <MetricCard title="Today's P&L" value="+$287K" icon="📈" trend="up" />
        <MetricCard title="Active Orders" value="12" icon="📋" />
        <MetricCard title="Latency" value="0.47ms" icon="⚡" />
      </div>

      {/* Harvey Quote */}
      <div className="mb-8">
        <PersonaCard
          persona="harvey"
          quote={QUOTES.HARVEY.SUCCESS}
        />
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PositionHeatmap positions={MOCK_POSITIONS} />
        </div>
        <div className="space-y-6">
          <ExecutionPanel />
        </div>
      </div>

      {/* Live Feed */}
      <div className="mt-8">
        <LiveFeedPanel feeds={feeds} />
      </div>
    </div>
  );
};

export default WarRoomPage;
