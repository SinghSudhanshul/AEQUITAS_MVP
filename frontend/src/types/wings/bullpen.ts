// ============================================
// BULLPEN WING TYPES
// Associate Workspace (Features 11-20)
// ============================================

/**
 * Evidence log entry
 */
export interface EvidenceLogEntry {
  id: string;
  timestamp: string;
  type: 'upload' | 'forecast' | 'decision' | 'alert' | 'modification';
  title: string;
  description: string;
  user: string;
  metadata: Record<string, unknown>;
  tags: string[];
  attachments: EvidenceAttachment[];
}

/**
 * Evidence attachment
 */
export interface EvidenceAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

/**
 * Billable hour entry
 */
export interface BillableHourEntry {
  id: string;
  userId: string;
  date: string;
  hours: number;
  taskType: string;
  description: string;
  billable: boolean;
  approved: boolean;
}

/**
 * Billable hour summary
 */
export interface BillableHourSummary {
  userId: string;
  period: string;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  utilizationRate: number;
}

/**
 * Kanban task
 */
export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  labels: string[];
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Kanban column
 */
export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
  limit?: number;
}

/**
 * Document unbinding animation state
 */
export interface DocumentUnbindingState {
  isAnimating: boolean;
  documentId: string;
  fileName: string;
  pageCount: number;
  currentPage: number;
  progress: number;
}

/**
 * Contextual help tooltip
 */
export interface ContextualHelpTooltip {
  id: string;
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
  trigger: 'hover' | 'click' | 'focus';
  hasVideo: boolean;
  videoUrl?: string;
}

/**
 * Hard love failure toast
 */
export interface HardLoveFailureToast {
  id: string;
  type: 'warning' | 'error';
  title: string;
  message: string;
  harveyQuote: string;
  actionRequired: boolean;
  suggestedAction?: string;
  timestamp: string;
}

/**
 * Priority sorter item
 */
export interface PrioritySorterItem {
  id: string;
  title: string;
  currentPriority: number;
  suggestedPriority: number;
  urgency: number;
  impact: number;
  effort: number;
  score: number;
}

/**
 * Collaborative war room sheet
 */
export interface WarRoomSheet {
  id: string;
  title: string;
  participants: string[];
  status: 'planning' | 'active' | 'reviewing' | 'closed';
  createdAt: string;
  updatedAt: string;
  notes: WarRoomNote[];
  decisions: WarRoomDecision[];
}

/**
 * War room note
 */
export interface WarRoomNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  pinned: boolean;
}

/**
 * War room decision
 */
export interface WarRoomDecision {
  id: string;
  decision: string;
  rationale: string;
  decidedBy: string;
  decidedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Snapshot date validation result
 */
export interface SnapshotDateValidation {
  isValid: boolean;
  snapshotDate: string;
  expectedDate: string;
  daysDifference: number;
  warning?: string;
  error?: string;
}

/**
 * XP celebration config
 */
export interface XPCelebration {
  type: 'small' | 'medium' | 'large' | 'epic';
  xpGained: number;
  reason: string;
  animation: string;
  sound: string;
  duration: number;
  harveyQuote?: string;
}
