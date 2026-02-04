# AEQUITAS LV-COP: COMPLETE PROJECT FILE STRUCTURE
## Production-Ready Codebase Organization

**Last Updated:** January 31, 2026  
**Purpose:** Exact directory structure for `git clone` → `docker-compose up` → working application

---

## ROOT DIRECTORY STRUCTURE

```
aequitas-mvp/
├── README.md                       # Project overview, quick start guide
├── LICENSE                         # MIT or Apache 2.0
├── .gitignore                      # Python, Node, Docker, IDE files
├── .env.example                    # Template for environment variables
├── docker-compose.yml              # Full stack orchestration
├── docker-compose.prod.yml         # Production overrides
│
├── backend/                        # FastAPI application
├── frontend/                       # React application
├── models/                         # Trained ML models (gitignored)
├── data/                          # Sample data, test fixtures
├── scripts/                        # Deployment, maintenance, training scripts
├── monitoring/                     # Prometheus, Grafana configs
├── docs/                          # Technical documentation
└── tests/                         # Integration tests
```

---

## BACKEND DIRECTORY (`backend/`)

```
backend/
├── Dockerfile                      # Container definition
├── requirements.txt                # Python dependencies
├── requirements-dev.txt            # Development dependencies (pytest, black, mypy)
├── .env.example                   # Backend environment variables
├── alembic.ini                    # Database migrations config
├── pyproject.toml                  # Black, isort, mypy configs
│
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app initialization, CORS, middleware
│   ├── config.py                  # Settings (from environment variables)
│   ├── dependencies.py            # Reusable dependency injection
│   │
│   ├── api/                       # API routes (organized by version)
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py         # Login, logout, token refresh
│   │   │   │   ├── forecasts.py    # GET /forecast/daily, /forecast/realtime
│   │   │   │   ├── upload.py       # POST /upload/csv
│   │   │   │   ├── brokers.py      # POST /broker/connect, GET /broker/status
│   │   │   │   ├── analytics.py    # GET /analytics/accuracy
│   │   │   │   ├── organizations.py # CRUD for organizations
│   │   │   │   └── market.py       # GET /market/regime (public endpoint)
│   │   │   │
│   │   │   └── router.py          # Aggregate all v1 endpoints
│   │   │
│   │   └── v2/                    # Future API version (breaking changes)
│   │       └── __init__.py
│   │
│   ├── auth/                      # Authentication & authorization
│   │   ├── __init__.py
│   │   ├── jwt.py                 # JWT token creation/validation
│   │   ├── auth0.py               # Auth0 integration
│   │   └── permissions.py         # Role-based access control
│   │
│   ├── core/                      # Core business logic
│   │   ├── __init__.py
│   │   ├── security.py            # Password hashing, encryption
│   │   ├── exceptions.py          # Custom exceptions
│   │   └── rate_limiting.py       # Rate limiter with Redis
│   │
│   ├── database/                  # Database layer
│   │   ├── __init__.py
│   │   ├── session.py             # SQLAlchemy session management
│   │   ├── base.py                # Declarative base
│   │   │
│   │   ├── models/                # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── organization.py    # Organization table
│   │   │   ├── user.py            # User table
│   │   │   ├── position.py        # PositionSnapshot table
│   │   │   ├── transaction.py     # Transactions table
│   │   │   ├── forecast.py        # Forecasts, ForecastActuals tables
│   │   │   ├── market_indicator.py # MarketIndicators table
│   │   │   ├── api_usage.py       # APIUsage table
│   │   │   ├── audit_log.py       # AuditLog table
│   │   │   └── broker_connection.py # BrokerConnection (encrypted creds)
│   │   │
│   │   └── migrations/            # Alembic migrations
│   │       ├── env.py
│   │       ├── script.py.mako
│   │       └── versions/
│   │           ├── 001_initial_schema.py
│   │           ├── 002_add_timescaledb.py
│   │           └── 003_add_audit_triggers.py
│   │
│   ├── schemas/                   # Pydantic models (request/response)
│   │   ├── __init__.py
│   │   ├── forecast.py            # ForecastRequest, ForecastResponse
│   │   ├── organization.py        # OrganizationCreate, OrganizationUpdate
│   │   ├── user.py                # UserCreate, UserResponse
│   │   ├── position.py            # PositionUpload
│   │   └── auth.py                # Token, Login schemas
│   │
│   ├── ml/                        # Machine learning components
│   │   ├── __init__.py
│   │   ├── forecasting.py         # ForecastingEngine, SteadyStateModel, CrisisModel
│   │   ├── regime_detector.py     # RegimeDetector class
│   │   ├── feature_engineering.py # Feature engineering functions
│   │   ├── model_registry.py      # MLflow integration
│   │   └── market_data.py         # Fetch VIX, credit spreads, repo rates
│   │
│   ├── integrations/              # External API integrations
│   │   ├── __init__.py
│   │   ├── goldman_sachs.py       # GS Prime API connector
│   │   ├── morgan_stanley.py      # MS Prime API connector
│   │   ├── jp_morgan.py           # JPM Prime API connector
│   │   └── base_broker.py         # Abstract base class for broker connectors
│   │
│   ├── services/                  # Business logic services
│   │   ├── __init__.py
│   │   ├── forecast_service.py    # Forecast generation orchestration
│   │   ├── upload_service.py      # CSV parsing and validation
│   │   ├── broker_service.py      # Broker sync orchestration
│   │   └── analytics_service.py   # Accuracy calculations, reports
│   │
│   ├── tasks/                     # Background tasks (Celery)
│   │   ├── __init__.py
│   │   ├── celery_app.py          # Celery configuration
│   │   ├── scheduled_tasks.py     # Periodic tasks (intraday forecasts)
│   │   └── async_tasks.py         # Async tasks (CSV processing, email)
│   │
│   ├── utils/                     # Utility functions
│   │   ├── __init__.py
│   │   ├── csv_parser.py          # CSV validation and parsing
│   │   ├── email.py               # SendGrid email templates
│   │   ├── storage.py             # MinIO file storage wrapper
│   │   └── monitoring.py          # Prometheus metrics exporters
│   │
│   └── websockets/                # WebSocket handlers
│       ├── __init__.py
│       └── forecast_updates.py    # Real-time forecast push
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Pytest fixtures
│   ├── test_auth.py               # Authentication tests
│   ├── test_forecasting.py        # ML model tests
│   ├── test_api_forecasts.py      # Forecast endpoint tests
│   ├── test_api_upload.py         # Upload endpoint tests
│   ├── test_multi_tenancy.py      # Org isolation tests
│   └── test_integrations.py       # Broker integration tests
│
└── scripts/
    ├── init_db.py                 # Initialize database schema
    ├── seed_data.py               # Populate sample data
    ├── train_models.py            # Train initial ML models
    ├── backup_db.sh               # Database backup script
    └── deploy.sh                  # Production deployment script
```

