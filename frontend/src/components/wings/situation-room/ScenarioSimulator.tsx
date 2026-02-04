'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, FastForward, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { CrisisScenario, SimulationState } from '@/types/wings/situation-room';

interface ScenarioSimulatorProps {
  scenario?: CrisisScenario;
  onComplete?: (results: any) => void;
  className?: string;
}

const mockScenario: CrisisScenario = {
  id: 'scenario-1',
  name: 'Flash Crash Recovery',
  description: 'Simulate response to a sudden 15% market drop',
  difficulty: 'hard',
  stages: [
    { id: '1', name: 'Detection', duration: 5, status: 'pending' },
    { id: '2', name: 'Assessment', duration: 10, status: 'pending' },
    { id: '3', name: 'Action', duration: 15, status: 'pending' },
    { id: '4', name: 'Recovery', duration: 10, status: 'pending' },
  ],
  xpReward: 500,
};

export const ScenarioSimulator = React.memo(function ScenarioSimulator({ scenario = mockScenario, onComplete, className }: ScenarioSimulatorProps) {
  const [state, setState] = React.useState<SimulationState>({
    isRunning: false,
    currentStage: 0,
    elapsedTime: 0,
    speed: 1,
  });
  const [stages, setStages] = React.useState(scenario.stages);

  const totalDuration = scenario.stages.reduce((sum, s) => sum + s.duration, 0);
  const progress = (state.elapsedTime / totalDuration) * 100;

  React.useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState(prev => {
        const newTime = prev.elapsedTime + state.speed;
        let cumulativeTime = 0;
        let newStage = 0;

        for (let i = 0; i < scenario.stages.length; i++) {
          cumulativeTime += scenario.stages[i].duration;
          if (newTime <= cumulativeTime) {
            newStage = i;
            break;
          }
          newStage = i + 1;
        }

        if (newTime >= totalDuration) {
          setStages(prev => prev.map(s => ({ ...s, status: 'completed' as const })));
          onComplete?.({ score: 85, xpEarned: scenario.xpReward });
          return { ...prev, isRunning: false, elapsedTime: totalDuration, currentStage: scenario.stages.length };
        }

        setStages(prev => prev.map((s, idx) => ({
          ...s,
          status: idx < newStage ? 'completed' : idx === newStage ? 'active' : 'pending'
        })));

        return { ...prev, elapsedTime: newTime, currentStage: newStage };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning, state.speed, onComplete, scenario, totalDuration]);

  const reset = () => {
    setState({ isRunning: false, currentStage: 0, elapsedTime: 0, speed: 1 });
    setStages(scenario.stages.map(s => ({ ...s, status: 'pending' })));
  };

  const difficultyColors = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-red-400' };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{scenario.name}</h3>
          <p className="text-sm text-slate-400">{scenario.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={cn('rounded-full px-3 py-1 text-xs font-medium uppercase', difficultyColors[scenario.difficulty])}>
            {scenario.difficulty}
          </span>
          <span className="text-sm text-amber-400">+{scenario.xpReward} XP</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="flex flex-col items-center flex-1">
              <motion.div
                animate={stage.status === 'active' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border-2 mb-2',
                  stage.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20' :
                    stage.status === 'active' ? 'border-amber-500 bg-amber-500/20' :
                      'border-slate-500 bg-slate-500/20'
                )}
              >
                {stage.status === 'completed' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                ) : stage.status === 'active' ? (
                  <Clock className="h-6 w-6 text-amber-400 animate-pulse" />
                ) : (
                  <span className="text-lg font-bold text-slate-400">{idx + 1}</span>
                )}
              </motion.div>
              <span className={cn('text-sm font-medium', stage.status === 'active' ? 'text-white' : 'text-slate-400')}>
                {stage.name}
              </span>
              <span className="text-xs text-slate-500">{stage.duration}s</span>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Progress</span>
            <span className="text-white">{state.elapsedTime}s / {totalDuration}s</span>
          </div>
          <Progress value={progress} variant="prestige" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={reset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button size="lg" onClick={() => setState(p => ({ ...p, isRunning: !p.isRunning }))}>
            {state.isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {state.isRunning ? 'Pause' : 'Start'} Simulation
          </Button>
          <Button variant="outline" size="icon" onClick={() => setState(p => ({ ...p, speed: p.speed === 1 ? 2 : p.speed === 2 ? 5 : 1 }))}>
            <FastForward className="h-5 w-5" />
            <span className="text-xs ml-1">{state.speed}x</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ScenarioSimulator;
