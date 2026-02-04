// ============================================
// HARVEY'S OFFICE PAGE
// Wing 8: Executive Strategy (Features 71-80)
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
// import { useCrisisStore } from '@/store/crisis.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface StrategyNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'exit';
  label: string;
  x: number;
  y: number;
  connections: string[];
}

interface WinRecord {
  id: string;
  strategy: string;
  result: 'win' | 'loss' | 'pending';
  pnl: number;
  date: string;
  confidence: number;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_STRATEGIES: StrategyNode[] = [
  { id: 'entry', type: 'trigger', label: 'Entry Signal', x: 50, y: 100, connections: ['cond1'] },
  { id: 'cond1', type: 'condition', label: 'RSI < 30', x: 200, y: 50, connections: ['action1'] },
  { id: 'cond2', type: 'condition', label: 'Volume > 1.5x', x: 200, y: 150, connections: ['action1'] },
  { id: 'action1', type: 'action', label: 'Buy 100 shares', x: 350, y: 100, connections: ['exit'] },
  { id: 'exit', type: 'exit', label: 'TP: +5%', x: 500, y: 100, connections: [] },
];

const MOCK_WINS: WinRecord[] = [
  { id: 'w1', strategy: 'Momentum Alpha', result: 'win', pnl: 125000, date: '2024-01-15', confidence: 92 },
  { id: 'w2', strategy: 'Mean Reversion', result: 'win', pnl: 87500, date: '2024-01-14', confidence: 88 },
  { id: 'w3', strategy: 'Breakout Play', result: 'loss', pnl: -32000, date: '2024-01-13', confidence: 75 },
  { id: 'w4', strategy: 'Momentum Alpha', result: 'win', pnl: 156000, date: '2024-01-12', confidence: 94 },
  { id: 'w5', strategy: 'Pairs Trade', result: 'pending', pnl: 0, date: '2024-01-15', confidence: 81 },
];

// ============================================
// STRATEGY BUILDER CANVAS
// ============================================

interface StrategyBuilderCanvasProps {
  nodes: StrategyNode[];
  onNodeSelect?: (node: StrategyNode) => void;
}

const StrategyBuilderCanvas: React.FC<StrategyBuilderCanvasProps> = ({ nodes, onNodeSelect }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { playSound } = useSoundEffects();

  const getNodeStyle = (type: StrategyNode['type']) => {
    switch (type) {
      case 'trigger': return 'bg-spring-green/30 border-spring-green text-spring-green';
      case 'condition': return 'bg-precision-teal/30 border-precision-teal text-precision-teal';
      case 'action': return 'bg-achievement-gold/30 border-achievement-gold text-achievement-gold';
      case 'exit': return 'bg-crisis-red/30 border-crisis-red text-crisis-red';
    }
  };

  const handleNodeClick = (node: StrategyNode) => {
    playSound('click');
    setSelectedNode(node.id);
    onNodeSelect?.(node);
  };

  return (
    <GlassPanel variant="default" padding="none" className="h-[400px] relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 border-b border-glass-border bg-surface/90 backdrop-blur z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h3 className="font-semibold text-off-white">Strategy Builder</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">📋 Templates</Button>
          <Button variant="outline" size="sm">💾 Save</Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 pt-16">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,216,180,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,216,180,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId);
              if (!target) return null;
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.x + 60}
                  y1={node.y + 20}
                  x2={target.x}
                  y2={target.y + 20}
                  stroke="rgba(0, 216, 180, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className={cn(
              'absolute px-4 py-2 rounded-lg border-2 font-medium text-sm',
              'transition-all hover:scale-105',
              getNodeStyle(node.type),
              selectedNode === node.id && 'ring-2 ring-off-white'
            )}
            style={{ left: node.x, top: node.y }}
          >
            {node.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4">
        <span className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded bg-spring-green/30 border border-spring-green" />
          Trigger
        </span>
        <span className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded bg-precision-teal/30 border border-precision-teal" />
          Condition
        </span>
        <span className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded bg-achievement-gold/30 border border-achievement-gold" />
          Action
        </span>
        <span className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded bg-crisis-red/30 border border-crisis-red" />
          Exit
        </span>
      </div>
    </GlassPanel>
  );
};

