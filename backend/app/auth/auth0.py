"""
Aequitas LV-COP Backend - Auth0 Integration
===========================================

Auth0 authentication and user management.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from typing import Optional

import httpx

from app.config import settings
from app.exceptions import AuthenticationError, ExternalServiceError

logger = logging.getLogger(__name__)


class Auth0Client:
    """
    Auth0 Management API client.
    
    Handles:
    - User creation
    - Password reset
    - Token exchange
    - User info retrieval
    """
    
    def __init__(self):
        self.domain = settings.AUTH0_DOMAIN
        self.client_id = settings.AUTH0_CLIENT_ID
        self.client_secret = settings.AUTH0_CLIENT_SECRET
        self.audience = settings.AUTH0_AUDIENCE
        self._management_token: Optional[str] = None
    
    @property
    def base_url(self) -> str:
        return f"https://{self.domain}"
    
    async def get_management_token(self) -> str:
        """
        Get Auth0 Management API token.
        
        Cached for reuse.
        """
        if self._management_token:
            return self._management_token
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/oauth/token",
                    json={
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "audience": f"{self.base_url}/api/v2/",
                        "grant_type": "client_credentials",
                    },
                )
                response.raise_for_status()
                data = response.json()
                self._management_token = data["access_token"]
                return self._management_token
                
            except httpx.HTTPError as e:
                logger.error(f"Failed to get Auth0 management token: {e}")
                raise ExternalServiceError("Auth0", "Failed to authenticate with Auth0")
    
    async def get_user_info(self, access_token: str) -> dict:
        """
        Get user info from Auth0 userinfo endpoint.
        
        Args:
            access_token: User's access token
        
        Returns:
            User info dictionary
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"},
                )
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPError as e:
                logger.error(f"Failed to get Auth0 user info: {e}")
                raise AuthenticationError("Failed to get user info")
    
    async def create_user(
        self,
        email: str,
        password: Optional[str] = None,
        connection: str = "Username-Password-Authentication",
        **metadata,
    ) -> dict:
        """
        Create a new Auth0 user.
        
        Args:
            email: User email
            password: Optional password (generates temp if not provided)
            connection: Auth0 connection name
            **metadata: Additional user metadata
        
        Returns:
            Created user data
        """
        management_token = await self.get_management_token()
        
        user_data = {
            "email": email,
            "email_verified": False,
            "connection": connection,
        }
        
        if password:
            user_data["password"] = password
        else:
            # Generate temporary password
            import secrets
            user_data["password"] = secrets.token_urlsafe(32)
        
        if metadata:
            user_data["app_metadata"] = metadata
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/v2/users",
                    headers={"Authorization": f"Bearer {management_token}"},
                    json=user_data,
                )
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPError as e:
                logger.error(f"Failed to create Auth0 user: {e}")
                raise ExternalServiceError("Auth0", "Failed to create user")
    
    async def send_password_reset(self, email: str) -> bool:
        """
        Send password reset email.
        
        Args:
            email: User email
        
        Returns:
            True if successful
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/dbconnections/change_password",
                    json={
                        "client_id": self.client_id,
                        "email": email,
                        "connection": "Username-Password-Authentication",
                    },
                )
                response.raise_for_status()
                return True
                
            except httpx.HTTPError as e:
                logger.warning(f"Password reset request failed: {e}")
                # Don't expose whether email exists
                return True
    
    async def delete_user(self, auth0_id: str) -> bool:
        """
        Delete Auth0 user.
        
        Args:
            auth0_id: Auth0 user ID (sub)
        
        Returns:
            True if successful
        """
        management_token = await self.get_management_token()
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(
                    f"{self.base_url}/api/v2/users/{auth0_id}",
                    headers={"Authorization": f"Bearer {management_token}"},
                )
                response.raise_for_status()
                return True
                
            except httpx.HTTPError as e:
                logger.error(f"Failed to delete Auth0 user: {e}")
                raise ExternalServiceError("Auth0", "Failed to delete user")
    
    async def update_user_metadata(
        self,
        auth0_id: str,
        metadata: dict,
    ) -> dict:
        """
        Update Auth0 user app_metadata.
        
        Args:
            auth0_id: Auth0 user ID
            metadata: Metadata to update
        
        Returns:
            Updated user data
        """
        management_token = await self.get_management_token()
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.patch(
                    f"{self.base_url}/api/v2/users/{auth0_id}",
                    headers={"Authorization": f"Bearer {management_token}"},
                    json={"app_metadata": metadata},
                )
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPError as e:
                logger.error(f"Failed to update Auth0 user: {e}")
                raise ExternalServiceError("Auth0", "Failed to update user")


# Global client instance
auth0_client = Auth0Client()
