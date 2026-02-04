"""
Aequitas LV-COP Backend - API v1 Router
======================================

Aggregates all v1 API endpoints.

Author: Aequitas Engineering
Version: 1.0.0
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    organizations,
    positions,
    forecasts,
    analytics,
    brokers,
    market,
    health,
    gamification,
    crisis_simulator,
)

api_router = APIRouter()

# Health checks (no auth required)
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

# Authentication
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

# Users
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
)

# Organizations
api_router.include_router(
    organizations.router,
    prefix="/organizations",
    tags=["Organizations"],
)

# Positions
api_router.include_router(
    positions.router,
    prefix="/positions",
    tags=["Positions"],
)

# Forecasts
api_router.include_router(
    forecasts.router,
    prefix="/forecasts",
    tags=["Forecasts"],
)

# Analytics
api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"],
)

# Brokers
api_router.include_router(
    brokers.router,
    prefix="/brokers",
    tags=["Brokers"],
)

# Market Data
api_router.include_router(
    market.router,
    prefix="/market",
    tags=["Market"],
)

# Gamification
api_router.include_router(
    gamification.router,
    prefix="/gamification",
    tags=["Gamification"],
)

# Crisis Simulator
api_router.include_router(
    crisis_simulator.router,
    prefix="/crisis-simulator",
    tags=["Crisis Simulator"],
)
