"""Initial schema - All core tables

Revision ID: 001_initial_schema
Revises: 
Create Date: 2024-01-15

Creates all initial tables for Aequitas LV-COP platform:
- organizations: Multi-tenant organizations
- users: User accounts with Auth0 integration
- position_snapshots: TimescaleDB hypertable for positions
- transactions: TimescaleDB hypertable for cash flows
- forecasts: Liquidity predictions
- forecast_actuals: Actual values for accuracy tracking
- market_indicators: TimescaleDB hypertable for market data
- broker_connections: Encrypted broker API connections
- api_usage: TimescaleDB hypertable for usage tracking
- audit_logs: TimescaleDB hypertable for compliance
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers
revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable extensions
    op.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
    op.execute("CREATE EXTENSION IF NOT EXISTS \"pg_trgm\"")
    op.execute("CREATE EXTENSION IF NOT EXISTS \"timescaledb\"")
    
    # Organizations table
    op.create_table(
        "organizations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(100), unique=True, nullable=False),
        sa.Column("tier", sa.String(50), nullable=False, server_default="free"),
        sa.Column("status", sa.String(50), nullable=False, server_default="active"),
        sa.Column("stripe_customer_id", sa.String(100), unique=True, nullable=True),
        sa.Column("stripe_subscription_id", sa.String(100), nullable=True),
        sa.Column("trial_ends_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("daily_api_limit", sa.Integer, nullable=False, server_default="100"),
        sa.Column("feature_broker_api", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("feature_realtime", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("feature_crisis_simulator", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("feature_gamification", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("primary_email", sa.String(255), nullable=True),
        sa.Column("primary_contact_name", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("industry", sa.String(100), nullable=True),
        sa.Column("company_size", sa.String(50), nullable=True),
        sa.Column("address_line1", sa.String(255), nullable=True),
        sa.Column("address_line2", sa.String(255), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("state", sa.String(100), nullable=True),
        sa.Column("postal_code", sa.String(20), nullable=True),
        sa.Column("country", sa.String(2), nullable=True),
        sa.Column("onboarding_completed", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("onboarding_step", sa.Integer, nullable=True),
        sa.Column("settings", postgresql.JSONB, nullable=True),
    )
    op.create_index("ix_organizations_slug", "organizations", ["slug"])
    op.create_index("ix_organizations_tier", "organizations", ["tier"])
    
    # Users table
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("auth0_id", sa.String(100), unique=True, nullable=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=True),
        sa.Column("first_name", sa.String(100), nullable=True),
        sa.Column("last_name", sa.String(100), nullable=True),
        sa.Column("display_name", sa.String(100), nullable=True),
        sa.Column("avatar_url", sa.String(500), nullable=True),
        sa.Column("job_title", sa.String(100), nullable=True),
        sa.Column("department", sa.String(100), nullable=True),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="active"),
        sa.Column("role", sa.String(50), nullable=False, server_default="analyst"),
        sa.Column("is_org_admin", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("email_verified", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_active_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("login_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("xp_total", sa.Integer, nullable=False, server_default="0"),
        sa.Column("level", sa.Integer, nullable=False, server_default="1"),
        sa.Column("prestige", sa.Integer, nullable=False, server_default="0"),
        sa.Column("streak_days", sa.Integer, nullable=False, server_default="0"),
        sa.Column("longest_streak", sa.Integer, nullable=False, server_default="0"),
        sa.Column("last_streak_date", sa.Date, nullable=True),
        sa.Column("timezone", sa.String(50), nullable=False, server_default="'UTC'"),
        sa.Column("locale", sa.String(10), nullable=False, server_default="'en-US'"),
        sa.Column("selected_theme", sa.String(50), nullable=True),
        sa.Column("preferences", postgresql.JSONB, nullable=True),
        sa.Column("notification_preferences", postgresql.JSONB, nullable=True),
    )
    op.create_index("ix_users_organization_id", "users", ["organization_id"])
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_auth0_id", "users", ["auth0_id"])
    
    # Position snapshots (TimescaleDB hypertable)
    op.create_table(
        "position_snapshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("snapshot_date", sa.Date, nullable=False),
        sa.Column("snapshot_time", sa.DateTime(timezone=True), nullable=True),
        sa.Column("security_id", sa.String(100), nullable=False),
        sa.Column("security_name", sa.String(255), nullable=True),
        sa.Column("isin", sa.String(12), nullable=True),
        sa.Column("cusip", sa.String(9), nullable=True),
        sa.Column("sedol", sa.String(7), nullable=True),
        sa.Column("ticker", sa.String(20), nullable=True),
        sa.Column("asset_class", sa.String(50), nullable=False, server_default="'equity'"),
        sa.Column("sector", sa.String(100), nullable=True),
        sa.Column("industry", sa.String(100), nullable=True),
        sa.Column("country", sa.String(2), nullable=True),
        sa.Column("quantity", sa.Numeric(20, 8), nullable=False),
        sa.Column("price", sa.Numeric(20, 8), nullable=False),
        sa.Column("market_value", sa.Numeric(20, 4), nullable=False),
        sa.Column("cost_basis", sa.Numeric(20, 4), nullable=True),
        sa.Column("unrealized_pnl", sa.Numeric(20, 4), nullable=True),
        sa.Column("realized_pnl", sa.Numeric(20, 4), nullable=True),
        sa.Column("currency", sa.String(3), nullable=False, server_default="'USD'"),
        sa.Column("fx_rate", sa.Numeric(15, 8), nullable=False, server_default="1.0"),
        sa.Column("market_value_usd", sa.Numeric(20, 4), nullable=True),
        sa.Column("portfolio_weight", sa.Numeric(10, 6), nullable=True),
        sa.Column("beta", sa.Numeric(10, 6), nullable=True),
        sa.Column("volatility_30d", sa.Numeric(10, 6), nullable=True),
        sa.Column("var_95", sa.Numeric(20, 4), nullable=True),
        sa.Column("avg_daily_volume", sa.Numeric(20, 2), nullable=True),
        sa.Column("days_to_liquidate", sa.Numeric(10, 2), nullable=True),
        sa.Column("account_id", sa.String(100), nullable=True),
        sa.Column("portfolio_id", sa.String(100), nullable=True),
        sa.Column("strategy", sa.String(100), nullable=True),
        sa.Column("broker", sa.String(100), nullable=True),
        sa.Column("prime_broker", sa.String(100), nullable=True),
        sa.Column("source", sa.String(50), nullable=False, server_default="'csv_upload'"),
        sa.Column("source_file", sa.String(255), nullable=True),
        sa.Column("custom_fields", postgresql.JSONB, nullable=True),
        sa.Column("is_validated", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("validation_errors", postgresql.JSONB, nullable=True),
    )
    op.create_index("ix_positions_org_date", "position_snapshots", ["organization_id", "snapshot_date"])
    op.create_index("ix_positions_org_security", "position_snapshots", ["organization_id", "security_id"])
    
    # Convert to hypertable
    op.execute("SELECT create_hypertable('position_snapshots', 'snapshot_date', if_not_exists => TRUE)")
    
    # Transactions (TimescaleDB hypertable)
    op.create_table(
        "transactions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_by_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("external_id", sa.String(100), nullable=True),
        sa.Column("reference", sa.String(255), nullable=True),
        sa.Column("transaction_type", sa.String(50), nullable=False),
        sa.Column("amount", sa.Numeric(20, 4), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="'USD'"),
        sa.Column("fx_rate", sa.Numeric(15, 8), nullable=False, server_default="1.0"),
        sa.Column("amount_usd", sa.Numeric(20, 4), nullable=True),
        sa.Column("transaction_date", sa.Date, nullable=False),
        sa.Column("value_date", sa.Date, nullable=True),
        sa.Column("settlement_date", sa.Date, nullable=True),
        sa.Column("transaction_time", sa.DateTime(timezone=True), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("subcategory", sa.String(100), nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("counterparty_name", sa.String(255), nullable=True),
        sa.Column("counterparty_id", sa.String(100), nullable=True),
        sa.Column("counterparty_type", sa.String(50), nullable=True),
        sa.Column("security_id", sa.String(100), nullable=True),
        sa.Column("security_name", sa.String(255), nullable=True),
        sa.Column("account_id", sa.String(100), nullable=True),
        sa.Column("portfolio_id", sa.String(100), nullable=True),
        sa.Column("broker", sa.String(100), nullable=True),
        sa.Column("is_settled", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("settled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_scheduled", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("is_recurring", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("recurrence_rule", sa.String(100), nullable=True),
        sa.Column("parent_transaction_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("is_predicted", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("confidence", sa.Numeric(5, 4), nullable=True),
        sa.Column("source", sa.String(50), nullable=False, server_default="'manual'"),
        sa.Column("source_file", sa.String(255), nullable=True),
        sa.Column("custom_fields", postgresql.JSONB, nullable=True),
        sa.Column("is_validated", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("validation_errors", postgresql.JSONB, nullable=True),
    )
    op.create_index("ix_txn_org_date", "transactions", ["organization_id", "transaction_date"])
    op.create_index("ix_txn_org_type", "transactions", ["organization_id", "transaction_type"])
    op.execute("SELECT create_hypertable('transactions', 'transaction_date', if_not_exists => TRUE)")
    
    # Forecasts table
    op.create_table(
        "forecasts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("requested_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("forecast_type", sa.String(50), nullable=False, server_default="'daily'"),
        sa.Column("status", sa.String(50), nullable=False, server_default="'pending'"),
        sa.Column("forecast_date", sa.Date, nullable=False),
        sa.Column("target_date", sa.Date, nullable=False),
        sa.Column("horizon_days", sa.Integer, nullable=False, server_default="1"),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("generation_time_ms", sa.Integer, nullable=True),
        sa.Column("predicted_net_flow_p5", sa.Numeric(20, 4), nullable=True),
        sa.Column("predicted_net_flow_p50", sa.Numeric(20, 4), nullable=False),
        sa.Column("predicted_net_flow_p95", sa.Numeric(20, 4), nullable=True),
        sa.Column("predicted_inflow_p50", sa.Numeric(20, 4), nullable=True),
        sa.Column("predicted_outflow_p50", sa.Numeric(20, 4), nullable=True),
        sa.Column("currency", sa.String(3), nullable=False, server_default="'USD'"),
        sa.Column("regime", sa.String(50), nullable=False, server_default="'steady_state'"),
        sa.Column("regime_confidence", sa.Numeric(5, 4), nullable=True),
        sa.Column("model_name", sa.String(100), nullable=False, server_default="'hybrid'"),
        sa.Column("model_version", sa.String(50), nullable=False, server_default="'1.0'"),
        sa.Column("steady_state_weight", sa.Numeric(5, 4), nullable=True),
        sa.Column("crisis_weight", sa.Numeric(5, 4), nullable=True),
        sa.Column("features_snapshot", postgresql.JSONB, nullable=True),
        sa.Column("vix_at_forecast", sa.Numeric(10, 4), nullable=True),
        sa.Column("credit_spread_at_forecast", sa.Numeric(10, 4), nullable=True),
        sa.Column("account_id", sa.String(100), nullable=True),
        sa.Column("portfolio_id", sa.String(100), nullable=True),
        sa.Column("confidence_score", sa.Numeric(5, 4), nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("cached", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("cache_key", sa.String(255), nullable=True),
        sa.Column("mlflow_run_id", sa.String(100), nullable=True),
    )
    op.create_index("ix_forecast_org_date", "forecasts", ["organization_id", "forecast_date"])
    op.create_index("ix_forecast_org_target", "forecasts", ["organization_id", "target_date"])
    
    # Forecast actuals
    op.create_table(
        "forecast_actuals",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("forecast_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("forecasts.id", ondelete="SET NULL"), nullable=True),
        sa.Column("actual_date", sa.Date, nullable=False),
        sa.Column("actual_net_flow", sa.Numeric(20, 4), nullable=False),
        sa.Column("actual_inflow", sa.Numeric(20, 4), nullable=True),
        sa.Column("actual_outflow", sa.Numeric(20, 4), nullable=True),
        sa.Column("currency", sa.String(3), nullable=False, server_default="'USD'"),
        sa.Column("account_id", sa.String(100), nullable=True),
        sa.Column("portfolio_id", sa.String(100), nullable=True),
        sa.Column("prediction_error", sa.Numeric(20, 4), nullable=True),
        sa.Column("absolute_error", sa.Numeric(20, 4), nullable=True),
        sa.Column("percentage_error", sa.Numeric(10, 6), nullable=True),
        sa.Column("within_confidence_interval", sa.Boolean, nullable=True),
        sa.Column("is_complete", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("data_source", sa.String(50), nullable=False, server_default="'calculated'"),
        sa.Column("recorded_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_actual_org_date", "forecast_actuals", ["organization_id", "actual_date"])
    
    # Market indicators (TimescaleDB hypertable)
    op.create_table(
        "market_indicators",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("indicator_name", sa.String(100), nullable=False),
        sa.Column("indicator_type", sa.String(50), nullable=False),
        sa.Column("indicator_date", sa.Date, nullable=False),
        sa.Column("indicator_time", sa.DateTime(timezone=True), nullable=True),
        sa.Column("value", sa.Numeric(20, 8), nullable=False),
        sa.Column("open_value", sa.Numeric(20, 8), nullable=True),
        sa.Column("high_value", sa.Numeric(20, 8), nullable=True),
        sa.Column("low_value", sa.Numeric(20, 8), nullable=True),
        sa.Column("close_value", sa.Numeric(20, 8), nullable=True),
        sa.Column("change", sa.Numeric(20, 8), nullable=True),
        sa.Column("change_percent", sa.Numeric(10, 6), nullable=True),
        sa.Column("rolling_mean_7d", sa.Numeric(20, 8), nullable=True),
        sa.Column("rolling_mean_30d", sa.Numeric(20, 8), nullable=True),
        sa.Column("rolling_std_30d", sa.Numeric(20, 8), nullable=True),
        sa.Column("z_score", sa.Numeric(10, 6), nullable=True),
        sa.Column("percentile_90d", sa.Numeric(10, 6), nullable=True),
        sa.Column("source", sa.String(50), nullable=False, server_default="'fred'"),
        sa.Column("source_id", sa.String(100), nullable=True),
        sa.Column("unit", sa.String(50), nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("metadata", postgresql.JSONB, nullable=True),
    )
    op.create_index("ix_market_date", "market_indicators", ["indicator_date"])
    op.create_index("ix_market_name_date", "market_indicators", ["indicator_name", "indicator_date"])
    op.execute("SELECT create_hypertable('market_indicators', 'indicator_date', if_not_exists => TRUE)")
    
    # Broker connections
    op.create_table(
        "broker_connections",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_by_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("broker_type", sa.String(50), nullable=False),
        sa.Column("broker_name", sa.String(100), nullable=False),
        sa.Column("display_name", sa.String(255), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="'pending'"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("api_key_encrypted", sa.Text, nullable=True),
        sa.Column("api_secret_encrypted", sa.Text, nullable=True),
        sa.Column("api_passphrase_encrypted", sa.Text, nullable=True),
        sa.Column("access_token_encrypted", sa.Text, nullable=True),
        sa.Column("refresh_token_encrypted", sa.Text, nullable=True),
        sa.Column("token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("api_endpoint", sa.String(500), nullable=True),
        sa.Column("settings", postgresql.JSONB, nullable=True),
        sa.Column("sync_enabled", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("sync_interval_minutes", sa.Integer, nullable=False, server_default="60"),
        sa.Column("sync_positions", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("sync_transactions", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("sync_balances", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("last_sync_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_sync_success", sa.Boolean, nullable=True),
        sa.Column("last_sync_error", sa.Text, nullable=True),
        sa.Column("next_sync_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_health_check", sa.DateTime(timezone=True), nullable=True),
        sa.Column("health_check_passed", sa.Boolean, nullable=True),
        sa.Column("consecutive_failures", sa.Integer, nullable=False, server_default="0"),
        sa.Column("broker_account_id", sa.String(100), nullable=True),
        sa.Column("broker_account_name", sa.String(255), nullable=True),
    )
    op.create_index("ix_broker_org", "broker_connections", ["organization_id"])
    
    # API usage (TimescaleDB hypertable)
    op.create_table(
        "api_usage",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("usage_date", sa.Date, nullable=False),
        sa.Column("endpoint", sa.String(255), nullable=True),
        sa.Column("request_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("success_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("error_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("rate_limited_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("forecast_requests", sa.Integer, nullable=False, server_default="0"),
        sa.Column("upload_requests", sa.Integer, nullable=False, server_default="0"),
        sa.Column("broker_requests", sa.Integer, nullable=False, server_default="0"),
        sa.Column("analytics_requests", sa.Integer, nullable=False, server_default="0"),
        sa.Column("bytes_uploaded", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("bytes_downloaded", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("rows_processed", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("total_response_time_ms", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("daily_limit", sa.Integer, nullable=False, server_default="100"),
        sa.Column("limit_percentage_used", sa.Integer, nullable=False, server_default="0"),
    )
    op.create_index("ix_api_usage_org_date", "api_usage", ["organization_id", "usage_date"])
    op.execute("SELECT create_hypertable('api_usage', 'usage_date', if_not_exists => TRUE)")
    
    # Audit logs (TimescaleDB hypertable)
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("user_email", sa.String(255), nullable=True),
        sa.Column("action", sa.String(50), nullable=False),
        sa.Column("entity_type", sa.String(100), nullable=False),
        sa.Column("entity_id", sa.String(100), nullable=True),
        sa.Column("entity_name", sa.String(255), nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("old_values", postgresql.JSONB, nullable=True),
        sa.Column("new_values", postgresql.JSONB, nullable=True),
        sa.Column("changed_fields", postgresql.JSONB, nullable=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("user_agent", sa.Text, nullable=True),
        sa.Column("request_id", sa.String(100), nullable=True),
        sa.Column("session_id", sa.String(100), nullable=True),
        sa.Column("endpoint", sa.String(255), nullable=True),
        sa.Column("http_method", sa.String(10), nullable=True),
        sa.Column("risk_level", sa.String(20), nullable=False, server_default="'low'"),
        sa.Column("success", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("metadata", postgresql.JSONB, nullable=True),
        sa.Column("compliance_tags", postgresql.JSONB, nullable=True),
    )
    op.create_index("ix_audit_org_date", "audit_logs", ["organization_id", "created_at"])
    op.create_index("ix_audit_action", "audit_logs", ["action", "created_at"])
    op.execute("SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE)")


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table("audit_logs")
    op.drop_table("api_usage")
    op.drop_table("broker_connections")
    op.drop_table("market_indicators")
    op.drop_table("forecast_actuals")
    op.drop_table("forecasts")
    op.drop_table("transactions")
    op.drop_table("position_snapshots")
    op.drop_table("users")
    op.drop_table("organizations")
