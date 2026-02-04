"""
Aequitas LV-COP Backend - Test Configuration
============================================

Pytest fixtures and configuration.

Author: Aequitas Engineering
Version: 1.0.0
"""

import asyncio
from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import AsyncGenerator, Generator
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from app.config import settings
from app.database.base import Base
from app.main import app


# Test database URL
TEST_DATABASE_URL = (
    settings.TEST_DATABASE_URL or
    settings.database_url_async.replace("/aequitas", "/aequitas_test")
)


# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    poolclass=NullPool,
    echo=False,
)


# Test session factory
TestSessionLocal = sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def setup_database() -> AsyncGenerator[None, None]:
    """Create all tables before tests, drop after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session(setup_database) -> AsyncGenerator[AsyncSession, None]:
    """Get test database session."""
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Get test HTTP client."""
    from app.dependencies import get_db
    
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def authenticated_client(
    client: AsyncClient,
    test_user: dict,
) -> AsyncGenerator[AsyncClient, None]:
    """Get authenticated test client."""
    client.headers["Authorization"] = f"Bearer dev-token"
    yield client


# =============================================================================
# MOCK DATA FIXTURES
# =============================================================================

@pytest.fixture
def test_organization_id() -> str:
    """Get test organization ID."""
    return str(uuid4())


@pytest.fixture
def test_user_id() -> str:
    """Get test user ID."""
    return str(uuid4())


@pytest.fixture
def test_user(test_organization_id: str, test_user_id: str) -> dict:
    """Get test user data."""
    return {
        "user_id": test_user_id,
        "email": "test@aequitas.ai",
        "org_id": test_organization_id,
        "role": "admin",
        "tier": "enterprise",
    }


@pytest.fixture
def sample_position_data() -> dict:
    """Sample position data for testing."""
    return {
        "snapshot_date": date.today(),
        "security_id": "AAPL",
        "security_name": "Apple Inc.",
        "ticker": "AAPL",
        "isin": "US0378331005",
        "asset_class": "equity",
        "quantity": Decimal("100"),
        "price": Decimal("150.00"),
        "market_value": Decimal("15000.00"),
        "currency": "USD",
    }


@pytest.fixture
def sample_forecast_data() -> dict:
    """Sample forecast data for testing."""
    return {
        "forecast_date": date.today(),
        "target_date": date.today() + timedelta(days=1),
        "horizon_days": 1,
        "predicted_net_flow_p5": Decimal("-25000.00"),
        "predicted_net_flow_p50": Decimal("30000.00"),
        "predicted_net_flow_p95": Decimal("85000.00"),
        "regime": "steady_state",
        "confidence_score": Decimal("0.78"),
        "model_name": "hybrid",
        "model_version": "1.0",
    }


@pytest.fixture
def sample_csv_content() -> bytes:
    """Sample CSV content for upload testing."""
    return b"""date,security_id,security_name,quantity,price,market_value,currency
2024-01-15,AAPL,Apple Inc.,100,150.00,15000.00,USD
2024-01-15,GOOGL,Alphabet Inc.,50,140.00,7000.00,USD
2024-01-15,MSFT,Microsoft Corp.,75,380.00,28500.00,USD
"""


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def assert_response_success(response) -> None:
    """Assert response is successful."""
    assert response.status_code in [200, 201]
    data = response.json()
    assert data.get("success") is True


def assert_response_error(response, status_code: int) -> None:
    """Assert response is error with expected status."""
    assert response.status_code == status_code
    data = response.json()
    assert "error" in data
