// ============================================
// FAQ COMPONENT
// Frequently Asked Questions
// ============================================

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FAQItem[] = [
  {
    question: "How accurate are the forecasts?",
    answer: "Our forecasts achieve 90%+ accuracy in steady-state markets and maintain 85%+ accuracy during crisis conditions. This is validated against historical data including the March 2020 volatility period.",
    category: "Accuracy",
  },
  {
    question: "What data do I need to provide?",
    answer: "You'll need to upload daily position snapshots in CSV format. We provide templates and can also integrate directly with your prime broker (Goldman Sachs, Morgan Stanley, JP Morgan) to automate this process.",
    category: "Data",
  },
  {
    question: "How long does it take to get started?",
    answer: "You can start generating forecasts within 15 minutes of uploading your first data file. For optimal accuracy, we recommend 30 days of historical data, though forecasts will work with as little as 5 days.",
    category: "Onboarding",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We're SOC 2 Type II compliant, use AES-256 encryption at rest and in transit, and implement strict data isolation between organizations. Your data is never shared or used for training models across clients.",
    category: "Security",
  },
  {
    question: "Can I integrate with my existing systems?",
    answer: "Yes, our REST API and WebSocket feeds can integrate with most trading systems, risk platforms, and treasury management tools. We also offer custom integration support for Enterprise clients.",
    category: "Integration",
  },
  {
    question: "What happens during a market crisis?",
    answer: "Our dual-model architecture automatically detects elevated volatility and switches to Monte Carlo simulations calibrated on historical crisis data. This maintains forecast accuracy when traditional models fail.",
    category: "Accuracy",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, all plans include a 14-day free trial with full access to features. No credit card required to start. We'll help you onboard and validate the forecasts against your actual liquidity needs.",
    category: "Pricing",
  },
  {
    question: "How is pricing calculated?",
    answer: "Pricing is based on your subscription tier, not AUM or transaction volume. This provides cost certainty as you scale. Enterprise clients can discuss custom pricing for specific needs.",
    category: "Pricing",
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-dark-navy">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-off-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted">
            Everything you need to know about Aequitas.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              variant="glass"
              className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-institutional-blue/50' : ''
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {faq.category && (
                    <span className="text-xs bg-glass-white text-muted px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  )}
                  <span className="font-semibold text-off-white">{faq.question}</span>
                </div>
                <span className={`text-precision-teal transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                  }`}>
                  ▼
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                <CardContent className="pt-0 pb-6 px-6">
                  <p className="text-muted leading-relaxed pl-0 md:pl-[70px]">
                    {faq.answer}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted mb-4">
            Still have questions?
          </p>
          <a href="#" className="text-precision-teal hover:underline font-medium">
            Contact our team →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
