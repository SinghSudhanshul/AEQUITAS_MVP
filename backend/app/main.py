"""
Aequitas LV-COP Backend - FastAPI Application
=============================================

Main application entry point. Initializes FastAPI app with all middleware,
routers, exception handlers, and lifecycle events.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import sentry_sdk
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse, ORJSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.v1.router import api_router as api_v1_router
from app.config import settings
from app.core.logging import setup_logging
from app.database.session import close_db_connection, init_db_connection
from app.database.redis import close_redis_connection, init_redis_connection
from app.exceptions import (
    AequitasException,
    aequitas_exception_handler,
    validation_exception_handler,
)
from app.middleware import (
    LoggingMiddleware,
    RateLimitMiddleware,
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
)


# =============================================================================
# LOGGING SETUP
# =============================================================================
logger = logging.getLogger(__name__)


# =============================================================================
# SENTRY INITIALIZATION
# =============================================================================
def init_sentry() -> None:
    """Initialize Sentry error tracking if DSN is configured."""
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
            profiles_sample_rate=settings.SENTRY_PROFILES_SAMPLE_RATE,
            integrations=[
                FastApiIntegration(transaction_style="endpoint"),
                SqlalchemyIntegration(),
            ],
            send_default_pii=False,
        )
        logger.info("Sentry initialized")


# =============================================================================
# LIFESPAN MANAGEMENT
# =============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.
    
    Handles startup and shutdown events:
    - Startup: Initialize database, Redis, logging, Sentry
    - Shutdown: Close database and Redis connections
    """
    # ===== STARTUP =====
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    # Setup structured logging
    setup_logging(settings.LOG_LEVEL)
    
    # Initialize Sentry
    init_sentry()
    
    # Initialize database connection
    await init_db_connection()
    logger.info("Database connection initialized")
    
    # Initialize Redis connection
    await init_redis_connection()
    logger.info("Redis connection initialized")
    
    logger.info("Application startup complete")
    
    yield
    
    # ===== SHUTDOWN =====
    logger.info("Starting application shutdown")
    
    # Close database connection
    await close_db_connection()
    logger.info("Database connection closed")
    
    # Close Redis connection
    await close_redis_connection()
    logger.info("Redis connection closed")
    
    logger.info("Application shutdown complete")


# =============================================================================
# APPLICATION FACTORY
# =============================================================================
def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application instance
    """
    application = FastAPI(
        title=settings.APP_NAME,
        description="Crisis-resilient intraday liquidity forecasting API",
        version=settings.APP_VERSION,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        default_response_class=ORJSONResponse,
        lifespan=lifespan,
    )
    
    # =========================================================================
    # MIDDLEWARE (order matters - first added = last executed)
    # =========================================================================
    
    # Security headers
    application.add_middleware(SecurityHeadersMiddleware)
    
    # Request ID tracking
    application.add_middleware(RequestIDMiddleware)
    
    # Request/response logging
    if settings.DEBUG:
        application.add_middleware(LoggingMiddleware)
    
    # Rate limiting
    if settings.RATE_LIMIT_ENABLED:
        application.add_middleware(RateLimitMiddleware)
    
    # GZIP compression
    application.add_middleware(GZipMiddleware, minimum_size=500)
    
    # CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Process-Time"],
    )
    
    # =========================================================================
    # EXCEPTION HANDLERS
    # =========================================================================
    application.add_exception_handler(AequitasException, aequitas_exception_handler)
    application.add_exception_handler(RequestValidationError, validation_exception_handler)
    
    # =========================================================================
    # ROUTERS
    # =========================================================================
    
    # API v1
    application.include_router(
        api_v1_router,
        prefix=settings.API_V1_PREFIX,
    )
    
    # =========================================================================
    # PROMETHEUS METRICS
    # =========================================================================
    if settings.PROMETHEUS_ENABLED:
        Instrumentator().instrument(application).expose(application, endpoint="/metrics")
    
    # =========================================================================
    # HEALTH CHECK ENDPOINTS
    # =========================================================================
    @application.get(
        "/health",
        tags=["Health"],
        summary="Health check",
        response_model=dict,
    )
    async def health_check() -> dict:
        """
        Basic health check endpoint.
        
        Returns application status and version.
        Does not check external dependencies (use /health/ready for that).
        """
        return {
            "status": "healthy",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }
    
    @application.get(
        "/health/ready",
        tags=["Health"],
        summary="Readiness check",
        response_model=dict,
    )
    async def readiness_check() -> dict:
        """
        Readiness check endpoint.
        
        Verifies all external dependencies are accessible:
        - Database connection
        - Redis connection
        
        Returns 503 if any dependency is unavailable.
        """
        from app.database.session import check_db_connection
        from app.database.redis import check_redis_connection
        
        checks = {
            "database": await check_db_connection(),
            "redis": await check_redis_connection(),
        }
        
        all_healthy = all(checks.values())
        
        return JSONResponse(
            status_code=status.HTTP_200_OK if all_healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "ready" if all_healthy else "not_ready",
                "checks": checks,
            },
        )
    
    @application.get(
        "/health/live",
        tags=["Health"],
        summary="Liveness check",
        response_model=dict,
    )
    async def liveness_check() -> dict:
        """
        Liveness check endpoint for Kubernetes.
        
        Returns 200 if the application process is running.
        Used by Kubernetes to determine if the container should be restarted.
        """
        return {"status": "alive"}
    
    return application


# =============================================================================
# APPLICATION INSTANCE
# =============================================================================
app = create_application()


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================
def main() -> None:
    """Run the application using uvicorn."""
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        workers=settings.WORKERS if not settings.RELOAD else 1,
        log_level=settings.LOG_LEVEL.lower(),
    )


if __name__ == "__main__":
    main()
