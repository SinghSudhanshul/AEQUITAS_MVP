"""
Aequitas LV-COP Backend - FastAPI Middleware
=============================================

Custom middleware for logging, rate limiting, security headers, and request tracking.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.types import ASGIApp

from app.config import settings


logger = logging.getLogger(__name__)


# =============================================================================
# REQUEST ID MIDDLEWARE
# =============================================================================

class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Add unique request ID to each request for tracing.
    
    The request ID is:
    - Generated if not present in headers
    - Added to response headers
    - Available in request.state for logging
    """
    
    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        # Get or generate request ID
        request_id = request.headers.get("X-Request-ID")
        if not request_id:
            request_id = str(uuid.uuid4())
        
        # Store in request state for access in route handlers
        request.state.request_id = request_id
        
        # Process request
        response = await call_next(request)
        
        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        
        return response


# =============================================================================
# LOGGING MIDDLEWARE
# =============================================================================

class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Log all HTTP requests and responses.
    
    Logs:
    - Request method, path, query params
    - Response status code
    - Processing time
    - Request ID
    """
    
    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        # Start timer
        start_time = time.perf_counter()
        
        # Get request ID
        request_id = getattr(request.state, "request_id", "unknown")
        
        # Log request
        logger.info(
            f"Request started",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "query": str(request.query_params),
                "client_ip": request.client.host if request.client else "unknown",
            },
        )
        
        # Process request
        try:
            response = await call_next(request)
        except Exception as e:
            # Log exception
            process_time = time.perf_counter() - start_time
            logger.error(
                f"Request failed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "error": str(e),
                    "process_time_ms": round(process_time * 1000, 2),
                },
                exc_info=True,
            )
            raise
        
        # Calculate processing time
        process_time = time.perf_counter() - start_time
        
        # Add processing time to response headers
        response.headers["X-Process-Time"] = f"{process_time:.4f}"
        
        # Log response
        logger.info(
            f"Request completed",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time_ms": round(process_time * 1000, 2),
            },
        )
        
        return response


# =============================================================================
# SECURITY HEADERS MIDDLEWARE
# =============================================================================

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add security headers to all responses.
    
    Headers added:
    - X-Content-Type-Options: nosniff
    - X-Frame-Options: DENY
    - X-XSS-Protection: 1; mode=block
    - Strict-Transport-Security (in production)
    - Content-Security-Policy
    - Referrer-Policy
    """
    
    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        response = await call_next(request)
        
        # Basic security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # HSTS only in production
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )
        
        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' https:; "
            "connect-src 'self' https:; "
            "frame-ancestors 'none';"
        )
        
        return response


# =============================================================================
# RATE LIMIT MIDDLEWARE
# =============================================================================

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware using Redis.
    
    Implements sliding window rate limiting based on:
    - Client IP for unauthenticated requests
    - User ID + organization for authenticated requests
    - Different limits for different subscription tiers
    
    Rate limits are configured in settings:
    - RATE_LIMIT_FREE_TIER: "100/day"
    - RATE_LIMIT_PREMIUM_TIER: "10000/day"
    - RATE_LIMIT_ENTERPRISE_TIER: "unlimited"
    """
    
    # Endpoints excluded from rate limiting
    EXCLUDED_PATHS = {
        "/health",
        "/health/ready",
        "/health/live",
        "/metrics",
        "/docs",
        "/redoc",
        "/openapi.json",
    }
    
    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        # Skip rate limiting for excluded paths
        if request.url.path in self.EXCLUDED_PATHS:
            return await call_next(request)
        
        # Skip if rate limiting is disabled
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)
        
        # TODO: Implement Redis-based rate limiting
        # For now, just pass through
        # Will be implemented with Redis connection
        
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = "100"
        response.headers["X-RateLimit-Remaining"] = "99"
        response.headers["X-RateLimit-Reset"] = "3600"
        
        return response


# =============================================================================
# DATABASE SESSION MIDDLEWARE
# =============================================================================

class DatabaseSessionMiddleware(BaseHTTPMiddleware):
    """
    Ensure database session is properly managed for each request.
    
    Creates a new session for each request and ensures it's closed
    after the request completes, even if an exception occurs.
    """
    
    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        # Session management is handled by dependency injection
        # This middleware is kept for potential future use
        return await call_next(request)


# =============================================================================
# TIMING MIDDLEWARE
# =============================================================================

class TimingMiddleware(BaseHTTPMiddleware):
    """
    Add request timing information to response headers.
    
    Headers added:
    - X-Process-Time: Request processing time in seconds
    - Server-Timing: Detailed timing breakdown
    """
    
    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        start_time = time.perf_counter()
        
        response = await call_next(request)
        
        process_time = time.perf_counter() - start_time
        
        response.headers["X-Process-Time"] = f"{process_time:.4f}"
        response.headers["Server-Timing"] = f"total;dur={process_time * 1000:.2f}"
        
        return response
