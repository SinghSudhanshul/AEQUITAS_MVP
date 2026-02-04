// ============================================
// MANHATTAN SKYLINE BACKGROUND
// Parallax cityscape with weather states
// ============================================

import React from 'react';
import { useMarketStore } from '@/store/market.store';
import { cn } from '@/lib/utils';

export const ManhattanSkyline: React.FC = () => {
  const { regime } = useMarketStore();

  // Adjust skyline colors based on regime
  const getSkylineStyle = () => {
    switch (regime) {
      case 'crisis':
        return {
          gradientStart: '#1A0505',
          gradientEnd: '#0A0202',
          buildingColor: '#2A1515',
          glowColor: 'rgba(192, 57, 43, 0.1)',
        };
      case 'elevated':
        return {
          gradientStart: '#1A1505',
          gradientEnd: '#0A0802',
          buildingColor: '#2A2515',
          glowColor: 'rgba(243, 156, 18, 0.08)',
        };
      default:
        return {
          gradientStart: '#0A1A2F',
          gradientEnd: '#050D17',
          buildingColor: '#0F2540',
          glowColor: 'rgba(0, 51, 102, 0.05)',
        };
    }
  };

  const style = getSkylineStyle();

  return (
    <div
      className="manhattan-skyline"
      style={{
        background: `linear-gradient(180deg, ${style.gradientStart} 0%, ${style.gradientEnd} 100%)`,
      }}
    >
      {/* Distant buildings layer */}
      <svg
        className="manhattan-skyline__layer opacity-5"
        viewBox="0 0 1200 200"
        style={{ height: '15vh' }}
        preserveAspectRatio="xMidYMax slice"
      >
        <rect x="50" y="100" width="20" height="100" fill={style.buildingColor} />
        <rect x="80" y="80" width="30" height="120" fill={style.buildingColor} />
        <rect x="120" y="60" width="25" height="140" fill={style.buildingColor} />
        <rect x="160" y="90" width="35" height="110" fill={style.buildingColor} />
        <rect x="210" y="40" width="40" height="160" fill={style.buildingColor} />
        <rect x="260" y="70" width="25" height="130" fill={style.buildingColor} />
        <rect x="300" y="50" width="50" height="150" fill={style.buildingColor} />
        <rect x="360" y="80" width="30" height="120" fill={style.buildingColor} />
        <rect x="400" y="30" width="35" height="170" fill={style.buildingColor} />
        <rect x="450" y="60" width="45" height="140" fill={style.buildingColor} />
        <rect x="510" y="45" width="30" height="155" fill={style.buildingColor} />
        <rect x="550" y="75" width="40" height="125" fill={style.buildingColor} />
        <rect x="600" y="20" width="55" height="180" fill={style.buildingColor} />
        <rect x="670" y="55" width="35" height="145" fill={style.buildingColor} />
        <rect x="720" y="85" width="25" height="115" fill={style.buildingColor} />
        <rect x="760" y="65" width="45" height="135" fill={style.buildingColor} />
        <rect x="820" y="35" width="30" height="165" fill={style.buildingColor} />
        <rect x="860" y="50" width="50" height="150" fill={style.buildingColor} />
        <rect x="920" y="70" width="35" height="130" fill={style.buildingColor} />
        <rect x="970" y="40" width="40" height="160" fill={style.buildingColor} />
        <rect x="1020" y="60" width="30" height="140" fill={style.buildingColor} />
        <rect x="1060" y="80" width="45" height="120" fill={style.buildingColor} />
        <rect x="1120" y="55" width="35" height="145" fill={style.buildingColor} />
      </svg>

      {/* Ambient glow layer */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-32',
          'pointer-events-none'
        )}
        style={{
          background: `radial-gradient(ellipse at bottom, ${style.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Subtle stars/lights */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-off-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
