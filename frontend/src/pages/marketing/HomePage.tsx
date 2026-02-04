// ============================================
// HOME PAGE (Marketing)
// Landing Page with Power Suit Aesthetic
// ============================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { cn } from '@/lib/utils';
import { QUOTES } from '@/config/narrative';
import { WINGS, WING_ORDER } from '@/config/wings';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ============================================
// HERO SECTION
// ============================================

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rich-black via-charcoal to-rich-black" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,216,180,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,216,180,0.2)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-precision-teal/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-institutional-blue/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Badge */}
        <Badge variant="premium" className="mb-6">
          🏛️ Enterprise-Grade Liquidity Platform
        </Badge>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-off-white mb-6 leading-tight">
          Liquidity Intelligence
          <br />
          <span className="text-precision-teal">Crisis Ready</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8">
          Aequitas LV-COP delivers real-time liquidity forecasting, volatility analysis,
          and crisis operations for institutional investors. Built for those who refuse to lose.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="default" size="lg" onClick={() => navigate('/signup')}>
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/features')}>
            Explore Features
          </Button>
        </div>

        {/* Harvey Quote */}
        <div className="flex items-center gap-4 justify-center max-w-md mx-auto">
          <PersonaAvatar persona="harvey" size="lg" />
          <div className="text-left">
            <p className="text-off-white italic text-sm mb-1">
              "{QUOTES.HARVEY.MOTIVATION}"
            </p>
            <p className="text-xs text-precision-teal">— Harvey Specter, Strategic Advisor</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-glass-border flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-precision-teal rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

// ============================================
// FEATURES SECTION
// ============================================

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '📊',
      title: 'Quantile Forecasting',
      description: 'P5/P50/P95 daily liquidity predictions with confidence intervals',
    },
    {
      icon: '🚨',
      title: 'Crisis Operations',
      description: 'Real-time regime detection and paranoia mode for market turbulence',
    },
    {
      icon: '🎯',
      title: 'Strategy Builder',
      description: 'Visual strategy canvas with backtesting and deployment',
    },
    {
      icon: '🤖',
      title: 'AI Coordinators',
      description: 'Harvey and Donna provide context-aware guidance and insights',
    },
    {
      icon: '⚡',
      title: 'Sub-Millisecond',
      description: 'Ultra-low latency execution for time-critical operations',
    },
    {
      icon: '🔐',
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with biometric authentication and vault access',
    },
  ];

  return (
    <section className="py-24 bg-charcoal">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-off-white mb-4">
            Built for Institutional Excellence
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Every feature designed with one goal: giving you the unfair advantage in volatile markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <GlassPanel
              key={i}
              variant="default"
              padding="lg"
              className="hover:border-precision-teal/30 transition-all group"
            >
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                {feature.icon}
              </span>
              <h3 className="text-lg font-bold text-off-white mb-2">{feature.title}</h3>
              <p className="text-sm text-muted">{feature.description}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// WINGS PREVIEW
// ============================================

const WingsPreview: React.FC = () => {
  return (
    <section className="py-24 bg-rich-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="premium" className="mb-4">The 9 Wings</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-off-white mb-4">
            Your Complete Command Center
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Navigate through dedicated wings, each designed for specific aspects of liquidity management.
          </p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
          {WING_ORDER.slice(0, 5).map((wingId) => {
            const wing = WINGS[wingId];
            return (
              <div
                key={wingId}
                className="p-4 bg-glass-white rounded-xl text-center hover:bg-precision-teal/10 transition-all"
              >
                <span className="text-3xl block mb-2">{wing.icon}</span>
                <p className="text-sm font-medium text-off-white">{wing.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// TESTIMONIAL SECTION
// ============================================

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-24 bg-charcoal">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Badge variant="default" className="mb-8">What They Say</Badge>

        <blockquote className="text-2xl lg:text-3xl text-off-white italic mb-8">
          "Aequitas transformed how we manage liquidity risk. The crisis simulation
          saved us during the last market correction."
        </blockquote>

        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-precision-teal/20 flex items-center justify-center text-xl">
            👔
          </div>
          <div className="text-left">
            <p className="font-semibold text-off-white">Michael Ross</p>
            <p className="text-sm text-muted">CIO, Pearson Capital</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA SECTION
// ============================================

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-precision-teal/20 to-institutional-blue/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-off-white mb-4">
          Ready to Win?
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          Join the elite firms using Aequitas to stay ahead of market volatility.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" size="lg" onClick={() => navigate('/signup')}>
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/pricing')}>
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-rich-black border-t border-glass-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center">
              <span className="font-bold text-rich-black">A</span>
            </div>
            <span className="font-bold text-off-white">Aequitas</span>
          </div>

          <div className="flex gap-6 text-sm text-muted">
            <Link to="/features" className="hover:text-off-white">Features</Link>
            <Link to="/pricing" className="hover:text-off-white">Pricing</Link>
            <Link to="/case-studies" className="hover:text-off-white">Case Studies</Link>
            <a href="#" className="hover:text-off-white">Documentation</a>
          </div>

          <p className="text-sm text-muted">
            © 2024 Aequitas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-rich-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-rich-black/80 backdrop-blur-md border-b border-glass-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center">
              <span className="font-bold text-sm text-rich-black">A</span>
            </div>
            <span className="font-bold text-off-white">Aequitas</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-sm text-muted hover:text-off-white">Features</Link>
            <Link to="/pricing" className="text-sm text-muted hover:text-off-white">Pricing</Link>
            <Link to="/case-studies" className="text-sm text-muted hover:text-off-white">Case Studies</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <HeroSection />
      <FeaturesSection />
      <WingsPreview />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
