// ============================================
// FORECAST DETAILS COMPONENT
// Detailed Forecast View with Breakdown
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ForecastDetailsProps {
  forecastId?: string;
}

export const ForecastDetails: React.FC<ForecastDetailsProps> = ({ forecastId }) => {
  // Mock data for demonstration
  const forecast = {
    id: forecastId || 'FCT-2026-01-31',
    date: 'January 31, 2026',
    generatedAt: '06:30 AM EST',
    regime: 'steady' as const,
    confidence: 94.2,
    predicted: 247500000,
    range: { low: 235000000, high: 260000000 },
    breakdown: [
      { category: 'Settlement Obligations', amount: 125000000, percentage: 50.5 },
      { category: 'Margin Calls', amount: 45000000, percentage: 18.2 },
      { category: 'Trading Activity', amount: 52500000, percentage: 21.2 },
      { category: 'Corporate Actions', amount: 15000000, percentage: 6.1 },
      { category: 'Buffer Reserve', amount: 10000000, percentage: 4.0 },
    ],
    factors: [
      { name: 'VIX Level', value: 18.5, impact: 'neutral' as const },
      { name: 'Credit Spreads', value: 'Normal', impact: 'positive' as const },
      { name: 'Repo Rates', value: '5.25%', impact: 'neutral' as const },
      { name: 'Settlement Volume', value: 'High', impact: 'negative' as const },
    ],
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getImpactColor = (impact: 'positive' | 'neutral' | 'negative') => {
    const colors = {
      positive: 'text-steady-green',
      neutral: 'text-muted',
      negative: 'text-elevated-amber',
    };
    return colors[impact];
  };

  const getImpactIcon = (impact: 'positive' | 'neutral' | 'negative') => {
    const icons = { positive: '↑', neutral: '→', negative: '↓' };
    return icons[impact];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-off-white">Forecast Details</h1>
          <p className="text-muted">{forecast.date} • Generated at {forecast.generatedAt}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost">Export PDF</Button>
          <Button variant="default">Share</Button>
        </div>
      </div>

      {/* Main Value Card */}
      <Card variant="glow">
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-xs text-muted uppercase tracking-widest mb-2">Predicted Requirement</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-institutional-blue to-precision-teal bg-clip-text text-transparent">
                {formatCurrency(forecast.predicted)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-widest mb-2">Confidence</div>
              <div className="text-4xl font-bold text-steady-green">{forecast.confidence}%</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-widest mb-2">Range</div>
              <div className="text-lg font-semibold text-off-white">
                {formatCurrency(forecast.range.low)} — {formatCurrency(forecast.range.high)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Requirement Breakdown</CardTitle>
            <CardDescription>Component analysis of predicted liquidity need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {forecast.breakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-off-white">{item.category}</span>
                  <span className="font-semibold text-precision-teal">
                    {formatCurrency(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-institutional-blue to-precision-teal rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contributing Factors */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Contributing Factors</CardTitle>
            <CardDescription>Market indicators impacting this forecast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {forecast.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-glass-white rounded-lg">
                <span className="text-off-white font-medium">{factor.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted">{factor.value}</span>
                  <span className={`${getImpactColor(factor.impact)} font-bold`}>
                    {getImpactIcon(factor.impact)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Methodology Note */}
      <Alert variant="info">
        <AlertTitle>Methodology</AlertTitle>
        <AlertDescription>
          This forecast uses our dual-model system: XGBoost for steady-state predictions and Monte Carlo simulations for crisis scenarios.
          The model was trained on 5+ years of historical data with crisis-specific calibration from March 2020 events.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ForecastDetails;
