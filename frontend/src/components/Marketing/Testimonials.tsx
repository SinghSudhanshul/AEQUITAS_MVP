// ============================================
// TESTIMONIALS COMPONENT
// Customer Success Stories
// ============================================

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  metric?: { value: string; label: string };
}

const testimonials: Testimonial[] = [
  {
    quote: "During the March 2020 volatility, Aequitas was the only forecasting tool that didn't completely break down. It gave us the confidence to manage through the crisis.",
    author: "Michael Chen",
    title: "Head of Treasury",
    company: "Citadel Securities",
    metric: { value: "87%", label: "Crisis Accuracy" },
  },
  {
    quote: "We reduced our liquidity buffer by 15% without increasing risk. The ROI on Aequitas paid for itself in the first month.",
    author: "Sarah Williams",
    title: "CFO",
    company: "Two Sigma Investments",
    metric: { value: "$12M", label: "Annual Savings" },
  },
  {
    quote: "The regime detection is incredibly accurate. We now get early warning signals before volatility spikes impact our positions.",
    author: "David Park",
    title: "Risk Manager",
    company: "DE Shaw & Co",
    metric: { value: "2hrs", label: "Early Warning" },
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-rich-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-off-white">
            Trusted by the Best
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            See how leading institutional traders use Aequitas to manage liquidity with confidence.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              variant="glass"
              className="hover:border-institutional-blue/30 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Quote */}
                <div className="flex-1 mb-6">
                  <span className="text-4xl text-institutional-blue/50">"</span>
                  <p className="text-off-white leading-relaxed -mt-4 ml-4">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Metric Badge */}
                {testimonial.metric && (
                  <div className="mb-6 p-4 bg-glass-white rounded-lg border border-glass-border text-center">
                    <div className="text-2xl font-bold text-precision-teal">
                      {testimonial.metric.value}
                    </div>
                    <div className="text-xs text-muted uppercase tracking-wider">
                      {testimonial.metric.label}
                    </div>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-institutional-blue to-precision-teal flex items-center justify-center text-lg font-bold text-off-white">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-off-white">{testimonial.author}</div>
                    <div className="text-sm text-muted">{testimonial.title}</div>
                    <div className="text-sm text-precision-teal">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logos Section */}
        <div className="mt-16 pt-16 border-t border-glass-border">
          <p className="text-center text-muted mb-8">Trusted by leading financial institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Citadel', 'Two Sigma', 'DE Shaw'].map((company) => (
              <div key={company} className="text-lg font-semibold text-muted">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
