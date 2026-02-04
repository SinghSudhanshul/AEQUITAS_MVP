"""
Aequitas LV-COP Backend - Audit Log Model
=========================================

Model for comprehensive audit logging (SOC 2 compliance).

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import INET, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.enums import AuditAction
from app.models.base import BaseModel


class AuditLog(BaseModel):
    """
    Audit log model for compliance and security.
    
    Tracks all data changes with:
    - Who made the change
    - When it was made
    - What was changed (before/after)
    - From where (IP, user agent)
    
    Required for:
    - SOC 2 compliance
    - GDPR compliance
    - 7-year retention
    """
    
    __tablename__ = "audit_logs"
    
    __table_args__ = (
        Index("ix_audit_org_date", "organization_id", "created_at"),
        Index("ix_audit_user", "user_id", "created_at"),
        Index("ix_audit_action", "action", "created_at"),
        Index("ix_audit_entity", "entity_type", "entity_id"),
        {"timescaledb_hypertable": {
            "time_column_name": "created_at",
            "partitioning_column": "organization_id",
        }},
    )
    
    # Tenant (nullable for system events)
    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    # User who performed action (nullable for system events)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    user_email: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # Action
    action: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    
    # Entity affected
    entity_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    
    entity_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    
    entity_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # Description
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Data changes
    old_values: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    new_values: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    changed_fields: Mapped[Optional[list]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    # Request context
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45),  # IPv6 compatible
        nullable=True,
    )
    
    user_agent: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    request_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    session_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # API endpoint
    endpoint: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    http_method: Mapped[Optional[str]] = mapped_column(
        String(10),
        nullable=True,
    )
    
    # Risk level
    risk_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="low",
    )
    
    # Status
    success: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )
    
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Additional metadata
    metadata: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    # Compliance tags
    compliance_tags: Mapped[Optional[list]] = mapped_column(
        JSONB,
        nullable=True,
    )
    
    def __repr__(self) -> str:
        return f"<AuditLog(action={self.action}, entity={self.entity_type}, user={self.user_email})>"


# Risk level classification
class AuditRiskLevel:
    """Risk levels for audit events."""
    LOW = "low"          # Read operations
    MEDIUM = "medium"    # Create/Update operations
    HIGH = "high"        # Delete operations, security changes
    CRITICAL = "critical"  # Auth failures, permission changes


# High-risk actions that require enhanced logging
HIGH_RISK_ACTIONS = {
    AuditAction.DELETE.value,
    AuditAction.EXPORT.value,
    "permission_change",
    "password_change",
    "api_key_rotation",
    "broker_connect",
    "subscription_change",
}
