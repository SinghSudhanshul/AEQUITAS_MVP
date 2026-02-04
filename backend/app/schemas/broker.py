"""
Aequitas LV-COP Backend - Broker Schemas
========================================

Broker connection and sync schemas.

Author: Aequitas Engineering
Version: 1.0.0
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import Field, SecretStr

from app.core.enums import BrokerType, ConnectionStatus
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin


class BrokerConnectionCreate(BaseSchema):
    """Schema for creating a broker connection."""
    
    broker_type: BrokerType
    broker_name: str = Field(..., max_length=100)
    display_name: Optional[str] = Field(None, max_length=255)
    
    # Credentials (will be encrypted)
    api_key: Optional[SecretStr] = None
    api_secret: Optional[SecretStr] = None
    api_passphrase: Optional[SecretStr] = None
    
    # OAuth
    oauth_code: Optional[str] = None
    oauth_redirect_uri: Optional[str] = None
    
    # Endpoint
    api_endpoint: Optional[str] = Field(None, max_length=500)
    
    # Settings
    sync_positions: bool = True
    sync_transactions: bool = True
    sync_balances: bool = True
    sync_interval_minutes: int = Field(default=60, ge=5, le=1440)


class BrokerConnectionUpdate(BaseSchema):
    """Schema for updating a broker connection."""
    
    display_name: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None
    sync_enabled: Optional[bool] = None
    sync_positions: Optional[bool] = None
    sync_transactions: Optional[bool] = None
    sync_balances: Optional[bool] = None
    sync_interval_minutes: Optional[int] = Field(None, ge=5, le=1440)
    settings: Optional[dict] = None


class BrokerConnectionResponse(IDMixin, TimestampMixin):
    """Broker connection response schema."""
    
    organization_id: UUID
    broker_type: BrokerType
    broker_name: str
    display_name: Optional[str] = None
    
    status: ConnectionStatus
    is_active: bool
    
    # Sync config
    sync_enabled: bool
    sync_interval_minutes: int
    sync_positions: bool
    sync_transactions: bool
    sync_balances: bool
    
    # Status
    last_sync_at: Optional[datetime] = None
    last_sync_success: Optional[bool] = None
    next_sync_at: Optional[datetime] = None
    consecutive_failures: int = 0
    
    # Account info
    broker_account_id: Optional[str] = None
    broker_account_name: Optional[str] = None
    
    # Note: Credentials are never returned


class BrokerSyncRequest(BaseSchema):
    """Request to trigger manual sync."""
    
    sync_positions: bool = True
    sync_transactions: bool = True
    sync_balances: bool = True
    force: bool = False  # Ignore rate limits


class BrokerSyncResponse(BaseSchema):
    """Response from broker sync."""
    
    connection_id: UUID
    sync_started_at: datetime
    sync_completed_at: Optional[datetime] = None
    
    success: bool
    error_message: Optional[str] = None
    
    # Results
    positions_synced: int = 0
    transactions_synced: int = 0
    balances_synced: int = 0
    
    # Changes
    positions_added: int = 0
    positions_updated: int = 0
    transactions_added: int = 0


class BrokerOAuthStart(BaseSchema):
    """OAuth flow start response."""
    
    authorization_url: str
    state: str
    code_verifier: Optional[str] = None


class BrokerOAuthCallback(BaseSchema):
    """OAuth callback request."""
    
    code: str
    state: str


class BrokerHealthCheck(BaseSchema):
    """Broker health check response."""
    
    connection_id: UUID
    broker_name: str
    is_healthy: bool
    response_time_ms: int
    last_check: datetime
    error: Optional[str] = None
