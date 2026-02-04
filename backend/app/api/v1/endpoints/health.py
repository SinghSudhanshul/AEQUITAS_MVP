"""
Aequitas LV-COP Backend - Health Check Endpoints
===============================================

Health, readiness, and liveness check endpoints.

Author: Aequitas Engineering
Version: 1.0.0
"""

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.session import check_db_connection
from app.database.redis import check_redis_connection
from app.schemas.base import HealthResponse, ReadinessResponse

router = APIRouter()


@router.get(
    "",
    response_model=HealthResponse,
    summary="Health check",
    description="Basic health check endpoint. Returns application status.",
)
async def health_check() -> HealthResponse:
    """
    Basic health check.
    
    Returns application name, version, and environment.
    Does not check external dependencies.
    """
    return HealthResponse(
        status="healthy",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
    )


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    summary="Readiness check",
    description="Readiness check for Kubernetes. Verifies external dependencies.",
)
async def readiness_check() -> JSONResponse:
    """
    Readiness check for Kubernetes/load balancers.
    
    Verifies:
    - Database connection
    - Redis connection
    
    Returns 503 if any dependency is unavailable.
    """
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


@router.get(
    "/live",
    summary="Liveness check",
    description="Liveness check for Kubernetes. Returns 200 if process is alive.",
)
async def liveness_check() -> dict:
    """
    Liveness check for Kubernetes.
    
    Simply returns 200 if the application is running.
    Used to determine if container needs restart.
    """
    return {"status": "alive"}
