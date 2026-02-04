// ============================================
// NARRATIVE CONFIG
// Harvey/Donna Quotes, Story Sequences
// ============================================

// ============================================
// PERSONA DEFINITIONS
// ============================================

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  accentColor: string;
  description: string;
  traits: string[];
}

export const PERSONAS = {
  HARVEY: {
    id: 'harvey',
    name: 'Harvey Specter',
    role: 'Strategic Advisor',
    avatar: '/avatars/harvey_specter.png',
    color: '#f59e0b',
    accentColor: '#d97706',
    description: 'The best closer in the city. Strategic, confident, and always wins.',
    traits: ['Strategic', 'Confident', 'Direct', 'Winning'],
  },

  DONNA: {
    id: 'donna',
    name: 'Donna Paulsen',
    role: 'AI Coordinator',
    avatar: '/avatars/donna_paulsen.png',
    color: '#0d9488',
    accentColor: '#0f766e',
    description: 'She knows everything. Proactive, intuitive, and always one step ahead.',
    traits: ['Proactive', 'Intuitive', 'Organized', 'Perceptive'],
  },

  LOUIS: {
    id: 'louis',
    name: 'Louis Litt',
    role: 'Compliance Officer',
    avatar: '/avatars/louis_litt.png',
    color: '#7c3aed',
    accentColor: '#6d28d9',
    description: 'Detail-oriented and thorough. No rule goes unchecked.',
    traits: ['Detail-oriented', 'Thorough', 'Technical', 'Persistent'],
  },
} as const;

// ============================================
// HARVEY QUOTES
// ============================================

export const QUOTES = {
  HARVEY: {
    // General
    WELCOME: "Winners don't make excuses when the other side plays the game.",
    MOTIVATION: "I don't play the odds, I play the man.",
    WORK_ETHIC: "The only time success comes before work is in the dictionary.",
    SUCCESS: "That's what I do. I drink and I win things.",

    // Market States
    HIGH_VOLATILITY: "When you're backed against the wall, break the goddamn thing down.",
    BULL_MARKET: "We're not riding the wave. We ARE the wave.",
    BEAR_MARKET: "Pressure makes diamonds. Let's make some diamonds.",
    CALM_MARKET: "The calm before the storm. Use it wisely.",

    // Risk
    HIGH_RISK: "You want to change your life? Change the stakes.",
    LOW_RISK: "Sometimes the best move is to not make one.",
    RISK_WARNING: "Anyone can do my job, but no one can be me.",

    // Decisions
    BIG_DECISION: "I don't have dreams. I have goals.",
    CONFIRMATION: "That's the thing about faith. If you don't have it, you can't understand it.",
    REJECTION: "I don't get on my knees for anyone.",

    // Performance
    GOOD_PERFORMANCE: "I could not care less what anyone other than me thinks.",
    BAD_PERFORMANCE: "Ever loved someone so much, you would do anything for them? Make that yourself and do whatever the hell you want.",
    MILESTONE: "It's going to happen because I'm going to make it happen.",

    // Crisis
    CRISIS_START: "Sorry, I can't hear you over the sound of how awesome I am.",
    CRISIS_NAVIGATION: "Life is a game. Play to win.",
    CRISIS_RESOLVED: "I don't get lucky. I make my own luck.",

    // Time
    MORNING: "Let's get this money.",
    AFTERNOON: "The day's not over. Neither are we.",
    EVENING: "Close out strong. Winners finish.",

    // Actions
    ON_STRATEGY: "I don't take half-measures on any case because I don't lose.",
    ON_UPLOAD: "Data is ammunition. Load up.",
    ON_FORECAST: "The future belongs to those who prepare.",

    // Errors
    ERROR: "That's what happens when you step to the king.",
    RETRY: "When you get knocked down, you get back up.",
  },

  // ============================================
  // DONNA QUOTES
  // ============================================

  DONNA: {
    // General
    WELCOME: "I know everything. That's what happens when you're a goddess.",
    PROACTIVE: "I'm going to tell you something that's going to make your day.",
    HELPFUL: "That's what I'm here for.",

    // Market States
    HIGH_VOLATILITY: "I've already prepared everything we need. You're welcome.",
    BULL_MARKET: "The markets are up, your coffee is ready, and I've already handled your morning emails.",
    BEAR_MARKET: "I saw this coming last week. I've already made contingency plans.",
    CALM_MARKET: "Everything's running smoothly. Suspiciously smoothly.",

    // Assistance
    OFFERING_HELP: "Before you even ask - yes, I've already thought of that.",
    REMINDER: "Don't forget - you have that thing.",
    NUDGE: "Just a gentle nudge from someone who knows better.",
    ANTICIPATION: "I knew you were going to ask that.",

    // Coordination
    SCHEDULING: "I've already moved your 3 o'clock. You needed the time.",
    ORGANIZATION: "Consider it done. Actually, it's already done.",
    DELEGATION: "I'll handle it. You focus on being..." + " well, you.",

    // Emotional Intelligence
    ENCOURAGEMENT: "You've got this. And if you don't, I do.",
    COMFORT: "It's not the end of the world. Trust me, I'd know.",
    CELEBRATION: "Now THAT deserves a celebration.",
    EMPATHY: "I know what you're going through. Let me help.",

    // Crisis
    CRISIS_START: "I've already activated the protocols. Just tell me what else you need.",
    CRISIS_NAVIGATION: "Stay calm. I've been through worse. Well, not worse, but... similar.",
    CRISIS_RESOLVED: "Crisis averted. As usual.",

    // Insights
    INSIGHT: "Here's something you might find interesting...",
    ANALYSIS: "I've analyzed the data. Here's what you need to know.",
    RECOMMENDATION: "If I were you - which I'm not, but if I were...",

    // Time
    MORNING: "Good morning. I've already organized your day.",
    AFTERNOON: "Quick check-in. How can I help?",
    EVENING: "Before you go - a few things to note for tomorrow.",

    // Actions
    ON_UPLOAD: "Data received. I'll cross-reference it with our existing records.",
    ON_FORECAST: "The forecast is ready. I've highlighted the important parts.",
    ON_STRATEGY: "Strategy looks solid. I've added a few of my own touches.",

    // Errors
    ERROR: "Something went wrong. I'm already fixing it.",
    RETRY: "Let's try that again. I'll guide you through it.",
  },

  // ============================================
  // LOUIS QUOTES
  // ============================================

  LOUIS: {
    WELCOME: "Did you validate that? Because I'll check.",
    COMPLIANCE: "This doesn't meet our standards. Yet.",
    APPROVAL: "Fine. This is acceptable. Barely.",
    REJECTION: "Absolutely not. Do it again.",

    ON_AUDIT: "I've reviewed everything three times. We're bulletproof.",
    ON_RISK: "The risk metrics are concerning. Very concerning.",
    ON_COMPLIANCE: "Every regulation. Every rule. No exceptions.",
  },
};

