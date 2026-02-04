'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Volume2, Briefcase, TrendingUp, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { HarveyMessage } from '@/types/wings/harveys-office';

interface HarveyConsultationProps {
  messages?: HarveyMessage[];
  onAskHarvey?: (question: string) => void;
  className?: string;
}

const mockMessages: HarveyMessage[] = [
  { id: '1', role: 'harvey', content: "Winners don't make excuses when the margin is against them. They find ways to win. Let's analyze your Goldman position.", timestamp: new Date(Date.now() - 300000).toISOString(), mood: 'confident' },
  { id: '2', role: 'user', content: "What's your recommendation on the current margin situation?", timestamp: new Date(Date.now() - 240000).toISOString() },
  { id: '3', role: 'harvey', content: "I've seen tougher situations. Here's what we do: reduce AAPL by 15%, shift $200K to the credit line, and get ahead of the call before they make it. Never let them see you sweat.", timestamp: new Date(Date.now() - 180000).toISOString(), mood: 'strategic', actionItems: ['Reduce AAPL 15%', 'Shift $200K to credit', 'Preemptive broker call'] },
];

const harveyQuotes = [
  "I don't play the odds. I play the man.",
  "When you're backed against the wall, break the goddamn thing down.",
  "Win a no-win situation by rewriting the rules.",
];

export const HarveyConsultation = React.memo(function HarveyConsultation({ messages = mockMessages, onAskHarvey, className }: HarveyConsultationProps) {
  const [input, setInput] = React.useState('');
  const [randomQuote] = React.useState(() => harveyQuotes[Math.floor(Math.random() * harveyQuotes.length)]);

  const handleSend = () => {
    if (!input.trim()) return;
    onAskHarvey?.(input);
    setInput('');
  };

  return (
    <div className={cn('flex flex-col h-[600px]', className)}>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-gradient-to-r from-slate-900 to-navy-900">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-amber-500/30">
            <Briefcase className="h-7 w-7 text-amber-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-navy-900 bg-emerald-500 flex items-center justify-center">
            <Volume2 className="h-3 w-3 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Harvey Specter AI</h3>
          <p className="text-sm text-amber-400 italic">"{randomQuote}"</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div className={cn(
              'max-w-[85%] rounded-2xl p-4',
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/20 text-white rounded-bl-none'
            )}>
              {msg.role === 'harvey' && (
                <Quote className="h-4 w-4 text-amber-400 mb-2" />
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>

              {msg.actionItems && msg.actionItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-xs text-amber-400 uppercase tracking-wider">Action Items:</span>
                  <ul className="mt-2 space-y-1">
                    {msg.actionItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-3 w-3 text-amber-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <span className="text-xs opacity-60 mt-2 block">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Harvey for strategic advice..."
            className="flex-1 rounded-xl border border-amber-500/20 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none"
          />
          <Button onClick={handleSend} className="h-12 bg-amber-500 hover:bg-amber-600 text-slate-900">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default HarveyConsultation;
