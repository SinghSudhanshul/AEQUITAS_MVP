"""
Aequitas LV-COP Backend - Broker Connection Model
=================================================

Model for storing encrypted broker API connections.

Author: Aequitas Engineering
Version: 1.0.0
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import BrokerType, ConnectionStatus
from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.organization import Organization


class BrokerConnection(BaseModel):
    """
    Broker connection model for API integrations.
    
    Features:
    - Encrypted credentials (AES-256)
    - Connection status tracking
    - Sync scheduling
    - Error logging
    """
    
    __tablename__ = "broker_connections"
    
    # Tenant
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # User who created connection
    created_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    
    # Broker info
    broker_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    
    broker_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    
    # Display name for UI
    display_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # Connection status
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default=ConnectionStatus.PENDING.value,
        index=True,
    )
    
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    
    # API credentials (encrypted)
    api_key_encrypted: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    api_secret_encrypted: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    api_passphrase_encrypted: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    # OAuth tokens (encrypted)
    access_token_encrypted: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    refresh_token_encrypted: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    token_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # API endpoint
    api_endpoint: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    
    # Connection settings
    settings: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        default=dict,
    )
    
    # Sync configuration
    sync_enabled: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    
    sync_interval_minutes: Mapped[int] = mapped_column(
        nullable=False,
        default=60,
    )
    
    sync_positions: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    
    sync_transactions: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    
    sync_balances: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    
    # Sync status
    last_sync_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    last_sync_success: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True,
    )
    
    last_sync_error: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    next_sync_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Connection health
    last_health_check: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    health_check_passed: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True,
    )
    
    consecutive_failures: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )
    
    # Account info from broker
    broker_account_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    broker_account_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="broker_connections",
    )
    
    def __repr__(self) -> str:
        return f"<BrokerConnection(broker={self.broker_name}, status={self.status})>"
    
    @property
    def is_connected(self) -> bool:
        """Check if broker is connected."""
        return self.status == ConnectionStatus.CONNECTED.value and self.is_active
    
    @property
    def needs_reconnect(self) -> bool:
        """Check if broker needs reconnection."""
        return self.consecutive_failures >= 3
    
    @property
    def is_token_expired(self) -> bool:
        """Check if OAuth token is expired."""
        if not self.token_expires_at:
            return False
        return datetime.now(self.token_expires_at.tzinfo) >= self.token_expires_at
