// ============================================
// REGIME BREAKDOWN COMPONENT
// Accuracy by Market Regime Analysis
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface RegimeStats {
  regime: 'steady' | 'elevated' | 'crisis';
  accuracy: number;
  mape: number;
  forecastCount: number;
  avgConfidence: number;
  daysInRegime: number;
}

interface RegimeBreakdownProps {
  data?: RegimeStats[];
}

const mockData: RegimeStats[] = [
  { regime: 'steady', accuracy: 95.2, mape: 3.1, forecastCount: 280, avgConfidence: 94.5, daysInRegime: 280 },
  { regime: 'elevated', accuracy: 89.8, mape: 6.2, forecastCount: 65, avgConfidence: 82.3, daysInRegime: 65 },
  { regime: 'crisis', accuracy: 84.5, mape: 9.8, forecastCount: 20, avgConfidence: 71.2, daysInRegime: 20 },
];

export const RegimeBreakdown: React.FC<RegimeBreakdownProps> = ({ data = mockData }) => {
  const regimeConfig = {
    steady: {
      label: 'Steady State',
      icon: '🟢',
      color: 'text-steady-green',
      bgColor: 'bg-steady-green/10',
      borderColor: 'border-steady-green/30',
      description: 'Normal market conditions with predictable patterns',
    },
    elevated: {
      label: 'Elevated',
      icon: '🟡',
      color: 'text-elevated-amber',
      bgColor: 'bg-elevated-amber/10',
      borderColor: 'border-elevated-amber/30',
      description: 'Heightened volatility requiring adjusted models',
    },
    crisis: {
      label: 'Crisis',
      icon: '🔴',
      color: 'text-crisis-red',
      bgColor: 'bg-crisis-red/10',
      borderColor: 'border-crisis-red/30',
      description: 'Extreme market stress with Monte Carlo adjustments',
    },
  };

  const totalDays = data.reduce((sum, d) => sum + d.daysInRegime, 0);

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span>📊</span> Performance by Regime
        </CardTitle>
        <CardDescription>
          Accuracy breakdown across different market conditions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Regime Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((stats) => {
            const config = regimeConfig[stats.regime];
            const percentage = ((stats.daysInRegime / totalDays) * 100).toFixed(1);

            return (
              <Card
                key={stats.regime}
                variant="default"
                className={`p-4 ${config.bgColor} border ${config.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <div className={`font-semibold ${config.color}`}>{config.label}</div>
                    <div className="text-xs text-muted">{percentage}% of time</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Accuracy</span>
                    <span className={`font-bold ${config.color}`}>{stats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">MAPE</span>
                    <span className="font-semibold text-off-white">{stats.mape}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Avg Confidence</span>
                    <span className="font-semibold text-off-white">{stats.avgConfidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Forecasts</span>
                    <span className="font-semibold text-off-white">{stats.forecastCount}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-glass-border text-xs text-muted">
                  {config.description}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Regime Distribution Bar */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-off-white">Regime Distribution</div>
          <div className="h-6 rounded-full overflow-hidden flex">
            {data.map((stats) => {
              const percentage = (stats.daysInRegime / totalDays) * 100;
              const config = regimeConfig[stats.regime];
              const bgClasses = {
                steady: 'bg-steady-green',
                elevated: 'bg-elevated-amber',
                crisis: 'bg-crisis-red',
              };

              return (
                <div
                  key={stats.regime}
                  className={`${bgClasses[stats.regime]} flex items-center justify-center text-xs font-bold text-rich-black`}
                  style={{ width: `${percentage}%` }}
                  title={`${config.label}: ${percentage.toFixed(1)}%`}
                >
                  {percentage >= 10 && `${percentage.toFixed(0)}%`}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>🟢 Steady: {data[0].daysInRegime} days</span>
            <span>🟡 Elevated: {data[1].daysInRegime} days</span>
            <span>🔴 Crisis: {data[2].daysInRegime} days</span>
          </div>
        </div>

        {/* Key Insight */}
        <div className="p-4 bg-institutional-blue/10 rounded-lg border border-institutional-blue/30">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold text-off-white mb-1">Key Insight</div>
              <div className="text-sm text-muted">
                Your model maintains above-target accuracy across all regimes. Crisis performance
                ({data[2].accuracy}%) demonstrates the value of Monte Carlo shock adjustments during
                market stress periods.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegimeBreakdown;
