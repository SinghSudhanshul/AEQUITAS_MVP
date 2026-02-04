"""
Aequitas LV-COP Backend - Base Schemas
======================================

Base Pydantic schemas used across the application.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import datetime
from typing import Any, Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# Type variable for generic responses
T = TypeVar("T")


class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        str_strip_whitespace=True,
    )


class TimestampMixin(BaseModel):
    """Mixin for timestamp fields."""
    
    created_at: datetime
    updated_at: datetime


class IDMixin(BaseModel):
    """Mixin for ID field."""
    
    id: UUID


class ResponseModel(BaseSchema, Generic[T]):
    """
    Standard API response wrapper.
    
    All successful API responses should use this format.
    """
    
    success: bool = True
    data: T | None = None
    message: str | None = None


class ErrorResponse(BaseSchema):
    """Standard error response format."""
    
    success: bool = False
    error: dict = Field(
        ...,
        example={
            "code": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "details": {"field": "value"},
        },
    )


class PaginatedResponse(BaseSchema, Generic[T]):
    """Paginated response wrapper."""
    
    success: bool = True
    data: list[T]
    pagination: dict = Field(
        ...,
        example={
            "page": 1,
            "page_size": 20,
            "total_items": 100,
            "total_pages": 5,
            "has_next": True,
            "has_prev": False,
        },
    )


class PaginationMeta(BaseSchema):
    """Pagination metadata."""
    
    page: int = Field(ge=1, default=1)
    page_size: int = Field(ge=1, le=100, default=20)
    total_items: int = Field(ge=0)
    total_pages: int = Field(ge=0)
    has_next: bool
    has_prev: bool
    
    @classmethod
    def from_query(
        cls,
        page: int,
        page_size: int,
        total_items: int,
    ) -> "PaginationMeta":
        """Create pagination meta from query params."""
        total_pages = (total_items + page_size - 1) // page_size
        return cls(
            page=page,
            page_size=page_size,
            total_items=total_items,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        )


class HealthResponse(BaseSchema):
    """Health check response."""
    
    status: str = Field(example="healthy")
    app: str = Field(example="Aequitas LV-COP")
    version: str = Field(example="1.0.0")
    environment: str = Field(example="production")


class ReadinessResponse(BaseSchema):
    """Readiness check response."""
    
    status: str = Field(example="ready")
    checks: dict = Field(
        example={
            "database": True,
            "redis": True,
        }
    )
