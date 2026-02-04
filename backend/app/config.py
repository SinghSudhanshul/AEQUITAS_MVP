"""
Aequitas LV-COP Backend - Application Configuration
====================================================

Centralized configuration management using Pydantic Settings.
All configuration is loaded from environment variables.

Author: Aequitas Engineering
Version: 1.0.0
"""

from functools import lru_cache
from typing import Any

from pydantic import AnyHttpUrl, PostgresDsn, RedisDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Uses Pydantic BaseSettings for type validation and environment variable parsing.
    All secrets should be set via environment variables, never hardcoded.
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )
    
    # ==========================================================================
    # ENVIRONMENT
    # ==========================================================================
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    TESTING: bool = False
    LOG_LEVEL: str = "INFO"
    
    # ==========================================================================
    # APPLICATION
    # ==========================================================================
    APP_NAME: str = "Aequitas LV-COP"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "change-me-in-production"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    RELOAD: bool = False
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # ==========================================================================
    # DATABASE
    # ==========================================================================
    DATABASE_URL: PostgresDsn = "postgresql://aequitas_user:password@localhost:5432/aequitas"  # type: ignore
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30
    DATABASE_POOL_RECYCLE: int = 1800
    DATABASE_ECHO: bool = False
    
    # Test database
    TEST_DATABASE_URL: PostgresDsn | None = None
    
    @property
    def database_url_sync(self) -> str:
        """Get synchronous database URL."""
        return str(self.DATABASE_URL)
    
    @property
    def database_url_async(self) -> str:
        """Get async database URL (replace postgresql with postgresql+asyncpg)."""
        url = str(self.DATABASE_URL)
        return url.replace("postgresql://", "postgresql+asyncpg://")
    
    # ==========================================================================
    # REDIS
    # ==========================================================================
    REDIS_URL: RedisDsn = "redis://localhost:6379/0"  # type: ignore
    REDIS_PASSWORD: str | None = None
    REDIS_MAX_CONNECTIONS: int = 10
    
    # Cache settings
    CACHE_TTL: int = 300  # 5 minutes
    FORECAST_CACHE_TTL: int = 3600  # 1 hour
    
    # ==========================================================================
    # CELERY (Task Queue)
    # ==========================================================================
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    CELERY_TASK_ALWAYS_EAGER: bool = False
    
    # ==========================================================================
    # AUTH0 (Authentication)
    # ==========================================================================
    AUTH0_DOMAIN: str = ""
    AUTH0_CLIENT_ID: str = ""
    AUTH0_CLIENT_SECRET: str = ""
    AUTH0_AUDIENCE: str = "https://api.aequitas.ai"
    AUTH0_ALGORITHMS: list[str] = ["RS256"]
    
    # JWT settings
    JWT_SECRET_KEY: str = "jwt-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    @property
    def auth0_issuer(self) -> str:
        """Get Auth0 issuer URL."""
        return f"https://{self.AUTH0_DOMAIN}/"
    
    @property
    def auth0_jwks_url(self) -> str:
        """Get Auth0 JWKS URL."""
        return f"https://{self.AUTH0_DOMAIN}/.well-known/jwks.json"
    
    # ==========================================================================
    # MINIO (Object Storage)
    # ==========================================================================
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_SECURE: bool = False
    MINIO_BUCKET_NAME: str = "aequitas"
    
    # ==========================================================================
    # STRIPE (Payments)
    # ==========================================================================
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRICE_ID_PREMIUM: str = ""
    STRIPE_PRICE_ID_ENTERPRISE: str = ""
    
    # ==========================================================================
    # SENDGRID (Email)
    # ==========================================================================
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = "noreply@aequitas.ai"
    SENDGRID_FROM_NAME: str = "Aequitas"
    
    # ==========================================================================
    # SENTRY (Error Tracking)
    # ==========================================================================
    SENTRY_DSN: str = ""
    SENTRY_TRACES_SAMPLE_RATE: float = 0.1
    SENTRY_PROFILES_SAMPLE_RATE: float = 0.1
    
    # ==========================================================================
    # MARKET DATA APIs
    # ==========================================================================
    FRED_API_KEY: str = ""
    
    # ==========================================================================
    # ENCRYPTION
    # ==========================================================================
    ENCRYPTION_KEY: str = ""
    ENCRYPTION_SALT: str = ""
    
    # ==========================================================================
    # RATE LIMITING
    # ==========================================================================
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_FREE_TIER: str = "100/day"
    RATE_LIMIT_PREMIUM_TIER: str = "10000/day"
    RATE_LIMIT_ENTERPRISE_TIER: str = "unlimited"
    
    # ==========================================================================
    # ML / MODEL SETTINGS
    # ==========================================================================
    MODEL_PATH: str = "/app/models"
    MODEL_VERSION: str = "1.0"
    FORECAST_HORIZON_DAYS: int = 5
    
    # Crisis detection thresholds
    VIX_CRISIS_THRESHOLD: float = 40.0
    VIX_ELEVATED_THRESHOLD: float = 25.0
    CREDIT_SPREAD_CRISIS_THRESHOLD: float = 200.0
    CREDIT_SPREAD_ELEVATED_THRESHOLD: float = 150.0
    
    # ==========================================================================
    # MLFLOW (Model Registry)
    # ==========================================================================
    MLFLOW_TRACKING_URI: str = "http://localhost:5000"
    MLFLOW_EXPERIMENT_NAME: str = "aequitas-forecasting"
    
    # ==========================================================================
    # MONITORING
    # ==========================================================================
    PROMETHEUS_ENABLED: bool = True
    PROMETHEUS_PORT: int = 9090
    OTEL_EXPORTER_OTLP_ENDPOINT: str = "http://localhost:4317"
    OTEL_SERVICE_NAME: str = "aequitas-backend"
    
    # ==========================================================================
    # NOTIFICATIONS
    # ==========================================================================
    SLACK_WEBHOOK_URL: str = ""
    PAGERDUTY_API_KEY: str = ""
    PAGERDUTY_SERVICE_ID: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_FROM_NUMBER: str = ""
    
    # ==========================================================================
    # FEATURE FLAGS
    # ==========================================================================
    FEATURE_GAMIFICATION_ENABLED: bool = True
    FEATURE_CRISIS_SIMULATOR_ENABLED: bool = True
    FEATURE_AI_AGENTS_ENABLED: bool = True
    FEATURE_BROKER_API_ENABLED: bool = True
    FEATURE_WEBSOCKET_ENABLED: bool = True
    
    # ==========================================================================
    # COMPUTED PROPERTIES
    # ==========================================================================
    @property
    def is_production(self) -> bool:
        """Check if running in production."""
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development."""
        return self.ENVIRONMENT.lower() == "development"
    
    @property
    def is_testing(self) -> bool:
        """Check if running in test mode."""
        return self.TESTING or self.ENVIRONMENT.lower() == "test"


@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance.
    
    Uses lru_cache to ensure settings are only loaded once from environment.
    """
    return Settings()


# Global settings instance
settings = get_settings()