---

## FRONTEND DIRECTORY (`frontend/`)

```
frontend/
├── Dockerfile                     # Container definition
├── package.json                   # npm dependencies
├── package-lock.json
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite build config
├── .env.example                   # Frontend environment variables
├── .eslintrc.json                 # ESLint config
├── .prettierrc                    # Prettier config
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── main.tsx                   # Application entry point
│   ├── App.tsx                    # Root component
│   ├── vite-env.d.ts             # Vite type definitions
│   │
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── alert.tsx
│   │   │   └── ...               # Other shadcn components
│   │   │
│   │   ├── Layout/
│   │   │   ├── Header.tsx         # Top navigation bar
│   │   │   ├── Sidebar.tsx        # Side navigation (Premium)
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx # Route guard for auth
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── DashboardHome.tsx  # Main dashboard view
│   │   │   ├── RegimeIndicator.tsx # Current regime badge
│   │   │   ├── ForecastCard.tsx   # Daily forecast display
│   │   │   └── AccuracyMetrics.tsx # Accuracy stats
│   │   │
│   │   ├── Forecasts/
│   │   │   ├── ForecastHistory.tsx    # Historical forecasts chart
│   │   │   ├── ForecastDetails.tsx    # Detailed forecast view
│   │   │   └── RealtimeForecasts.tsx  # Premium: WebSocket updates
│   │   │
│   │   ├── Upload/
│   │   │   ├── FileUpload.tsx     # CSV upload component
│   │   │   ├── UploadHistory.tsx  # Past uploads log
│   │   │   └── DataPreview.tsx    # Preview uploaded data
│   │   │
│   │   ├── Analytics/
│   │   │   ├── AccuracyDashboard.tsx  # Accuracy over time
│   │   │   ├── RegimeBreakdown.tsx    # Accuracy by regime
│   │   │   └── ExportData.tsx         # CSV/JSON export
│   │   │
│   │   ├── Settings/
│   │   │   ├── OrganizationSettings.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── BrokerConnections.tsx  # Premium: Manage broker APIs
│   │   │   └── BillingSettings.tsx    # Stripe integration
│   │   │
│   │   └── Marketing/              # Landing page components
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       ├── Pricing.tsx
│   │       ├── Testimonials.tsx
│   │       └── FAQ.tsx
│   │
│   ├── pages/                      # Page-level components
│   │   ├── Home.tsx                # Marketing landing page
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Forecasts.tsx
│   │   ├── Upload.tsx
│   │   ├── Analytics.tsx
│   │   ├── Settings.tsx
│   │   ├── Pricing.tsx             # Pricing page
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts              # Auth state management
│   │   ├── useForecast.ts          # Forecast data fetching
│   │   ├── useWebSocket.ts         # WebSocket connection
│   │   └── useUpload.ts            # File upload logic
│   │
│   ├── services/                   # API client services
│   │   ├── api.ts                  # Axios instance with interceptors
│   │   ├── auth.service.ts         # Login, logout, register
│   │   ├── forecast.service.ts     # Forecast CRUD operations
│   │   ├── upload.service.ts       # CSV upload
│   │   └── analytics.service.ts    # Analytics data
│   │
│   ├── store/                      # State management (Zustand)
│   │   ├── authStore.ts            # Auth state
│   │   ├── forecastStore.ts        # Forecast state
│   │   └── uiStore.ts              # UI state (sidebar, modals)
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── forecast.ts             # Forecast interfaces
│   │   ├── user.ts                 # User interfaces
│   │   ├── organization.ts         # Organization interfaces
│   │   └── api.ts                  # API response types
│   │
│   ├── utils/                      # Utility functions
│   │   ├── formatters.ts           # Number, date formatting
│   │   ├── validators.ts           # Form validation
│   │   └── constants.ts            # App-wide constants
│   │
│   └── styles/
│       ├── globals.css             # Global styles, Tailwind imports
│       └── themes.css              # Theme variables
│
└── tests/
    ├── setup.ts                    # Vitest setup
    ├── Dashboard.test.tsx
    ├── ForecastCard.test.tsx
    └── FileUpload.test.tsx
```

