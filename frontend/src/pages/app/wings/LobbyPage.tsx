// ============================================
// LOBBY PAGE
// Wing 1: Onboarding & Discovery (Features 1-10)
// ============================================

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WINGS } from '@/config/wings';
import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { MetricCard } from '@/components/shared/MetricCard';
import { PersonaCard } from '@/components/shared/PersonaAvatar';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import { RankBadge } from '@/components/gamification/RankBadge';

// Lobby Components
import { IntentRecognitionModal, useIntentRecognition } from '@/components/wings/lobby/IntentRecognitionModal';
import { RegimeDetectionBadge, RegimeStatusCard } from '@/components/wings/lobby/RegimeDetectionBadge';

// Stores
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamification.store';
import { useCrisisStore } from '@/store/crisis.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// PAGE HEADER
// ============================================

const LobbyHeader: React.FC = () => {
  const { user } = useAuthStore();
  // const { rank } = useGamificationStore();
  // const { marketRegime } = useCrisisStore();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{WINGS.lobby.icon}</span>
          <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
            Welcome to the Firm
          </h1>
          <RegimeDetectionBadge size="sm" />
        </div>
        <p className="text-muted">
          Good{getTimeOfDay()}, <span className="text-off-white">{user?.firstName || 'Counselor'}</span>.
          Let's make today count.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <RankBadge size="lg" />
      </div>
    </div>
  );
};

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return ' morning';
  if (hour < 17) return ' afternoon';
  return ' evening';
}

// ============================================
// QUICK ACTIONS
// ============================================

interface QuickAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  path: string;
  color: string;
  xp: number;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'upload',
    icon: '📤',
    title: 'Upload Positions',
    description: 'Import CSV data for analysis',
    path: '/app/wings/bullpen?action=upload',
    color: 'bg-institutional-blue/20 border-institutional-blue/30',
    xp: 50,
  },
  {
    id: 'forecast',
    icon: '📊',
    title: 'View Forecasts',
    description: 'Daily liquidity predictions',
    path: '/app/wings/treasury',
    color: 'bg-spring-green/20 border-spring-green/30',
    xp: 25,
  },
  {
    id: 'crisis',
    icon: '🚨',
    title: 'Crisis Simulation',
    description: 'Test disaster scenarios',
    path: '/app/wings/situation-room',
    color: 'bg-crisis-red/20 border-crisis-red/30',
    xp: 75,
  },
  {
    id: 'donna',
    icon: '💅',
    title: 'Ask Donna',
    description: 'Get AI assistance',
    path: '/app/wings/donnas-desk',
    color: 'bg-precision-teal/20 border-precision-teal/30',
    xp: 15,
  },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();
  const { addXP } = useGamificationStore();

  const handleAction = useCallback((action: QuickAction) => {
    playSound('click');
    addXP(5, 'navigation', `Navigated to ${action.title}`);
    navigate(action.path);
  }, [navigate, playSound, addXP]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => handleAction(action)}
          className={cn(
            'group p-4 rounded-xl border text-left transition-all duration-200',
            'hover:scale-[1.02] active:scale-[0.98]',
            action.color
          )}
        >
          <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
            {action.icon}
          </span>
          <h3 className="font-semibold text-off-white mb-1">{action.title}</h3>
          <p className="text-xs text-muted">{action.description}</p>
          <span className="text-xs text-achievement-gold mt-2 block">+{action.xp} XP</span>
        </button>
      ))}
    </div>
  );
};

// ============================================
// PERSONA WELCOME
// ============================================

const PersonaWelcome: React.FC = () => {
  // const { rank } = useGamificationStore();
  const { marketRegime } = useCrisisStore();

  // Get context-appropriate quote
  const getQuote = () => {
    if (marketRegime === 'crisis') {
      return QUOTES.HARVEY.CRISIS_START;
    }
    if (marketRegime === 'volatile') {
      return QUOTES.HARVEY.HIGH_VOLATILITY;
    }
    return QUOTES.HARVEY.MOTIVATION;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PersonaCard
        persona="donna"
        quote={QUOTES.DONNA.PROACTIVE}
      />
      <PersonaCard
        persona="harvey"
        quote={getQuote()}
      />
    </div>
  );
};

