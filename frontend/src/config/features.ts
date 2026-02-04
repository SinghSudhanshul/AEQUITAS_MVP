import { WINGS } from './wings';

export const FEATURES = {
  [WINGS.lobby.id]: {
    intent_recognition: { enabled: true, tier: 'free' },
    biometric_gatekeeper: { enabled: true, tier: 'premium' },
    regime_badge: { enabled: true, tier: 'free' },
  },
  [WINGS.bullpen.id]: {
    evidence_log: { enabled: true, tier: 'free' },
    billable_tracker: { enabled: true, tier: 'free' },
    task_kanban: { enabled: true, tier: 'free' },
    document_unbinding: { enabled: true, tier: 'premium' },
  },
  [WINGS.library.id]: {
    quantile_visualizer: { enabled: true, tier: 'premium' },
    market_weather: { enabled: true, tier: 'premium' },
    xgboost: { enabled: true, tier: 'enterprise' },
  },
  [WINGS.treasury.id]: {
    liquidity_forecast: { enabled: true, tier: 'premium' },
    margin_monitor: { enabled: true, tier: 'premium' },
  },
  [WINGS['situation-room'].id]: {
    paranoia_mode: { enabled: true, tier: 'enterprise' },
    disaster_mapping: { enabled: true, tier: 'enterprise' },
  },
  // ... maps to all 90 features
};

export const TIERS = {
  FREE: {
    id: 'free',
    name: 'Associate Tier',
    price: 0,
    limits: {
      uploads_per_day: 1,
      history_retention: '30d',
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Partner Tier',
    price: 30000, // Monthly
    limits: {
      uploads_per_day: Infinity,
      history_retention: '2y',
    },
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Firm Tier',
    price: 75000,
    limits: {
      uploads_per_day: Infinity,
      history_retention: 'Unlimited',
    },
  },
};
