// ============================================
// GAMIFICATION CONFIG
// XP Thresholds, Ranks, Badges, Achievements
// ============================================

// ============================================
// RANK DEFINITIONS
// ============================================

export type RankId =
  | 'junior_associate'
  | 'associate'
  | 'senior_associate'
  | 'junior_partner'
  | 'partner'
  | 'senior_partner'
  | 'managing_partner'
  | 'name_partner';

export interface RankConfig {
  id: RankId;
  name: string;
  icon: string;
  minXP: number;
  maxXP: number;
  color: string;
  description: string;
  benefits: string[];
  unlocks: string[];
}

export const RANKS: Record<RankId, RankConfig> = {
  junior_associate: {
    id: 'junior_associate',
    name: 'Junior Associate',
    icon: '📋',
    minXP: 0,
    maxXP: 999,
    color: '#a8a29e',
    description: 'Starting your journey at the firm',
    benefits: [
      'Access to Lobby',
      'Basic forecasts',
      'Limited features',
    ],
    unlocks: ['lobby', 'basic_forecast'],
  },
  associate: {
    id: 'associate',
    name: 'Associate',
    icon: '💼',
    minXP: 1000,
    maxXP: 4999,
    color: '#94a3b8',
    description: 'Building your reputation',
    benefits: [
      'Access to Bullpen',
      'CSV uploads',
      'Evidence logging',
    ],
    unlocks: ['bullpen', 'csv_upload', 'evidence_log'],
  },
  senior_associate: {
    id: 'senior_associate',
    name: 'Senior Associate',
    icon: '⚖️',
    minXP: 5000,
    maxXP: 14999,
    color: '#3b82f6',
    description: 'Proving your worth',
    benefits: [
      'Access to Library',
      'ML analytics',
      'Quantile visualizers',
    ],
    unlocks: ['library', 'ml_analytics', 'quantile_viz'],
  },
  junior_partner: {
    id: 'junior_partner',
    name: 'Junior Partner',
    icon: '🏛️',
    minXP: 15000,
    maxXP: 34999,
    color: '#f59e0b',
    description: 'Entering the partnership',
    benefits: [
      'Access to Treasury',
      'Margin monitoring',
      'Peer benchmarks',
    ],
    unlocks: ['treasury', 'margin_monitor', 'benchmarks'],
  },
  partner: {
    id: 'partner',
    name: 'Partner',
    icon: '🎖️',
    minXP: 35000,
    maxXP: 74999,
    color: '#f59e0b',
    description: 'Respected partner',
    benefits: [
      'Access to Situation Room',
      'Crisis simulations',
      'Paranoia mode',
    ],
    unlocks: ['situation_room', 'crisis_sim', 'paranoia_mode'],
  },
  senior_partner: {
    id: 'senior_partner',
    name: 'Senior Partner',
    icon: '💎',
    minXP: 75000,
    maxXP: 149999,
    color: '#e5e7eb',
    description: 'Seasoned veteran',
    benefits: [
      'Access to War Room',
      'Donna AI assistant',
      'Advanced analytics',
    ],
    unlocks: ['war_room', 'donna_ai', 'advanced_analytics'],
  },
  managing_partner: {
    id: 'managing_partner',
    name: 'Managing Partner',
    icon: '👑',
    minXP: 150000,
    maxXP: 299999,
    color: '#fbbf24',
    description: 'Running the show',
    benefits: [
      'Access to Harvey\'s Office',
      'Strategy builder',
      'Full platform access',
    ],
    unlocks: ['harveys_office', 'strategy_builder', 'full_access'],
  },
  name_partner: {
    id: 'name_partner',
    name: 'Name Partner',
    icon: '🏆',
    minXP: 300000,
    maxXP: 999999999,
    color: '#fbbf24',
    description: 'Your name is on the wall',
    benefits: [
      'Access to Vault',
      'Prestige available',
      'All premium features',
      'Custom dashboard skins',
    ],
    unlocks: ['vault', 'prestige', 'premium_all', 'custom_skins'],
  },
};

// ============================================
// ACHIEVEMENT DEFINITIONS
// ============================================

export type AchievementId =
  | 'first_login'
  | 'the_closer'
  | 'the_fixer'
  | 'the_genius'
  | 'the_rainmaker'
  | 'the_negotiator'
  | 'speed_demon'
  | 'crisis_survivor'
  | 'streak_week'
  | 'streak_month'
  | 'upload_master'
  | 'forecast_guru'
  | 'donna_favorite'
  | 'harvey_apprentice'
  | 'prestige_pioneer';

