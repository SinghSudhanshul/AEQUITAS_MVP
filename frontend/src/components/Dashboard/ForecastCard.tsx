// ============================================
// FORECAST CARD COMPONENT
// Daily Liquidity Forecast Display
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ForecastData {
  date: string;
  predicted: number;
  confidence: number;
  range: { low: number; high: number };
  regime: 'steady' | 'elevated' | 'crisis';
}

interface ForecastCardProps {
  forecast?: ForecastData;
}

const defaultForecast: ForecastData = {
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  predicted: 247500000,
  confidence: 92.4,
  range: { low: 235000000, high: 260000000 },
  regime: 'steady',
};

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast = defaultForecast }) => {
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const confidenceColor =
    forecast.confidence >= 90 ? 'text-steady-green' :
      forecast.confidence >= 75 ? 'text-elevated-amber' :
        'text-crisis-red';

  return (
    <Card variant="glow" className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardDescription className="text-precision-teal uppercase tracking-wider text-xs font-semibold">
              Intraday Liquidity Forecast
            </CardDescription>
            <CardTitle className="text-2xl mt-1">
              Today's Projection
            </CardTitle>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted uppercase">Confidence</div>
            <div className={`text-2xl font-bold ${confidenceColor}`}>
              {forecast.confidence}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Forecast Value */}
        <div className="text-center py-6 bg-glass-white rounded-xl border border-glass-border">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">
            Predicted Requirement
          </div>
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-institutional-blue to-precision-teal bg-clip-text text-transparent">
            {formatCurrency(forecast.predicted)}
          </div>
          <div className="text-sm text-muted mt-2">
            Range: {formatCurrency(forecast.range.low)} — {formatCurrency(forecast.range.high)}
          </div>
        </div>

        {/* Forecast Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Intraday Peak (Est.)</span>
            <span className="font-semibold text-off-white">2:30 PM EST</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Settlement Window</span>
            <span className="font-semibold text-off-white">4:00 - 5:30 PM EST</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Last Updated</span>
            <span className="font-semibold text-precision-teal">Live</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="default" className="flex-1">
            View Details
          </Button>
          <Button variant="ghost">
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
