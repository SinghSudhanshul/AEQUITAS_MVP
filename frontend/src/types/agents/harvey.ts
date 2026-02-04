// ============================================
// HARVEY AGENT TYPES
// Executive AI Persona
// ============================================

/**
 * Harvey's mood states
 */
export type HarveyMood =
  | 'confident'    // Standard Harvey
  | 'impressed'    // User did well
  | 'disappointed' // User made poor choice
  | 'intense'      // High-stakes situation
  | 'mentoring'    // Teaching moment
  | 'closing';     // Celebration/win

/**
 * Harvey message categories
 */
export type HarveyMessageCategory =
  | 'greeting'
  | 'forecast_insight'
  | 'crisis_alert'
  | 'achievement'
  | 'motivation'
  | 'strategy'
  | 'warning'
  | 'celebration';

/**
 * Harvey message
 */
export interface HarveyMessage {
  messageId: string;
  category: HarveyMessageCategory;
  mood: HarveyMood;
  content: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action?: {
    label: string;
    route?: string;
    callback?: string;
  };
  context?: Record<string, unknown>;
}

/**
 * Harvey strategy suggestion
 */
export interface HarveyStrategy {
  strategyId: string;
  title: string;
  description: string;
  harveyQuote: string;

  // Strategy details
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: 'short' | 'medium' | 'long';
  confidenceLevel: number;

  // Actions
  suggestedActions: StrategyAction[];

  // Context
  regime: string;
  marketConditions: string[];

  createdAt: string;
}

/**
 * Strategy action
 */
export interface StrategyAction {
  actionId: string;
  type: 'rebalance' | 'hedge' | 'hold' | 'exit' | 'enter';
  description: string;
  urgency: 'when_convenient' | 'today' | 'immediately';
  impact: string;
}

/**
 * Harvey's alert dialog
 */
export interface HarveyAlert {
  alertId: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  harveyQuote: string;
  mood: HarveyMood;

  // Actions
  primaryAction?: {
    label: string;
    action: string;
  };
  secondaryAction?: {
    label: string;
    action: string;
  };

  // Display
  persistent: boolean;
  soundEffect?: string;
  createdAt: string;
}

/**
 * Harvey session state
 */
export interface HarveySessionState {
  currentMood: HarveyMood;
  lastInteractionAt: string;
  messagesDelivered: number;
  strategiesSuggested: number;
  alertsTriggered: number;
}

/**
 * Harvey quote collection
 */
export interface HarveyQuoteCollection {
  category: string;
  quotes: Array<{
    id: string;
    quote: string;
    mood: HarveyMood;
    context?: string;
  }>;
}
