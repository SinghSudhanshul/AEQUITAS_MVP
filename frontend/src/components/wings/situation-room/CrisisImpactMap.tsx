'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, AlertTriangle, TrendingDown, Radio, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImpactGeographyData } from '@/types/wings/situation-room';

interface CrisisImpactMapProps {
  data?: ImpactGeographyData[];
  className?: string;
}

const mockData: ImpactGeographyData[] = [
  { id: 'ny', region: 'New York', broker: 'Goldman Sachs', impact: 1250000, severity: 'critical', coordinates: { x: 75, y: 35 } },
  { id: 'london', region: 'London', broker: 'Barclays', impact: 850000, severity: 'high', coordinates: { x: 48, y: 28 } },
  { id: 'tokyo', region: 'Tokyo', broker: 'Nomura', impact: 420000, severity: 'medium', coordinates: { x: 85, y: 38 } },
  { id: 'hk', region: 'Hong Kong', broker: 'HSBC', impact: 380000, severity: 'medium', coordinates: { x: 82, y: 45 } },
  { id: 'chicago', region: 'Chicago', broker: 'Citadel', impact: 520000, severity: 'high', coordinates: { x: 25, y: 35 } },
];

const severityConfig = {
  critical: { pulse: 'animate-ping', ring: 'ring-red-500', bg: 'bg-red-500', size: 'h-6 w-6' },
  high: { pulse: 'animate-pulse', ring: 'ring-orange-500', bg: 'bg-orange-500', size: 'h-5 w-5' },
  medium: { pulse: '', ring: 'ring-amber-500', bg: 'bg-amber-500', size: 'h-4 w-4' },
  low: { pulse: '', ring: 'ring-blue-500', bg: 'bg-blue-500', size: 'h-3 w-3' },
};

export const CrisisImpactMap = React.memo(function CrisisImpactMap({ data = mockData, className }: CrisisImpactMapProps) {
  const [selectedPoint, setSelectedPoint] = React.useState<ImpactGeographyData | null>(null);
  const totalImpact = data.reduce((sum, d) => sum + d.impact, 0);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-red-400" />
          <div>
            <h3 className="font-semibold text-white">Global Impact Map</h3>
            <p className="text-sm text-slate-400">Geographic exposure analysis</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total Impact</span>
          <p className="text-lg font-bold text-red-400">${(totalImpact / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      {/* Map container */}
      <div className="relative rounded-xl border border-white/10 bg-navy-900/50 overflow-hidden" style={{ height: 300 }}>
        {/* World map background (simplified grid) */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 60">
            {/* Grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 6} x2="100" y2={i * 6} stroke="currentColor" strokeWidth="0.1" className="text-slate-500" />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 5} y1="0" x2={i * 5} y2="60" stroke="currentColor" strokeWidth="0.1" className="text-slate-500" />
            ))}
            {/* Simplified continent outlines */}
            <ellipse cx="25" cy="30" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-500" />
            <ellipse cx="50" cy="28" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-500" />
            <ellipse cx="80" cy="35" rx="12" ry="15" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-500" />
          </svg>
        </div>

        {/* Impact points */}
        {data.map((point) => {
          const config = severityConfig[point.severity];
          return (
            <motion.div
              key={point.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedPoint(point)}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
            >
              {/* Pulse ring */}
              <div className={cn('absolute inset-0 rounded-full ring-2 opacity-50', config.ring, config.pulse)} />
              {/* Main dot */}
              <div className={cn('relative rounded-full', config.bg, config.size)} />
            </motion.div>
          );
        })}

        {/* Selected point tooltip */}
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/20 bg-navy-900/95 p-4 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-400" />
                <div>
                  <h4 className="font-medium text-white">{selectedPoint.region}</h4>
                  <p className="text-sm text-slate-400">{selectedPoint.broker}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-400">${(selectedPoint.impact / 1000).toFixed(0)}K</p>
                <span className={cn('text-xs uppercase', severityConfig[selectedPoint.severity].bg.replace('bg-', 'text-'))}>
                  {selectedPoint.severity}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs">
        {Object.entries(severityConfig).map(([severity, config]) => (
          <div key={severity} className="flex items-center gap-2">
            <div className={cn('h-3 w-3 rounded-full', config.bg)} />
            <span className="text-slate-400 capitalize">{severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CrisisImpactMap;
