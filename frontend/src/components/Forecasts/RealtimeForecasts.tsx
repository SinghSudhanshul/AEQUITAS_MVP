// ============================================
// REALTIME FORECASTS COMPONENT
// Premium: WebSocket Live Updates
// ============================================

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RealtimeDataPoint {
  timestamp: string;
  value: number;
  change: number;
}

interface RealtimeForecastsProps {
  isConnected?: boolean;
}

export const RealtimeForecasts: React.FC<RealtimeForecastsProps> = ({ isConnected = true }) => {
  const [liveData, setLiveData] = useState<RealtimeDataPoint[]>([
    { timestamp: '14:30:00', value: 247500000, change: 0 },
    { timestamp: '14:30:15', value: 247850000, change: 350000 },
    { timestamp: '14:30:30', value: 248100000, change: 250000 },
    { timestamp: '14:30:45', value: 247900000, change: -200000 },
    { timestamp: '14:31:00', value: 248250000, change: 350000 },
  ]);
  const [isLive, setIsLive] = useState(true);

  // Simulate live updates
  useEffect(() => {
    if (!isLive || !isConnected) return;

    const interval = setInterval(() => {
      setLiveData(prev => {
        const lastValue = prev[prev.length - 1]?.value || 247500000;
        const change = Math.round((Math.random() - 0.5) * 1000000);
        const newValue = lastValue + change;
        const newTimestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

        return [
          ...prev.slice(-9),
          { timestamp: newTimestamp, value: newValue, change }
        ];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, isConnected]);

  const formatCurrency = (value: number) => `$${(value / 1e6).toFixed(2)}M`;
  const formatChange = (change: number) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}$${(change / 1e3).toFixed(0)}K`;
  };

  const currentValue = liveData[liveData.length - 1]?.value || 0;
  const currentChange = liveData[liveData.length - 1]?.change || 0;

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {!isConnected && (
        <Alert variant="warning">
          <AlertDescription>
            WebSocket connection lost. Attempting to reconnect...
          </AlertDescription>
        </Alert>
      )}

      {/* Live Value Display */}
      <Card variant="glow" className="relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLive && isConnected ? 'bg-steady-green animate-pulse' : 'bg-crisis-red'}`} />
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            {isLive && isConnected ? 'Live' : 'Paused'}
          </span>
        </div>

        <CardContent className="py-8 text-center">
          <div className="text-xs text-muted uppercase tracking-widest mb-4">
            Realtime Liquidity Forecast
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-institutional-blue to-precision-teal bg-clip-text text-transparent mb-2">
            {formatCurrency(currentValue)}
          </div>
          <div className={`text-lg font-semibold ${currentChange >= 0 ? 'text-steady-green' : 'text-crisis-red'}`}>
            {formatChange(currentChange)} / 15s
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={isLive ? 'default' : 'ghost'}
            className={isLive ? 'bg-spring-green/20 text-spring-green border-spring-green/50' : ''}
            size="sm"
            onClick={() => setIsLive(true)}
          >
            ▶ Live
          </Button>
          <Button
            variant={!isLive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setIsLive(false)}
          >
            ⏸ Pause
          </Button>
        </div>
        <span className="text-xs text-muted">
          Updates every 15 seconds
        </span>
      </div>

      {/* Live Data Stream */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Data Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            {liveData.slice().reverse().map((point, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded ${index === 0 ? 'bg-glass-white border border-glass-border' : ''}`}
              >
                <span className="text-muted">{point.timestamp}</span>
                <span className="text-off-white">{formatCurrency(point.value)}</span>
                <span className={point.change >= 0 ? 'text-steady-green' : 'text-crisis-red'}>
                  {formatChange(point.change)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeForecasts;
