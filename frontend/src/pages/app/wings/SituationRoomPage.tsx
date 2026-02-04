// ============================================
// SITUATION ROOM PAGE
// Wing 5: Crisis Simulator (Features 21-30)
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
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

interface CrisisScenario {
  id: string;
  name: string;
  icon: string;
  severity: 'moderate' | 'severe' | 'catastrophic';
  description: string;
  triggers: string[];
  estimatedImpact: {
    portfolioLoss: number;
    liquidityCrunch: number;
    recoveryDays: number;
  };
  probability: number;
}

interface SimulationStep {
  id: string;
  time: string;
  event: string;
  impact: 'positive' | 'negative' | 'neutral';
  value?: string;
}

// ============================================
// MOCK DATA
// ============================================

const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'flash-crash',
    name: '2026 Flash Crash',
    icon: '⚡',
    severity: 'severe',
    description: 'AI-driven trading algorithms trigger cascading sell-offs across major indices',
    triggers: ['Algorithmic trading failure', 'Liquidity evaporation', 'Circuit breaker failures'],
    estimatedImpact: { portfolioLoss: 23, liquidityCrunch: 45, recoveryDays: 5 },
    probability: 15,
  },
  {
    id: 'cyber-attack',
    name: 'Banking Cyberattack',
    icon: '🔐',
    severity: 'catastrophic',
    description: 'Coordinated ransomware attack disrupts major financial institutions',
    triggers: ['SWIFT network breach', 'Trading system lockout', 'Settlement failures'],
    estimatedImpact: { portfolioLoss: 35, liquidityCrunch: 80, recoveryDays: 14 },
    probability: 8,
  },
  {
    id: 'fed-shock',
    name: 'Fed Policy Shock',
    icon: '🏛️',
    severity: 'moderate',
    description: 'Emergency rate change of 100bps triggers market repricing',
    triggers: ['Surprise FOMC decision', 'Bond market disruption', 'Dollar volatility'],
    estimatedImpact: { portfolioLoss: 12, liquidityCrunch: 25, recoveryDays: 3 },
    probability: 25,
  },
  {
    id: 'geopolitical',
    name: 'Geopolitical Conflict',
    icon: '🌍',
    severity: 'severe',
    description: 'Major regional conflict disrupts global supply chains and energy markets',
    triggers: ['Energy price spike', 'Commodity shortage', 'Currency instability'],
    estimatedImpact: { portfolioLoss: 28, liquidityCrunch: 55, recoveryDays: 21 },
    probability: 12,
  },
];

const SIMULATION_STEPS: SimulationStep[] = [
  { id: 's1', time: 'T+0', event: 'Initial shock detected', impact: 'negative', value: '-5%' },
  { id: 's2', time: 'T+5m', event: 'Trading halted on major exchanges', impact: 'neutral' },
  { id: 's3', time: 'T+10m', event: 'Margin calls triggered', impact: 'negative', value: '-12%' },
  { id: 's4', time: 'T+30m', event: 'Defensive positions activated', impact: 'positive', value: '+3%' },
  { id: 's5', time: 'T+1h', event: 'Liquidity restored partially', impact: 'positive', value: '+5%' },
  { id: 's6', time: 'T+2h', event: 'Market stabilizing', impact: 'positive', value: '+2%' },
];

// ============================================
// CRISIS SCENARIO CARD
// ============================================

