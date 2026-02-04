// ============================================
// HERO COMPONENT
// Landing Page Hero Section
// ============================================

import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onWatchDemo }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-navy via-rich-black to-rich-black" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-institutional-blue rounded-full filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-precision-teal rounded-full filter blur-[120px]" />
      </div>

      {/* Manhattan Skyline Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-rich-black to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-glass-white border border-glass-border">
          <span className="w-2 h-2 rounded-full bg-steady-green animate-pulse" />
          <span className="text-sm text-muted">Trusted by 50+ institutional trading firms</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-off-white">Crisis-Resilient</span>
          <br />
          <span className="bg-gradient-to-r from-institutional-blue via-precision-teal to-achievement-gold bg-clip-text text-transparent">
            Liquidity Forecasting
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed">
          The only forecasting platform that maintains accuracy during market crises.
          Predict intraday liquidity requirements with{' '}
          <span className="text-steady-green font-semibold">90%+ accuracy</span>—even when others fail.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            variant="closeDeal"
            size="xl"
            onClick={onGetStarted}
          >
            Start Free Trial
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={onWatchDemo}
          >
            ▶ Watch Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-muted">
          <div className="text-center">
            <div className="text-3xl font-bold text-off-white">$2.7T+</div>
            <div className="text-sm">Assets Forecasted</div>
          </div>
          <div className="w-px h-12 bg-glass-border hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-off-white">94.2%</div>
            <div className="text-sm">Average Accuracy</div>
          </div>
          <div className="w-px h-12 bg-glass-border hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-off-white">15min</div>
            <div className="text-sm">Real-time Updates</div>
          </div>
          <div className="w-px h-12 bg-glass-border hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-steady-green">March 2020</div>
            <div className="text-sm">Crisis-Tested</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