---

## MODELS DIRECTORY (`models/`)

```
models/
├── .gitkeep                       # Keep directory in git (models gitignored)
├── README.md                      # Model versioning documentation
│
├── steady_state/
│   ├── v1.0/
│   │   ├── model.pkl              # XGBoost model (joblib)
│   │   ├── scaler.pkl             # Feature scaler
│   │   ├── feature_names.json     # Feature list
│   │   └── metadata.json          # Training date, accuracy, hyperparams
│   │
│   └── v1.1/                      # Improved model after 90 days real data
│       ├── model.pkl
│       ├── scaler.pkl
│       ├── feature_names.json
│       └── metadata.json
│
├── crisis/
│   ├── v1.0/
│   │   ├── shock_multipliers.json # Crisis model parameters
│   │   └── metadata.json
│   │
│   └── v1.1/
│       └── ...
│
└── client_specific/               # Premium: Custom calibrated models
    ├── client_001/
    │   ├── steady_state_calibrated.pkl
    │   ├── scaler.pkl
    │   └── metadata.json
    │
    └── client_002/
        └── ...
```

---

## DATA DIRECTORY (`data/`)

```
data/
├── sample/                        # Sample data for testing/demos
│   ├── sample_positions.csv       # Example position data
│   ├── sample_transactions.csv    # Example transaction data
│   └── README.md                  # Data format documentation
│
├── seeds/                         # Database seed data
│   ├── organizations.json         # Test organizations
│   ├── users.json                 # Test users
│   └── market_indicators.json     # Historical VIX, spreads
│
├── fixtures/                      # Test fixtures
│   ├── forecast_test_cases.json   # Known inputs → expected outputs
│   └── march_2020_backtest.csv    # Crisis period test data
│
└── templates/                     # Templates for users
    ├── position_upload_template.csv
    ├── transaction_upload_template.csv
    └── excel_template.xlsx        # Excel version for non-technical users
```

