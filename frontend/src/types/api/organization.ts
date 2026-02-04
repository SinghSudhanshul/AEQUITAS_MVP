// ============================================
// ORGANIZATION API TYPES
// Organization & Team Management
// ============================================

/**
 * Subscription tiers
 */
export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

/**
 * Organization status
 */
export type OrgStatus = 'active' | 'trial' | 'suspended' | 'churned';

/**
 * Organization profile
 */
export interface Organization {
  orgId: string;
  name: string;
  slug: string;

  // Subscription
  tier: SubscriptionTier;
  status: OrgStatus;
  trialEndsAt?: string;

  // Billing
  billingEmail?: string;
  stripeCustomerId?: string;

  // Settings
  settings: OrgSettings;

  // Stats
  memberCount: number;
  aumEstimate?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Organization settings
 */
export interface OrgSettings {
  // Branding
  logoUrl?: string;
  primaryColor?: string;

  // Features
  features: OrgFeatureFlags;

  // Security
  mfaRequired: boolean;
  ssoEnabled: boolean;
  ssoProvider?: 'okta' | 'azure_ad' | 'google';

  // Data
  dataRetentionDays: number;
  timezone: string;
  defaultCurrency: string;

  // Notifications
  slackWebhookUrl?: string;
  teamsWebhookUrl?: string;
}

/**
 * Organization feature flags
 */
export interface OrgFeatureFlags {
  // Core features
  csvUpload: boolean;
  brokerApi: boolean;
  realTimeForecasts: boolean;

  // Premium features
  customCalibration: boolean;
  multiCurrency: boolean;
  stressTesting: boolean;

  // Enterprise features
  whiteLabel: boolean;
  dedicatedInfra: boolean;
  customIntegrations: boolean;

  // Beta features
  betaFeatures: string[];
}

/**
 * Team member
 */
export interface TeamMember {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  status: 'active' | 'invited' | 'deactivated';
  joinedAt: string;
  lastActiveAt?: string;
}

/**
 * Team invitation
 */
export interface TeamInvitation {
  inviteId: string;
  email: string;
  role: string;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
}

/**
 * Broker connection
 */
export interface BrokerConnection {
  connectionId: string;
  orgId: string;
  brokerName: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
  syncFrequency: 'hourly' | 'daily' | 'manual';
  error?: string;
  createdAt: string;
}

/**
 * API key
 */
export interface ApiKey {
  keyId: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdBy: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  status: 'active' | 'revoked';
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  webhookId: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

/**
 * Usage statistics
 */
export interface UsageStats {
  orgId: string;
  periodStart: string;
  periodEnd: string;

  // API usage
  apiCalls: number;
  apiCallsLimit: number;

  // Forecasts
  forecastsGenerated: number;
  forecastsLimit: number;

  // Storage
  storageUsedMb: number;
  storageLimitMb: number;

  // Data uploads
  csvUploads: number;
  recordsProcessed: number;
}

/**
 * Billing info
 */
export interface BillingInfo {
  orgId: string;
  tier: SubscriptionTier;

  // Subscription
  planName: string;
  monthlyAmount: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';

  // Next billing
  nextBillingDate: string;
  nextBillingAmount: number;

  // Payment method
  paymentMethodType: 'card' | 'invoice' | 'wire';
  paymentMethodLast4?: string;

  // History
  invoices: Invoice[];
}

/**
 * Invoice
 */
export interface Invoice {
  invoiceId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void';
  periodStart: string;
  periodEnd: string;
  pdfUrl?: string;
  createdAt: string;
  paidAt?: string;
}
