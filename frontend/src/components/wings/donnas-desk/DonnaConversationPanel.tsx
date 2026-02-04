'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Mic, Sparkles, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DonnaChatMessage } from '@/types/wings/donnas-desk';

interface DonnaConversationPanelProps {
  messages?: DonnaChatMessage[];
  onSendMessage?: (message: string) => void;
  className?: string;
}

const mockMessages: DonnaChatMessage[] = [
  { id: '1', role: 'assistant', content: "Good morning! I've already completed your morning briefing prep. Three things need your attention today: Goldman margin is at 82%, the Q4 settlement is due in 48 hours, and you have a strategy call at 2 PM.", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: '2', role: 'user', content: "What's the status on the Goldman situation?", timestamp: new Date(Date.now() - 240000).toISOString() },
  { id: '3', role: 'assistant', content: "I've been monitoring it closely. Margin increased 3% overnight due to AAPL volatility. I've already drafted three mitigation options and notified Harvey. Want me to walk you through them?", timestamp: new Date(Date.now() - 180000).toISOString() },
];

export const DonnaConversationPanel = React.memo(function DonnaConversationPanel({ messages = mockMessages, onSendMessage, className }: DonnaConversationPanelProps) {
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage?.(input);
    setInput('');
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className={cn('flex flex-col h-[600px]', className)}>
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-navy-900 bg-emerald-500" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Donna Paulsen AI</h3>
          <p className="text-sm text-emerald-400">Always one step ahead</p>
        </div>
        <Sparkles className="ml-auto h-5 w-5 text-rose-400 animate-pulse" />
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
              'max-w-[80%] rounded-2xl p-4',
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-white/10 text-white rounded-bl-none'
            )}>
              <p className="text-sm">{msg.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'assistant' && (
                  <div className="flex gap-2">
                    <button className="opacity-60 hover:opacity-100"><ThumbsUp className="h-3 w-3" /></button>
                    <button className="opacity-60 hover:opacity-100"><ThumbsDown className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-slate-400">
              <div className="flex gap-1">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="h-2 w-2 rounded-full bg-rose-400" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-2 w-2 rounded-full bg-rose-400" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-2 w-2 rounded-full bg-rose-400" />
              </div>
              <span className="text-sm">Donna is typing...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Donna anything..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-rose-500/50 focus:outline-none"
          />
          <Button size="icon" variant="outline" className="h-12 w-12">
            <Mic className="h-5 w-5" />
          </Button>
          <Button onClick={handleSend} className="h-12 bg-rose-500 hover:bg-rose-600">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DonnaConversationPanel;
