// ============================================
// DONNA'S DESK PAGE
// Wing 7: AI Persona (Features 61-70)
// ============================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { WINGS } from '@/config/wings';
import { QUOTES, getTimeBasedGreeting } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PersonaAvatar, PersonaCard } from '@/components/shared/PersonaAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Stores
import { useGamificationStore } from '@/store/gamification.store';
// import { useAuthStore } from '@/store/authStore';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface ChatMessage {
  id: string;
  role: 'user' | 'donna' | 'system';
  content: string;
  timestamp: string;
  xpReward?: number;
  actions?: Array<{
    label: string;
    action: string;
    icon?: string;
  }>;
}

interface ProactiveNudge {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  action?: { label: string; path: string };
  timestamp: string;
}

// ============================================
// MOCK DATA
// ============================================

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'donna',
    content: getTimeBasedGreeting('donna'),
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm2',
    role: 'donna',
    content: 'I\'ve been reviewing your positions and noticed a few things you might want to address.',
    timestamp: new Date().toISOString(),
    actions: [
      { label: 'Review Positions', action: 'navigate:/app/wings/bullpen', icon: '📊' },
      { label: 'View Forecasts', action: 'navigate:/app/wings/treasury', icon: '📈' },
    ],
  },
];

const MOCK_NUDGES: ProactiveNudge[] = [
  {
    id: 'n1',
    title: 'Margin Check Due',
    message: 'Your margin requirements should be reviewed - market volatility has increased 15%.',
    priority: 'high',
    action: { label: 'Review Now', path: '/app/wings/treasury' },
    timestamp: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'CSV Upload Reminder',
    message: 'You haven\'t uploaded position data in 3 days. Would you like to do that now?',
    priority: 'medium',
    action: { label: 'Upload', path: '/app/wings/bullpen?action=upload' },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Achievement Almost Unlocked',
    message: 'You\'re 50 XP away from "The Closer" achievement!',
    priority: 'low',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

// ============================================
// DONNA RESPONSES
// ============================================

const DONNA_RESPONSES: Record<string, string[]> = {
  forecast: [
    'Based on the patterns I\'ve observed, your P50 forecast for tomorrow is looking strong. Confidence is at 87%.',
    'I\'ve already pulled up the forecast data. The quantile range is tightening, which usually means higher accuracy.',
  ],
  positions: [
    'Your current positions are well-diversified. However, I noticed your AAPL allocation is slightly above the recommended threshold.',
    'I\'ve flagged 3 positions that might need rebalancing. Want me to show you the details?',
  ],
  help: [
    'Of course! I\'m here to help. What specific area would you like assistance with?',
    'I knew you were going to ask that. Here\'s what I recommend...',
  ],
  strategy: [
    'Let me connect you with Harvey for strategy questions. He handles the high-stakes decisions.',
    'For strategic planning, I recommend visiting Harvey\'s Office. I\'ll prepare a brief for him.',
  ],
  default: [
    'Interesting question. Let me look into that for you.',
    'I\'m already on it. Give me a moment to pull up the relevant data.',
    'Consider it done. Here\'s what I found...',
  ],
};

function getDonnaResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (message.includes('forecast') || message.includes('predict')) {
    return DONNA_RESPONSES.forecast[Math.floor(Math.random() * DONNA_RESPONSES.forecast.length)];
  }
  if (message.includes('position') || message.includes('portfolio')) {
    return DONNA_RESPONSES.positions[Math.floor(Math.random() * DONNA_RESPONSES.positions.length)];
  }
  if (message.includes('help') || message.includes('assist')) {
    return DONNA_RESPONSES.help[Math.floor(Math.random() * DONNA_RESPONSES.help.length)];
  }
  if (message.includes('strategy') || message.includes('harvey')) {
    return DONNA_RESPONSES.strategy[Math.floor(Math.random() * DONNA_RESPONSES.strategy.length)];
  }

  return DONNA_RESPONSES.default[Math.floor(Math.random() * DONNA_RESPONSES.default.length)];
}

// ============================================
// CHAT MESSAGE COMPONENT
// ============================================

interface ChatMessageProps {
  message: ChatMessage;
  onAction?: (action: string) => void;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, onAction }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex gap-3 mb-4',
      isUser && 'flex-row-reverse'
    )}>
      {/* Avatar */}
      {!isUser && (
        <PersonaAvatar
          persona="donna"
          size="sm"
          state="idle"
        />
      )}

      {/* Message Bubble */}
      <div className={cn(
        'max-w-[80%]',
        isUser && 'text-right'
      )}>
        <div className={cn(
          'inline-block px-4 py-2.5 rounded-2xl text-sm',
          isUser
            ? 'bg-precision-teal text-rich-black rounded-tr-sm'
            : 'bg-glass-white text-off-white rounded-tl-sm'
        )}>
          {message.content}
        </div>

        {/* Actions */}
        {message.actions && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.actions.map((action, i) => (
              <button
                key={i}
                onClick={() => onAction?.(action.action)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-precision-teal/20 text-precision-teal rounded-full text-xs font-medium hover:bg-precision-teal/30 transition-colors"
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-[10px] text-muted mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// ============================================
// DONNA CHAT INTERFACE
// ============================================

const DonnaChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addXP } = useGamificationStore();
  const { playSound } = useSoundEffects();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    playSound('click');

    // Simulate typing
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
    setIsTyping(false);

    // Get Donna's response
    const donnaResponse: ChatMessage = {
      id: `donna_${Date.now()}`,
      role: 'donna',
      content: getDonnaResponse(input),
      timestamp: new Date().toISOString(),
      xpReward: 15,
    };

    setMessages((prev) => [...prev, donnaResponse]);
    playSound('success_chord');
    addXP(15, 'donna_conversation', 'Chatted with Donna');
  }, [input, playSound, addXP]);

  const handleAction = useCallback((action: string) => {
    if (action.startsWith('navigate:')) {
      const path = action.replace('navigate:', '');
      window.location.href = path;
    }
  }, []);

  return (
    <GlassPanel variant="default" padding="none" className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-glass-border flex items-center gap-3">
        <PersonaAvatar persona="donna" size="lg" state={isTyping ? 'thinking' : 'idle'} />
        <div>
          <h3 className="font-semibold text-off-white">Donna</h3>
          <p className="text-xs text-precision-teal">
            {isTyping ? 'Typing...' : 'Online • AI Coordinator'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatMessageComponent
            key={msg.id}
            message={msg}
            onAction={handleAction}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <PersonaAvatar persona="donna" size="sm" state="thinking" />
            <div className="bg-glass-white px-4 py-2 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-glass-border">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Donna anything..."
            className="flex-1 px-4 py-2 bg-glass-white border border-glass-border rounded-xl text-off-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-precision-teal"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            Send
          </Button>
        </div>
        <p className="text-xs text-muted mt-2 text-center">
          +15 XP per conversation • Donna remembers context
        </p>
      </div>
    </GlassPanel>
  );
};

// ============================================
// PROACTIVE NUDGE RADAR
// ============================================

interface DonnaRadarProps {
  nudges: ProactiveNudge[];
  onDismiss?: (id: string) => void;
}

const DonnaRadarProactiveNudge: React.FC<DonnaRadarProps> = ({ nudges, onDismiss }) => {
  const { playSound } = useSoundEffects();

  const getPriorityColor = (priority: ProactiveNudge['priority']) => {
    switch (priority) {
      case 'high': return 'border-crisis-red';
      case 'medium': return 'border-achievement-gold';
      default: return 'border-precision-teal';
    }
  };

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📡</span>
          <h3 className="font-semibold text-off-white">Donna's Radar</h3>
        </div>
        <Badge variant="default">{nudges.length} active</Badge>
      </div>

      <div className="space-y-3">
        {nudges.map((nudge) => (
          <div
            key={nudge.id}
            className={cn(
              'p-3 bg-glass-white rounded-lg border-l-4 transition-all hover:bg-glass-white/80',
              getPriorityColor(nudge.priority)
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-off-white">{nudge.title}</h4>
                <p className="text-xs text-muted mt-1">{nudge.message}</p>
              </div>
              <button
                onClick={() => {
                  playSound('click');
                  onDismiss?.(nudge.id);
                }}
                className="p-1 text-muted hover:text-off-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {nudge.action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = nudge.action!.path}
                className="mt-2"
              >
                {nudge.action.label} →
              </Button>
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// PERSONA SIGNED MESSAGES
// ============================================

const PersonaSignedMessages: React.FC = () => {
  const messages = [
    { text: QUOTES.DONNA.PROACTIVE, time: '2 hours ago' },
    { text: QUOTES.DONNA.ANTICIPATION, time: '5 hours ago' },
    { text: QUOTES.DONNA.ORGANIZATION, time: 'Yesterday' },
  ];

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💌</span>
        <h3 className="font-semibold text-off-white">Donna's Notes</h3>
      </div>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="p-3 bg-glass-white rounded-lg">
            <p className="text-sm text-off-white italic">"{msg.text}"</p>
            <div className="flex items-center gap-2 mt-2">
              <PersonaAvatar persona="donna" size="xs" />
              <span className="text-xs text-muted">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const DonnasDeskPage: React.FC = () => {
  const wing = WINGS['donnas-desk'];
  const [nudges, setNudges] = useState(MOCK_NUDGES);
  const { addXP } = useGamificationStore();

  useEffect(() => {
    addXP(10, 'page_view', 'Visited Donna\'s Desk');
  }, [addXP]);

  const handleDismissNudge = (id: string) => {
    setNudges((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{wing.icon}</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
              {wing.name}
            </h1>
            <Badge variant="premium">PREMIUM</Badge>
          </div>
          <p className="text-muted">
            {wing.description}. Your AI coordinator is always one step ahead.
          </p>
        </div>
      </div>

      {/* Donna's Welcome */}
      <div className="mb-8">
        <PersonaCard
          persona="donna"
          quote={QUOTES.DONNA.WELCOME}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <DonnaChatInterface />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DonnaRadarProactiveNudge nudges={nudges} onDismiss={handleDismissNudge} />
          <PersonaSignedMessages />
        </div>
      </div>
    </div>
  );
};

export default DonnasDeskPage;
