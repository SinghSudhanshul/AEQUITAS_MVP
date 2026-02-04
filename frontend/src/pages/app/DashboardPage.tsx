// ============================================
// DASHBOARD PAGE
// Main Application Dashboard
// ============================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WINGS, WING_ORDER, isWingUnlocked } from '@/config/wings';
import { QUOTES, getTimeBasedGreeting } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { MetricCard } from '@/components/shared/MetricCard';
import { PersonaCard } from '@/components/shared/PersonaAvatar';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import { RankBadge } from '@/components/gamification/RankBadge';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';
import { RegimeDetectionBadge, RegimeStatusCard } from '@/components/wings/lobby/RegimeDetectionBadge';
// import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Stores
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamification.store';
import { useCrisisStore } from '@/store/crisis.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface QuickStatCard {
  id: string;
  label: string;
  value: string;
  icon: string;
  change?: number;
}

// ============================================
// PAGE HEADER
// ============================================

const DashboardHeader: React.FC = () => {
  const { user } = useAuthStore();
  const { xp } = useGamificationStore();
  // const { marketRegime } = useCrisisStore();

  const firstName = user?.firstName || 'Counselor';
  const greeting = getTimeBasedGreeting('harvey');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
            Welcome, {firstName}
          </h1>
          <RegimeDetectionBadge size="sm" />
        </div>
        <p className="text-muted max-w-xl">
          {greeting}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <RankBadge size="lg" />
        <div className="hidden lg:block h-10 w-px bg-glass-border" />
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-off-white font-bold">{xp.toLocaleString()} XP</span>
          <span className="text-xs text-muted">Total earned</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// QUICK STATS
// ============================================

const QuickStats: React.FC = () => {
  const { marketRegime, volatilityIndex } = useCrisisStore();
  const { loginStreak } = useGamificationStore();

  const stats: QuickStatCard[] = [
    {
      id: 'liquidity',
      label: 'Available Liquidity',
      value: '$15.2M',
      icon: '💰',
      change: 4.2,
    },
    {
      id: 'pnl',
      label: "Today's P&L",
      value: '+$287K',
      icon: '📈',
      change: 2.1,
    },
    {
      id: 'volatility',
      label: 'Volatility Index',
      value: volatilityIndex.toFixed(1),
      icon: marketRegime === 'crisis' ? '🔥' : '⚡',
      change: -8.5,
    },
    {
      id: 'streak',
      label: 'Login Streak',
      value: `${loginStreak} days`,
      icon: '🔥',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <MetricCard
          key={stat.id}
          title={stat.label}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
        />
      ))}
    </div>
  );
};

// ============================================
// WINGS GRID
// ============================================

const WingsGrid: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();
  const { rank } = useGamificationStore();
  const { subscriptionTier } = useAuthStore();

  const handleWingClick = (wing: typeof WINGS[keyof typeof WINGS]) => {
    playSound('click');
    navigate(wing.path);
  };

  return (
    <GlassPanel variant="default" padding="lg" className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-off-white">Your Wings</h2>
        <span className="text-xs text-muted">{WING_ORDER.length} total</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {WING_ORDER.map((wingId) => {
          const wing = WINGS[wingId];
          const isUnlocked = isWingUnlocked(wingId, rank, subscriptionTier || 'free');

          return (
            <button
              key={wingId}
              onClick={() => isUnlocked && handleWingClick(wing)}
              disabled={!isUnlocked}
              className={cn(
                'group p-4 rounded-xl text-left transition-all border',
                isUnlocked
                  ? 'bg-glass-white border-glass-border hover:border-precision-teal/50 hover:bg-precision-teal/5'
                  : 'bg-rich-black/30 border-glass-border/50 opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{wing.icon}</span>
                <div className="flex-1">
                  <h3 className={cn(
                    'font-semibold text-sm',
                    isUnlocked ? 'text-off-white' : 'text-muted'
                  )}>
                    {wing.name}
                  </h3>
                </div>
                {!isUnlocked && (
                  <span className="text-sm">🔒</span>
                )}
              </div>
              <p className="text-xs text-muted line-clamp-2">
                {wing.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant={wing.tier === 'enterprise' ? 'premium' : wing.tier === 'premium' ? 'warning' : 'default'}>
                  {wing.tier.toUpperCase()}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
};

// ============================================
// PROGRESS SECTION
// ============================================

const ProgressSection: React.FC = () => {
  const { achievements } = useGamificationStore();
  const recentAchievements = achievements.slice(-3);

  return (
    <GlassPanel variant="default" padding="lg" className="mb-8">
      <h2 className="text-lg font-bold text-off-white mb-4">Your Progress</h2>

      {/* XP Progress */}
      <div className="mb-6">
        <XPProgressBar showMilestone compact={false} />
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Recent Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {recentAchievements.map((achievementId) => (
              <AchievementBadge
                key={achievementId}
                achievementId={achievementId as any}
                size="sm"
                showTooltip
              />
            ))}
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

// ============================================
// PERSONA SECTION
// ============================================

const PersonaSection: React.FC = () => {
  const { marketRegime } = useCrisisStore();

  const getHarveyQuote = () => {
    if (marketRegime === 'crisis') return QUOTES.HARVEY.CRISIS_START;
    if (marketRegime === 'volatile') return QUOTES.HARVEY.HIGH_VOLATILITY;
    return QUOTES.HARVEY.MOTIVATION;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PersonaCard
        persona="harvey"
        quote={getHarveyQuote()}
      />
      <PersonaCard
        persona="donna"
        quote={QUOTES.DONNA.PROACTIVE}
      />
    </div>
  );
};

// ============================================
// ACTIVITY FEED
// ============================================

interface Activity {
  id: string;
  type: 'xp' | 'achievement' | 'alert' | 'action';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

const ActivityFeed: React.FC = () => {
  const { xpHistory } = useGamificationStore();

  // Convert XP history to activities
  const activities: Activity[] = xpHistory.slice(0, 5).map((entry) => ({
    id: entry.timestamp,
    type: 'xp',
    title: `+${entry.amount} XP`,
    description: entry.reason || 'Activity completed',
    timestamp: entry.timestamp,
    icon: '⭐',
  }));

  return (
    <GlassPanel variant="default" padding="lg">
      <h2 className="text-lg font-bold text-off-white mb-4">Recent Activity</h2>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 bg-glass-white rounded-lg"
            >
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-off-white">{activity.title}</p>
                <p className="text-xs text-muted">{activity.description}</p>
              </div>
              <span className="text-xs text-muted">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted">
          <span className="text-3xl block mb-2">📋</span>
          <p>No recent activity</p>
        </div>
      )}
    </GlassPanel>
  );
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now.getTime() - time.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

// ============================================
// MAIN PAGE
// ============================================

const DashboardPage: React.FC = () => {
  const { addXP, checkLoginStreak } = useGamificationStore();

  useEffect(() => {
    checkLoginStreak();
    addXP(5, 'page_view', 'Viewed Dashboard');
  }, [addXP, checkLoginStreak]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <DashboardHeader />

      {/* Quick Stats */}
      <QuickStats />

      {/* Persona Section */}
      <PersonaSection />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WingsGrid />
          <ProgressSection />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RegimeStatusCard showRecommendations />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
