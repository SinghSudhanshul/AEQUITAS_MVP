'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Scale, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SettlementScenario } from '@/types/wings/war-room';

interface SettlementCalculatorProps {
  scenarios?: SettlementScenario[];
  className?: string;
}

const mockScenarios: SettlementScenario[] = [
  { id: '1', name: 'Early Settlement', probability: 35, amount: 650000, timeline: '30 days', risk: 'low' },
  { id: '2', name: 'Mediated Resolution', probability: 40, amount: 820000, timeline: '60 days', risk: 'medium' },
  { id: '3', name: 'Full Trial', probability: 25, amount: 1200000, timeline: '12 months', risk: 'high' },
];

const colors = ['#10b981', '#f59e0b', '#ef4444'];
const riskColors = { low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-red-400' };

export const SettlementCalculator = React.memo(function SettlementCalculator({ scenarios = mockScenarios, className }: SettlementCalculatorProps) {
  const [selectedScenario, setSelectedScenario] = React.useState<SettlementScenario | null>(null);

  const expectedValue = scenarios.reduce((sum, s) => sum + (s.probability / 100) * s.amount, 0);
  const chartData = scenarios.map((s, i) => ({ name: s.name, value: s.probability, color: colors[i] }));

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-white">Settlement Calculator</h3>
            <p className="text-sm text-slate-400">Outcome probability analysis</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Expected Value</span>
          <p className="text-lg font-bold text-emerald-400">${(expectedValue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Pie chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={(_, index) => setSelectedScenario(scenarios[index])}
                  onMouseLeave={() => setSelectedScenario(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}%`, 'Probability']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Scenario details */}
          <div className="space-y-3">
            {scenarios.map((scenario, idx) => (
              <motion.div
                key={scenario.id}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setSelectedScenario(scenario)}
                onMouseLeave={() => setSelectedScenario(null)}
                className={cn(
                  'rounded-lg border p-3 cursor-pointer transition-all',
                  selectedScenario?.id === scenario.id ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                    <span className="font-medium text-white">{scenario.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{scenario.probability}%</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-slate-400">Value: ${(scenario.amount / 1000).toFixed(0)}K</span>
                  <span className={riskColors[scenario.risk]}>{scenario.risk} risk</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected scenario details */}
      {selectedScenario && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="font-medium text-white mb-3">{selectedScenario.name} Analysis</h4>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <Scale className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Probability</span>
              <p className="text-sm font-bold text-white">{selectedScenario.probability}%</p>
            </div>
            <div>
              <DollarSign className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Amount</span>
              <p className="text-sm font-bold text-emerald-400">${(selectedScenario.amount / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <Clock className="h-5 w-5 text-amber-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Timeline</span>
              <p className="text-sm font-bold text-white">{selectedScenario.timeline}</p>
            </div>
            <div>
              <FileText className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Expected</span>
              <p className="text-sm font-bold text-white">
                ${((selectedScenario.probability / 100) * selectedScenario.amount / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default SettlementCalculator;
