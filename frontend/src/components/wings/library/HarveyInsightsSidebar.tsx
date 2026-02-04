'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { HarveyInsight } from '@/types/wings/library';

interface HarveyInsightsSidebarProps {
  insights?: HarveyInsight[];
  onInsightClick?: (insight: HarveyInsight) => void;
  className?: string;
}

const mockInsights: HarveyInsight[] = [
  { id: '1', type: 'recommendation', title: 'Reduce Goldman Exposure', content: 'Based on current regime signals, consider reducing Goldman Sachs margin exposure by 15%.', priority: 'high', context: 'margin_warning', timestamp: new Date().toISOString() },
  { id: '2', type: 'pattern', title: 'Seasonal Pattern Detected', content: 'Q4 typically shows 12% higher liquidity variance. Models have been adjusted accordingly.', priority: 'medium', context: 'forecast', timestamp: new Date().toISOString() },
  { id: '3', type: 'opportunity', title: 'Optimization Opportunity', content: 'Cross-broker netting could reduce settlement risk by 8%. Worth investigating.', priority: 'low', context: 'optimization', timestamp: new Date().toISOString() },
];

const priorityColors = {
  high: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400' },
  medium: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  low: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

const typeIcons = {
  recommendation: Lightbulb,
  pattern: BookOpen,
  opportunity: Sparkles,
  warning: Lightbulb,
};

export const HarveyInsightsSidebar = React.memo(function HarveyInsightsSidebar({ insights = mockInsights, onInsightClick, className }: HarveyInsightsSidebarProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
          <Sparkles className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Harvey's Insights</h3>
          <p className="text-sm text-slate-400">AI-powered recommendations</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const colors = priorityColors[insight.priority];
          const Icon = typeIcons[insight.type];

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onInsightClick?.(insight)}
              className={cn(
                'group rounded-lg border p-4 cursor-pointer transition-all hover:scale-[1.02]',
                colors.border, colors.bg
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('h-5 w-5 mt-0.5', colors.text)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-medium uppercase', colors.text)}>{insight.priority}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="mt-1 font-medium text-white">{insight.title}</h4>
                  <p className="mt-1 text-sm text-slate-300 line-clamp-2">{insight.content}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-white/10 pt-4">
        <Button variant="outline" className="w-full">
          View All Insights
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Harvey quote */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-sm italic text-slate-300">"The best way to win is not to have to fight at all. Prepare before they even know there's a battle."</p>
        <p className="mt-2 text-xs font-medium text-amber-500/60">— Harvey Specter</p>
      </div>
    </div>
  );
});

export default HarveyInsightsSidebar;