// ============================================
// WIN RATE DASHBOARD
// ============================================

interface WinRateDashboardProps {
  records: WinRecord[];
}

const WinRateDashboard: React.FC<WinRateDashboardProps> = ({ records }) => {
  const wins = records.filter((r) => r.result === 'win').length;
  const losses = records.filter((r) => r.result === 'loss').length;
  const total = wins + losses;
  const winRate = total > 0 ? (wins / total) * 100 : 0;
  const totalPnL = records.reduce((sum, r) => sum + r.pnl, 0);

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🏆</span>
        <h3 className="font-semibold text-off-white">Win Rate Dashboard</h3>
      </div>

      {/* Win Rate Gauge */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={winRate >= 60 ? '#00d8b4' : winRate >= 50 ? '#fbbf24' : '#ef4444'}
            strokeWidth="12"
            strokeDasharray={`${(winRate / 100) * 352} 352`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-off-white">{winRate.toFixed(0)}%</span>
          <span className="text-xs text-muted">Win Rate</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-glass-white rounded-lg">
          <p className="text-2xl font-bold text-spring-green">{wins}</p>
          <p className="text-xs text-muted">Wins</p>
        </div>
        <div className="text-center p-3 bg-glass-white rounded-lg">
          <p className="text-2xl font-bold text-crisis-red">{losses}</p>
          <p className="text-xs text-muted">Losses</p>
        </div>
        <div className="text-center p-3 bg-glass-white rounded-lg">
          <p className={cn(
            'text-2xl font-bold',
            totalPnL >= 0 ? 'text-spring-green' : 'text-crisis-red'
          )}>
            ${Math.abs(totalPnL / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-muted">Total P&L</p>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="space-y-2">
        <p className="text-xs text-muted uppercase font-medium">Recent Trades</p>
        {records.slice(0, 5).map((record) => (
          <div key={record.id} className="flex items-center justify-between p-2 bg-glass-white rounded">
            <div>
              <p className="text-sm font-medium text-off-white">{record.strategy}</p>
              <p className="text-[10px] text-muted">{record.date}</p>
            </div>
            <div className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              record.result === 'win' && 'bg-spring-green/20 text-spring-green',
              record.result === 'loss' && 'bg-crisis-red/20 text-crisis-red',
              record.result === 'pending' && 'bg-achievement-gold/20 text-achievement-gold'
            )}>
              {record.result === 'pending' ? 'LIVE' : (record.pnl >= 0 ? '+' : '') + '$' + (record.pnl / 1000).toFixed(0) + 'K'}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// RISK TOLERANCE CONTROL
// ============================================

const RiskToleranceBiggerGun: React.FC = () => {
  const [riskLevel, setRiskLevel] = useState(50);
  const { playSound } = useSoundEffects();

  const getRiskLabel = () => {
    if (riskLevel <= 25) return { label: 'Conservative', color: 'text-precision-teal' };
    if (riskLevel <= 50) return { label: 'Moderate', color: 'text-spring-green' };
    if (riskLevel <= 75) return { label: 'Aggressive', color: 'text-achievement-gold' };
    return { label: 'Maximum', color: 'text-crisis-red' };
  };

  const risk = getRiskLabel();

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎰</span>
        <h3 className="font-semibold text-off-white">Risk Tolerance</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={cn('text-lg font-bold', risk.color)}>{risk.label}</span>
          <span className="text-off-white font-medium">{riskLevel}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={riskLevel}
          onChange={(e) => {
            setRiskLevel(Number(e.target.value));
            playSound('click');
          }}
          className="w-full h-3 bg-rich-black rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-precision-teal"
        />
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className={cn('p-2 rounded', riskLevel <= 25 && 'bg-precision-teal/20')}>
          <p className="text-precision-teal">🛡️</p>
          <p className="text-muted">Safe</p>
        </div>
        <div className={cn('p-2 rounded', riskLevel > 25 && riskLevel <= 50 && 'bg-spring-green/20')}>
          <p className="text-spring-green">⚖️</p>
          <p className="text-muted">Balanced</p>
        </div>
        <div className={cn('p-2 rounded', riskLevel > 50 && riskLevel <= 75 && 'bg-achievement-gold/20')}>
          <p className="text-achievement-gold">⚡</p>
          <p className="text-muted">Growth</p>
        </div>
        <div className={cn('p-2 rounded', riskLevel > 75 && 'bg-crisis-red/20')}>
          <p className="text-crisis-red">🔥</p>
          <p className="text-muted">YOLO</p>
        </div>
      </div>

      <p className="text-[10px] text-muted text-center mt-4 italic">
        "{QUOTES.HARVEY.RISK_WARNING}"
      </p>
    </GlassPanel>
  );
};

// ============================================
// EXECUTION TRIGGERS
// ============================================

const ExecutionTriggers: React.FC = () => {
  const [triggers, setTriggers] = useState([
    { id: 1, name: 'Stop Loss', enabled: true, value: '-5%' },
    { id: 2, name: 'Take Profit', enabled: true, value: '+10%' },
    { id: 3, name: 'Trailing Stop', enabled: false, value: '3%' },
    { id: 4, name: 'Time Exit', enabled: false, value: '15:30 ET' },
  ]);
  const { playSound } = useSoundEffects();
  const { addXP } = useGamificationStore();

  const toggleTrigger = (id: number) => {
    playSound('click');
    setTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
    addXP(5, 'trigger_toggle', 'Modified execution trigger');
  };

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚡</span>
        <h3 className="font-semibold text-off-white">Execution Triggers</h3>
      </div>

      <div className="space-y-3">
        {triggers.map((trigger) => (
          <div
            key={trigger.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg',
              trigger.enabled ? 'bg-precision-teal/10 border border-precision-teal/30' : 'bg-glass-white'
            )}
          >
            <div>
              <p className="font-medium text-sm text-off-white">{trigger.name}</p>
              <p className="text-xs text-muted">{trigger.value}</p>
            </div>
            <button
              onClick={() => toggleTrigger(trigger.id)}
              className={cn(
                'w-12 h-6 rounded-full transition-all',
                trigger.enabled ? 'bg-precision-teal' : 'bg-glass-border'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full bg-white shadow transition-transform',
                  trigger.enabled ? 'translate-x-6' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const HarveysOfficePage: React.FC = () => {
  const wing = WINGS['harveys-office'];
  const { addXP } = useGamificationStore();

  useEffect(() => {
    addXP(10, 'page_view', 'Visited Harvey\'s Office');
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
          </div>
          <p className="text-muted">{wing.description}. Think big. Win bigger.</p>
        </div>

        <Button variant="default" size="lg">
          🚀 Deploy Strategy
        </Button>
      </div>

      {/* Harvey's Wisdom */}
      <div className="mb-8">
        <PersonaCard
          persona="harvey"
          quote={QUOTES.HARVEY.MOTIVATION}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Active Strategies"
          value="3"
          icon="🎯"
        />
        <MetricCard
          title="Win Rate (30d)"
          value="78%"
          icon="🏆"
          change={5}
        />
        <MetricCard
          title="Total Returns"
          value="+$336K"
          icon="💰"
        />
        <MetricCard
          title="Risk Score"
          value="Moderate"
          icon="⚖️"
        />
      </div>

      {/* Strategy Builder */}
      <div className="mb-8">
        <StrategyBuilderCanvas nodes={MOCK_STRATEGIES} />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WinRateDashboard records={MOCK_WINS} />
        </div>
        <div className="space-y-6">
          <RiskToleranceBiggerGun />
          <ExecutionTriggers />
        </div>
      </div>
    </div>
  );
};

export default HarveysOfficePage;
