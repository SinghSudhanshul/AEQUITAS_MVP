'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Link, ArrowRight, Tag, Calendar, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { EvidenceItem, EvidenceLink } from '@/types/wings/war-room';

interface EvidenceLinkMapProps {
  evidence?: EvidenceItem[];
  links?: EvidenceLink[];
  onItemClick?: (item: EvidenceItem) => void;
  className?: string;
}

const mockEvidence: EvidenceItem[] = [
  { id: '1', title: 'Position Statement Q3', type: 'document', date: '2024-09-15', tags: ['financial', 'quarterly'], x: 15, y: 20 },
  { id: '2', title: 'Email Thread: Goldman', type: 'correspondence', date: '2024-10-01', tags: ['communication'], x: 40, y: 35 },
  { id: '3', title: 'Trade Confirmations', type: 'exhibit', date: '2024-08-20', tags: ['trading', 'proof'], x: 70, y: 25 },
  { id: '4', title: 'Margin Call Records', type: 'document', date: '2024-10-10', tags: ['margin', 'records'], x: 55, y: 60 },
  { id: '5', title: 'Expert Opinion', type: 'testimony', date: '2024-11-01', tags: ['expert', 'opinion'], x: 25, y: 70 },
];

const mockLinks: EvidenceLink[] = [
  { from: '1', to: '2', type: 'supports' },
  { from: '2', to: '4', type: 'references' },
  { from: '3', to: '4', type: 'corroborates' },
  { from: '4', to: '5', type: 'analyzed_by' },
];

const typeColors = {
  document: 'bg-blue-500',
  correspondence: 'bg-amber-500',
  exhibit: 'bg-emerald-500',
  testimony: 'bg-purple-500',
};

export const EvidenceLinkMap = React.memo(function EvidenceLinkMap({ evidence = mockEvidence, links = mockLinks, onItemClick, className }: EvidenceLinkMapProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const getPosition = (id: string) => {
    const item = evidence.find(e => e.id === id);
    return item ? { x: item.x, y: item.y } : { x: 50, y: 50 };
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white">Evidence Link Map</h3>
            <p className="text-sm text-slate-400">Document relationships</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />Add Link
        </Button>
      </div>

      {/* Map container */}
      <div className="relative rounded-xl border border-white/10 bg-navy-900/50 overflow-hidden" style={{ height: 400 }}>
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {links.map((link, idx) => {
            const from = getPosition(link.from);
            const to = getPosition(link.to);
            const isHighlighted = selectedId === link.from || selectedId === link.to;

            return (
              <g key={idx}>
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={isHighlighted ? '#06b6d4' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={link.type === 'references' ? '4 2' : undefined}
                />
              </g>
            );
          })}
        </svg>

        {/* Evidence nodes */}
        {evidence.map((item) => {
          const isSelected = selectedId === item.id;
          const isConnected = links.some(l => (l.from === item.id || l.to === item.id) && (l.from === selectedId || l.to === selectedId));

          return (
            <motion.div
              key={item.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              onClick={() => { setSelectedId(item.id); onItemClick?.(item); }}
              className={cn(
                'absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-lg cursor-pointer transition-all',
                'border bg-navy-800',
                isSelected ? 'border-cyan-500 shadow-lg shadow-cyan-500/30' : isConnected ? 'border-cyan-500/50' : 'border-white/10'
              )}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <div className="flex items-center gap-2">
                <div className={cn('h-3 w-3 rounded-full', typeColors[item.type])} />
                <span className="text-sm font-medium text-white whitespace-nowrap">{item.title}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected item details */}
      {selectedId && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
          {(() => {
            const item = evidence.find(e => e.id === selectedId);
            if (!item) return null;
            const linkedItems = links.filter(l => l.from === selectedId || l.to === selectedId);

            return (
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="capitalize">{item.type}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Link className="h-3 w-3" />{linkedItems.length} connections
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-400">{tag}</span>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => onItemClick?.(item)}>
                  Open <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex gap-6 text-xs justify-center">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={cn('h-3 w-3 rounded-full', color)} />
            <span className="text-slate-400 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default EvidenceLinkMap;
