// ============================================
// API TYPE DEFINITIONS
// ============================================

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// API Error
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Request parameters
export interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
  period?: '7d' | '30d' | '90d' | 'ytd' | 'all';
}

// WebSocket message types
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  sequence?: number;
}

export type WebSocketMessageType =
  | 'forecast_update'
  | 'regime_change'
  | 'accuracy_update'
  | 'notification'
  | 'ping'
  | 'pong';

// Rate limit info
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
