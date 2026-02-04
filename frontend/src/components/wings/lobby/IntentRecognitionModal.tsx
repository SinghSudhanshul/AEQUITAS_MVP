// ============================================
// INTENT RECOGNITION MODAL
// Feature 1: Onboarding Intent Capture
// ============================================

import * as React from 'react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { GlassPanel, GlassOverlay } from '@/components/shared/GlassPanel';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { Button } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';
import { useGamificationStore } from '@/store/gamification.store';
import { QUOTES } from '@/config/narrative';

// ============================================
// TYPES
// ============================================

export interface IntentOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  targetWing: string;
  targetPath: string;
  xpReward: number;
  features: string[];
}

export interface IntentRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (intentId: string) => void;
  className?: string;
}

// ============================================
// INTENT OPTIONS
// ============================================

const INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'forecast',
    icon: '📊',
    title: 'Get Liquidity Forecasts',
    description: 'Daily, weekly, and monthly cash flow predictions with ML accuracy',
    targetWing: 'treasury',
    targetPath: '/app/wings/treasury',
    xpReward: 50,
    features: ['P5/P50/P95 quantile ranges', 'Historical accuracy metrics', 'Regime detection'],
  },
  {
    id: 'upload',
    icon: '📤',
    title: 'Upload Position Data',
    description: 'Import CSV files with your current positions for analysis',
    targetWing: 'bullpen',
    targetPath: '/app/wings/bullpen?action=upload',
    xpReward: 75,
    features: ['Auto-detection of columns', 'Validation & cleanup', 'Historical tracking'],
  },
  {
    id: 'crisis',
    icon: '🚨',
    title: 'Run Crisis Simulation',
    description: 'Test your portfolio against disaster scenarios',
    targetWing: 'situation-room',
    targetPath: '/app/wings/situation-room',
    xpReward: 100,
    features: ['Monte Carlo simulations', 'Stress testing', 'Recovery planning'],
  },
  {
    id: 'strategy',
    icon: '👔',
    title: 'Build Trading Strategy',
    description: 'Create and backtest execution strategies with Harvey',
    targetWing: 'harveys-office',
    targetPath: '/app/wings/harveys-office',
    xpReward: 100,
    features: ['Canvas builder', 'Risk tolerance tuning', 'Historical performance'],
  },
  {
    id: 'explore',
    icon: '🔍',
    title: 'Just Exploring',
    description: 'Take a tour of the platform with Donna as your guide',
    targetWing: 'lobby',
    targetPath: '/app/wings/lobby',
    xpReward: 25,
    features: ['Interactive tour', 'Feature overview', 'Quick start guide'],
  },
];

// ============================================
// INTENT CARD
// ============================================

interface IntentCardProps {
  intent: IntentOption;
  isSelected: boolean;
  onSelect: () => void;
}

