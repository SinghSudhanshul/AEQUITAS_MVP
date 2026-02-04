// ============================================
// FORECAST HISTORY COMPONENT
// Historical Forecasts Chart Display
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ForecastEntry {
  id: string;
  date: string;
  predicted: number;
  actual: number;
  accuracy: number;
  regime: 'steady' | 'elevated' | 'crisis';
}

interface ForecastHistoryProps {
  data?: ForecastEntry[];
}

const mockData: ForecastEntry[] = [
  { id: '1', date: '2026-01-30', predicted: 245000000, actual: 248500000, accuracy: 98.6, regime: 'steady' },
  { id: '2', date: '2026-01-29', predicted: 252000000, actual: 249200000, accuracy: 98.9, regime: 'steady' },
  { id: '3', date: '2026-01-28', predicted: 238000000, actual: 241800000, accuracy: 98.4, regime: 'elevated' },
  { id: '4', date: '2026-01-27', predicted: 268000000, actual: 275300000, accuracy: 97.3, regime: 'elevated' },
  { id: '5', date: '2026-01-26', predicted: 310000000, actual: 298500000, accuracy: 96.1, regime: 'crisis' },
  { id: '6', date: '2026-01-25', predicted: 285000000, actual: 282700000, accuracy: 99.2, regime: 'crisis' },
  { id: '7', date: '2026-01-24', predicted: 247000000, actual: 244500000, accuracy: 99.0, regime: 'steady' },
];

export const ForecastHistory: React.FC<ForecastHistoryProps> = ({ data = mockData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const formatCurrency = (value: number) => {
    return `$${(value / 1e6).toFixed(1)}M`;
  };

  const getRegimeColor = (regime: 'steady' | 'elevated' | 'crisis') => {
    const colors = {
      steady: 'text-steady-green',
      elevated: 'text-elevated-amber',
      crisis: 'text-crisis-red',
    };
    return colors[regime];
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 98) return 'text-steady-green';
    if (accuracy >= 95) return 'text-precision-teal';
    if (accuracy >= 90) return 'text-elevated-amber';
    return 'text-crisis-red';
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Forecast History</CardTitle>
            <CardDescription>Compare predictions vs actual outcomes</CardDescription>
          </div>
          <div className="flex gap-1 bg-charcoal rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart Placeholder */}
        <div className="h-48 bg-glass-white rounded-xl border border-glass-border mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-muted text-sm">Chart visualization</div>
            <div className="text-xs text-muted mt-1">Predicted vs Actual over time</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Predicted</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Actual</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Accuracy</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Regime</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.id} className="border-b border-glass-border/50 hover:bg-glass-white transition-colors">
                  <td className="py-3 px-2 text-sm font-medium text-off-white">{entry.date}</td>
                  <td className="py-3 px-2 text-sm text-right text-muted">{formatCurrency(entry.predicted)}</td>
                  <td className="py-3 px-2 text-sm text-right text-off-white">{formatCurrency(entry.actual)}</td>
                  <td className={`py-3 px-2 text-sm text-right font-semibold ${getAccuracyColor(entry.accuracy)}`}>
                    {entry.accuracy.toFixed(1)}%
                  </td>
                  <td className={`py-3 px-2 text-sm text-center capitalize ${getRegimeColor(entry.regime)}`}>
                    {entry.regime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastHistory;
