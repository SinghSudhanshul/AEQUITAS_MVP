"""
Aequitas LV-COP Backend - Redis Connection
==========================================

Redis client setup for caching, rate limiting, and Celery broker.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from typing import Any

import redis.asyncio as redis
from redis.asyncio import Redis

from app.config import settings


logger = logging.getLogger(__name__)


# Global Redis client
_redis_client: Redis | None = None


async def get_redis_client() -> Redis:
    """
    Get Redis client instance.
    
    Returns the global Redis client, creating it if necessary.
    """
    global _redis_client
    
    if _redis_client is None:
        await init_redis_connection()
    
    return _redis_client  # type: ignore


async def init_redis_connection() -> None:
    """
    Initialize Redis connection on application startup.
    """
    global _redis_client
    
    if _redis_client is not None:
        return
    
    try:
        _redis_client = redis.from_url(
            str(settings.REDIS_URL),
            password=settings.REDIS_PASSWORD,
            max_connections=settings.REDIS_MAX_CONNECTIONS,
            decode_responses=True,
            encoding="utf-8",
        )
        
        # Verify connection
        await _redis_client.ping()
        
        logger.info("Redis connection initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Redis connection: {e}")
        raise


async def close_redis_connection() -> None:
    """
    Close Redis connection on application shutdown.
    """
    global _redis_client
    
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None
        logger.info("Redis connection closed")


async def check_redis_connection() -> bool:
    """
    Check if Redis connection is healthy.
    
    Returns:
        True if connection is working, False otherwise
    """
    try:
        client = await get_redis_client()
        await client.ping()
        return True
    except Exception as e:
        logger.warning(f"Redis health check failed: {e}")
        return False


# =============================================================================
# CACHE OPERATIONS
# =============================================================================

class CacheService:
    """
    Redis cache service with typed operations.
    
    Provides high-level caching operations with TTL management.
    """
    
    def __init__(self, prefix: str = "aequitas"):
        """
        Initialize cache service.
        
        Args:
            prefix: Key prefix for namespacing
        """
        self.prefix = prefix
    
    def _key(self, key: str) -> str:
        """Generate prefixed key."""
        return f"{self.prefix}:{key}"
    
    async def get(self, key: str) -> str | None:
        """
        Get value from cache.
        
        Args:
            key: Cache key
        
        Returns:
            Cached value or None if not found
        """
        client = await get_redis_client()
        return await client.get(self._key(key))
    
    async def set(
        self,
        key: str,
        value: str,
        ttl: int | None = None,
    ) -> bool:
        """
        Set value in cache.
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time-to-live in seconds (None = no expiry)
        
        Returns:
            True if successful
        """
        client = await get_redis_client()
        if ttl:
            return await client.setex(self._key(key), ttl, value)
        return await client.set(self._key(key), value)
    
    async def delete(self, key: str) -> bool:
        """
        Delete value from cache.
        
        Args:
            key: Cache key
        
        Returns:
            True if key was deleted
        """
        client = await get_redis_client()
        result = await client.delete(self._key(key))
        return result > 0
    
    async def exists(self, key: str) -> bool:
        """
        Check if key exists in cache.
        
        Args:
            key: Cache key
        
        Returns:
            True if key exists
        """
        client = await get_redis_client()
        return await client.exists(self._key(key)) > 0
    
    async def get_json(self, key: str) -> dict | list | None:
        """
        Get JSON value from cache.
        
        Args:
            key: Cache key
        
        Returns:
            Parsed JSON or None
        """
        import orjson
        
        value = await self.get(key)
        if value:
            return orjson.loads(value)
        return None
    
    async def set_json(
        self,
        key: str,
        value: dict | list,
        ttl: int | None = None,
    ) -> bool:
        """
        Set JSON value in cache.
        
        Args:
            key: Cache key
            value: Value to serialize and cache
            ttl: Time-to-live in seconds
        
        Returns:
            True if successful
        """
        import orjson
        
        serialized = orjson.dumps(value).decode("utf-8")
        return await self.set(key, serialized, ttl)
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """
        Increment integer value.
        
        Args:
            key: Cache key
            amount: Amount to increment by
        
        Returns:
            New value after increment
        """
        client = await get_redis_client()
        return await client.incrby(self._key(key), amount)
    
    async def expire(self, key: str, ttl: int) -> bool:
        """
        Set expiration on key.
        
        Args:
            key: Cache key
            ttl: Time-to-live in seconds
        
        Returns:
            True if expiration was set
        """
        client = await get_redis_client()
        return await client.expire(self._key(key), ttl)
    
    async def ttl(self, key: str) -> int:
        """
        Get remaining TTL of key.
        
        Args:
            key: Cache key
        
        Returns:
            Remaining TTL in seconds (-1 if no expiry, -2 if not found)
        """
        client = await get_redis_client()
        return await client.ttl(self._key(key))
    
    async def clear_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching pattern.
        
        Args:
            pattern: Glob pattern (e.g., "user:*")
        
        Returns:
            Number of keys deleted
        """
        client = await get_redis_client()
        keys = []
        async for key in client.scan_iter(self._key(pattern)):
            keys.append(key)
        
        if keys:
            return await client.delete(*keys)
        return 0


# Default cache instance
cache = CacheService()


# =============================================================================
# RATE LIMITING
# =============================================================================

class RateLimiter:
    """
    Redis-based rate limiter using sliding window algorithm.
    """
    
    def __init__(self, prefix: str = "ratelimit"):
        self.prefix = prefix
    
    def _key(self, identifier: str, window: str) -> str:
        """Generate rate limit key."""
        return f"{self.prefix}:{identifier}:{window}"
    
    async def is_allowed(
        self,
        identifier: str,
        limit: int,
        window_seconds: int,
    ) -> tuple[bool, int]:
        """
        Check if request is allowed under rate limit.
        
        Args:
            identifier: Unique identifier (IP, user_id, etc.)
            limit: Maximum requests per window
            window_seconds: Window size in seconds
        
        Returns:
            Tuple of (is_allowed, remaining_requests)
        """
        import time
        
        client = await get_redis_client()
        now = int(time.time())
        window = now // window_seconds
        key = self._key(identifier, str(window))
        
        # Increment counter
        count = await client.incr(key)
        
        # Set expiry on first request in window
        if count == 1:
            await client.expire(key, window_seconds)
        
        remaining = max(0, limit - count)
        is_allowed = count <= limit
        
        return is_allowed, remaining


# Default rate limiter instance
rate_limiter = RateLimiter()
