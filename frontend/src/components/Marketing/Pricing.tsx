// ============================================
// PRICING COMPONENT
// Landing Page Pricing Section
// ============================================

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PricingTier {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: { monthly: 499, yearly: 4990 },
    description: 'Perfect for small funds starting with liquidity forecasting.',
    features: [
      'Daily forecasts',
      'CSV data upload',
      '90-day history',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Start Trial',
  },
  {
    name: 'Professional',
    price: { monthly: 1499, yearly: 14990 },
    description: 'For growing funds that need real-time insights and integrations.',
    features: [
      'Everything in Starter',
      'Intraday updates (15-min)',
      '1-year history',
      'API access',
      'Broker integration (1)',
      'Priority support',
    ],
    cta: 'Start Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 4999, yearly: 49990 },
    description: 'For large institutions requiring custom solutions and dedicated support.',
    features: [
      'Everything in Professional',
      'Real-time WebSocket feeds',
      'Unlimited history',
      'Multiple broker integrations',
      'Custom model calibration',
      'Dedicated account manager',
      'On-premise deployment option',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
  },
];

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 px-6 bg-dark-navy">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-off-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-glass-white rounded-lg">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isYearly ? 'bg-institutional-blue text-off-white' : 'text-muted hover:text-off-white'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isYearly ? 'bg-institutional-blue text-off-white' : 'text-muted hover:text-off-white'
                }`}
            >
              Yearly
              <span className="text-xs bg-steady-green/20 text-steady-green px-1.5 py-0.5 rounded">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              variant={tier.popular ? 'glow' : 'glass'}
              className={`relative ${tier.popular ? 'scale-105 z-10' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-achievement-gold text-rich-black text-xs font-bold px-4 py-1.5 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <CardContent className="p-8">
                {/* Tier Name */}
                <h3 className="text-xl font-bold text-off-white mb-2">{tier.name}</h3>
                <p className="text-muted text-sm mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-off-white">
                    ${(isYearly ? tier.price.yearly : tier.price.monthly).toLocaleString()}
                  </span>
                  <span className="text-muted">/{isYearly ? 'year' : 'month'}</span>
                </div>

                {/* CTA Button */}
                <Button
                  variant={tier.popular ? 'closeDeal' : 'default'}
                  size="lg"
                  className="w-full mb-8"
                >
                  {tier.cta}
                </Button>

                {/* Features List */}
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-steady-green mt-0.5">✓</span>
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Note */}
        <div className="mt-12 text-center">
          <p className="text-muted">
            Need a custom solution?{' '}
            <a href="#" className="text-precision-teal hover:underline">
              Contact our sales team
            </a>
            {' '}for custom pricing and features.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