---

## SCRIPTS DIRECTORY (`scripts/`)

```
scripts/
├── setup/
│   ├── install_dependencies.sh    # Install Python, Node, Docker
│   ├── init_database.sh           # Create database, run migrations
│   └── setup_auth0.sh             # Configure Auth0 tenant
│
├── development/
│   ├── reset_db.sh                # Drop and recreate database
│   ├── seed_db.sh                 # Populate with sample data
│   └── generate_test_data.py      # Generate synthetic data
│
├── ml/
│   ├── train_initial_models.py    # Train v1.0 models on synthetic data
│   ├── retrain_with_real_data.py  # Retrain after pilot data collection
│   ├── backtest_march_2020.py     # Validate crisis model
│   └── evaluate_accuracy.py       # Calculate accuracy metrics
│
├── deployment/
│   ├── deploy_railway.sh          # Deploy to Railway
│   ├── deploy_aws.sh              # Deploy to AWS (future)
│   └── rollback.sh                # Rollback to previous version
│
├── maintenance/
│   ├── backup_database.sh         # Daily backup to S3
│   ├── archive_old_data.sh        # Archive data >2 years old
│   ├── optimize_database.sh       # VACUUM, ANALYZE, reindex
│   └── health_check.sh            # Ping all services
│
└── analytics/
    ├── generate_weekly_report.py  # Send accuracy reports to clients
    ├── export_metrics.py          # Export Prometheus metrics to CSV
    └── churn_analysis.py          # Identify at-risk clients
```

---

## MONITORING DIRECTORY (`monitoring/`)

```
monitoring/
├── prometheus/
│   ├── prometheus.yml             # Prometheus config
│   ├── alerts.yml                 # Alert rules (high error rate, etc.)
│   └── rules.yml                  # Recording rules
│
├── grafana/
│   ├── dashboards/
│   │   ├── application_metrics.json    # API latency, request rate
│   │   ├── forecast_accuracy.json      # Accuracy over time
│   │   ├── database_performance.json   # Query performance
│   │   └── business_metrics.json       # Daily active users, forecasts generated
│   │
│   └── grafana.ini                # Grafana config
│
├── alertmanager/
│   └── alertmanager.yml           # Alert routing (Slack, PagerDuty)
│
└── docker-compose.monitoring.yml  # Monitoring stack (Prometheus, Grafana)
```

---

## DOCS DIRECTORY (`docs/`)

```
docs/
├── README.md                      # Documentation index
│
├── architecture/
│   ├── system_design.md           # High-level architecture diagram
│   ├── database_schema.md         # Database ERD and table descriptions
│   ├── api_design.md              # API design principles
│   └── ml_pipeline.md             # ML training and inference flow
│
├── guides/
│   ├── getting_started.md         # Quick start for developers
│   ├── deployment.md              # Deploy to Railway/AWS
│   ├── contributing.md            # Contribution guidelines
│   └── troubleshooting.md         # Common issues and fixes
│
├── api/
│   ├── openapi.yaml               # OpenAPI 3.0 specification
│   └── postman_collection.json    # Postman collection for testing
│
└── user_guides/
    ├── csv_upload_guide.md        # How to upload position data
    ├── reading_forecasts.md       # How to interpret forecasts
    └── broker_integration.md      # Premium: Connect broker APIs
```

