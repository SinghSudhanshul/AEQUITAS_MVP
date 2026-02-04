// ============================================
// BILLING SETTINGS COMPONENT
// Subscription & Payment Management
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: PlanFeature[];
  popular?: boolean;
}

interface BillingSettingsProps {
  currentPlan?: string;
  usage?: { forecasts: number; uploads: number; apiCalls: number };
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    interval: 'month',
    features: [
      { name: 'Daily forecasts', included: true },
      { name: 'CSV uploads', included: true },
      { name: '90-day history', included: true },
      { name: 'Email support', included: true },
      { name: 'API access', included: false },
      { name: 'Broker integration', included: false },
      { name: 'Real-time updates', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 1499,
    interval: 'month',
    popular: true,
    features: [
      { name: 'Daily forecasts', included: true },
      { name: 'CSV uploads', included: true },
      { name: '1-year history', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: true },
      { name: 'Broker integration', included: true },
      { name: 'Real-time updates', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    interval: 'month',
    features: [
      { name: 'Daily forecasts', included: true },
      { name: 'CSV uploads', included: true },
      { name: 'Unlimited history', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'API access', included: true },
      { name: 'Broker integration', included: true },
      { name: 'Real-time updates', included: true },
    ],
  },
];

export const BillingSettings: React.FC<BillingSettingsProps> = ({
  currentPlan = 'professional',
  usage = { forecasts: 22, uploads: 45, apiCalls: 1250 },
}) => {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const getPrice = (plan: Plan) => {
    const basePrice = plan.price;
    if (billingInterval === 'year') {
      return Math.round(basePrice * 10); // 2 months free
    }
    return basePrice;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan & Usage */}
      <Card variant="glow">
        <CardHeader>
          <CardTitle className="text-xl">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="text-sm text-muted uppercase tracking-wider mb-1">Plan</div>
              <div className="text-2xl font-bold text-precision-teal capitalize">{currentPlan}</div>
              <div className="text-sm text-muted mt-1">Renews Feb 15, 2026</div>
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider mb-1">Forecasts</div>
              <div className="text-2xl font-bold text-off-white">{usage.forecasts}</div>
              <div className="text-sm text-muted">This month</div>
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider mb-1">Uploads</div>
              <div className="text-2xl font-bold text-off-white">{usage.uploads}</div>
              <div className="text-sm text-muted">This month</div>
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider mb-1">API Calls</div>
              <div className="text-2xl font-bold text-off-white">{usage.apiCalls.toLocaleString()}</div>
              <div className="text-sm text-muted">This month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Available Plans</CardTitle>
              <CardDescription>Choose the plan that fits your needs</CardDescription>
            </div>
            <div className="flex gap-1 bg-charcoal p-1 rounded-lg">
              <Button
                variant={billingInterval === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBillingInterval('month')}
              >
                Monthly
              </Button>
              <Button
                variant={billingInterval === 'year' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBillingInterval('year')}
              >
                Yearly
                <span className="ml-1 text-xs bg-steady-green/20 text-steady-green px-1.5 py-0.5 rounded">
                  -17%
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                variant={plan.popular ? 'glow' : 'default'}
                className={`p-6 relative ${plan.id === currentPlan ? 'border-precision-teal' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-achievement-gold text-rich-black text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-off-white">{plan.name}</div>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-off-white">
                      ${getPrice(plan).toLocaleString()}
                    </span>
                    <span className="text-muted">/{billingInterval}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className={feature.included ? 'text-steady-green' : 'text-muted'}>
                        {feature.included ? '✓' : '✕'}
                      </span>
                      <span className={feature.included ? 'text-off-white' : 'text-muted'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.id === currentPlan ? 'ghost' : plan.popular ? 'closeDeal' : 'default'}
                  className="w-full"
                  disabled={plan.id === currentPlan}
                >
                  {plan.id === currentPlan ? 'Current Plan' : 'Select Plan'}
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-glass-white rounded-lg border border-glass-border">
            <div className="flex items-center gap-4">
              <span className="text-2xl">💳</span>
              <div>
                <div className="font-medium text-off-white">•••• •••• •••• 4242</div>
                <div className="text-sm text-muted">Expires 12/2027</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Alert variant="info">
        <AlertTitle>Need Invoices?</AlertTitle>
        <AlertDescription>
          <a href="#" className="text-precision-teal underline">View billing history</a> to download invoices for your records.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default BillingSettings;
