'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ChevronRight, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DecisionTreeNode } from '@/types/wings/situation-room';

interface DecisionTreeVisualizerProps {
  rootNode?: DecisionTreeNode;
  onNodeSelect?: (node: DecisionTreeNode) => void;
  className?: string;
}

const mockTree: DecisionTreeNode = {
  id: 'root',
  question: 'Is margin utilization above 85%?',
  type: 'decision',
  children: [
    {
      id: 'yes-1',
      question: 'Is there available credit line?',
      type: 'decision',
      parent: 'root',
      children: [
        { id: 'yes-1-yes', question: 'Draw from credit line', type: 'action', outcome: 'positive', parent: 'yes-1' },
        { id: 'yes-1-no', question: 'Reduce positions immediately', type: 'action', outcome: 'warning', parent: 'yes-1' },
      ],
    },
    {
      id: 'no-1',
      question: 'Is margin trending up?',
      type: 'decision',
      parent: 'root',
      children: [
        { id: 'no-1-yes', question: 'Schedule preventive rebalance', type: 'action', outcome: 'positive', parent: 'no-1' },
        { id: 'no-1-no', question: 'Continue monitoring', type: 'action', outcome: 'positive', parent: 'no-1' },
      ],
    },
  ],
};

interface NodeComponentProps {
  node: DecisionTreeNode;
  depth: number;
  onSelect?: (node: DecisionTreeNode) => void;
}

const NodeComponent = React.memo(function NodeComponent({ node, depth, onSelect }: NodeComponentProps) {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const outcomeConfig = {
    positive: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: Check, color: 'text-emerald-400' },
    warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', icon: AlertTriangle, color: 'text-amber-400' },
    negative: { bg: 'bg-red-500/20', border: 'border-red-500/30', icon: X, color: 'text-red-400' },
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.1 }}
        onClick={() => onSelect?.(node)}
        className={cn(
          'rounded-lg border p-4 cursor-pointer transition-all hover:scale-[1.02]',
          node.type === 'decision' ? 'border-blue-500/30 bg-blue-500/10' :
            node.outcome ? outcomeConfig[node.outcome].border + ' ' + outcomeConfig[node.outcome].bg :
              'border-white/10 bg-white/5'
        )}
        style={{ marginLeft: depth * 24 }}
      >
        <div className="flex items-center gap-3">
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
              <ChevronRight className={cn('h-5 w-5 text-slate-400 transition-transform', expanded && 'rotate-90')} />
            </button>
          )}
          {node.type === 'decision' ? (
            <GitBranch className="h-5 w-5 text-blue-400" />
          ) : node.outcome ? (
            React.createElement(outcomeConfig[node.outcome].icon, { className: cn('h-5 w-5', outcomeConfig[node.outcome].color) })
          ) : (
            <Clock className="h-5 w-5 text-slate-400" />
          )}
          <span className={cn('font-medium', node.type === 'decision' ? 'text-white' : 'text-slate-300')}>
            {node.question}
          </span>
        </div>
      </motion.div>

      {expanded && hasChildren && (
        <div className="mt-2 space-y-2 border-l-2 border-white/10 ml-8">
          {node.children!.map(child => (
            <NodeComponent key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
});

export const DecisionTreeVisualizer = React.memo(function DecisionTreeVisualizer({ rootNode = mockTree, onNodeSelect, className }: DecisionTreeVisualizerProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <GitBranch className="h-5 w-5 text-blue-400" />
        <div>
          <h3 className="font-semibold text-white">Decision Tree</h3>
          <p className="text-sm text-slate-400">Crisis response logic flow</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4 overflow-x-auto">
        <NodeComponent node={rootNode} depth={0} onSelect={onNodeSelect} />
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-2 border-blue-500 bg-blue-500/20" />
          <span className="text-slate-400">Decision Point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-2 border-emerald-500 bg-emerald-500/20" />
          <span className="text-slate-400">Positive Action</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-2 border-amber-500 bg-amber-500/20" />
          <span className="text-slate-400">Warning Action</span>
        </div>
      </div>
    </div>
  );
});

export default DecisionTreeVisualizer;
