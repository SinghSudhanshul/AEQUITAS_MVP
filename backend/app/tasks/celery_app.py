"""
Aequitas LV-COP Backend - Celery Application
============================================

Celery task queue configuration.

Author: Aequitas Engineering
Version: 1.0.0
"""

from celery import Celery
from celery.schedules import crontab

from app.config import settings


def create_celery_app() -> Celery:
    """
    Create and configure Celery application.
    
    Returns:
        Configured Celery app
    """
    celery_app = Celery(
        "aequitas",
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND,
        include=[
            "app.tasks.forecast_tasks",
            "app.tasks.market_data_tasks",
            "app.tasks.broker_tasks",
            "app.tasks.notification_tasks",
            "app.tasks.analytics_tasks",
        ],
    )
    
    # Celery configuration
    celery_app.conf.update(
        # Task settings
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        
        # Task execution
        task_acks_late=True,
        task_reject_on_worker_lost=True,
        task_time_limit=3600,  # 1 hour max
        task_soft_time_limit=3300,  # 55 min soft limit
        
        # Worker settings
        worker_prefetch_multiplier=4,
        worker_concurrency=4,
        
        # Result backend
        result_expires=86400,  # 24 hours
        
        # Task routing
        task_routes={
            "app.tasks.forecast_tasks.*": {"queue": "forecasts"},
            "app.tasks.market_data_tasks.*": {"queue": "market_data"},
            "app.tasks.broker_tasks.*": {"queue": "brokers"},
            "app.tasks.notification_tasks.*": {"queue": "notifications"},
            "app.tasks.analytics_tasks.*": {"queue": "analytics"},
        },
        
        # Retry settings
        task_default_retry_delay=60,  # 1 minute
        task_max_retries=3,
        
        # Beat scheduler
        beat_schedule={
            # Market data refresh every 5 minutes during market hours
            "refresh-market-data": {
                "task": "app.tasks.market_data_tasks.refresh_market_indicators",
                "schedule": crontab(minute="*/5", hour="9-16", day_of_week="1-5"),
            },
            # Daily forecast generation at 6 AM UTC
            "daily-forecasts": {
                "task": "app.tasks.forecast_tasks.generate_daily_forecasts",
                "schedule": crontab(hour=6, minute=0),
            },
            # Broker sync every hour
            "broker-sync": {
                "task": "app.tasks.broker_tasks.sync_all_brokers",
                "schedule": crontab(minute=0),
            },
            # Daily accuracy report at midnight
            "accuracy-report": {
                "task": "app.tasks.analytics_tasks.calculate_accuracy_metrics",
                "schedule": crontab(hour=0, minute=0),
            },
            # Weekly leaderboard update
            "update-leaderboard": {
                "task": "app.tasks.analytics_tasks.update_leaderboards",
                "schedule": crontab(hour=0, minute=0, day_of_week=0),
            },
            # Cleanup old data monthly
            "cleanup-old-data": {
                "task": "app.tasks.analytics_tasks.cleanup_old_data",
                "schedule": crontab(hour=2, minute=0, day_of_month=1),
            },
        },
    )
    
    return celery_app


# Create global Celery app instance
celery_app = create_celery_app()


# Task eager mode for testing
if settings.CELERY_TASK_ALWAYS_EAGER:
    celery_app.conf.task_always_eager = True
    celery_app.conf.task_eager_propagates = True
