# ==============================================================================
# AEQUITAS LV-COP BACKEND - MAKEFILE
# ==============================================================================
# Development and deployment automation commands
# ==============================================================================

.PHONY: help install install-dev install-ml test lint format type-check \
        security-check run dev clean docker-build docker-run migrate \
        db-reset seed-data train-models shell coverage docs deploy

# Default target
.DEFAULT_GOAL := help

# Variables
PYTHON := python3.11
VENV := .venv
BIN := $(VENV)/bin
APP := app.main:app
PORT := 8000

# Colors
BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# ==============================================================================
# HELP
# ==============================================================================
help: ## Show this help message
	@echo "$(BLUE)Aequitas LV-COP Backend$(RESET)"
	@echo "$(YELLOW)Usage:$(RESET) make [target]"
	@echo ""
	@echo "$(GREEN)Available targets:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-20s$(RESET) %s\n", $$1, $$2}'

# ==============================================================================
# INSTALLATION
# ==============================================================================
venv: ## Create virtual environment
	@echo "$(GREEN)Creating virtual environment...$(RESET)"
	$(PYTHON) -m venv $(VENV)
	@echo "$(GREEN)Virtual environment created at $(VENV)$(RESET)"

install: venv ## Install production dependencies
	@echo "$(GREEN)Installing production dependencies...$(RESET)"
	$(BIN)/pip install --upgrade pip setuptools wheel
	$(BIN)/pip install -r requirements.txt
	@echo "$(GREEN)Production dependencies installed$(RESET)"

install-ml: install ## Install ML dependencies
	@echo "$(GREEN)Installing ML dependencies...$(RESET)"
	$(BIN)/pip install -r requirements-ml.txt
	@echo "$(GREEN)ML dependencies installed$(RESET)"

install-dev: install-ml ## Install all dependencies (including dev)
	@echo "$(GREEN)Installing development dependencies...$(RESET)"
	$(BIN)/pip install -r requirements-dev.txt
	$(BIN)/pre-commit install
	@echo "$(GREEN)Development dependencies installed$(RESET)"

# ==============================================================================
# DEVELOPMENT
# ==============================================================================
run: ## Run production server
	@echo "$(GREEN)Starting production server...$(RESET)"
	$(BIN)/gunicorn $(APP) \
		--worker-class uvicorn.workers.UvicornWorker \
		--workers 4 \
		--bind 0.0.0.0:$(PORT) \
		--access-logfile - \
		--error-logfile -

dev: ## Run development server with hot reload
	@echo "$(GREEN)Starting development server...$(RESET)"
	$(BIN)/uvicorn $(APP) --host 0.0.0.0 --port $(PORT) --reload

shell: ## Open Python shell with app context
	@echo "$(GREEN)Opening Python shell...$(RESET)"
	$(BIN)/ipython -i -c "from app.main import app; from app.config import settings"

# ==============================================================================
# TESTING
# ==============================================================================
test: ## Run all tests
	@echo "$(GREEN)Running tests...$(RESET)"
	$(BIN)/pytest tests/ -v

test-unit: ## Run unit tests only
	@echo "$(GREEN)Running unit tests...$(RESET)"
	$(BIN)/pytest tests/unit/ -v -m unit

test-integration: ## Run integration tests only
	@echo "$(GREEN)Running integration tests...$(RESET)"
	$(BIN)/pytest tests/integration/ -v -m integration

test-e2e: ## Run end-to-end tests only
	@echo "$(GREEN)Running e2e tests...$(RESET)"
	$(BIN)/pytest tests/e2e/ -v -m e2e

test-performance: ## Run performance tests
	@echo "$(GREEN)Running performance tests...$(RESET)"
	$(BIN)/pytest tests/performance/ -v -m performance

coverage: ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage...$(RESET)"
	$(BIN)/pytest tests/ -v --cov=app --cov-report=html --cov-report=xml
	@echo "$(GREEN)Coverage report generated in htmlcov/$(RESET)"

# ==============================================================================
# CODE QUALITY
# ==============================================================================
lint: ## Run linter (ruff)
	@echo "$(GREEN)Running linter...$(RESET)"
	$(BIN)/ruff check app/ tests/

lint-fix: ## Run linter and fix issues
	@echo "$(GREEN)Running linter with auto-fix...$(RESET)"
	$(BIN)/ruff check app/ tests/ --fix

format: ## Format code (black + isort)
	@echo "$(GREEN)Formatting code...$(RESET)"
	$(BIN)/black app/ tests/
	$(BIN)/isort app/ tests/

format-check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting...$(RESET)"
	$(BIN)/black app/ tests/ --check
	$(BIN)/isort app/ tests/ --check-only

type-check: ## Run type checker (mypy)
	@echo "$(GREEN)Running type checker...$(RESET)"
	$(BIN)/mypy app/

