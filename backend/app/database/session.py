"""
Aequitas LV-COP Backend - Database Session Management
=====================================================

Async session factory and dependency injection for database access.

Author: Aequitas Engineering
Version: 1.0.0
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.database.engine import engine


logger = logging.getLogger(__name__)


# Create async session factory
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting async database session.
    
    Yields:
        AsyncSession: SQLAlchemy async session
    
    Usage:
        @app.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db_session)):
            result = await db.execute(select(Item))
            return result.scalars().all()
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@asynccontextmanager
async def get_db_context() -> AsyncGenerator[AsyncSession, None]:
    """
    Context manager for database sessions.
    
    For use outside of FastAPI dependency injection.
    
    Usage:
        async with get_db_context() as db:
            result = await db.execute(select(Item))
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# =============================================================================
# Connection Lifecycle Management
# =============================================================================

_is_initialized = False


async def init_db_connection() -> None:
    """
    Initialize database connection on application startup.
    
    Verifies connection and initializes extensions.
    """
    global _is_initialized
    
    if _is_initialized:
        return
    
    try:
        async with engine.begin() as conn:
            # Verify connection
            await conn.execute(text("SELECT 1"))
            
            # Initialize TimescaleDB extension
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE"))
            
            # Initialize pg_trgm for text search
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm"))
            
            # Initialize uuid-ossp for UUID generation
            await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'))
        
        _is_initialized = True
        logger.info("Database connection initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize database connection: {e}")
        raise


async def close_db_connection() -> None:
    """
    Close database connection on application shutdown.
    """
    global _is_initialized
    
    await engine.dispose()
    _is_initialized = False
    logger.info("Database connection closed")


async def check_db_connection() -> bool:
    """
    Check if database connection is healthy.
    
    Returns:
        True if connection is working, False otherwise
    """
    try:
        async with async_session_factory() as session:
            await session.execute(text("SELECT 1"))
            return True
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        return False


# =============================================================================
# Transaction Helpers
# =============================================================================

@asynccontextmanager
async def transaction(session: AsyncSession) -> AsyncGenerator[None, None]:
    """
    Explicit transaction context manager.
    
    Commits on success, rolls back on exception.
    
    Usage:
        async with transaction(session):
            session.add(item)
            # auto-commits on exit
    """
    try:
        yield
        await session.commit()
    except Exception:
        await session.rollback()
        raise


async def execute_raw_query(query: str, params: dict | None = None) -> list:
    """
    Execute raw SQL query.
    
    Args:
        query: SQL query string
        params: Optional query parameters
    
    Returns:
        List of result rows
    
    Note:
        Use with caution - prefer ORM queries when possible.
    """
    async with async_session_factory() as session:
        result = await session.execute(text(query), params or {})
        return result.fetchall()
