"""
Aequitas LV-COP Backend - Prometheus Metrics
============================================

Prometheus metrics for monitoring application performance.

Author: Aequitas Engineering
Version: 1.0.0
"""

from prometheus_client import Counter, Gauge, Histogram, Info


# =============================================================================
# APPLICATION INFO
# =============================================================================

app_info = Info(
    "aequitas_app",
    "Aequitas LV-COP application information",
)

# =============================================================================
# REQUEST METRICS
# =============================================================================

http_requests_total = Counter(
    "aequitas_http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"],
)

http_request_duration_seconds = Histogram(
    "aequitas_http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint"],
    buckets=[0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 10.0],
)

# =============================================================================
# FORECAST METRICS
# =============================================================================

forecasts_generated_total = Counter(
    "aequitas_forecasts_generated_total",
    "Total forecasts generated",
    ["tier", "regime", "forecast_type"],
)

forecast_generation_duration_seconds = Histogram(
    "aequitas_forecast_generation_duration_seconds",
    "Forecast generation duration in seconds",
    ["forecast_type"],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
)

forecast_accuracy = Gauge(
    "aequitas_forecast_accuracy",
    "Forecast accuracy percentage",
    ["horizon_days", "regime"],
)

# =============================================================================
# MODEL METRICS
# =============================================================================

model_predictions_total = Counter(
    "aequitas_model_predictions_total",
    "Total model predictions",
    ["model_name", "model_version"],
)

model_prediction_duration_seconds = Histogram(
    "aequitas_model_prediction_duration_seconds",
    "Model prediction duration in seconds",
    ["model_name"],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5],
)

active_model_version = Gauge(
    "aequitas_active_model_version",
    "Currently active model version",
    ["model_name"],
)

# =============================================================================
# DATABASE METRICS
# =============================================================================

db_queries_total = Counter(
    "aequitas_db_queries_total",
    "Total database queries",
    ["query_type", "table"],
)

db_query_duration_seconds = Histogram(
    "aequitas_db_query_duration_seconds",
    "Database query duration in seconds",
    ["query_type"],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0],
)

db_connection_pool_size = Gauge(
    "aequitas_db_connection_pool_size",
    "Database connection pool size",
)

db_connections_in_use = Gauge(
    "aequitas_db_connections_in_use",
    "Database connections currently in use",
)

# =============================================================================
# CACHE METRICS
# =============================================================================

cache_hits_total = Counter(
    "aequitas_cache_hits_total",
    "Total cache hits",
    ["cache_type"],
)

cache_misses_total = Counter(
    "aequitas_cache_misses_total",
    "Total cache misses",
    ["cache_type"],
)

cache_size_bytes = Gauge(
    "aequitas_cache_size_bytes",
    "Cache size in bytes",
    ["cache_type"],
)

# =============================================================================
# AUTHENTICATION METRICS
# =============================================================================

auth_attempts_total = Counter(
    "aequitas_auth_attempts_total",
    "Total authentication attempts",
    ["auth_type", "status"],
)

active_sessions = Gauge(
    "aequitas_active_sessions",
    "Number of active user sessions",
)

# =============================================================================
# RATE LIMITING METRICS
# =============================================================================

rate_limit_exceeded_total = Counter(
    "aequitas_rate_limit_exceeded_total",
    "Total rate limit exceeded events",
    ["tier", "endpoint"],
)

# =============================================================================
# TASK QUEUE METRICS
# =============================================================================

celery_tasks_total = Counter(
    "aequitas_celery_tasks_total",
    "Total Celery tasks",
    ["task_name", "status"],
)

celery_task_duration_seconds = Histogram(
    "aequitas_celery_task_duration_seconds",
    "Celery task duration in seconds",
    ["task_name"],
    buckets=[0.1, 0.5, 1.0, 5.0, 10.0, 30.0, 60.0, 300.0],
)

celery_queue_length = Gauge(
    "aequitas_celery_queue_length",
    "Celery queue length",
    ["queue_name"],
)

# =============================================================================
# WEBSOCKET METRICS
# =============================================================================

websocket_connections_total = Gauge(
    "aequitas_websocket_connections_total",
    "Total active WebSocket connections",
)

websocket_messages_sent_total = Counter(
    "aequitas_websocket_messages_sent_total",
    "Total WebSocket messages sent",
    ["message_type"],
)

# =============================================================================
# BUSINESS METRICS
# =============================================================================

organizations_total = Gauge(
    "aequitas_organizations_total",
    "Total organizations",
    ["tier", "status"],
)

users_total = Gauge(
    "aequitas_users_total",
    "Total users",
    ["tier", "role"],
)

api_usage_today = Gauge(
    "aequitas_api_usage_today",
    "API calls made today",
    ["tier"],
)

# =============================================================================
# EXTERNAL SERVICE METRICS
# =============================================================================

external_api_requests_total = Counter(
    "aequitas_external_api_requests_total",
    "Total external API requests",
    ["service", "status"],
)

external_api_duration_seconds = Histogram(
    "aequitas_external_api_duration_seconds",
    "External API request duration in seconds",
    ["service"],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0],
)


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def init_app_info(version: str, environment: str) -> None:
    """Initialize application info metric."""
    app_info.info({
        "version": version,
        "environment": environment,
    })


def record_request(method: str, endpoint: str, status_code: int, duration: float) -> None:
    """Record HTTP request metrics."""
    http_requests_total.labels(
        method=method,
        endpoint=endpoint,
        status_code=str(status_code),
    ).inc()
    
    http_request_duration_seconds.labels(
        method=method,
        endpoint=endpoint,
    ).observe(duration)


def record_forecast(tier: str, regime: str, forecast_type: str, duration: float) -> None:
    """Record forecast generation metrics."""
    forecasts_generated_total.labels(
        tier=tier,
        regime=regime,
        forecast_type=forecast_type,
    ).inc()
    
    forecast_generation_duration_seconds.labels(
        forecast_type=forecast_type,
    ).observe(duration)