// ============================================
// TOAST MESSAGES
// ============================================

export const TOAST_MESSAGES = {
  SUCCESS: {
    UPLOAD: {
      persona: 'donna' as const,
      title: 'Upload Complete',
      message: QUOTES.DONNA.ON_UPLOAD,
    },
    FORECAST: {
      persona: 'donna' as const,
      title: 'Forecast Generated',
      message: QUOTES.DONNA.ON_FORECAST,
    },
    STRATEGY: {
      persona: 'harvey' as const,
      title: 'Strategy Deployed',
      message: QUOTES.HARVEY.ON_STRATEGY,
    },
    MILESTONE: {
      persona: 'harvey' as const,
      title: 'Milestone Achieved',
      message: QUOTES.HARVEY.MILESTONE,
    },
  },

  ERROR: {
    GENERAL: {
      persona: 'donna' as const,
      title: 'Something Went Wrong',
      message: QUOTES.DONNA.ERROR,
    },
    VALIDATION: {
      persona: 'donna' as const,
      title: 'Validation Failed',
      message: QUOTES.DONNA.RETRY,
    },
  },

  WARNING: {
    HIGH_RISK: {
      persona: 'harvey' as const,
      title: 'Risk Alert',
      message: QUOTES.HARVEY.RISK_WARNING,
    },
    VOLATILITY: {
      persona: 'harvey' as const,
      title: 'High Volatility',
      message: QUOTES.HARVEY.HIGH_VOLATILITY,
    },
  },

  INFO: {
    NUDGE: {
      persona: 'donna' as const,
      title: 'Heads Up',
      message: QUOTES.DONNA.NUDGE,
    },
    INSIGHT: {
      persona: 'donna' as const,
      title: 'Insight',
      message: QUOTES.DONNA.INSIGHT,
    },
  },
};

// ============================================
// STORY SEQUENCES
// ============================================

export interface StoryStep {
  id: string;
  persona: 'harvey' | 'donna' | 'louis' | 'system';
  message: string;
  action?: string;
  nextStep?: string;
}

export interface StorySequence {
  id: string;
  name: string;
  trigger: string;
  steps: StoryStep[];
}