interface ScenarioCardProps {
  scenario: CrisisScenario;
  isSelected: boolean;
  onSelect: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, isSelected, onSelect }) => {
  const { playSound } = useSoundEffects();

  const getSeverityColor = () => {
    switch (scenario.severity) {
      case 'catastrophic': return 'border-crisis-red bg-crisis-red/10';
      case 'severe': return 'border-achievement-gold bg-achievement-gold/10';
      default: return 'border-precision-teal bg-precision-teal/10';
    }
  };

  return (
    <button
      onClick={() => {
        playSound('click');
        onSelect();
      }}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all',
        'hover:scale-[1.02] active:scale-[0.98]',
        isSelected
          ? 'ring-2 ring-off-white ' + getSeverityColor()
          : 'border-glass-border hover:border-precision-teal/50 bg-glass-white'
      )}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{scenario.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-off-white">{scenario.name}</h4>
            <Badge variant={
              scenario.severity === 'catastrophic' ? 'error' :
                scenario.severity === 'severe' ? 'warning' : 'default'
            }>
              {scenario.severity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted mb-3">{scenario.description}</p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-rich-black/30 rounded">
              <p className="text-sm font-bold text-crisis-red">-{scenario.estimatedImpact.portfolioLoss}%</p>
              <p className="text-[10px] text-muted">Portfolio</p>
            </div>
            <div className="p-2 bg-rich-black/30 rounded">
              <p className="text-sm font-bold text-achievement-gold">{scenario.estimatedImpact.liquidityCrunch}%</p>
              <p className="text-[10px] text-muted">Liquidity</p>
            </div>
            <div className="p-2 bg-rich-black/30 rounded">
              <p className="text-sm font-bold text-precision-teal">{scenario.estimatedImpact.recoveryDays}d</p>
              <p className="text-[10px] text-muted">Recovery</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

// ============================================
// CRISIS SIMULATOR
// ============================================

interface CrisisSimulatorProps {
  scenario: CrisisScenario | null;
}

const CrisisSimulator: React.FC<CrisisSimulatorProps> = ({ scenario }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const { playSound } = useSoundEffects();
  const { addXP } = useGamificationStore();
  const { toggleParanoiaMode } = useCrisisStore();

  const runSimulation = useCallback(async () => {
    if (!scenario) return;

    setIsRunning(true);
    setCurrentStep(0);
    setSimulationComplete(false);
    playSound('elevator_chime');

    for (let i = 0; i < SIMULATION_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      setCurrentStep(i + 1);
      playSound(SIMULATION_STEPS[i].impact === 'negative' ? 'error' : 'success_chord');
    }

    setIsRunning(false);
    setSimulationComplete(true);
    addXP(75, 'crisis_simulation', `Completed ${scenario.name} scenario`);
  }, [scenario, playSound, addXP]);

  const activateParanoiaMode = () => {
    playSound('elevator_chime');
    toggleParanoiaMode();
  };

  if (!scenario) {
    return (
      <GlassPanel variant="default" padding="lg" className="h-full flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🎯</span>
          <h3 className="text-lg font-semibold text-off-white mb-2">Select a Scenario</h3>
          <p className="text-sm text-muted">Choose a crisis scenario to simulate</p>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel variant="crisis" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{scenario.icon}</span>
          <div>
            <h3 className="font-semibold text-off-white">{scenario.name}</h3>
            <p className="text-xs text-muted">Crisis Simulation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={activateParanoiaMode}
          >
            🚨 Paranoia Mode
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={runSimulation}
            disabled={isRunning}
            loading={isRunning}
            loadingText="Simulating..."
          >
            ▶️ Run
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {SIMULATION_STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep && isRunning;

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg transition-all',
                isComplete ? 'bg-glass-white' : 'bg-rich-black/30',
                isCurrent && 'ring-2 ring-precision-teal animate-pulse'
              )}
            >
              {/* Status */}
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0',
                isComplete
                  ? step.impact === 'positive' ? 'bg-spring-green/20' :
                    step.impact === 'negative' ? 'bg-crisis-red/20' : 'bg-glass-white'
                  : 'bg-rich-black'
              )}>
                {isComplete ? (
                  step.impact === 'positive' ? '✅' :
                    step.impact === 'negative' ? '❌' : '⏸️'
                ) : (
                  isCurrent ? '⏳' : '⏹️'
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-precision-teal">{step.time}</span>
                  <p className={cn(
                    'font-medium text-sm',
                    isComplete ? 'text-off-white' : 'text-muted'
                  )}>
                    {step.event}
                  </p>
                </div>
              </div>

              {/* Value */}
              {step.value && (
                <span className={cn(
                  'text-sm font-bold',
                  step.impact === 'positive' ? 'text-spring-green' : 'text-crisis-red',
                  !isComplete && 'opacity-30'
                )}>
                  {step.value}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Results */}
      {simulationComplete && (
        <div className="mt-6 p-4 bg-spring-green/10 border border-spring-green/30 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-semibold text-spring-green">Simulation Complete</p>
              <p className="text-xs text-muted">+75 XP earned • Crisis survived</p>
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

// ============================================
// MONTE CARLO RACE
// ============================================

const MonteCarloSimulationRace: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [scenarios, setScenarios] = useState([
    { id: 'bull', name: 'Bull Market', color: 'bg-spring-green', progress: 0, result: 125 },
    { id: 'bear', name: 'Bear Market', color: 'bg-crisis-red', progress: 0, result: 75 },
    { id: 'sideways', name: 'Sideways', color: 'bg-precision-teal', progress: 0, result: 100 },
  ]);
  const { playSound } = useSoundEffects();

  const runRace = useCallback(async () => {
    setIsRunning(true);
    playSound('elevator_chime');

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 100));
      setScenarios((prev) =>
        prev.map((s) => ({
          ...s,
          progress: Math.min(i + Math.random() * 10, 100),
        }))
      );
    }

    setIsRunning(false);
    playSound('success_chord');
  }, [playSound]);

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏁</span>
          <h3 className="font-semibold text-off-white">Monte Carlo Race</h3>
        </div>
        <Button variant="outline" size="sm" onClick={runRace} disabled={isRunning}>
          {isRunning ? 'Racing...' : 'Run 1000 Sims'}
        </Button>
      </div>

      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <div key={scenario.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-off-white">{scenario.name}</span>
              <span className="text-sm font-medium text-off-white">
                ${scenario.result}K
              </span>
            </div>
            <div className="h-4 bg-rich-black rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-300', scenario.color)}
                style={{ width: `${scenario.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const SituationRoomPage: React.FC = () => {
  const wing = WINGS['situation-room'];
  const [selectedScenario, setSelectedScenario] = useState<CrisisScenario | null>(null);
  const { addXP } = useGamificationStore();

  useEffect(() => {
    addXP(10, 'page_view', 'Visited Situation Room');
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
            <Badge variant="warning">PREMIUM</Badge>
          </div>
          <p className="text-muted">{wing.description}. Prepare for the worst. Execute the best.</p>
        </div>
      </div>

      {/* Harvey Quote */}
      <div className="mb-8">
        <PersonaCard
          persona="harvey"
          quote={QUOTES.HARVEY.HIGH_VOLATILITY}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Scenarios Run" value="47" icon="🎯" />
        <MetricCard title="Survival Rate" value="94%" icon="🛡️" change={3} />
        <MetricCard title="Avg Recovery" value="4.2d" icon="⏱️" />
        <MetricCard title="Risk Score" value="Moderate" icon="⚠️" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Scenario Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-off-white">Crisis Scenarios</h3>
          {CRISIS_SCENARIOS.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isSelected={selectedScenario?.id === scenario.id}
              onSelect={() => setSelectedScenario(scenario)}
            />
          ))}
        </div>

        {/* Simulator */}
        <CrisisSimulator scenario={selectedScenario} />
      </div>

      {/* Monte Carlo */}
      <MonteCarloSimulationRace />
    </div>
  );
};

export default SituationRoomPage;
