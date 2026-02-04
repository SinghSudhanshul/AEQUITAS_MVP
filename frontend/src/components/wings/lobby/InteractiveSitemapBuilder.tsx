'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Map, Layout, ChevronRight, Home, Shield, Library,
  Briefcase, AlertTriangle, Scale, MessageSquare,
  Target, Lock, Plus, GripVertical
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SitemapItem } from '@/types/wings/lobby';

// ============================================
// INTERACTIVE SITEMAP BUILDER
// Feature 9: Drag-Drop Sitemap Builder
// ============================================

interface InteractiveSitemapBuilderProps {
  items?: SitemapItem[];
  onItemClick?: (item: SitemapItem) => void;
  editable?: boolean;
  className?: string;
}

const wingIcons: Record<string, React.ReactNode> = {
  lobby: <Home className="h-4 w-4" />,
  bullpen: <Briefcase className="h-4 w-4" />,
  library: <Library className="h-4 w-4" />,
  treasury: <Shield className="h-4 w-4" />,
  'situation-room': <AlertTriangle className="h-4 w-4" />,
  'war-room': <Scale className="h-4 w-4" />,
  'donnas-desk': <MessageSquare className="h-4 w-4" />,
  'harveys-office': <Target className="h-4 w-4" />,
  vault: <Lock className="h-4 w-4" />,
};

const tierColors: Record<string, string> = {
  free: 'border-emerald-500/30 bg-emerald-500/10',
  premium: 'border-amber-500/30 bg-amber-500/10',
  enterprise: 'border-purple-500/30 bg-purple-500/10',
};

const tierBadges: Record<string, string> = {
  free: 'bg-emerald-500/20 text-emerald-400',
  premium: 'bg-amber-500/20 text-amber-400',
  enterprise: 'bg-purple-500/20 text-purple-400',
};

const defaultSitemapItems: SitemapItem[] = [
  {
    id: 'lobby',
    label: 'Lobby',
    route: '/app/lobby',
    icon: 'home',
    tier: 'free',
    wingId: 'lobby',
    children: [
      { id: 'onboarding', label: 'Onboarding', route: '/app/lobby/onboarding', icon: 'user', tier: 'free', wingId: 'lobby', children: [] },
      { id: 'kyc', label: 'KYC Verification', route: '/app/lobby/kyc', icon: 'shield', tier: 'free', wingId: 'lobby', children: [] },
    ],
  },
  {
    id: 'bullpen',
    label: 'Bullpen',
    route: '/app/bullpen',
    icon: 'briefcase',
    tier: 'free',
    wingId: 'bullpen',
    children: [
      { id: 'tasks', label: 'Task Board', route: '/app/bullpen/tasks', icon: 'kanban', tier: 'free', wingId: 'bullpen', children: [] },
      { id: 'evidence', label: 'Evidence Log', route: '/app/bullpen/evidence', icon: 'file', tier: 'premium', wingId: 'bullpen', children: [] },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    route: '/app/library',
    icon: 'library',
    tier: 'premium',
    wingId: 'library',
    children: [
      { id: 'analytics', label: 'Analytics', route: '/app/library/analytics', icon: 'chart', tier: 'premium', wingId: 'library', children: [] },
      { id: 'ml-models', label: 'ML Models', route: '/app/library/models', icon: 'cpu', tier: 'enterprise', wingId: 'library', children: [] },
    ],
  },
  {
    id: 'vault',
    label: 'Vault',
    route: '/app/vault',
    icon: 'lock',
    tier: 'enterprise',
    wingId: 'vault',
    children: [],
  },
];

interface SitemapNodeProps {
  item: SitemapItem;
  level: number;
  onSelect: (item: SitemapItem) => void;
  editable: boolean;
}

const SitemapNode = React.memo(function SitemapNode({
  item,
  level,
  onSelect,
  editable,
}: SitemapNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(level === 0);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="relative">
      {/* Connection line */}
      {level > 0 && (
        <div className="absolute -left-4 top-0 h-6 w-4 border-l border-b border-white/10 rounded-bl-lg" />
      )}

      {/* Node */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.05 }}
        className={cn(
          'group relative flex items-center gap-2 rounded-lg border p-3',
          'transition-all duration-200 cursor-pointer',
          tierColors[item.tier],
          'hover:scale-[1.02] hover:shadow-lg'
        )}
        onClick={() => onSelect(item)}
      >
        {/* Drag handle */}
        {editable && (
          <GripVertical className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 cursor-grab" />
        )}

        {/* Expand button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 text-slate-400 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        )}

        {/* Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          {wingIcons[item.wingId] || <Layout className="h-4 w-4 text-slate-400" />}
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <span className="font-medium text-white">{item.label}</span>
          <span className="ml-2 text-xs text-slate-500">{item.route}</span>
        </div>

        {/* Tier badge */}
        <span className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
          tierBadges[item.tier]
        )}>
          {item.tier}
        </span>
      </motion.div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="ml-8 mt-2 space-y-2 relative">
          {item.children.map((child) => (
            <SitemapNode
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              editable={editable}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export const InteractiveSitemapBuilder = React.memo(function InteractiveSitemapBuilder({
  items = defaultSitemapItems,
  onItemClick,
  editable = false,
  className,
}: InteractiveSitemapBuilderProps) {
  const [selectedItem, setSelectedItem] = React.useState<SitemapItem | null>(null);
  const [viewMode, setViewMode] = React.useState<'tree' | 'grid'>('tree');

  const handleSelect = React.useCallback((item: SitemapItem) => {
    setSelectedItem(item);
    onItemClick?.(item);
  }, [onItemClick]);

  const totalPages = React.useMemo(() => {
    const countItems = (items: SitemapItem[]): number => {
      return items.reduce((sum, item) => {
        return sum + 1 + countItems(item.children || []);
      }, 0);
    };
    return countItems(items);
  }, [items]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
            <Map className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Platform Sitemap</h3>
            <p className="text-sm text-slate-400">{totalPages} pages across 9 wings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tree')}
          >
            Tree
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          {editable && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Page
            </Button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
          <span className="text-slate-400">Free</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500/30 border border-amber-500/50" />
          <span className="text-slate-400">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-500/30 border border-purple-500/50" />
          <span className="text-slate-400">Enterprise</span>
        </div>
      </div>

      {/* Sitemap tree/grid */}
      <div className="rounded-xl border border-white/10 bg-navy-900/30 p-4 backdrop-blur-sm">
        {viewMode === 'tree' ? (
          <div className="space-y-3">
            {items.map((item) => (
              <SitemapNode
                key={item.id}
                item={item}
                level={0}
                onSelect={handleSelect}
                editable={editable}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'rounded-lg border p-4 cursor-pointer',
                  tierColors[item.tier]
                )}
                onClick={() => handleSelect(item)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {wingIcons[item.wingId]}
                  <span className="font-medium text-white">{item.label}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {item.children.length} sub-pages
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Selected item details */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{selectedItem.label}</h4>
              <p className="text-sm text-slate-400">{selectedItem.route}</p>
            </div>
            <Button size="sm">Navigate</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default InteractiveSitemapBuilder;
