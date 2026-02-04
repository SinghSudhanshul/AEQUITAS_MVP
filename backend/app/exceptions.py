"""
Aequitas LV-COP Backend - Custom Exceptions
===========================================

Centralized exception definitions with HTTP status codes and error codes.
All custom exceptions inherit from AequitasException.

Author: Aequitas Engineering
Version: 1.0.0
"""

from typing import Any

from fastapi import HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class AequitasException(Exception):
    """
    Base exception for all Aequitas application errors.
    
    Attributes:
        message: Human-readable error message
        error_code: Machine-readable error code
        status_code: HTTP status code
        details: Additional error details
    """
    
    def __init__(
        self,
        message: str,
        error_code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> dict[str, Any]:
        """Convert exception to dictionary for JSON response."""
        return {
            "error": {
                "code": self.error_code,
                "message": self.message,
                "details": self.details,
            }
        }


# =============================================================================
# AUTHENTICATION EXCEPTIONS
# =============================================================================

class AuthenticationError(AequitasException):
    """Raised when authentication fails."""
    
    def __init__(
        self,
        message: str = "Authentication failed",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details,
        )


class InvalidTokenError(AuthenticationError):
    """Raised when token is invalid or expired."""
    
    def __init__(
        self,
        message: str = "Invalid or expired token",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message=message, details=details)
        self.error_code = "INVALID_TOKEN"


class TokenExpiredError(AuthenticationError):
    """Raised when token has expired."""
    
    def __init__(
        self,
        message: str = "Token has expired",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message=message, details=details)
        self.error_code = "TOKEN_EXPIRED"


# =============================================================================
# AUTHORIZATION EXCEPTIONS
# =============================================================================

class AuthorizationError(AequitasException):
    """Raised when user lacks permission for an action."""
    
    def __init__(
        self,
        message: str = "Permission denied",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            status_code=status.HTTP_403_FORBIDDEN,
            details=details,
        )


class InsufficientPermissionsError(AuthorizationError):
    """Raised when user lacks specific permissions."""
    
    def __init__(
        self,
        required_permission: str,
        message: str | None = None,
    ) -> None:
        super().__init__(
            message=message or f"Missing required permission: {required_permission}",
            details={"required_permission": required_permission},
        )
        self.error_code = "INSUFFICIENT_PERMISSIONS"


class SubscriptionRequiredError(AuthorizationError):
    """Raised when feature requires a higher subscription tier."""
    
    def __init__(
        self,
        required_tier: str,
        current_tier: str,
        feature: str,
    ) -> None:
        super().__init__(
            message=f"Feature '{feature}' requires {required_tier} subscription",
            details={
                "required_tier": required_tier,
                "current_tier": current_tier,
                "feature": feature,
            },
        )
        self.error_code = "SUBSCRIPTION_REQUIRED"
        self.status_code = status.HTTP_402_PAYMENT_REQUIRED


# =============================================================================
# RESOURCE EXCEPTIONS
# =============================================================================

class NotFoundError(AequitasException):
    """Raised when a requested resource is not found."""
    
    def __init__(
        self,
        resource_type: str,
        resource_id: str | None = None,
        message: str | None = None,
    ) -> None:
        super().__init__(
            message=message or f"{resource_type} not found",
            error_code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={
                "resource_type": resource_type,
                "resource_id": resource_id,
            } if resource_id else {"resource_type": resource_type},
        )


class ResourceExistsError(AequitasException):
    """Raised when trying to create a resource that already exists."""
    
    def __init__(
        self,
        resource_type: str,
        identifier: str,
        message: str | None = None,
    ) -> None:
        super().__init__(
            message=message or f"{resource_type} already exists: {identifier}",
            error_code="RESOURCE_EXISTS",
            status_code=status.HTTP_409_CONFLICT,
            details={
                "resource_type": resource_type,
                "identifier": identifier,
            },
        )


# =============================================================================
# VALIDATION EXCEPTIONS
# =============================================================================

class ValidationError(AequitasException):
    """Raised when input validation fails."""
    
    def __init__(
        self,
        message: str = "Validation error",
        errors: list[dict[str, Any]] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details={"errors": errors or []},
        )


class InvalidInputError(ValidationError):
    """Raised for invalid input data."""
    
    def __init__(
        self,
        field: str,
        message: str,
        value: Any = None,
    ) -> None:
        super().__init__(
            message=message,
            errors=[{
                "field": field,
                "message": message,
                "value": str(value) if value is not None else None,
            }],
        )
        self.error_code = "INVALID_INPUT"


# =============================================================================
# RATE LIMITING EXCEPTIONS
# =============================================================================

class RateLimitExceededError(AequitasException):
    """Raised when rate limit is exceeded."""
    
    def __init__(
        self,
        limit: str,
        retry_after: int | None = None,
    ) -> None:
        super().__init__(
            message=f"Rate limit exceeded: {limit}",
            error_code="RATE_LIMIT_EXCEEDED",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            details={
                "limit": limit,
                "retry_after": retry_after,
            },
        )


# =============================================================================
# BUSINESS LOGIC EXCEPTIONS
# =============================================================================

class ForecastError(AequitasException):
    """Raised when forecast generation fails."""
    
    def __init__(
        self,
        message: str = "Forecast generation failed",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="FORECAST_ERROR",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details,
        )


class InsufficientDataError(AequitasException):
    """Raised when there's not enough data for an operation."""
    
    def __init__(
        self,
        message: str = "Insufficient data",
        required: int | None = None,
        available: int | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="INSUFFICIENT_DATA",
            status_code=status.HTTP_400_BAD_REQUEST,
            details={
                "required": required,
                "available": available,
            },
        )


class BrokerConnectionError(AequitasException):
    """Raised when broker API connection fails."""
    
    def __init__(
        self,
        broker_name: str,
        message: str = "Broker connection failed",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="BROKER_CONNECTION_ERROR",
            status_code=status.HTTP_502_BAD_GATEWAY,
            details={"broker": broker_name, **(details or {})},
        )


class ModelNotFoundError(AequitasException):
    """Raised when ML model is not found."""
    
    def __init__(
        self,
        model_name: str,
        version: str | None = None,
    ) -> None:
        super().__init__(
            message=f"Model not found: {model_name}",
            error_code="MODEL_NOT_FOUND",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details={
                "model_name": model_name,
                "version": version,
            },
        )


# =============================================================================
# EXTERNAL SERVICE EXCEPTIONS
# =============================================================================

class ExternalServiceError(AequitasException):
    """Raised when an external service fails."""
    
    def __init__(
        self,
        service_name: str,
        message: str = "External service error",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="EXTERNAL_SERVICE_ERROR",
            status_code=status.HTTP_502_BAD_GATEWAY,
            details={"service": service_name, **(details or {})},
        )


class PaymentError(AequitasException):
    """Raised when payment processing fails."""
    
    def __init__(
        self,
        message: str = "Payment processing failed",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            error_code="PAYMENT_ERROR",
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            details=details,
        )


# =============================================================================
# EXCEPTION HANDLERS
# =============================================================================

async def aequitas_exception_handler(
    request: Request,
    exc: AequitasException,
) -> JSONResponse:
    """Handle AequitasException and return JSON response."""
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.to_dict(),
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Handle Pydantic validation errors."""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": {"errors": errors},
            }
        },
    )
