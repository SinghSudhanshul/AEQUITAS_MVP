'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Users, Building2, User, Crown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { OrgChartNode } from '@/types/wings/lobby';

// ============================================
// INSTITUTIONAL ORG CHART COMPONENT
// Feature 7: Interactive Org Chart
// ============================================

interface InstitutionalOrgChartProps {
  data?: OrgChartNode;
  onNodeClick?: (node: OrgChartNode) => void;
  className?: string;
}

const mockOrgData: OrgChartNode = {
  id: 'ceo',
  name: 'Jessica Pearson',
  title: 'Managing Partner',
  avatarUrl: '/avatars/jessica.png',
  department: 'Executive',
  isExpanded: true,
  children: [
    {
      id: 'harvey',
      name: 'Harvey Specter',
      title: 'Senior Partner',
      avatarUrl: '/avatars/harvey_specter.png',
      department: 'Corporate Law',
      isExpanded: true,
      children: [
        {
          id: 'mike',
          name: 'Mike Ross',
          title: 'Associate',
          department: 'Corporate Law',
          isExpanded: false,
          children: [],
        },
        {
          id: 'rachel',
          name: 'Rachel Zane',
          title: 'Paralegal',
          department: 'Corporate Law',
          isExpanded: false,
          children: [],
        },
      ],
    },
    {
      id: 'louis',
      name: 'Louis Litt',
      title: 'Senior Partner',
      avatarUrl: '/avatars/louis_litt.png',
      department: 'Financial Law',
      isExpanded: false,
      children: [
        {
          id: 'katrina',
          name: 'Katrina Bennett',
          title: 'Associate',
          department: 'Financial Law',
          isExpanded: false,
          children: [],
        },
      ],
    },
    {
      id: 'donna',
      name: 'Donna Paulsen',
      title: 'Executive Assistant',
      avatarUrl: '/avatars/donna_paulsen.png',
      department: 'Operations',
      isExpanded: false,
      children: [],
    },
  ],
};

interface OrgNodeProps {
  node: OrgChartNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onSelect: (node: OrgChartNode) => void;
}

const OrgNode = React.memo(function OrgNode({
  node,
  level,
  onToggle,
  onSelect,
}: OrgNodeProps) {
  const hasChildren = node.children && node.children.length > 0;

  const getRoleIcon = (title: string) => {
    if (title.includes('Partner')) return <Crown className="h-4 w-4 text-amber-400" />;
    if (title.includes('Executive') || title.includes('Manager')) return <Building2 className="h-4 w-4 text-blue-400" />;
    return <User className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="relative">
      {/* Node card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
        className={cn(
          'group relative flex items-center gap-3 rounded-lg p-3',
          'border border-white/10 bg-navy-900/50 backdrop-blur-sm',
          'hover:border-amber-500/30 hover:bg-navy-800/50',
          'cursor-pointer transition-all duration-200',
          level === 0 && 'border-amber-500/30 bg-gradient-to-r from-navy-900/80 to-navy-800/60'
        )}
        style={{ marginLeft: level * 24 }}
        onClick={() => onSelect(node)}
      >
        {/* Expand/collapse button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            {node.isExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        {/* Avatar */}
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          'bg-gradient-to-br from-slate-700 to-slate-800',
          'border border-white/20'
        )}>
          {node.avatarUrl ? (
            <img
              src={node.avatarUrl}
              alt={node.name}
              className="h-full w-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {node.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{node.name}</span>
            {getRoleIcon(node.title)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">{node.title}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">{node.department}</span>
          </div>
        </div>

        {/* Children count */}
        {hasChildren && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users className="h-3 w-3" />
            <span>{node.children.length}</span>
          </div>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {node.isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {/* Connector line */}
            <div
              className="absolute left-6 top-14 w-px bg-white/10"
              style={{
                height: `calc(100% - 56px)`,
                marginLeft: level * 24,
              }}
            />
            {node.children.map((child) => (
              <OrgNode
                key={child.id}
                node={child}
                level={level + 1}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export const InstitutionalOrgChart = React.memo(function InstitutionalOrgChart({
  data = mockOrgData,
  onNodeClick,
  className,
}: InstitutionalOrgChartProps) {
  const [orgData, setOrgData] = React.useState<OrgChartNode>(data);
  const [selectedNode, setSelectedNode] = React.useState<OrgChartNode | null>(null);

  const toggleNode = React.useCallback((nodeId: string) => {
    const toggleInTree = (node: OrgChartNode): OrgChartNode => {
      if (node.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      return {
        ...node,
        children: node.children.map(toggleInTree),
      };
    };
    setOrgData(toggleInTree(orgData));
  }, [orgData]);

  const handleSelect = React.useCallback((node: OrgChartNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  }, [onNodeClick]);

  const expandAll = React.useCallback(() => {
    const expandInTree = (node: OrgChartNode): OrgChartNode => ({
      ...node,
      isExpanded: true,
      children: node.children.map(expandInTree),
    });
    setOrgData(expandInTree(orgData));
  }, [orgData]);

  const collapseAll = React.useCallback(() => {
    const collapseInTree = (node: OrgChartNode): OrgChartNode => ({
      ...node,
      isExpanded: false,
      children: node.children.map(collapseInTree),
    });
    setOrgData(collapseInTree(orgData));
  }, [orgData]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Organization Structure</h3>
          <p className="text-sm text-slate-400">Click to expand teams</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {/* Tree */}
      <div className="rounded-xl border border-white/10 bg-navy-900/30 p-4 backdrop-blur-sm">
        <OrgNode
          node={orgData}
          level={0}
          onToggle={toggleNode}
          onSelect={handleSelect}
        />
      </div>

      {/* Selected node details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
          >
            <h4 className="font-medium text-white">{selectedNode.name}</h4>
            <p className="text-sm text-slate-400">{selectedNode.title} • {selectedNode.department}</p>
            {selectedNode.children.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Direct reports: {selectedNode.children.length}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default InstitutionalOrgChart;
