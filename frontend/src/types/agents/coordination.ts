// ============================================
// AGENT COORDINATION TYPES
// Multi-Agent Orchestration
// ============================================

import type { HarveyMessage, HarveyMood } from './harvey';
import type { DonnaMessage, DonnaMood } from './donna';

/**
 * Agent identifiers
 */
export type AgentId = 'harvey' | 'donna' | 'louis' | 'system';

/**
 * Agent persona
 */
export interface AgentPersona {
  id: AgentId;
  name: string;
  title: string;
  avatarUrl: string;
  description: string;
  specialties: string[];
  voiceCharacteristics: {
    tone: string;
    style: string;
    vocabulary: string[];
  };
}

/**
 * Unified agent message
 */
export interface AgentMessage {
  messageId: string;
  agentId: AgentId;
  content: HarveyMessage | DonnaMessage;
  timestamp: string;
  priority: number;
  delivered: boolean;
  read: boolean;
}

/**
 * Agent coordination request
 */
export interface CoordinationRequest {
  requestId: string;
  initiator: AgentId;
  targetAgents: AgentId[];
  type: 'handoff' | 'collaboration' | 'escalation' | 'delegation';
  context: Record<string, unknown>;
  createdAt: string;
}

/**
 * Agent handoff
 */
export interface AgentHandoff {
  handoffId: string;
  fromAgent: AgentId;
  toAgent: AgentId;
  reason: string;
  context: Record<string, unknown>;
  timestamp: string;

  // Transition message
  transitionMessage: string;
}

/**
 * Agent task
 */
export interface AgentTask {
  taskId: string;
  assignedAgent: AgentId;
  type: 'monitor' | 'analyze' | 'notify' | 'automate' | 'assist';
  status: 'pending' | 'active' | 'completed' | 'failed';

  // Task details
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';

  // Scheduling
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;

  // Results
  result?: AgentTaskResult;
}

/**
 * Agent task result
 */
export interface AgentTaskResult {
  success: boolean;
  output: unknown;
  message: string;
  actions?: string[];
}

/**
 * Agent conversation thread
 */
export interface AgentThread {
  threadId: string;
  participants: AgentId[];
  messages: AgentMessage[];
  topic: string;
  status: 'active' | 'resolved' | 'archived';
  createdAt: string;
  updatedAt: string;
}

/**
 * Multi-agent response
 */
export interface MultiAgentResponse {
  responseId: string;
  agents: Array<{
    agentId: AgentId;
    response: string;
    confidence: number;
    mood: HarveyMood | DonnaMood;
  }>;
  consensus?: string;
  timestamp: string;
}

/**
 * Agent notification preferences
 */
export interface AgentNotificationPrefs {
  userId: string;
  enabledAgents: AgentId[];
  quietHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  priorityThreshold: 'all' | 'medium' | 'high' | 'critical';
  soundEnabled: boolean;
}

/**
 * Agent analytics
 */
export interface AgentAnalytics {
  agentId: AgentId;
  period: string;
  metrics: {
    messagesDelivered: number;
    tasksCompleted: number;
    avgResponseTime: number;
    userSatisfaction: number;
    handoffsInitiated: number;
  };
}
