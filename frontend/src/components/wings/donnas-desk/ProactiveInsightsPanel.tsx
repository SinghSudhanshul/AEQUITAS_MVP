'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Lightbulb, ArrowRight, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DonnaInsight } from '@/types/wings/donnas-desk';

interface ProactiveInsightsPanelProps {
  insights?: DonnaInsight[];
  onTakeAction?: (insight: DonnaInsight) => void;
  className?: string;
}

const mockInsights: DonnaInsight[] = [
  { id: '1', type: 'prediction', title: 'Margin Pressure Expected', description: 'Based on current positions and market volatility, Goldman margin may reach 88% by EOD tomorrow.', confidence: 85, suggestedAction: 'Consider reducing AAPL exposure by 200 shares', impact: 'high' },
  { id: '2', type: 'optimization', title: 'Cost Savings Opportunity', description: 'Moving $150K from Morgan Stanley to JP Morgan could save $2.5K monthly in margin fees.', confidence: 92, suggestedAction: 'Initiate collateral transfer', impact: 'medium' },
  { id: '3', type: 'reminder', title: 'Upcoming Deadline', description: 'Q4 settlement deadline is in 48 hours. All documents are prepared but require final review.', confidence: 100, suggestedAction: 'Schedule review session', impact: 'high' },
];

const typeConfig = {
  prediction: { color: 'text-purple-400', bg: 'bg-purple-500/20', gradient: 'from-purple-500/10 to-transparent' },
  optimization: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', gradient: 'from-cyan-500/10 to-transparent' },
  reminder: { color: 'text-amber-400', bg: 'bg-amber-500/20', gradient: 'from-amber-500/10 to-transparent' },
  alert: { color: 'text-red-400', bg: 'bg-red-500/20', gradient: 'from-red-500/10 to-transparent' },
};

const impactColors = { low: 'text-blue-400', medium: 'text-amber-400', high: 'text-red-400' };

export const ProactiveInsightsPanel = React.memo(function ProactiveInsightsPanel({ insights = mockInsights, onTakeAction, className }: ProactiveInsightsPanelProps) {
  const [actedOn, setActedOn] = React.useState<Set<string>>(new Set());

  const handleAction = (insight: DonnaInsight) => {
    setActedOn(prev => new Set([...prev, insight.id]));
    onTakeAction?.(insight);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className="h-5 w-5 text-rose-400" />
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Proactive Insights</h3>
          <p className="text-sm text-slate-400">Donna's intelligent observations</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => {
          const type = typeConfig[insight.type] || typeConfig.prediction;
          const wasActedOn = actedOn.has(insight.id);

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                'relative rounded-xl border overflow-hidden',
                wasActedOn ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-navy-900/50'
              )}
            >
              {/* Gradient background */}
              <div className={cn('absolute inset-0 bg-gradient-to-r', type.gradient)} />

              <div className="relative p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className={cn('h-5 w-5', type.color)} />
                    <span className={cn('text-xs font-medium uppercase', type.color)}>{insight.type}</span>
                    <span className={cn('text-xs', impactColors[insight.impact])}>{insight.impact} impact</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">{insight.confidence}%</span>
                    <span className="text-slate-500">confidence</span>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-white mb-2">{insight.title}</h4>
                <p className="text-sm text-slate-300 mb-4">{insight.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Suggested:</span>
                    <span className="text-white">{insight.suggestedAction}</span>
                  </div>

                  {wasActedOn ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">Action Taken</span>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleAction(insight)}>
                      Take Action <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default ProactiveInsightsPanel;