// ============================================
// DASHBOARD METRICS
// ============================================

const DashboardMetrics: React.FC = () => {
  const { xp, achievements, loginStreak } = useGamificationStore();
  const { marketRegime, regimeConfidence } = useCrisisStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Total XP"
        value={xp.toLocaleString()}
        icon="⭐"
        change={12}
      />
      <MetricCard
        title="Achievements"
        value={achievements.length.toString()}
        icon="🏆"
        subtitle="of 15 available"
      />
      <MetricCard
        title="Login Streak"
        value={`${loginStreak} days`}
        icon="🔥"
        change={loginStreak > 7 ? 100 : loginStreak * 14}
      />
      <MetricCard
        title="Market Regime"
        value={marketRegime.charAt(0).toUpperCase() + marketRegime.slice(1)}
        icon={marketRegime === 'crisis' ? '🚨' : marketRegime === 'volatile' ? '⚡' : '🌤️'}
        subtitle={`${(regimeConfidence * 100).toFixed(0)}% confidence`}
      />
    </div>
  );
};

// ============================================
// WINGS OVERVIEW
// ============================================

const WingsOverview: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();

  const accessibleWings = [
    { ...WINGS.lobby, status: 'Current' },
    { ...WINGS.bullpen, status: 'Available' },
    { ...WINGS.library, status: 'Locked' },
    { ...WINGS.treasury, status: 'Locked' },
  ];

  return (
    <GlassPanel variant="default" padding="lg" className="mb-8">
      <h2 className="text-lg font-bold text-off-white mb-4">Your Wings</h2>

      <div className="space-y-3">
        {accessibleWings.map((wing) => (
          <button
            key={wing.id}
            onClick={() => {
              playSound('click');
              navigate(wing.path);
            }}
            disabled={wing.status === 'Locked'}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-lg transition-all text-left',
              wing.status === 'Locked'
                ? 'opacity-50 cursor-not-allowed bg-glass-white'
                : 'hover:bg-glass-white group'
            )}
          >
            <span className="text-2xl">{wing.icon}</span>
            <div className="flex-1">
              <h3 className="font-medium text-off-white">{wing.name}</h3>
              <p className="text-xs text-muted">{wing.description}</p>
            </div>
            <span className={cn(
              'text-xs px-2 py-1 rounded',
              wing.status === 'Current' && 'bg-precision-teal/20 text-precision-teal',
              wing.status === 'Available' && 'bg-spring-green/20 text-spring-green',
              wing.status === 'Locked' && 'bg-glass-border text-muted'
            )}>
              {wing.status}
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted text-center mt-4">
        Unlock wings by earning XP and advancing your rank
      </p>
    </GlassPanel>
  );
};

// ============================================
// XP PROGRESS SECTION
// ============================================

const XPProgressSection: React.FC = () => {
  return (
    <GlassPanel variant="default" padding="lg" className="mb-8">
      <h2 className="text-lg font-bold text-off-white mb-4">Your Progress</h2>
      <XPProgressBar showMilestone compact={false} />
    </GlassPanel>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

const LobbyPage: React.FC = () => {
  const intentRecognition = useIntentRecognition();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <LobbyHeader />

      {/* Quick Actions */}
      <QuickActions />

      {/* Persona Welcome */}
      <PersonaWelcome />

      {/* Dashboard Metrics */}
      <DashboardMetrics />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <XPProgressSection />
          <RegimeStatusCard showRecommendations />
        </div>

        {/* Sidebar */}
        <div>
          <WingsOverview />
        </div>
      </div>

      {/* Intent Recognition Modal */}
      <IntentRecognitionModal
        isOpen={intentRecognition.isOpen}
        onClose={intentRecognition.hideModal}
      />
    </div>
  );
};

export default LobbyPage;
