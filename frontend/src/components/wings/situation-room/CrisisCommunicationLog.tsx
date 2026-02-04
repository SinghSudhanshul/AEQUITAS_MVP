'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, AlertTriangle, User, Bot, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CrisisLogEntry } from '@/types/wings/situation-room';

interface CrisisCommunicationLogProps {
  entries?: CrisisLogEntry[];
  onSendMessage?: (message: string) => void;
  className?: string;
}

const mockEntries: CrisisLogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 300000).toISOString(), type: 'system', message: 'CRISIS MODE ACTIVATED - Margin breach detected at Goldman Sachs', severity: 'critical' },
  { id: '2', timestamp: new Date(Date.now() - 240000).toISOString(), type: 'ai', message: 'Analyzing situation. Current margin at 92%. Recommending immediate position reduction of $300K.', sender: 'Harvey', severity: 'info' },
  { id: '3', timestamp: new Date(Date.now() - 180000).toISOString(), type: 'user', message: 'Approved. Initiating position reduction.', sender: 'John Smith', severity: 'info' },
  { id: '4', timestamp: new Date(Date.now() - 120000).toISOString(), type: 'action', message: 'Position reduction order submitted: AAPL -500 shares, MSFT -200 shares', severity: 'info' },
  { id: '5', timestamp: new Date(Date.now() - 60000).toISOString(), type: 'system', message: 'Margin reduced to 85%. Crisis mode maintained for monitoring.', severity: 'warning' },
];

const typeConfig = {
  system: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ai: { icon: Bot, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  user: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  action: { icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export const CrisisCommunicationLog = React.memo(function CrisisCommunicationLog({ entries = mockEntries, onSendMessage, className }: CrisisCommunicationLogProps) {
  const [message, setMessage] = React.useState('');
  const logRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage?.(message);
    setMessage('');
  };

  return (
    <div className={cn('flex flex-col h-[500px]', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
          <MessageSquare className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Crisis Communication Log</h3>
          <p className="text-sm text-slate-400">Real-time incident tracking</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400">LIVE</span>
        </div>
      </div>

      <div ref={logRef} className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-navy-900/50 p-4 space-y-3">
        {entries.map((entry, idx) => {
          const config = typeConfig[entry.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={cn('rounded-lg p-3', config.bg)}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.sender && (
                      <span className={cn('text-sm font-medium', config.color)}>{entry.sender}</span>
                    )}
                    <span className="text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    {entry.severity === 'critical' && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-200">{entry.message}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message or action..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-red-500/50 focus:outline-none"
        />
        <Button onClick={handleSend} className="bg-red-500 hover:bg-red-600">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

export default CrisisCommunicationLog;
