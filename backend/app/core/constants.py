"""
Aequitas LV-COP Backend - Core Constants
=======================================

Application-wide constants and configuration values.

Author: Aequitas Engineering
Version: 1.0.0
"""

# =============================================================================
# API RATE LIMITS
# =============================================================================

# Daily API call limits by tier
RATE_LIMITS = {
    "free": 100,
    "premium": 10000,
    "enterprise": float("inf"),
}

# Request rate limits (requests per minute)
RATE_LIMIT_PER_MINUTE = {
    "free": 10,
    "premium": 100,
    "enterprise": 1000,
}

# =============================================================================
# FORECAST SETTINGS
# =============================================================================

# Forecast horizon (days)
DEFAULT_FORECAST_HORIZON = 5
MAX_FORECAST_HORIZON = 30

# Confidence intervals for quantile regression
FORECAST_QUANTILES = [0.05, 0.50, 0.95]

# Minimum data points required for forecasting
MIN_POSITIONS_FOR_FORECAST = 30
MIN_TRANSACTIONS_FOR_PATTERN = 10

# =============================================================================
# REGIME DETECTION THRESHOLDS
# =============================================================================

# VIX thresholds
VIX_STEADY_STATE_MAX = 25.0
VIX_ELEVATED_MIN = 25.0
VIX_ELEVATED_MAX = 40.0
VIX_CRISIS_MIN = 40.0

# Credit spread thresholds (basis points)
CREDIT_SPREAD_STEADY_STATE_MAX = 150.0
CREDIT_SPREAD_ELEVATED_MIN = 150.0
CREDIT_SPREAD_ELEVATED_MAX = 200.0
CREDIT_SPREAD_CRISIS_MIN = 200.0

# Repo rate thresholds
REPO_RATE_NORMAL_MAX = 3.0
REPO_RATE_ELEVATED_MIN = 3.0
REPO_RATE_CRISIS_MIN = 5.0

# =============================================================================
# CRISIS MODEL MULTIPLIERS
# =============================================================================

# Shock multipliers for crisis model
CRISIS_SHOCK_MULTIPLIERS = {
    "steady_state": 1.0,
    "elevated": 1.5,
    "crisis": 2.5,
}

# Volatility scaling factors
VOLATILITY_SCALING = {
    "steady_state": 1.0,
    "elevated": 1.25,
    "crisis": 2.0,
}

# =============================================================================
# GAMIFICATION SETTINGS
# =============================================================================

# XP earned per action
XP_ACTIONS = {
    "forecast_generated": 10,
    "accurate_prediction": 50,
    "data_upload": 5,
    "broker_connected": 100,
    "crisis_simulation_completed": 75,
    "streak_day": 25,
    "first_login": 20,
}

# XP required per level (cumulative)
XP_LEVELS = [
    0,      # Level 1
    100,    # Level 2
    250,    # Level 3
    500,    # Level 4
    1000,   # Level 5
    2000,   # Level 6
    3500,   # Level 7
    5500,   # Level 8
    8000,   # Level 9
    11000,  # Level 10
    15000,  # Level 11
    20000,  # Level 12
    26000,  # Level 13
    33000,  # Level 14
    41000,  # Level 15
    50000,  # Level 16 (max)
]

# Rank names
RANK_NAMES = [
    "Novice Analyst",
    "Junior Analyst",
    "Analyst",
    "Senior Analyst",
    "Lead Analyst",
    "Strategist",
    "Senior Strategist",
    "Principal",
    "Senior Principal",
    "Director",
    "Senior Director",
    "Managing Director",
    "Executive Director",
    "Global Head",
    "Chief Strategist",
    "Master Strategist",
]

# =============================================================================
# DATA RETENTION
# =============================================================================

# Data retention periods (days)
DATA_RETENTION = {
    "positions": 365 * 7,      # 7 years
    "transactions": 365 * 7,   # 7 years
    "forecasts": 365 * 2,      # 2 years
    "audit_logs": 365 * 7,     # 7 years
    "api_usage": 365,          # 1 year
    "sessions": 30,            # 30 days
}

# =============================================================================
# CACHE TTL (seconds)
# =============================================================================

CACHE_TTL = {
    "market_data": 60,         # 1 minute
    "regime_status": 300,      # 5 minutes
    "forecast": 3600,          # 1 hour
    "user_profile": 300,       # 5 minutes
    "leaderboard": 900,        # 15 minutes
    "accuracy_metrics": 3600,  # 1 hour
}

# =============================================================================
# FILE UPLOAD LIMITS
# =============================================================================

MAX_UPLOAD_SIZE_MB = 50
MAX_ROWS_PER_UPLOAD = 1_000_000
ALLOWED_UPLOAD_EXTENSIONS = {".csv", ".xlsx", ".xls"}

# =============================================================================
# PAGINATION
# =============================================================================

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# =============================================================================
# WEBSOCKET
# =============================================================================

WEBSOCKET_HEARTBEAT_INTERVAL = 30  # seconds
WEBSOCKET_MAX_CONNECTIONS_PER_USER = 5

# =============================================================================
# EXTERNAL APIS
# =============================================================================

# Market data refresh intervals (seconds)
MARKET_DATA_REFRESH_INTERVALS = {
    "vix": 60,
    "credit_spreads": 300,
    "repo_rates": 3600,
    "treasury_yields": 3600,
}

# API timeout (seconds)
API_TIMEOUT = 30

# Retry settings
MAX_RETRIES = 3
RETRY_BACKOFF_FACTOR = 2

# =============================================================================
# SECURITY
# =============================================================================

# Password requirements
MIN_PASSWORD_LENGTH = 12
PASSWORD_REQUIRE_UPPERCASE = True
PASSWORD_REQUIRE_LOWERCASE = True
PASSWORD_REQUIRE_DIGIT = True
PASSWORD_REQUIRE_SPECIAL = True

# Session settings
SESSION_EXPIRY_HOURS = 24
MAX_FAILED_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 30

# =============================================================================
# ML MODEL SETTINGS
# =============================================================================

# Model versions
DEFAULT_MODEL_VERSION = "1.0"

# Feature engineering
LOOKBACK_PERIODS = [7, 14, 30, 60, 90]  # days
ROLLING_WINDOWS = [5, 10, 20]  # days

# Training settings
TRAIN_TEST_SPLIT = 0.8
CROSS_VALIDATION_FOLDS = 5
