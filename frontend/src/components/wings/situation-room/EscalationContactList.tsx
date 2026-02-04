'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Mail, MessageSquare, Video, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { EscalationContact } from '@/types/wings/situation-room';

interface EscalationContactListProps {
  contacts?: EscalationContact[];
  onContact?: (contact: EscalationContact, method: string) => void;
  className?: string;
}

const mockContacts: EscalationContact[] = [
  { id: '1', name: 'Sarah Johnson', role: 'Chief Risk Officer', level: 1, availability: 'available', phone: '+1-555-0101', email: 's.johnson@firm.com' },
  { id: '2', name: 'Michael Chen', role: 'Head of Trading', level: 1, availability: 'busy', phone: '+1-555-0102', email: 'm.chen@firm.com' },
  { id: '3', name: 'Emily Williams', role: 'Compliance Director', level: 2, availability: 'available', phone: '+1-555-0103', email: 'e.williams@firm.com' },
  { id: '4', name: 'Robert Martinez', role: 'CEO', level: 3, availability: 'away', phone: '+1-555-0104', email: 'r.martinez@firm.com' },
];

const availabilityConfig = {
  available: { color: 'bg-emerald-500', label: 'Available' },
  busy: { color: 'bg-amber-500', label: 'Busy' },
  away: { color: 'bg-slate-500', label: 'Away' },
  dnd: { color: 'bg-red-500', label: 'Do Not Disturb' },
};

export const EscalationContactList = React.memo(function EscalationContactList({ contacts = mockContacts, onContact, className }: EscalationContactListProps) {
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);
  const levels = [...new Set(contacts.map(c => c.level))].sort();
  const filtered = selectedLevel ? contacts.filter(c => c.level === selectedLevel) : contacts;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-semibold text-white">Escalation Contacts</h3>
            <p className="text-sm text-slate-400">Emergency response team</p>
          </div>
        </div>
      </div>

      {/* Level filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedLevel(null)}
          className={cn(
            'rounded-full px-4 py-1 text-sm transition-colors',
            selectedLevel === null ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
          )}
        >
          All
        </button>
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={cn(
              'rounded-full px-4 py-1 text-sm transition-colors',
              selectedLevel === level ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            )}
          >
            Level {level}
          </button>
        ))}
      </div>

      {/* Contact list */}
      <div className="space-y-2">
        {filtered.map((contact, idx) => {
          const availability = availabilityConfig[contact.availability];

          return (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-white/10 bg-navy-900/50 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-lg font-bold text-purple-400">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={cn('absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-navy-900', availability.color)} title={availability.label} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{contact.name}</h4>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-400">L{contact.level}</span>
                    </div>
                    <p className="text-sm text-slate-400">{contact.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => onContact?.(contact, 'phone')} title="Call">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => onContact?.(contact, 'email')} title="Email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => onContact?.(contact, 'message')} title="Message">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => onContact?.(contact, 'video')} title="Video Call" disabled={contact.availability === 'away'}>
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default EscalationContactList;
