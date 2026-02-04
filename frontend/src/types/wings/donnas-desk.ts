// ============================================
// DONNA'S DESK WING TYPES
// AI Persona (Features 61-70)
// ============================================

import type { DonnaMood, DonnaChatMessage } from '../agents/donna';

/**
 * Donna chat interface state
 */
export interface DonnaChatInterfaceState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: DonnaChatMessage[];
  isTyping: boolean;
  inputValue: string;
  suggestions: string[];
}

/**
 * Donna radar nudge
 */
export interface DonnaRadarNudge {
  id: string;
  type: 'reminder' | 'opportunity' | 'warning' | 'insight' | 'celebration';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  mood: DonnaMood;
  actionable: boolean;
  actions?: NudgeActionButton[];
  expiresAt?: string;
  source: string;
}

/**
 * Nudge action button
 */
export interface NudgeActionButton {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'ghost';
  action: string;
  icon?: string;
}

/**
 * Multi-step workflow
 */
export interface MultiStepWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  steps: WorkflowStepDefinition[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number;
}

/**
 * Workflow step definition
 */
export interface WorkflowStepDefinition {
  id: string;
  order: number;
  name: string;
  description: string;
  type: 'manual' | 'automated' | 'approval' | 'conditional';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  config: Record<string, unknown>;
  dependencies: string[];
  timeout?: number;
}

/**
 * EQ-aware microcopy
 */
export interface EQAwareMicrocopy {
  id: string;
  context: string;
  userState: UserEmotionalState;
  originalText: string;
  adaptedText: string;
  tone: 'supportive' | 'encouraging' | 'neutral' | 'urgent' | 'celebratory';
}

/**
 * User emotional state
 */
export interface UserEmotionalState {
  stressLevel: 'low' | 'medium' | 'high';
  recentErrors: number;
  sessionDuration: number;
  taskCompletion: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

/**
 * Shadowing agent state
 */
export interface ShadowingAgentState {
  isActive: boolean;
  observedActions: ObservedAction[];
  patterns: BehaviorPattern[];
  suggestions: ShadowSuggestion[];
  learningProgress: number;
}

/**
 * Observed action
 */
export interface ObservedAction {
  id: string;
  action: string;
  timestamp: string;
  context: Record<string, unknown>;
  duration: number;
}

/**
 * Behavior pattern
 */
export interface BehaviorPattern {
  id: string;
  name: string;
  frequency: number;
  averageDuration: number;
  canAutomate: boolean;
  automationSavings: number;
}

/**
 * Shadow suggestion
 */
export interface ShadowSuggestion {
  id: string;
  type: 'shortcut' | 'automation' | 'optimization' | 'correction';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

/**
 * Multimodal command
 */
export interface MultimodalCommand {
  id: string;
  inputType: 'text' | 'voice' | 'image' | 'file' | 'gesture';
  rawInput: string | Blob;
  processedIntent: string;
  confidence: number;
  entities: CommandEntity[];
  action: string;
  parameters: Record<string, unknown>;
}

/**
 * Command entity
 */
export interface CommandEntity {
  type: string;
  value: string;
  confidence: number;
  position: [number, number];
}

/**
 * Automatic draft
 */
export interface AutomaticDraft {
  id: string;
  type: 'email' | 'report' | 'summary' | 'response' | 'analysis';
  title: string;
  content: string;
  status: 'draft' | 'reviewed' | 'sent' | 'discarded';
  confidence: number;
  sources: string[];
  createdAt: string;
  editedAt?: string;
}

/**
 * Teacher loop state
 */
export interface TeacherLoopState {
  isActive: boolean;
  currentLesson: string;
  lessonsCompleted: number;
  totalLessons: number;
  correctAnswers: number;
  incorrectAnswers: number;
  adaptedDifficulty: 'beginner' | 'intermediate' | 'advanced';
  feedback: TeacherFeedback[];
}

/**
 * Teacher feedback
 */
export interface TeacherFeedback {
  id: string;
  type: 'praise' | 'correction' | 'hint' | 'explanation';
  message: string;
  donnaQuote: string;
  relatedConcepts: string[];
}

/**
 * Multi-agent coordinator state
 */
export interface MultiAgentCoordinatorState {
  activeAgents: string[];
  currentLeader: string;
  taskQueue: CoordinatedTask[];
  completedTasks: number;
  collaborationScore: number;
}

/**
 * Coordinated task
 */
export interface CoordinatedTask {
  id: string;
  assignedAgents: string[];
  task: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  dependencies: string[];
}

/**
 * Persona signed message
 */
export interface PersonaSignedMessage {
  id: string;
  persona: 'harvey' | 'donna' | 'louis';
  message: string;
  mood: string;
  context: string;
  timestamp: string;
  signature: string;
}
