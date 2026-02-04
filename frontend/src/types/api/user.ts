// ============================================
// USER API TYPES
// User Profile & Authentication
// ============================================

/**
 * User roles in the system
 */
export type UserRole =
  | 'admin'
  | 'manager'
  | 'analyst'
  | 'viewer'
  | 'super_admin';

/**
 * User status
 */
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  dashboardSkin: 'default' | 'corner_office' | 'rainmaker' | 'name_partner';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  emailDigest: 'daily' | 'weekly' | 'never';
  timezone: string;
  locale: string;
  compactMode: boolean;
}

/**
 * User profile
 */
export interface User {
  userId: string;
  orgId: string;

  // Identity
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;

  // Role & Access
  role: UserRole;
  permissions: string[];
  status: UserStatus;

  // Subscription
  tier: 'free' | 'premium' | 'enterprise';

  // Preferences
  preferences: UserPreferences;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;

  // Gamification
  gamification: UserGamificationProfile;
}

/**
 * User gamification profile
 */
export interface UserGamificationProfile {
  xp: number;
  level: number;
  rank: UserRank;
  prestigeLevel: number;
  achievements: string[];
  streakDays: number;
  lastActivityDate: string;
}

/**
 * User rank progression
 */
export type UserRank =
  | 'junior_associate'
  | 'associate'
  | 'senior_associate'
  | 'junior_partner'
  | 'partner'
  | 'senior_partner'
  | 'managing_partner'
  | 'name_partner';

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Signup request
 */
export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  inviteCode?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
}

/**
 * User update request
 */
export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * Session info
 */
export interface SessionInfo {
  sessionId: string;
  userId: string;
  device: string;
  browser: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

/**
 * User activity log entry
 */
export interface UserActivityLog {
  activityId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress: string;
  timestamp: string;
}
