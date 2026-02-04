// ============================================
// ACCURACY DASHBOARD COMPONENT
// Performance Analytics Over Time
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccuracyData {
  period: string;
  accuracy: number;
  mape: number;
  directionAccuracy: number;
  forecastCount: number;
}

interface AccuracyDashboardProps {
  data?: AccuracyData[];
}

const mockData: AccuracyData[] = [
  { period: 'This Week', accuracy: 94.2, mape: 3.8, directionAccuracy: 97.1, forecastCount: 5 },
  { period: 'Last Week', accuracy: 93.8, mape: 4.1, directionAccuracy: 96.5, forecastCount: 5 },
  { period: 'This Month', accuracy: 93.5, mape: 4.3, directionAccuracy: 96.2, forecastCount: 22 },
  { period: 'Last Month', accuracy: 92.1, mape: 5.2, directionAccuracy: 95.8, forecastCount: 20 },
  { period: 'YTD', accuracy: 93.2, mape: 4.5, directionAccuracy: 96.0, forecastCount: 22 },
  { period: 'All Time', accuracy: 91.8, mape: 5.5, directionAccuracy: 94.5, forecastCount: 365 },
];

export const AccuracyDashboard: React.FC<AccuracyDashboardProps> = ({ data = mockData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Month');

  const currentData = data.find(d => d.period === selectedPeriod) || data[0];

  const getPerformanceLabel = (accuracy: number) => {
    if (accuracy >= 95) return { label: 'Exceptional', color: 'text-achievement-gold' };
    if (accuracy >= 90) return { label: 'Excellent', color: 'text-steady-green' };
    if (accuracy >= 85) return { label: 'Good', color: 'text-precision-teal' };
    return { label: 'Needs Improvement', color: 'text-elevated-amber' };
  };

  const performance = getPerformanceLabel(currentData.accuracy);

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-off-white">Accuracy Dashboard</h2>
          <p className="text-muted">Track your forecasting performance over time</p>
        </div>
        <div className="flex gap-1 bg-charcoal p-1 rounded-lg">
          {['This Week', 'This Month', 'YTD', 'All Time'].map((period) => (
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

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glow" className="p-6 text-center">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">Overall Accuracy</div>
          <div className="text-4xl font-bold text-steady-green">{currentData.accuracy}%</div>
          <div className={`text-sm mt-1 ${performance.color}`}>{performance.label}</div>
        </Card>
        <Card variant="glass" className="p-6 text-center">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">MAPE</div>
          <div className="text-4xl font-bold text-precision-teal">{currentData.mape}%</div>
          <div className="text-sm text-muted mt-1">Mean Absolute % Error</div>
        </Card>
        <Card variant="glass" className="p-6 text-center">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">Direction</div>
          <div className="text-4xl font-bold text-off-white">{currentData.directionAccuracy}%</div>
          <div className="text-sm text-muted mt-1">Up/Down Accuracy</div>
        </Card>
        <Card variant="glass" className="p-6 text-center">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">Forecasts</div>
          <div className="text-4xl font-bold text-off-white">{currentData.forecastCount}</div>
          <div className="text-sm text-muted mt-1">{selectedPeriod}</div>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Accuracy Trend</CardTitle>
          <CardDescription>Performance visualization over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-glass-white rounded-xl border border-glass-border flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">📈</div>
              <div className="text-muted">Interactive chart visualization</div>
              <div className="text-xs text-muted mt-1">Accuracy trend over {selectedPeriod.toLowerCase()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Period Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Period</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Accuracy</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">MAPE</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Direction</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Forecasts</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.period}
                    className={`border-b border-glass-border/50 hover:bg-glass-white transition-colors cursor-pointer ${row.period === selectedPeriod ? 'bg-institutional-blue/10' : ''
                      }`}
                    onClick={() => setSelectedPeriod(row.period)}
                  >
                    <td className="py-3 px-2 font-medium text-off-white">{row.period}</td>
                    <td className={`py-3 px-2 text-right font-semibold ${getPerformanceLabel(row.accuracy).color}`}>
                      {row.accuracy}%
                    </td>
                    <td className="py-3 px-2 text-right text-muted">{row.mape}%</td>
                    <td className="py-3 px-2 text-right text-muted">{row.directionAccuracy}%</td>
                    <td className="py-3 px-2 text-right text-muted">{row.forecastCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccuracyDashboard;