---

## ROOT LEVEL CONFIGURATION FILES

### `.env.example`
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aequitas

# Redis
REDIS_URL=redis://localhost:6379

# MinIO (S3-compatible storage)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Auth0
AUTH0_DOMAIN=aequitas.us.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=https://api.aequitas.ai

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SendGrid (Email)
SENDGRID_API_KEY=SG.xxx

# Sentry (Error tracking)
SENTRY_DSN=https://xxx@sentry.io/xxx

# API Keys for market data
FRED_API_KEY=your_fred_api_key  # For credit spreads, repo rates

# Environment
ENVIRONMENT=development  # or production
DEBUG=true

# Encryption
ENCRYPTION_KEY=your-32-byte-encryption-key-here

# Broker APIs (Premium feature - encrypted in DB)
# These are placeholders; real credentials stored encrypted in database
```

### `.gitignore`
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
.env
.env.local
*.egg-info/
dist/
build/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
dist/
.cache/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*.swn
.DS_Store

# Models (too large for git)
models/*.pkl
models/*.h5
models/*.pt

# Data files
data/*.csv
data/*.json
!data/sample/*.csv
!data/templates/*.csv

# Docker
.dockerignore

# Logs
*.log
logs/

# Testing
.coverage
htmlcov/
.pytest_cache/

# OS
.DS_Store
Thumbs.db
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_DB: aequitas
      POSTGRES_USER: aequitas_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - aequitas_network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - aequitas_network

  minio:
    image: minio/minio:latest
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    networks:
      - aequitas_network

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://aequitas_user:${DB_PASSWORD}@postgres:5432/aequitas
      REDIS_URL: redis://redis:6379
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - ./models:/models
    networks:
      - aequitas_network

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - aequitas_network

volumes:
  postgres_data:
  minio_data:

networks:
  aequitas_network:
    driver: bridge
```

### `README.md` (Root)
```markdown
# Aequitas LV-COP

Crisis-resilient intraday liquidity forecasting for institutional trading firms.

## Quick Start

1. Clone repository:
   ```bash
   git clone https://github.com/aequitas/aequitas-mvp.git
   cd aequitas-mvp
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. Start all services:
   ```bash
   docker-compose up
   ```

4. Access application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - MinIO Console: http://localhost:9001

## Documentation

See `docs/` directory for detailed documentation.

## License

MIT License - see LICENSE file
```

---

## DEPLOYMENT VARIATIONS

### Production (`docker-compose.prod.yml`)
```yaml
# Production overrides
services:
  backend:
    environment:
      DEBUG: "false"
      ENVIRONMENT: production
    command: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

  frontend:
    build:
      context: ./frontend
      target: production
    environment:
      NODE_ENV: production
```

### CI/CD (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## FILE COUNT SUMMARY

**Total Files**: ~180+

**Backend**: 70+ files
- API endpoints: 10 files
- Database models: 12 files
- ML components: 8 files
- Tests: 15 files
- Services: 10 files
- Utils: 8 files

**Frontend**: 60+ files
- Components: 30 files
- Pages: 10 files
- Services/Hooks: 12 files
- Tests: 5 files

**Infrastructure**: 25+ files
- Docker configs: 5 files
- Scripts: 15 files
- Monitoring: 5 files

**Documentation**: 15+ files

**Data/Models**: 10+ files

---

## NEXT STEPS

1. **Week 1**: Create this exact directory structure
2. **Week 2**: Implement backend API with database models
3. **Week 3**: Build ML forecasting pipeline
4. **Week 4**: Complete frontend dashboard
5. **Week 5**: Deploy to Railway, invite first alpha user

This file structure is production-ready. No reorganization needed as we scale from 1 to 1,000 users.
