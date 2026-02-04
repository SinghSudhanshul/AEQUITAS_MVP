// ============================================
// PERSONA AVATAR COMPONENT
// Harvey & Donna Character System
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { PERSONAS, QUOTES } from '@/config/narrative';

// ============================================
// TYPES
// ============================================

export type PersonaType = 'harvey' | 'donna' | 'louis' | 'system';
export type PersonaState = 'idle' | 'speaking' | 'listening' | 'thinking' | 'alert';

// ============================================
// VARIANTS
// ============================================

const avatarVariants = cva(
  // Base styles
  [
    'relative inline-flex items-center justify-center',
    'rounded-full',
    'font-semibold',
    'transition-all duration-300',
    'overflow-hidden',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        default: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-24 h-24 text-3xl',
      },

      persona: {
        harvey: [
          'bg-gradient-to-br from-rich-black to-institutional-blue',
          'border-2 border-achievement-gold/50',
          'shadow-lg shadow-achievement-gold/10',
        ].join(' '),

        donna: [
          'bg-gradient-to-br from-precision-teal/20 to-precision-teal/5',
          'border-2 border-precision-teal/50',
          'shadow-lg shadow-precision-teal/10',
        ].join(' '),

        system: [
          'bg-glass-white',
          'border border-glass-border',
        ].join(' '),

        louis: [
          'bg-gradient-to-br from-institutional-blue/20 to-institutional-blue/5',
          'border-2 border-institutional-blue/50',
          'shadow-lg shadow-institutional-blue/10',
        ].join(' '),
      },

      state: {
        idle: '',
        speaking: 'ring-2 ring-offset-2 ring-offset-rich-black animate-pulse',
        listening: 'ring-2 ring-offset-2 ring-offset-rich-black ring-precision-teal',
        thinking: 'animate-spin-slow',
        alert: 'ring-2 ring-offset-2 ring-offset-rich-black ring-crisis-red animate-pulse',
      },
    },
    compoundVariants: [
      {
        persona: 'harvey',
        state: 'speaking',
        className: 'ring-achievement-gold',
      },
      {
        persona: 'donna',
        state: 'speaking',
        className: 'ring-precision-teal',
      },
    ],
    defaultVariants: {
      size: 'default',
      persona: 'system',
      state: 'idle',
    },
  }
);

// ============================================
// PERSONA AVATAR PROPS
// ============================================

export interface PersonaAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof avatarVariants> {
  /** Persona type */
  persona: PersonaType;
  /** Current state */
  state?: PersonaState;
  /** Show status dot */
  showStatus?: boolean;
  /** Interactive mode */
  interactive?: boolean;
  /** Show name tooltip */
  showTooltip?: boolean;
}

// ============================================
// STATUS DOT COMPONENT
// ============================================

interface StatusDotProps {
  state: PersonaState;
  persona: PersonaType;
}

const StatusDot: React.FC<StatusDotProps> = ({ state, persona }) => {
  const statusColors = {
    idle: 'bg-muted',
    speaking: persona === 'harvey' ? 'bg-achievement-gold' : 'bg-precision-teal',
    listening: 'bg-precision-teal',
    thinking: 'bg-achievement-gold animate-pulse',
    alert: 'bg-crisis-red animate-pulse',
  };

  return (
    <span
      className={cn(
        'absolute bottom-0 right-0',
        'w-3 h-3 rounded-full',
        'border-2 border-rich-black',
        statusColors[state]
      )}
    />
  );
};

// ============================================
// EMOJI/ICON FOR PERSONA
// ============================================

const PersonaIcon: React.FC<{ persona: PersonaType }> = ({ persona }) => {
  const icons = {
    harvey: '👔',
    donna: '💅',
    louis: '👓',
    system: '🤖',
  };

  return <span>{icons[persona]}</span>;
};

// ============================================
// COMPONENT
// ============================================

