# ==============================================================================
# AEQUITAS LV-COP BACKEND - PRODUCTION DOCKERFILE
# ==============================================================================
# Multi-stage build optimized for:
# - Docker layer caching
# - Minimal final image size
# - Security (non-root user)
# - Health checks
# - Signal handling
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Builder - Install dependencies and build wheels
# ------------------------------------------------------------------------------
FROM python:3.11-slim-bookworm AS builder

# Set environment variables for build
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    gfortran \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    libblas-dev \
    liblapack-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements files
COPY requirements.txt requirements-ml.txt ./

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt && \
    pip install -r requirements-ml.txt

# ------------------------------------------------------------------------------
# Stage 2: Production - Minimal runtime image
# ------------------------------------------------------------------------------
FROM python:3.11-slim-bookworm AS production

# Labels for container metadata
LABEL org.opencontainers.image.title="Aequitas LV-COP Backend" \
      org.opencontainers.image.description="Crisis-resilient intraday liquidity forecasting API" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Aequitas Engineering <engineering@aequitas.ai>" \
      org.opencontainers.image.source="https://github.com/aequitas/aequitas-mvp"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    # Application settings
    APP_HOME=/app \
    APP_USER=aequitas \
    APP_GROUP=aequitas \
    # Virtual environment
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:$PATH" \
    # Python path
    PYTHONPATH=/app \
    # Uvicorn settings
    UVICORN_HOST=0.0.0.0 \
    UVICORN_PORT=8000 \
    UVICORN_WORKERS=4 \
    UVICORN_LOG_LEVEL=info \
    # Default environment
    ENVIRONMENT=production

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    # PostgreSQL client for database operations
    libpq5 \
    postgresql-client \
    # For file processing
    libmagic1 \
    # For health checks
    curl \
    wget \
    # Timezone data
    tzdata \
    # CA certificates for HTTPS
    ca-certificates \
    # Process management
    tini \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user for security
RUN groupadd --gid 1000 ${APP_GROUP} && \
    useradd --uid 1000 --gid ${APP_GROUP} --shell /bin/bash --create-home ${APP_USER}

# Set working directory
WORKDIR ${APP_HOME}

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY --chown=${APP_USER}:${APP_GROUP} ./app ${APP_HOME}/app
COPY --chown=${APP_USER}:${APP_GROUP} ./alembic.ini ${APP_HOME}/
COPY --chown=${APP_USER}:${APP_GROUP} ./scripts ${APP_HOME}/scripts

# Create directories for models and data
RUN mkdir -p ${APP_HOME}/models ${APP_HOME}/data ${APP_HOME}/logs && \
    chown -R ${APP_USER}:${APP_GROUP} ${APP_HOME}

# Switch to non-root user
USER ${APP_USER}

# Expose port
EXPOSE 8000

# Health check configuration
# Checks /health endpoint every 30 seconds
# Allows 5 seconds for startup, 10 second timeout, 3 retries before unhealthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:8000/health || exit 1

# Use tini as init system for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

# Default command - production server with Gunicorn + Uvicorn workers
CMD ["sh", "-c", "gunicorn app.main:app \
    --worker-class uvicorn.workers.UvicornWorker \
    --workers ${UVICORN_WORKERS:-4} \
    --bind ${UVICORN_HOST:-0.0.0.0}:${UVICORN_PORT:-8000} \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --graceful-timeout 30 \
    --access-logfile - \
    --error-logfile - \
    --log-level ${UVICORN_LOG_LEVEL:-info} \
    --capture-output"]

# ------------------------------------------------------------------------------
# Stage 3: Development - includes dev dependencies
# ------------------------------------------------------------------------------
FROM production AS development

# Switch back to root for installing dev dependencies
USER root

# Copy dev requirements
COPY requirements-dev.txt ./

# Install development dependencies
RUN pip install -r requirements-dev.txt

# Install additional dev tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    vim \
    less \
    htop \
    && rm -rf /var/lib/apt/lists/*

# Switch back to app user
USER ${APP_USER}

# Override command for development with hot reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ------------------------------------------------------------------------------
# Stage 4: Testing - for CI/CD pipelines
# ------------------------------------------------------------------------------
FROM development AS testing

# Switch to root for test setup
USER root

# Copy test files
COPY --chown=${APP_USER}:${APP_GROUP} ./tests ${APP_HOME}/tests
COPY --chown=${APP_USER}:${APP_GROUP} ./pytest.ini ${APP_HOME}/
COPY --chown=${APP_USER}:${APP_GROUP} ./.env.test ${APP_HOME}/.env

# Set test environment
ENV ENVIRONMENT=test \
    TESTING=1

# Switch back to app user
USER ${APP_USER}

# Run tests by default
CMD ["pytest", "-v", "--cov=app", "--cov-report=html", "--cov-report=xml"]
