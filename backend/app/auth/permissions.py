"""
Aequitas LV-COP Backend - RBAC Permissions
==========================================

Role-based access control implementation.

Author: Aequitas Engineering
Version: 1.0.0
"""

from enum import Enum
from typing import Optional

from app.core.enums import Role, Tier


class Permission(str, Enum):
    """All available permissions."""
    
    # Forecast permissions
    FORECAST_READ = "forecast:read"
    FORECAST_CREATE = "forecast:create"
    FORECAST_REALTIME = "forecast:realtime"
    
    # Position permissions
    POSITION_READ = "position:read"
    POSITION_CREATE = "position:create"
    POSITION_UPDATE = "position:update"
    POSITION_DELETE = "position:delete"
    
    # User permissions
    USER_READ = "user:read"
    USER_CREATE = "user:create"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"
    USER_INVITE = "user:invite"
    
    # Organization permissions
    ORG_READ = "org:read"
    ORG_UPDATE = "org:update"
    ORG_BILLING = "org:billing"
    
    # Broker permissions
    BROKER_READ = "broker:read"
    BROKER_CONNECT = "broker:connect"
    BROKER_SYNC = "broker:sync"
    BROKER_DELETE = "broker:delete"
    
    # Analytics permissions
    ANALYTICS_READ = "analytics:read"
    ANALYTICS_EXPORT = "analytics:export"
    
    # Admin permissions
    ADMIN_ALL = "admin:*"
    AUDIT_READ = "audit:read"


# Role -> Permissions mapping
ROLE_PERMISSIONS: dict[str, set[str]] = {
    Role.ADMIN.value: {
        Permission.ADMIN_ALL.value,
        Permission.FORECAST_READ.value,
        Permission.FORECAST_CREATE.value,
        Permission.FORECAST_REALTIME.value,
        Permission.POSITION_READ.value,
        Permission.POSITION_CREATE.value,
        Permission.POSITION_UPDATE.value,
        Permission.POSITION_DELETE.value,
        Permission.USER_READ.value,
        Permission.USER_CREATE.value,
        Permission.USER_UPDATE.value,
        Permission.USER_DELETE.value,
        Permission.USER_INVITE.value,
        Permission.ORG_READ.value,
        Permission.ORG_UPDATE.value,
        Permission.ORG_BILLING.value,
        Permission.BROKER_READ.value,
        Permission.BROKER_CONNECT.value,
        Permission.BROKER_SYNC.value,
        Permission.BROKER_DELETE.value,
        Permission.ANALYTICS_READ.value,
        Permission.ANALYTICS_EXPORT.value,
        Permission.AUDIT_READ.value,
    },
    Role.MANAGER.value: {
        Permission.FORECAST_READ.value,
        Permission.FORECAST_CREATE.value,
        Permission.POSITION_READ.value,
        Permission.POSITION_CREATE.value,
        Permission.POSITION_UPDATE.value,
        Permission.POSITION_DELETE.value,
        Permission.USER_READ.value,
        Permission.USER_INVITE.value,
        Permission.ORG_READ.value,
        Permission.BROKER_READ.value,
        Permission.BROKER_CONNECT.value,
        Permission.BROKER_SYNC.value,
        Permission.ANALYTICS_READ.value,
        Permission.ANALYTICS_EXPORT.value,
    },
    Role.ANALYST.value: {
        Permission.FORECAST_READ.value,
        Permission.FORECAST_CREATE.value,
        Permission.POSITION_READ.value,
        Permission.POSITION_CREATE.value,
        Permission.POSITION_UPDATE.value,
        Permission.ORG_READ.value,
        Permission.ANALYTICS_READ.value,
    },
    Role.VIEWER.value: {
        Permission.FORECAST_READ.value,
        Permission.POSITION_READ.value,
        Permission.ORG_READ.value,
        Permission.ANALYTICS_READ.value,
    },
}

# Tier -> Additional permissions
TIER_PERMISSIONS: dict[str, set[str]] = {
    Tier.FREE.value: set(),
    Tier.PREMIUM.value: {
        Permission.BROKER_READ.value,
        Permission.BROKER_CONNECT.value,
        Permission.BROKER_SYNC.value,
        Permission.ANALYTICS_EXPORT.value,
    },
    Tier.ENTERPRISE.value: {
        Permission.BROKER_READ.value,
        Permission.BROKER_CONNECT.value,
        Permission.BROKER_SYNC.value,
        Permission.BROKER_DELETE.value,
        Permission.ANALYTICS_EXPORT.value,
        Permission.FORECAST_REALTIME.value,
        Permission.AUDIT_READ.value,
    },
}


def get_user_permissions(
    role: str,
    tier: str,
    is_org_admin: bool = False,
) -> set[str]:
    """
    Get all permissions for a user based on role, tier, and admin status.
    
    Args:
        role: User role
        tier: Organization tier
        is_org_admin: Whether user is org admin
    
    Returns:
        Set of permission strings
    """
    permissions = set()
    
    # Add role permissions
    role_perms = ROLE_PERMISSIONS.get(role, set())
    permissions.update(role_perms)
    
    # Add tier permissions
    tier_perms = TIER_PERMISSIONS.get(tier, set())
    permissions.update(tier_perms)
    
    # Org admins get admin permissions
    if is_org_admin:
        admin_perms = ROLE_PERMISSIONS.get(Role.ADMIN.value, set())
        permissions.update(admin_perms)
    
    return permissions


def has_permission(
    user_permissions: set[str],
    required_permission: str,
) -> bool:
    """
    Check if user has a specific permission.
    
    Args:
        user_permissions: Set of user's permissions
        required_permission: Permission to check
    
    Returns:
        True if user has permission
    """
    # Admin wildcard
    if Permission.ADMIN_ALL.value in user_permissions:
        return True
    
    return required_permission in user_permissions


def check_permission(
    role: str,
    tier: str,
    required_permission: str,
    is_org_admin: bool = False,
) -> bool:
    """
    Check if a user with given role/tier has a permission.
    
    Args:
        role: User role
        tier: Organization tier
        required_permission: Permission to check
        is_org_admin: Whether user is org admin
    
    Returns:
        True if user has permission
    """
    user_permissions = get_user_permissions(role, tier, is_org_admin)
    return has_permission(user_permissions, required_permission)


def get_feature_access(tier: str) -> dict[str, bool]:
    """
    Get feature access based on tier.
    
    Args:
        tier: Organization tier
    
    Returns:
        Dictionary of feature -> enabled
    """
    features = {
        "forecasting": True,
        "csv_upload": True,
        "gamification": True,
        "crisis_simulator": True,
        "broker_api": tier in [Tier.PREMIUM.value, Tier.ENTERPRISE.value],
        "realtime_forecasts": tier == Tier.ENTERPRISE.value,
        "api_export": tier in [Tier.PREMIUM.value, Tier.ENTERPRISE.value],
        "audit_logs": tier == Tier.ENTERPRISE.value,
        "sso": tier == Tier.ENTERPRISE.value,
        "priority_support": tier == Tier.ENTERPRISE.value,
        "custom_models": tier == Tier.ENTERPRISE.value,
    }
    return features
