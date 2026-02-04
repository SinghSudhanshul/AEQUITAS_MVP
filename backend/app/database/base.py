"""
Aequitas LV-COP Backend - Database Base Class
=============================================

SQLAlchemy declarative base with common model functionality.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import datetime
from typing import Any
import uuid

from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, declared_attr


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.
    
    Provides:
    - UUID primary key generation
    - Automatic table naming from class name
    - Created/updated timestamp tracking
    - Common utility methods
    """
    
    # Use UUID as default ID type
    id: Any
    
    @declared_attr.directive
    def __tablename__(cls) -> str:
        """
        Generate table name from class name.
        
        Converts CamelCase to snake_case and pluralizes.
        Example: UserProfile -> user_profiles
        """
        import re
        name = re.sub(r'(?<!^)(?=[A-Z])', '_', cls.__name__).lower()
        # Simple pluralization
        if name.endswith('s') or name.endswith('x') or name.endswith('z'):
            return name + 'es'
        elif name.endswith('y'):
            return name[:-1] + 'ies'
        else:
            return name + 's'
    
    def to_dict(self) -> dict[str, Any]:
        """
        Convert model instance to dictionary.
        
        Handles UUID and datetime serialization.
        """
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, uuid.UUID):
                value = str(value)
            elif isinstance(value, datetime):
                value = value.isoformat()
            result[column.name] = value
        return result
    
    def __repr__(self) -> str:
        """String representation of the model."""
        class_name = self.__class__.__name__
        id_value = getattr(self, 'id', None)
        return f"<{class_name}(id={id_value})>"


class TimestampMixin:
    """
    Mixin that adds created_at and updated_at timestamps.
    
    - created_at: Set automatically on insert
    - updated_at: Set automatically on insert and update
    """
    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class SoftDeleteMixin:
    """
    Mixin for soft delete functionality.
    
    Records are marked as deleted instead of being removed from database.
    """
    
    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )
    
    @property
    def is_deleted(self) -> bool:
        """Check if record is soft-deleted."""
        return self.deleted_at is not None


class AuditMixin:
    """
    Mixin for audit trail fields.
    
    Tracks who created and last updated the record.
    """
    
    created_by = Column(
        UUID(as_uuid=True),
        nullable=True,
    )
    
    updated_by = Column(
        UUID(as_uuid=True),
        nullable=True,
    )


class TenantMixin:
    """
    Mixin for multi-tenant models.
    
    All queries should be filtered by organization_id for data isolation.
    """
    
    organization_id = Column(
        UUID(as_uuid=True),
        nullable=False,
        index=True,
    )
