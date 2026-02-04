"""
Aequitas LV-COP Backend - Database Engine Configuration
=======================================================

SQLAlchemy async engine setup with connection pooling and TimescaleDB support.

Author: Aequitas Engineering
Version: 1.0.0
"""

from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy import event, text
from sqlalchemy.pool import AsyncAdaptedQueuePool

from app.config import settings


def create_engine() -> AsyncEngine:
    """
    Create async SQLAlchemy engine with optimized settings.
    
    Configuration includes:
    - Connection pooling with configurable size
    - Pre-ping to verify connections
    - Query logging in debug mode
    - TimescaleDB extension support
    """
    engine = create_async_engine(
        settings.database_url_async,
        # Connection pool settings
        poolclass=AsyncAdaptedQueuePool,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_recycle=settings.DATABASE_POOL_RECYCLE,
        pool_pre_ping=True,  # Verify connections before use
        # Query logging
        echo=settings.DATABASE_ECHO,
        echo_pool=settings.DATABASE_ECHO,
        # Future-proof settings
        future=True,
    )
    
    return engine


# Create global engine instance
engine = create_engine()


async def init_timescaledb(conn) -> None:
    """
    Initialize TimescaleDB extension.
    
    Should be called during application startup.
    """
    await conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE"))
    await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm"))  # For text search


async def verify_database_connection() -> bool:
    """
    Verify database connection is working.
    
    Returns:
        True if connection is successful, False otherwise
    """
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            return True
    except Exception:
        return False