const IntentCard: React.FC<IntentCardProps> = ({ intent, isSelected, onSelect }) => {
  const { playSound } = useSoundEffects();

  const handleClick = useCallback(() => {
    playSound('click');
    onSelect();
  }, [playSound, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'text-left w-full p-4 rounded-xl border transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        isSelected
          ? 'bg-precision-teal/20 border-precision-teal/50 shadow-lg shadow-precision-teal/10'
          : 'bg-glass-white border-glass-border hover:border-precision-teal/30'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0',
          isSelected ? 'bg-precision-teal/30' : 'bg-glass-white'
        )}>
          {intent.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={cn(
              'font-semibold',
              isSelected ? 'text-precision-teal' : 'text-off-white'
            )}>
              {intent.title}
            </h3>
            <span className="text-xs text-achievement-gold font-medium">
              +{intent.xpReward} XP
            </span>
          </div>
          <p className="text-sm text-muted mb-3">
            {intent.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5">
            {intent.features.map((feature, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-glass-white text-muted"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Selection Indicator */}
        <div className={cn(
          'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center',
          isSelected
            ? 'border-precision-teal bg-precision-teal'
            : 'border-glass-border'
        )}>
          {isSelected && (
            <svg className="w-3 h-3 text-rich-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

// ============================================
// DONNA WELCOME
// ============================================

const DonnaWelcome: React.FC = () => (
  <div className="flex items-start gap-4 mb-6">
    <PersonaAvatar persona="donna" size="lg" state="speaking" />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-precision-teal font-semibold">Donna</span>
        <span className="text-xs text-muted">is here to help</span>
      </div>
      <p className="text-off-white text-sm">
        "{QUOTES.DONNA.PROACTIVE}"
      </p>
      <p className="text-muted text-sm mt-2">
        What brings you to Aequitas today? Select your primary goal and I'll make sure
        you get there efficiently.
      </p>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const IntentRecognitionModal: React.FC<IntentRecognitionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  className,
}) => {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();
  const { addXP } = useGamificationStore();

  const handleContinue = useCallback(async () => {
    if (!selectedIntent) return;

    const intent = INTENT_OPTIONS.find((i) => i.id === selectedIntent);
    if (!intent) return;

    setIsSubmitting(true);
    playSound('success_chord');

    // Award XP
    addXP(intent.xpReward, 'intent_selection');

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Callback
    onComplete?.(selectedIntent);

    // Navigate to target
    navigate(intent.targetPath);
    onClose();
  }, [selectedIntent, navigate, onClose, onComplete, playSound, addXP]);

  const handleSkip = useCallback(() => {
    playSound('click');
    onComplete?.('skip');
    onClose();
  }, [onClose, onComplete, playSound]);

  if (!isOpen) return null;

  return (
    <GlassOverlay visible={isOpen} onClose={onClose}>
      <GlassPanel
        variant="heavy"
        padding="lg"
        className={cn(
          'w-full max-w-2xl max-h-[90vh] overflow-y-auto',
          'animate-in fade-in zoom-in-95 duration-300',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-off-white">
              Welcome to Aequitas
            </h2>
            <p className="text-sm text-muted mt-1">
              Let's get you started on the right path
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 rounded-lg text-muted hover:text-off-white hover:bg-glass-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Donna Welcome */}
        <DonnaWelcome />

        {/* Intent Options */}
        <div className="space-y-3 mb-6">
          {INTENT_OPTIONS.map((intent) => (
            <IntentCard
              key={intent.id}
              intent={intent}
              isSelected={selectedIntent === intent.id}
              onSelect={() => setSelectedIntent(intent.id)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-glass-border">
          <button
            onClick={handleSkip}
            className="text-sm text-muted hover:text-off-white transition-colors"
          >
            Skip for now
          </button>

          <Button
            variant="default"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedIntent || isSubmitting}
            loading={isSubmitting}
            loadingText="Setting up..."
          >
            Continue →
          </Button>
        </div>

        {/* XP Hint */}
        <p className="text-center text-xs text-muted mt-4">
          🎮 Selecting an intent earns you XP towards your next rank
        </p>
      </GlassPanel>
    </GlassOverlay>
  );
};

// ============================================
// INTENT RECOGNITION HOOK
// ============================================

export function useIntentRecognition(): {
  showModal: () => void;
  hideModal: () => void;
  isOpen: boolean;
  selectedIntent: string | null;
} {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIntent] = useState<string | null>(null);

  // Check if user has seen intent modal
  React.useEffect(() => {
    const hasSeenIntent = localStorage.getItem('aequitas-intent-seen');
    if (!hasSeenIntent) {
      // Show modal on first visit
      setIsOpen(true);
    }
  }, []);

  const showModal = useCallback(() => setIsOpen(true), []);
  const hideModal = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('aequitas-intent-seen', 'true');
  }, []);

  return {
    showModal,
    hideModal,
    isOpen,
    selectedIntent,
  };
}

// ============================================
// EXPORTS
// ============================================

export default IntentRecognitionModal;