export const PersonaAvatar = React.forwardRef<HTMLDivElement, PersonaAvatarProps>(
  (
    {
      className,
      persona,
      size,
      state = 'idle',
      showStatus = true,
      interactive = false,
      showTooltip = false,
      ...props
    },
    ref
  ) => {
    const personaInfo = persona === 'harvey' ? PERSONAS.HARVEY :
      persona === 'donna' ? PERSONAS.DONNA : null;

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ size, persona, state }),
          interactive && 'cursor-pointer hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-offset-rich-black',
          interactive && persona === 'harvey' && 'hover:ring-achievement-gold',
          interactive && persona === 'donna' && 'hover:ring-precision-teal',
          className
        )}
        title={showTooltip && personaInfo ? `${personaInfo.name} - ${personaInfo.role}` : undefined}
        {...props}
      >
        <PersonaIcon persona={persona} />

        {showStatus && state !== 'idle' && (
          <StatusDot state={state} persona={persona} />
        )}
      </div>
    );
  }
);

PersonaAvatar.displayName = 'PersonaAvatar';

// ============================================
// PERSONA CARD COMPONENT
// ============================================

export interface PersonaCardProps {
  persona: PersonaType;
  state?: PersonaState;
  message?: string;
  quote?: string;
  showActions?: boolean;
  onDismiss?: () => void;
  onInteract?: () => void;
  className?: string;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  state = 'idle',
  message,
  quote,
  showActions = false,
  onDismiss,
  onInteract,
  className,
}) => {
  const personaInfo = persona === 'harvey' ? PERSONAS.HARVEY :
    persona === 'donna' ? PERSONAS.DONNA : null;

  if (!personaInfo) return null;

  const borderColor = persona === 'harvey'
    ? 'border-achievement-gold/30'
    : 'border-precision-teal/30';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-glass-white backdrop-blur-md',
        'rounded-xl border',
        borderColor,
        'p-4',
        'shadow-lg',
        'animate-in slide-in-from-right-2 duration-300',
        className
      )}
    >
      {/* Close Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-lg text-muted hover:text-off-white hover:bg-glass-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <PersonaAvatar
          persona={persona}
          state={state}
          size="lg"
          showStatus={true}
        />

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'font-semibold',
              persona === 'harvey' ? 'text-achievement-gold' : 'text-precision-teal'
            )}>
              {personaInfo.name}
            </span>
            <span className="text-xs text-muted">
              {personaInfo.role}
            </span>
          </div>

          {/* Message */}
          {message && (
            <p className="text-sm text-off-white mb-2">
              {message}
            </p>
          )}

          {/* Quote */}
          {quote && (
            <p className="text-xs italic text-muted border-l-2 border-glass-border pl-2">
              "{quote}"
            </p>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={onInteract}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                  persona === 'harvey'
                    ? 'bg-achievement-gold/20 text-achievement-gold hover:bg-achievement-gold/30'
                    : 'bg-precision-teal/20 text-precision-teal hover:bg-precision-teal/30'
                )}
              >
                {persona === 'harvey' ? 'Get Advice' : 'Ask Donna'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// PERSONA QUOTE COMPONENT
// ============================================

export interface PersonaQuoteProps {
  persona: PersonaType;
  quoteKey?: keyof typeof QUOTES.HARVEY | keyof typeof QUOTES.DONNA;
  customQuote?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const PersonaQuote: React.FC<PersonaQuoteProps> = ({
  persona,
  quoteKey,
  customQuote,
  size = 'default',
  className,
}) => {
  const getQuote = (): string => {
    if (customQuote) return customQuote;

    if (persona === 'harvey' && quoteKey && quoteKey in QUOTES.HARVEY) {
      return QUOTES.HARVEY[quoteKey as keyof typeof QUOTES.HARVEY];
    }

    if (persona === 'donna' && quoteKey && quoteKey in QUOTES.DONNA) {
      return QUOTES.DONNA[quoteKey as keyof typeof QUOTES.DONNA];
    }

    return '';
  };

  const quote = getQuote();
  if (!quote) return null;

  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <PersonaAvatar persona={persona} size="sm" />
      <blockquote className={cn(
        'italic text-muted',
        sizeClasses[size]
      )}>
        "{quote}"
      </blockquote>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export { avatarVariants };
export default PersonaAvatar;