security-check: ## Run security checks
	@echo "$(GREEN)Running security checks...$(RESET)"
	$(BIN)/bandit -r app/
	$(BIN)/safety check --full-report

quality: lint format-check type-check security-check ## Run all quality checks

pre-commit: ## Run pre-commit hooks
	@echo "$(GREEN)Running pre-commit hooks...$(RESET)"
	$(BIN)/pre-commit run --all-files

# ==============================================================================
# DATABASE
# ==============================================================================
migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(RESET)"
	$(BIN)/alembic upgrade head

migrate-down: ## Rollback last migration
	@echo "$(YELLOW)Rolling back last migration...$(RESET)"
	$(BIN)/alembic downgrade -1

migrate-new: ## Create new migration (usage: make migrate-new MSG="migration message")
	@echo "$(GREEN)Creating new migration...$(RESET)"
	$(BIN)/alembic revision --autogenerate -m "$(MSG)"

db-reset: ## Reset database (destructive!)
	@echo "$(RED)Resetting database...$(RESET)"
	$(BIN)/alembic downgrade base
	$(BIN)/alembic upgrade head
	@echo "$(GREEN)Database reset complete$(RESET)"

seed-data: ## Seed database with sample data
	@echo "$(GREEN)Seeding database...$(RESET)"
	$(BIN)/python scripts/development/seed_database.py

# ==============================================================================
# MACHINE LEARNING
# ==============================================================================
train-models: ## Train ML models
	@echo "$(GREEN)Training ML models...$(RESET)"
	$(BIN)/python scripts/ml/train_initial_models.py

backtest: ## Run backtesting on March 2020 data
	@echo "$(GREEN)Running backtests...$(RESET)"
	$(BIN)/python scripts/ml/backtest_march_2020.py

evaluate: ## Evaluate model accuracy
	@echo "$(GREEN)Evaluating model accuracy...$(RESET)"
	$(BIN)/python scripts/ml/evaluate_accuracy.py

# ==============================================================================
# CELERY
# ==============================================================================
worker: ## Start Celery worker
	@echo "$(GREEN)Starting Celery worker...$(RESET)"
	$(BIN)/celery -A app.tasks.celery_app worker --loglevel=info

worker-beat: ## Start Celery beat scheduler
	@echo "$(GREEN)Starting Celery beat...$(RESET)"
	$(BIN)/celery -A app.tasks.celery_app beat --loglevel=info

flower: ## Start Flower (Celery monitoring)
	@echo "$(GREEN)Starting Flower...$(RESET)"
	$(BIN)/celery -A app.tasks.celery_app flower --port=5555

# ==============================================================================
# DOCKER
# ==============================================================================
docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(RESET)"
	docker build -t aequitas-backend:latest .

docker-build-prod: ## Build production Docker image
	@echo "$(GREEN)Building production Docker image...$(RESET)"
	docker build -t aequitas-backend:prod -f Dockerfile.prod .

docker-run: ## Run Docker container
	@echo "$(GREEN)Running Docker container...$(RESET)"
	docker run -p $(PORT):$(PORT) --env-file .env aequitas-backend:latest

docker-compose-up: ## Start all services with docker-compose
	@echo "$(GREEN)Starting all services...$(RESET)"
	docker-compose up -d

docker-compose-down: ## Stop all services
	@echo "$(GREEN)Stopping all services...$(RESET)"
	docker-compose down

docker-compose-logs: ## View docker-compose logs
	docker-compose logs -f

# ==============================================================================
# DOCUMENTATION
# ==============================================================================
docs: ## Generate documentation
	@echo "$(GREEN)Generating documentation...$(RESET)"
	$(BIN)/mkdocs build

docs-serve: ## Serve documentation locally
	@echo "$(GREEN)Serving documentation...$(RESET)"
	$(BIN)/mkdocs serve

# ==============================================================================
# DEPLOYMENT
# ==============================================================================
deploy-railway: ## Deploy to Railway
	@echo "$(GREEN)Deploying to Railway...$(RESET)"
	railway up

health-check: ## Check API health
	@echo "$(GREEN)Checking API health...$(RESET)"
	curl -s http://localhost:$(PORT)/health | jq

# ==============================================================================
# CLEANUP
# ==============================================================================
clean: ## Clean up generated files
	@echo "$(YELLOW)Cleaning up...$(RESET)"
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "coverage.xml" -delete
	find . -type f -name ".coverage" -delete
	@echo "$(GREEN)Cleanup complete$(RESET)"

clean-docker: ## Clean Docker resources
	@echo "$(YELLOW)Cleaning Docker resources...$(RESET)"
	docker system prune -f

clean-all: clean clean-docker ## Clean everything
	@echo "$(GREEN)All cleanup complete$(RESET)"
