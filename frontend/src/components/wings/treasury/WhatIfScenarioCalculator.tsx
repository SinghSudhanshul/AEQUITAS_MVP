'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { WhatIfScenarioData } from '@/types/wings/treasury';

interface WhatIfScenarioCalculatorProps {
  onCalculate?: (scenario: WhatIfScenarioData) => void;
  className?: string;
}

interface ScenarioResult {
  impactedBrokers: { broker: string; oldMargin: number; newMargin: number }[];
  totalImpact: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const WhatIfScenarioCalculator = React.memo(function WhatIfScenarioCalculator({ onCalculate, className }: WhatIfScenarioCalculatorProps) {
  const [scenario, setScenario] = React.useState<WhatIfScenarioData>({
    type: 'position_change',
    broker: 'Goldman Sachs',
    amount: 100000,
    direction: 'increase',
  });
  const [result, setResult] = React.useState<ScenarioResult | null>(null);

  const calculate = () => {
    // Simulate calculation
    const mockResult: ScenarioResult = {
      impactedBrokers: [
        { broker: 'Goldman Sachs', oldMargin: 72, newMargin: scenario.direction === 'increase' ? 78 : 66 },
        { broker: 'Morgan Stanley', oldMargin: 65, newMargin: scenario.direction === 'increase' ? 63 : 67 },
      ],
      totalImpact: scenario.direction === 'increase' ? 6 : -6,
      riskLevel: Math.abs(scenario.amount) > 200000 ? 'high' : Math.abs(scenario.amount) > 100000 ? 'medium' : 'low',
    };
    setResult(mockResult);
    onCalculate?.(scenario);
  };

  const riskColors = { low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-red-400' };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Calculator className="h-5 w-5 text-purple-400" />
        <div>
          <h3 className="font-semibold text-white">What-If Calculator</h3>
          <p className="text-sm text-slate-400">Scenario impact analysis</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Scenario Type</label>
            <select
              value={scenario.type}
              onChange={(e) => setScenario(p => ({ ...p, type: e.target.value as any }))}
              className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white"
            >
              <option value="position_change">Position Change</option>
              <option value="margin_adjustment">Margin Adjustment</option>
              <option value="collateral_move">Collateral Move</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Broker</label>
            <select
              value={scenario.broker}
              onChange={(e) => setScenario(p => ({ ...p, broker: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white"
            >
              <option>Goldman Sachs</option>
              <option>Morgan Stanley</option>
              <option>JP Morgan</option>
              <option>Citadel</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Amount ($)</label>
            <input
              type="number"
              value={scenario.amount}
              onChange={(e) => setScenario(p => ({ ...p, amount: parseInt(e.target.value) || 0 }))}
              className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Direction</label>
            <div className="flex gap-2">
              <button
                onClick={() => setScenario(p => ({ ...p, direction: 'increase' }))}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  scenario.direction === 'increase' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                )}
              >
                <TrendingUp className="h-4 w-4 inline mr-1" />Increase
              </button>
              <button
                onClick={() => setScenario(p => ({ ...p, direction: 'decrease' }))}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  scenario.direction === 'decrease' ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400'
                )}
              >
                <TrendingDown className="h-4 w-4 inline mr-1" />Decrease
              </button>
            </div>
          </div>
        </div>

        <Button onClick={calculate} className="w-full">Calculate Impact</Button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-white">Impact Analysis</h4>
            <span className={cn('rounded-full px-3 py-1 text-xs font-medium capitalize', riskColors[result.riskLevel])}>
              {result.riskLevel} Risk
            </span>
          </div>

          <div className="space-y-2">
            {result.impactedBrokers.map((b) => (
              <div key={b.broker} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-slate-300">{b.broker}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">{b.oldMargin}%</span>
                  <span className="text-slate-400">→</span>
                  <span className={cn('font-medium', b.newMargin > b.oldMargin ? 'text-amber-400' : 'text-emerald-400')}>
                    {b.newMargin}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {result.riskLevel === 'high' && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">This scenario requires senior approval</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
});

export default WhatIfScenarioCalculator;
