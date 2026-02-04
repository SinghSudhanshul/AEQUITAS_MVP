"""
Aequitas LV-COP Backend - Core Enums
====================================

Enumeration definitions used throughout the application.

Author: Aequitas Engineering
Version: 1.0.0
"""

from enum import Enum, IntEnum


class Tier(str, Enum):
    """Subscription tier levels."""
    FREE = "free"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class Regime(str, Enum):
    """Market regime classifications."""
    STEADY_STATE = "steady_state"
    ELEVATED = "elevated"
    CRISIS = "crisis"


class Role(str, Enum):
    """User roles within an organization."""
    ADMIN = "admin"
    MANAGER = "manager"
    ANALYST = "analyst"
    VIEWER = "viewer"


class UserStatus(str, Enum):
    """User account status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"


class OrganizationStatus(str, Enum):
    """Organization status."""
    ACTIVE = "active"
    TRIAL = "trial"
    SUSPENDED = "suspended"
    CHURNED = "churned"


class TransactionType(str, Enum):
    """Transaction types for cash flow."""
    INFLOW = "inflow"
    OUTFLOW = "outflow"


class AssetClass(str, Enum):
    """Asset classification."""
    EQUITY = "equity"
    FIXED_INCOME = "fixed_income"
    DERIVATIVES = "derivatives"
    CASH = "cash"
    ALTERNATIVES = "alternatives"
    CRYPTO = "crypto"


class Currency(str, Enum):
    """Supported currencies."""
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    JPY = "JPY"
    CHF = "CHF"
    CAD = "CAD"
    AUD = "AUD"


class ForecastStatus(str, Enum):
    """Forecast generation status."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ForecastType(str, Enum):
    """Forecast type."""
    DAILY = "daily"
    INTRADAY = "intraday"
    REALTIME = "realtime"


class BrokerType(str, Enum):
    """Broker types."""
    GOLDMAN_SACHS = "goldman_sachs"
    MORGAN_STANLEY = "morgan_stanley"
    JP_MORGAN = "jp_morgan"
    MOCK = "mock"


class ConnectionStatus(str, Enum):
    """Broker connection status."""
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    PENDING = "pending"


class AuditAction(str, Enum):
    """Audit log action types."""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    EXPORT = "export"
    IMPORT = "import"


class AchievementType(str, Enum):
    """Achievement categories."""
    ACCURACY = "accuracy"
    CONSISTENCY = "consistency"
    SPEED = "speed"
    VOLUME = "volume"
    EXPLORATION = "exploration"
    MASTERY = "mastery"


class BadgeRarity(str, Enum):
    """Badge rarity levels."""
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"


class PrestigeLevel(IntEnum):
    """Prestige levels for gamification."""
    BRONZE = 1
    SILVER = 2
    GOLD = 3
    PLATINUM = 4
    DIAMOND = 5


class PaymentStatus(str, Enum):
    """Payment status."""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"


class SubscriptionStatus(str, Enum):
    """Subscription status."""
    ACTIVE = "active"
    TRIALING = "trialing"
    PAST_DUE = "past_due"
    CANCELLED = "cancelled"
    UNPAID = "unpaid"


class CrisisScenario(str, Enum):
    """Crisis simulation scenario types."""
    LIQUIDITY_LOCKDOWN = "liquidity_lockdown"
    RANSOMWARE_ATTACK = "ransomware_attack"
    INSIDER_THREAT = "insider_threat"
    QUANTUM_ATTACK = "quantum_attack"
    MARKET_CRASH = "market_crash"
    REGULATORY_FREEZE = "regulatory_freeze"


class NotificationType(str, Enum):
    """Notification types."""
    EMAIL = "email"
    SLACK = "slack"
    SMS = "sms"
    PUSH = "push"
    WEBHOOK = "webhook"


class TaskPriority(str, Enum):
    """Background task priority."""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"
