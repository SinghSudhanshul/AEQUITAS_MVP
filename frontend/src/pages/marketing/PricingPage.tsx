// ============================================
// PRICING PAGE (Stub)
// ============================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Get started with essential features',
      features: ['Lobby Access', 'Bullpen Access', 'Basic Forecasting', '500 XP/month limit'],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$299',
      period: '/month',
      description: 'Advanced features for serious traders',
      features: ['All Free features', 'Library & Treasury', 'Situation Room', 'Donna\'s Desk', 'Unlimited XP', 'Priority Support'],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Full platform access with dedicated support',
      features: ['All Premium features', 'War Room & Harvey\'s Office', 'Vault Access', 'Dedicated CSM', 'SLA Guarantee', 'White-label Options'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-rich-black">
      {/* Header */}
      <nav className="border-b border-glass-border py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center">
              <span className="font-bold text-sm text-rich-black">A</span>
            </div>
            <span className="font-bold text-off-white">Aequitas</span>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="premium" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold text-off-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Start free and scale as you grow. All plans include core platform features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <GlassPanel
              key={plan.name}
              variant={plan.popular ? 'premium' : 'default'}
              padding="lg"
              className={plan.popular ? 'ring-2 ring-precision-teal' : ''}
            >
              {plan.popular && (
                <Badge variant="premium" className="mb-4">Most Popular</Badge>
              )}

              <h2 className="text-2xl font-bold text-off-white">{plan.name}</h2>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-bold text-off-white">{plan.price}</span>
                <span className="text-muted">{plan.period}</span>
              </div>
              <p className="text-sm text-muted mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-off-white">
                    <span className="text-spring-green">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'default' : 'outline'}
                className="w-full"
                onClick={() => navigate('/signup')}
              >
                {plan.cta}
              </Button>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
