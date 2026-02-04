"""
Aequitas LV-COP Backend - Authentication Service
================================================

User authentication, registration, and session management.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security import hash_password, verify_password
from app.exceptions import AuthenticationError, NotFoundError, ValidationError
from app.models.organization import Organization
from app.models.user import User

logger = logging.getLogger(__name__)


# =============================================================================
# SUPER ADMIN CREDENTIALS (Development/Initial Setup)
# =============================================================================
SUPER_ADMIN = {
    "email": "admin@aequitas.ai",
    "password": "Aequitas2024!",
    "first_name": "Super",
    "last_name": "Admin",
    "role": "admin",
}


class AuthService:
    """
    Authentication service for user login and registration.
    
    Features:
    - Login with email/password (only existing users)
    - Super admin auto-creation
    - Password hashing with Argon2
    - Session management
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def login(
        self,
        email: str,
        password: str,
    ) -> dict:
        """
        Authenticate user with email and password.
        
        Args:
            email: User email
            password: Plain text password
        
        Returns:
            User data with tokens
        
        Raises:
            AuthenticationError: If credentials are invalid
        """
        # Normalize email
        email = email.lower().strip()
        
        # Check for super admin login
        if email == SUPER_ADMIN["email"] and password == SUPER_ADMIN["password"]:
            user = await self._get_or_create_super_admin()
            return await self._create_session(user)
        
        # Find user by email
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            logger.warning(f"Login attempt for non-existent user: {email}")
            raise AuthenticationError("Invalid email or password")
        
        # Check if user is active
        if user.status != "active":
            raise AuthenticationError("Account is not active")
        
        # Verify password
        if not user.password_hash:
            raise AuthenticationError("Password not set. Please reset your password.")
        
        if not verify_password(password, user.password_hash):
            logger.warning(f"Failed login attempt for user: {email}")
            raise AuthenticationError("Invalid email or password")
        
        # Update login stats
        user.last_login_at = datetime.utcnow()
        user.login_count += 1
        await self.db.commit()
        
        logger.info(f"Successful login for user: {email}")
        return await self._create_session(user)
    
    async def register(
        self,
        email: str,
        password: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        organization_name: Optional[str] = None,
    ) -> dict:
        """
        Register a new user.
        
        Args:
            email: User email
            password: Plain text password
            first_name: Optional first name
            last_name: Optional last name
            organization_name: Optional org name (creates new org)
        
        Returns:
            Created user data
        
        Raises:
            ValidationError: If email already exists
        """
        email = email.lower().strip()
        
        # Check if user exists
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        if result.scalar_one_or_none():
            raise ValidationError("Email already registered")
        
        # Validate password strength
        self._validate_password(password)
        
        # Create organization if name provided, else use default
        if organization_name:
            org = await self._create_organization(organization_name, email)
        else:
            org = await self._get_or_create_default_org()
        
        # Create user
        user = User(
            id=uuid4(),
            organization_id=org.id,
            email=email,
            password_hash=hash_password(password),
            first_name=first_name,
            last_name=last_name,
            status="active",
            role="analyst",  # Default role
            is_org_admin=organization_name is not None,  # Admin if created org
            email_verified=False,
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        logger.info(f"New user registered: {email}")
        return await self._create_session(user)
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        result = await self.db.execute(
            select(User).where(User.email == email.lower().strip())
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def _get_or_create_super_admin(self) -> User:
        """Get or create the super admin user."""
        email = SUPER_ADMIN["email"]
        
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if user:
            return user
        
        # Create default organization for admin
        org = await self._get_or_create_default_org()
        
        # Create super admin user
        user = User(
            id=uuid4(),
            organization_id=org.id,
            email=email,
            password_hash=hash_password(SUPER_ADMIN["password"]),
            first_name=SUPER_ADMIN["first_name"],
            last_name=SUPER_ADMIN["last_name"],
            status="active",
            role="admin",
            is_org_admin=True,
            email_verified=True,
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        logger.info("Super admin user created")
        return user
    
    async def _get_or_create_default_org(self) -> Organization:
        """Get or create default organization."""
        result = await self.db.execute(
            select(Organization).where(Organization.slug == "aequitas-default")
        )
        org = result.scalar_one_or_none()
        
        if org:
            return org
        
        org = Organization(
            id=uuid4(),
            name="Aequitas Default",
            slug="aequitas-default",
            tier="enterprise",  # Full access for dev
            status="active",
            feature_broker_api=True,
            feature_realtime=True,
            feature_crisis_simulator=True,
            feature_gamification=True,
            daily_api_limit=10000,
        )
        
        self.db.add(org)
        await self.db.commit()
        await self.db.refresh(org)
        
        logger.info("Default organization created")
        return org
    
    async def _create_organization(self, name: str, admin_email: str) -> Organization:
        """Create a new organization."""
        import re
        # Generate slug
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        
        # Check uniqueness
        result = await self.db.execute(
            select(Organization).where(Organization.slug == slug)
        )
        if result.scalar_one_or_none():
            slug = f"{slug}-{uuid4().hex[:8]}"
        
        org = Organization(
            id=uuid4(),
            name=name,
            slug=slug,
            tier="free",
            status="active",
            primary_email=admin_email,
        )
        
        self.db.add(org)
        await self.db.commit()
        await self.db.refresh(org)
        
        return org
    
    async def _create_session(self, user: User) -> dict:
        """Create session with tokens."""
        from app.auth.jwt import create_access_token, create_refresh_token
        
        # Get organization
        result = await self.db.execute(
            select(Organization).where(Organization.id == user.organization_id)
        )
        org = result.scalar_one_or_none()
        
        # Create tokens
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "org_id": str(user.organization_id),
            "role": user.role,
            "tier": org.tier if org else "free",
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(str(user.id))
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "org_id": str(user.organization_id),
                "tier": org.tier if org else "free",
            },
        }
    
    def _validate_password(self, password: str) -> None:
        """Validate password strength."""
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters")
        if not any(c.isupper() for c in password):
            raise ValidationError("Password must contain uppercase letter")
        if not any(c.islower() for c in password):
            raise ValidationError("Password must contain lowercase letter")
        if not any(c.isdigit() for c in password):
            raise ValidationError("Password must contain a digit")
