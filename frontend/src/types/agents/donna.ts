// ============================================
// DONNA AGENT TYPES
// Coordinator AI Persona
// ============================================

/**
 * Donna's mood states
 */
export type DonnaMood =
  | 'helpful'      // Standard Donna
  | 'knowing'      // She predicted this
  | 'concerned'    // Warning about something
  | 'proud'        // User succeeded
  | 'efficient'    // Getting things done
  | 'comforting';  // Supporting user

/**
 * Donna message categories
 */
export type DonnaMessageCategory =
  | 'greeting'
  | 'reminder'
  | 'suggestion'
  | 'workflow'
  | 'schedule'
  | 'insight'
  | 'comfort'
  | 'prediction';

/**
 * Donna message
 */
export interface DonnaMessage {
  messageId: string;
  category: DonnaMessageCategory;
  mood: DonnaMood;
  content: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';

  // Context awareness
  contextual: boolean;
  trigger?: string;

  // Actions
  suggestedAction?: {
    label: string;
    route?: string;
    callback?: string;
  };
}

/**
 * Donna's proactive nudge
 */
export interface DonnaNudge {
  nudgeId: string;
  type: 'reminder' | 'suggestion' | 'warning' | 'opportunity' | 'celebration';
  title: string;
  message: string;
  donnaQuote: string;
  mood: DonnaMood;

  // Timing
  scheduledFor?: string;
  expiresAt?: string;

  // User response
  dismissable: boolean;
  actions: NudgeAction[];

  // Intelligence
  confidence: number;
  reasoning?: string;
}

/**
 * Nudge action
 */
export interface NudgeAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'dismiss';
  action: string;
}

/**
 * Donna workflow suggestion
 */
export interface DonnaWorkflow {
  workflowId: string;
  name: string;
  description: string;
  donnaQuote: string;

  // Steps
  steps: WorkflowStep[];
  estimatedTime: number; // minutes

  // Context
  currentStep: number;
  progress: number;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Workflow step
 */
export interface WorkflowStep {
  stepId: string;
  order: number;
  title: string;
  description: string;
  type: 'action' | 'decision' | 'review' | 'approval';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';

  // Navigation
  route?: string;
  component?: string;

  // Metadata
  estimatedTime: number;
  isOptional: boolean;
}

/**
 * Donna chat message
 */
export interface DonnaChatMessage {
  id: string;
  role: 'user' | 'donna';
  content: string;
  timestamp: string;
  mood?: DonnaMood;

  // Rich content
  attachments?: ChatAttachment[];
  actions?: ChatAction[];

  // Context
  referencedData?: Record<string, unknown>;
}

/**
 * Chat attachment
 */
export interface ChatAttachment {
  type: 'chart' | 'table' | 'file' | 'image';
  data: unknown;
  title: string;
}

/**
 * Chat action
 */
export interface ChatAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
}

/**
 * Donna session state
 */
export interface DonnaSessionState {
  currentMood: DonnaMood;
  lastInteractionAt: string;
  activeWorkflows: string[];
  pendingNudges: number;
  chatHistory: DonnaChatMessage[];
}
