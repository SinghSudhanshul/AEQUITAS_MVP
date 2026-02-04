// ============================================
// FEATURES COMPONENT
// Landing Page Feature Grid
// ============================================

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  icon: string;
  title: string;
  description: string;
  highlight?: string;
}

const features: Feature[] = [
  {
    icon: '🎯',
    title: 'Dual-Model Architecture',
    description: 'Seamlessly switches between XGBoost for steady markets and Monte Carlo simulations during crises.',
    highlight: 'Patent-pending',
  },
  {
    icon: '⚡',
    title: 'Intraday Precision',
    description: 'Forecasts update every 15 minutes throughout the trading day, not just daily predictions.',
  },
  {
    icon: '🛡️',
    title: 'Crisis-Resilient',
    description: 'Calibrated on March 2020 and historical crisis data. Maintains accuracy when it matters most.',
    highlight: 'Battle-tested',
  },
  {
    icon: '🔗',
    title: 'Prime Broker Integration',
    description: 'Direct API connections to Goldman Sachs, Morgan Stanley, and JP Morgan for automated data sync.',
  },
  {
    icon: '📊',
    title: 'Regime Detection',
    description: 'Automatically identifies market conditions and adjusts model parameters in real-time.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'SOC 2 compliant infrastructure with AES-256 encryption and role-based access control.',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-rich-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-off-white">Built for</span>{' '}
            <span className="bg-gradient-to-r from-institutional-blue to-precision-teal bg-clip-text text-transparent">
              Institutional Traders
            </span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Purpose-built technology that understands the unique challenges of managing liquidity in volatile markets.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="glass"
              className="group hover:border-institutional-blue/50 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className="text-4xl mb-4">{feature.icon}</div>

                {/* Title with Highlight Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-off-white group-hover:text-precision-teal transition-colors">
                    {feature.title}
                  </h3>
                  {feature.highlight && (
                    <span className="text-xs bg-achievement-gold/20 text-achievement-gold px-2 py-0.5 rounded">
                      {feature.highlight}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted mb-4">
            Join 50+ hedge funds and trading firms already using Aequitas
          </p>
          <a href="#pricing" className="text-precision-teal hover:underline font-medium">
            View pricing →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
