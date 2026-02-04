'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { LegalParalegalChatMessage } from '@/types/wings/bullpen';

interface LegalParalegalChatProps {
  messages?: LegalParalegalChatMessage[];
  onSendMessage?: (message: string) => void;
  className?: string;
}

const mockMessages: LegalParalegalChatMessage[] = [
  { id: '1', role: 'assistant', content: 'Good morning! I\'ve reviewed the latest position data. There are 3 items that need your attention.', timestamp: new Date(Date.now() - 3600000).toISOString(), persona: 'donna' },
  { id: '2', role: 'user', content: 'What are they?', timestamp: new Date(Date.now() - 3500000).toISOString() },
  { id: '3', role: 'assistant', content: '1. The Goldman Sachs margin is approaching 80%\n2. Two forecasts from yesterday exceeded P95 bounds\n3. Q4 compliance report is due this Friday', timestamp: new Date(Date.now() - 3400000).toISOString(), persona: 'donna' },
];

export const LegalParalegalChat = React.memo(function LegalParalegalChat({ messages = mockMessages, onSendMessage, className }: LegalParalegalChatProps) {
  const [input, setInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState(messages);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: LegalParalegalChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    onSendMessage?.(input);
    setInput('');

    // Simulate response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'ll look into that for you. Give me just a moment...',
        timestamp: new Date().toISOString(),
        persona: 'donna',
      }]);
    }, 1000);
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className={cn('flex flex-col h-[500px] rounded-xl border border-white/10 bg-navy-900/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-navy-800/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20">
          <Sparkles className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Donna</h3>
          <p className="text-xs text-slate-400">Your AI Paralegal Assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message, idx) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}
          >
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0',
              message.role === 'user' ? 'bg-blue-500/20' : 'bg-rose-500/20'
            )}>
              {message.role === 'user' ? <User className="h-4 w-4 text-blue-400" /> : <Bot className="h-4 w-4 text-rose-400" />}
            </div>
            <div className={cn(
              'max-w-[70%] rounded-lg p-3',
              message.role === 'user' ? 'bg-blue-500/20' : 'bg-white/5'
            )}>
              <p className="text-sm text-white whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs text-slate-500 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
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
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-rose-500/50 focus:outline-none"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default LegalParalegalChat;
