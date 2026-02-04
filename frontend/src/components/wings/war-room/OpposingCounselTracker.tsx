'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Briefcase, MessageSquare, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { OpposingParty } from '@/types/wings/war-room';

interface OpposingCounselTrackerProps {
  parties?: OpposingParty[];
  onViewProfile?: (party: OpposingParty) => void;
  className?: string;
}

const mockParties: OpposingParty[] = [
  { id: '1', name: 'Sullivan & Cromwell', leadCounsel: 'James Morrison', reputation: 92, tactics: ['Aggressive Discovery', 'Expert Witnesses'], strengths: ['M&A Expertise', 'SEC Experience'], weaknesses: ['Slow Motion Practice'], recentCases: 12 },
  { id: '2', name: 'Davis Polk', leadCounsel: 'Sarah Chen', reputation: 88, tactics: ['Mediation Push', 'Document Deluge'], strengths: ['Regulatory Defense'], weaknesses: ['Limited Trial Experience'], recentCases: 8 },
];

const getTacticIcon = (tactic: string) => {
  if (tactic.includes('Aggress')) return Zap;
  if (tactic.includes('Expert')) return Users;
  if (tactic.includes('Document')) return Briefcase;
  return Shield;
};

export const OpposingCounselTracker = React.memo(function OpposingCounselTracker({ parties = mockParties, onViewProfile, className }: OpposingCounselTrackerProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-red-400" />
          <div>
            <h3 className="font-semibold text-white">Opposing Counsel</h3>
            <p className="text-sm text-slate-400">Intelligence profiles</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {parties.map((party, idx) => (
          <motion.div
            key={party.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/20">
                    <Crown className="h-7 w-7 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{party.name}</h4>
                    <p className="text-sm text-slate-400">Lead: {party.leadCounsel}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500">Reputation:</span>
                        <span className={cn('text-sm font-bold', party.reputation >= 90 ? 'text-red-400' : 'text-amber-400')}>
                          {party.reputation}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500">Recent Cases:</span>
                        <span className="text-sm font-medium text-white">{party.recentCases}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setExpanded(expanded === party.id ? null : party.id)}>
                  {expanded === party.id ? 'Less' : 'Intel'}
                </Button>
              </div>

              {/* Known tactics */}
              <div className="mt-4">
                <span className="text-xs text-slate-500 mb-2 block">Known Tactics:</span>
                <div className="flex flex-wrap gap-2">
                  {party.tactics.map(tactic => {
                    const TacticIcon = getTacticIcon(tactic);
                    return (
                      <div key={tactic} className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1">
                        <TacticIcon className="h-3 w-3 text-red-400" />
                        <span className="text-xs text-red-300">{tactic}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Expanded intel */}
            {expanded === party.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-red-500/20 bg-red-500/5 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 mb-2 block">Strengths:</span>
                    <div className="space-y-1">
                      {party.strengths.map(s => (
                        <div key={s} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-slate-300">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 mb-2 block">Weaknesses:</span>
                    <div className="space-y-1">
                      {party.weaknesses.map(w => (
                        <div key={w} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span className="text-slate-300">{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => onViewProfile?.(party)}>
                  View Full Profile
                </Button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default OpposingCounselTracker;