export const STORY_SEQUENCES: Record<string, StorySequence> = {
  onboarding: {
    id: 'onboarding',
    name: 'Welcome to the Firm',
    trigger: 'first_login',
    steps: [
      {
        id: 'welcome_donna',
        persona: 'donna',
        message: QUOTES.DONNA.WELCOME,
        nextStep: 'welcome_harvey',
      },
      {
        id: 'welcome_harvey',
        persona: 'harvey',
        message: QUOTES.HARVEY.WELCOME,
        nextStep: 'intent_capture',
      },
      {
        id: 'intent_capture',
        persona: 'donna',
        message: "What brings you to Aequitas today? Let me help you get started.",
        action: 'show_intent_modal',
      },
    ],
  },

  first_crisis: {
    id: 'first_crisis',
    name: 'Baptism by Fire',
    trigger: 'first_crisis_mode',
    steps: [
      {
        id: 'crisis_alert',
        persona: 'donna',
        message: QUOTES.DONNA.CRISIS_START,
        nextStep: 'harvey_advice',
      },
      {
        id: 'harvey_advice',
        persona: 'harvey',
        message: QUOTES.HARVEY.CRISIS_START,
        action: 'enable_paranoia_mode',
      },
    ],
  },

  rank_up: {
    id: 'rank_up',
    name: 'Moving Up',
    trigger: 'rank_change',
    steps: [
      {
        id: 'congratulation',
        persona: 'harvey',
        message: QUOTES.HARVEY.SUCCESS,
        nextStep: 'donna_celebration',
      },
      {
        id: 'donna_celebration',
        persona: 'donna',
        message: QUOTES.DONNA.CELEBRATION,
        action: 'show_new_unlocks',
      },
    ],
  },

  prestige: {
    id: 'prestige',
    name: 'Prestige Mode',
    trigger: 'prestige_up',
    steps: [
      {
        id: 'prestige_intro',
        persona: 'harvey',
        message: "You've reached the top. Now let's see if you can do it again.",
        nextStep: 'prestige_confirm',
      },
      {
        id: 'prestige_confirm',
        persona: 'donna',
        message: "Starting over with a clean slate, but this time with a 10% XP bonus. Worth it.",
        action: 'confirm_prestige',
      },
    ],
  },
};

// ============================================
// TIME-BASED GREETINGS
// ============================================

export function getTimeBasedGreeting(persona: 'harvey' | 'donna' = 'donna'): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return persona === 'harvey' ? QUOTES.HARVEY.MORNING : QUOTES.DONNA.MORNING;
  } else if (hour < 17) {
    return persona === 'harvey' ? QUOTES.HARVEY.AFTERNOON : QUOTES.DONNA.AFTERNOON;
  } else {
    return persona === 'harvey' ? QUOTES.HARVEY.EVENING : QUOTES.DONNA.EVENING;
  }
}

// ============================================
// RANDOM QUOTE SELECTOR
// ============================================

export function getRandomQuote(
  persona: 'harvey' | 'donna',
  category?: keyof typeof QUOTES.HARVEY | keyof typeof QUOTES.DONNA
): string {
  const quotes = persona === 'harvey' ? QUOTES.HARVEY : QUOTES.DONNA;

  if (category && category in quotes) {
    return quotes[category as keyof typeof quotes];
  }

  const allQuotes = Object.values(quotes);
  return allQuotes[Math.floor(Math.random() * allQuotes.length)];
}

// ============================================
// REGIME-BASED QUOTE
// ============================================

export function getRegimeQuote(
  regime: 'calm' | 'volatile' | 'crisis' | 'recovery',
  persona: 'harvey' | 'donna' = 'harvey'
): string {
  const quotes = persona === 'harvey' ? QUOTES.HARVEY : QUOTES.DONNA;

  switch (regime) {
    case 'calm':
      return quotes.CALM_MARKET;
    case 'volatile':
      return quotes.HIGH_VOLATILITY;
    case 'crisis':
      return quotes.CRISIS_START || quotes.HIGH_VOLATILITY;
    case 'recovery':
      return quotes.BULL_MARKET;
    default:
      const defaultQuote = persona === 'harvey' ? QUOTES.HARVEY.MOTIVATION : QUOTES.DONNA.HELPFUL;
      return defaultQuote;
  }
}

// ============================================
// EXPORTS
// ============================================

export default {
  PERSONAS,
  QUOTES,
  TOAST_MESSAGES,
  STORY_SEQUENCES,
  getTimeBasedGreeting,
  getRandomQuote,
  getRegimeQuote,
};