export interface AchievementConfig {
  id: AchievementId;
  name: string;
  icon: string;
  description: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement?: {
    type: 'xp' | 'rank' | 'streak' | 'prestige' | 'action';
    value: number | string;
  };
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementConfig> = {
  first_login: {
    id: 'first_login',
    name: 'First Day at the Firm',
    icon: '🎉',
    description: 'Complete your first login to Aequitas',
    xpReward: 50,
    rarity: 'common',
    requirement: { type: 'action', value: 'first_login' },
  },
  the_closer: {
    id: 'the_closer',
    name: 'The Closer',
    icon: '🎯',
    description: 'Complete 100 successful forecasts',
    xpReward: 500,
    rarity: 'epic',
    requirement: { type: 'action', value: 'forecasts_100' },
  },
  the_fixer: {
    id: 'the_fixer',
    name: 'The Fixer',
    icon: '🔧',
    description: 'Resolve 50 data quality issues',
    xpReward: 300,
    rarity: 'rare',
    requirement: { type: 'action', value: 'fixes_50' },
  },
  the_genius: {
    id: 'the_genius',
    name: 'The Genius',
    icon: '🧠',
    description: 'Achieve 95%+ forecast accuracy for 30 days',
    xpReward: 1000,
    rarity: 'legendary',
    requirement: { type: 'action', value: 'accuracy_95_30d' },
  },
  the_rainmaker: {
    id: 'the_rainmaker',
    name: 'The Rainmaker',
    icon: '💰',
    description: 'Generate $1M+ in virtual P&L',
    xpReward: 750,
    rarity: 'epic',
    requirement: { type: 'action', value: 'pnl_1m' },
  },
  the_negotiator: {
    id: 'the_negotiator',
    name: 'The Negotiator',
    icon: '🤝',
    description: 'Complete 25 collaborative sessions',
    xpReward: 400,
    rarity: 'rare',
    requirement: { type: 'action', value: 'collab_25' },
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Execute 10 sub-second trades',
    xpReward: 250,
    rarity: 'rare',
    requirement: { type: 'action', value: 'fast_trades_10' },
  },
  crisis_survivor: {
    id: 'crisis_survivor',
    name: 'Crisis Survivor',
    icon: '🛡️',
    description: 'Navigate through 5 market crises successfully',
    xpReward: 600,
    rarity: 'epic',
    requirement: { type: 'action', value: 'crises_5' },
  },
  streak_week: {
    id: 'streak_week',
    name: 'Consistent Closer',
    icon: '📅',
    description: 'Maintain a 7-day login streak',
    xpReward: 100,
    rarity: 'common',
    requirement: { type: 'streak', value: 7 },
  },
  streak_month: {
    id: 'streak_month',
    name: 'Marathon Runner',
    icon: '🏃',
    description: 'Maintain a 30-day login streak',
    xpReward: 500,
    rarity: 'epic',
    requirement: { type: 'streak', value: 30 },
  },
  upload_master: {
    id: 'upload_master',
    name: 'Upload Master',
    icon: '📤',
    description: 'Successfully upload 50 CSV files',
    xpReward: 200,
    rarity: 'rare',
    requirement: { type: 'action', value: 'uploads_50' },
  },
  forecast_guru: {
    id: 'forecast_guru',
    name: 'Forecast Guru',
    icon: '🔮',
    description: 'View 1000+ forecast predictions',
    xpReward: 350,
    rarity: 'rare',
    requirement: { type: 'action', value: 'views_1000' },
  },
  donna_favorite: {
    id: 'donna_favorite',
    name: 'Donna\'s Favorite',
    icon: '💅',
    description: 'Have 100 conversations with Donna',
    xpReward: 400,
    rarity: 'rare',
    requirement: { type: 'action', value: 'donna_chats_100' },
  },
  harvey_apprentice: {
    id: 'harvey_apprentice',
    name: 'Harvey\'s Apprentice',
    icon: '👔',
    description: 'Complete 25 strategy sessions with Harvey',
    xpReward: 500,
    rarity: 'epic',
    requirement: { type: 'action', value: 'harvey_sessions_25' },
  },
  prestige_pioneer: {
    id: 'prestige_pioneer',
    name: 'Prestige Pioneer',
    icon: '⭐',
    description: 'Reach Prestige Level 1',
    xpReward: 1000,
    rarity: 'legendary',
    requirement: { type: 'prestige', value: 1 },
  },
};

// ============================================
// XP EVENTS
// ============================================

export const XP_EVENTS = {
  // Login & Activity
  daily_login: { amount: 25, description: 'Daily login bonus' },
  streak_bonus: { amount: 10, description: 'Per day streak bonus' },

  // Data Operations
  csv_upload: { amount: 50, description: 'Upload a CSV file' },
  position_update: { amount: 15, description: 'Update position data' },
  data_validation: { amount: 30, description: 'Fix data quality issue' },

  // Forecasting
  forecast_view: { amount: 5, description: 'View a forecast' },
  forecast_accurate: { amount: 100, description: 'Accurate forecast (within 5%)' },
  forecast_creation: { amount: 25, description: 'Create new forecast' },

  // Crisis & Simulation
  crisis_simulation: { amount: 75, description: 'Complete crisis simulation' },
  scenario_analysis: { amount: 50, description: 'Run scenario analysis' },
  paranoia_activation: { amount: 20, description: 'Activate paranoia mode' },

  // AI Interaction
  donna_conversation: { amount: 15, description: 'Chat with Donna' },
  harvey_consultation: { amount: 25, description: 'Consult with Harvey' },

  // Strategy
  strategy_created: { amount: 100, description: 'Create trading strategy' },
  strategy_executed: { amount: 75, description: 'Execute strategy' },
  strategy_review: { amount: 30, description: 'Review strategy performance' },

  // Social
  collaboration: { amount: 50, description: 'Collaborative session' },
  team_invite: { amount: 100, description: 'Invite team member' },

  // Achievements
  achievement: { amount: 0, description: 'Varies by achievement' },
  intent_selection: { amount: 50, description: 'Select onboarding intent' },
};

// ============================================
// DASHBOARD SKINS
// ============================================

export interface DashboardSkin {
  id: string;
  name: string;
  description: string;
  preview: string;
  requiredRank: RankId;
  prestigeCost?: number;
  cssClass: string;
}

export const DASHBOARD_SKINS: Record<string, DashboardSkin> = {
  default: {
    id: 'default',
    name: 'Power Suit',
    description: 'The classic institutional look',
    preview: '/images/skins/default.jpg',
    requiredRank: 'junior_associate',
    cssClass: 'theme-default',
  },
  corner_office: {
    id: 'corner_office',
    name: 'Corner Office',
    description: 'Manhattan skyline views',
    preview: '/images/skins/corner-office.jpg',
    requiredRank: 'senior_partner',
    cssClass: 'theme-corner-office',
  },
  rainmaker: {
    id: 'rainmaker',
    name: 'Rainmaker',
    description: 'Gold accents and premium feel',
    preview: '/images/skins/rainmaker.jpg',
    requiredRank: 'managing_partner',
    cssClass: 'theme-rainmaker',
  },
  name_partner: {
    id: 'name_partner',
    name: 'Name Partner',
    description: 'Your name on the wall',
    preview: '/images/skins/name-partner.jpg',
    requiredRank: 'name_partner',
    prestigeCost: 500,
    cssClass: 'theme-name-partner',
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getRankForXP(xp: number): string {
  const ranks = Object.values(RANKS).sort((a, b) => b.minXP - a.minXP);
  for (const rank of ranks) {
    if (xp >= rank.minXP) {
      return rank.name;
    }
  }
  return RANKS.junior_associate.name;
}

export function getNextRank(currentRank: string): string | null {
  const rankOrder = Object.values(RANKS).sort((a, b) => a.minXP - b.minXP);
  const currentIndex = rankOrder.findIndex((r) => r.name === currentRank);
  if (currentIndex < rankOrder.length - 1) {
    return rankOrder[currentIndex + 1].name;
  }
  return null;
}

export function getRankProgress(xp: number, currentRank: string): number {
  const ranks = Object.values(RANKS).sort((a, b) => a.minXP - b.minXP);
  const currentRankConfig = ranks.find((r) => r.name === currentRank);
  const currentIndex = ranks.findIndex((r) => r.name === currentRank);
  const nextRankConfig = currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;

  if (!currentRankConfig) return 0;

  const rankMinXP = currentRankConfig.minXP;
  const rankMaxXP = nextRankConfig?.minXP ?? currentRankConfig.maxXP;
  const xpInRank = xp - rankMinXP;
  const xpRangeForRank = rankMaxXP - rankMinXP;

  return Math.min((xpInRank / xpRangeForRank) * 100, 100);
}

// ... existing code ...

export function getRankByXP(xp: number): RankConfig | undefined {
  const rankName = getRankForXP(xp);
  return Object.values(RANKS).find((r) => r.name === rankName);
}

export function getXPToNextRank(xp: number, currentRank: string): number {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return 0;

  const nextRankConfig = Object.values(RANKS).find((r) => r.name === nextRank);
  if (!nextRankConfig) return 0;

  return Math.max(0, nextRankConfig.minXP - xp);
}
