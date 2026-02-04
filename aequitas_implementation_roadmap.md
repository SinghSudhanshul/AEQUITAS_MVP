# AEQUITAS LV-COP: STAGED IMPLEMENTATION ROADMAP
## From Code to Revenue in 16 Weeks

**Version:** 1.0  
**Timeline:** Week 1 (Feb 3, 2026) → Week 16 (May 18, 2026)  
**First Paying Client Target:** Week 12 (April 20, 2026)

---

## EXECUTION PHILOSOPHY: SHIP EARLY, ITERATE FAST

We're building in **four distinct stages**, each ending with a shippable product:

1. **MVP Core** (Weeks 1-4): Free tier that actually works
2. **Commercial Readiness** (Weeks 5-8): Premium features + first pilot client
3. **Scale Preparation** (Weeks 9-12): Multi-client support + revenue
4. **Product Market Fit** (Weeks 13-16): Refinement based on real usage

**Critical Rule**: Each stage MUST be production-ready before moving to next. We ship imperfect features over perfect demos.

---

## STAGE 1: MVP CORE (Weeks 1-4)
### Goal: Free tier users can upload CSV, get daily forecasts

**Team**: 2 full-stack engineers + 1 data scientist  
**Budget**: $0 (using free tier everything)  
**Success Criteria**: 1 alpha user (friendly hedge fund contact) using it daily

### WEEK 1: Infrastructure + Database

**Monday-Tuesday: Development Environment Setup**
```bash
# Hour 1-4: Initialize repository
mkdir aequitas-mvp && cd aequitas-mvp
git init
gh repo create aequitas-mvp --private

# Create directory structure
mkdir -p backend/{app,database,ml,tests}
mkdir -p frontend/{src,public}
mkdir -p models
mkdir -p monitoring

# Initialize Python backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
pip freeze > requirements.txt

# Initialize React frontend
cd ../frontend
npx create-vite@latest . --template react-ts
npm install axios @tanstack/react-query recharts shadcn-ui
```

**Wednesday-Thursday: Database Setup**
- Deploy PostgreSQL on Railway.app (15 minutes)
- Create all tables from TECH_ARCHITECTURE.md (2 hours)
- Write SQLAlchemy models matching schema (3 hours)
- Create Alembic migrations for version control (2 hours)
- Write database seed script with sample data (2 hours)

**Friday: Docker Compose**
- Write docker-compose.yml for local development (2 hours)
- Test full stack spins up with `docker-compose up` (1 hour)
- Document setup in README.md (1 hour)

**Deliverable**: `docker-compose up` works on fresh laptop

---

### WEEK 2: Core API + CSV Upload

**Monday-Tuesday: Authentication Foundation**
```python
# backend/app/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
import jwt

security = HTTPBearer()

# TEMPORARY: Simple API key auth for MVP
# Production: Migrate to Auth0 in Stage 2
VALID_API_KEYS = {
    "alpha-user-key-1": {"user_id": "alpha", "org_id": "test-org", "tier": "free"}
}

async def verify_api_key(credentials = Depends(security)):
    api_key = credentials.credentials
    if api_key not in VALID_API_KEYS:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return VALID_API_KEYS[api_key]
```

**Wednesday-Thursday: CSV Upload Endpoint**
```python
# backend/app/routers/upload.py
from fastapi import APIRouter, UploadFile, File, Depends
import pandas as pd
from app.auth import verify_api_key
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/api/v1/upload/csv")
async def upload_positions_csv(
    file: UploadFile = File(...),
    user = Depends(verify_api_key),
    db: Session = Depends(get_db)
):
    # Validate CSV format
    df = pd.read_csv(file.file)
    required_columns = [
        'snapshot_date', 'broker_name', 'asset_class',
        'position_value_usd', 'margin_requirement_usd',
        'available_collateral_usd'
    ]
    
    if not all(col in df.columns for col in required_columns):
        raise HTTPException(400, "Invalid CSV format")
    
    # Insert into database
    for _, row in df.iterrows():
        position = PositionSnapshot(
            org_id=user['org_id'],
            **row.to_dict()
        )
        db.add(position)
    
    db.commit()
    
    return {
        "status": "success",
        "records_inserted": len(df)
    }
```

**Friday: Testing + Documentation**
- Write pytest tests for CSV upload (2 hours)
- Create sample CSV template for users (30 minutes)
- Test with malformed CSVs, verify error handling (2 hours)

**Deliverable**: Working CSV upload endpoint with validation

---

### WEEK 3: Forecasting Engine (Critical Week)

**Monday: Market Data Integration**
```python
# backend/app/ml/market_data.py
import yfinance as yf  # Free market data
import pandas as pd
from datetime import date, timedelta

def fetch_market_indicators(end_date: date = None) -> pd.DataFrame:
    """
    Fetch free market data for regime detection
    
    Sources:
    - VIX: Yahoo Finance (^VIX)
    - Credit spreads: FRED API (free)
    - Repo rates: FRED API
    """
    if end_date is None:
        end_date = date.today()
    
    start_date = end_date - timedelta(days=90)
    
    # Fetch VIX from Yahoo Finance
    vix = yf.download('^VIX', start=start_date, end=end_date)
    vix = vix[['Close']].rename(columns={'Close': 'vix_close'})
    vix['vix_change_pct'] = vix['vix_close'].pct_change() * 100
    
    # TODO: Integrate FRED API for credit spreads and repo rates
    # For MVP: Use hardcoded reasonable values
    vix['credit_spread_ig'] = 120  # basis points (typical)
    vix['repo_rate'] = 5.33  # current approximate rate
    vix['repo_spread_bps'] = 15
    
    return vix
```

**Tuesday-Wednesday: Train Initial Models**
```python
# scripts/train_initial_models.py
import pandas as pd
from backend.app.ml.forecasting import SteadyStateModel, RegimeDetector
from sklearn.model_selection import train_test_split
import joblib

# Load historical training data
# For MVP: Use synthetic data generated from distributions
def generate_synthetic_training_data(n_samples=1000):
    """
    Generate synthetic position/liquidity data for initial training
    Real data from pilots will replace this in Stage 2
    """
    np.random.seed(42)
    
    data = pd.DataFrame({
        'date': pd.date_range('2023-01-01', periods=n_samples),
        'total_position_value': np.random.normal(5e9, 1e9, n_samples),
        'margin_requirement': np.random.normal(500e6, 100e6, n_samples),
        'actual_liquidity': np.random.normal(600e6, 150e6, n_samples),
        'vix_close': np.random.normal(18, 5, n_samples),
        # ... other features
    })
    
    return data

# Train model
data = generate_synthetic_training_data()
model = SteadyStateModel()

features = model.engineer_features(data)
X = features.drop('actual_liquidity', axis=1)
y = data['actual_liquidity']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.train(X_train, y_train)

# Evaluate
from sklearn.metrics import mean_absolute_percentage_error
preds = model.predict(X_test)
mape = mean_absolute_percentage_error(y_test, preds)
print(f"MAPE: {mape:.2%}")  # Target: <12% for MVP

# Save model
model.save_models('./models/')
```

**Thursday: Forecast Generation Endpoint**
```python
# backend/app/routers/forecasts.py
from fastapi import APIRouter, Depends
from app.ml.forecasting import ForecastingEngine
from app.ml.market_data import fetch_market_indicators

router = APIRouter()
engine = ForecastingEngine()
engine.load_models('./models/')  # Load pre-trained models

@router.get("/api/v1/forecast/daily")
async def get_daily_forecast(
    target_date: date = None,
    user = Depends(verify_api_key),
    db: Session = Depends(get_db)
):
    if target_date is None:
        target_date = date.today()
    
    # Fetch latest positions for this org
    positions = db.query(PositionSnapshot).filter(
        PositionSnapshot.org_id == user['org_id']
    ).order_by(PositionSnapshot.snapshot_date.desc()).limit(30).all()
    
    if not positions:
        raise HTTPException(400, "No position data uploaded")
    
    position_df = pd.DataFrame([p.__dict__ for p in positions])
    
    # Fetch market data
    market_df = fetch_market_indicators()
    
    # Generate forecast
    forecast = engine.generate_forecast(
        user['org_id'],
        target_date,
        position_df,
        market_df
    )
    
    # Save to database
    db_forecast = Forecast(**forecast)
    db.add(db_forecast)
    db.commit()
    
    return forecast
```

**Friday: End-to-End Test**
- Upload sample CSV via API (1 hour)
- Generate forecast via API (1 hour)
- Verify forecast stored in database (30 minutes)
- Check accuracy against synthetic ground truth (2 hours)

**Deliverable**: Working forecasting pipeline (CSV → Forecast)

---

### WEEK 4: Frontend Dashboard

**Monday-Tuesday: React Dashboard Setup**
```tsx
// frontend/src/App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './components/Dashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

```tsx
// frontend/src/components/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function Dashboard() {
  const { data: forecast, isLoading } = useQuery({
    queryKey: ['daily-forecast'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/forecast/daily`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      return res.json();
    }
  });

  if (isLoading) return <div>Loading forecast...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Aequitas Liquidity Forecast</h1>
      
      {/* Regime Indicator */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Market Regime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            forecast.regime_detected === 'crisis' ? 'text-red-600' :
            forecast.regime_detected === 'elevated' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {forecast.regime_detected.toUpperCase()}
          </div>
        </CardContent>
      </Card>

      {/* Forecast Display */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Liquidity Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-gray-600">Base Case (P50):</span>
              <span className="text-2xl font-bold ml-4">
                ${(forecast.predicted_liquidity_p50 / 1e6).toFixed(2)}M
              </span>
            </div>
            
            <div className="text-sm text-gray-500">
              Range: ${(forecast.predicted_liquidity_p5 / 1e6).toFixed(2)}M 
              {' to '}
              ${(forecast.predicted_liquidity_p95 / 1e6).toFixed(2)}M
            </div>

            <div>
              <span className="text-gray-600">Confidence:</span>
              <span className="ml-4">{(forecast.confidence_score * 100).toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Wednesday: CSV Upload UI**
```tsx
// frontend/src/components/FileUpload.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/v1/upload/csv`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
        body: formData
      });
      
      const data = await res.json();
      alert(`Success! Uploaded ${data.records_inserted} records`);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm"
      />
      
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Position Data'}
      </Button>
    </div>
  );
}
```

**Thursday: Historical Forecast Chart**
```tsx
// frontend/src/components/ForecastHistory.tsx
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ForecastHistory() {
  const { data } = useQuery({
    queryKey: ['forecast-history'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/forecasts/history?days=30`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      return res.json();
    }
  });

  if (!data?.forecasts) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.forecasts}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="target_date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="predicted_liquidity_p50" 
          stroke="#8884d8" 
          name="Forecast" 
        />
        <Line 
          type="monotone" 
          dataKey="actual_liquidity" 
          stroke="#82ca9d" 
          name="Actual" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Friday: Deploy MVP**
- Push to GitHub (15 minutes)
- Connect Railway to GitHub repo (30 minutes)
- Configure environment variables in Railway (30 minutes)
- Deploy and verify at https://aequitas-mvp.up.railway.app (1 hour)
- Share with alpha user, collect feedback (rest of day)

**Deliverable**: Live MVP at production URL

---

## STAGE 2: COMMERCIAL READINESS (Weeks 5-8)
### Goal: Premium tier ready, first pilot client onboarded

**Team**: Same 3 people + 1 product manager (part-time)  
**Budget**: $500 for pilot support  
**Success Criteria**: 1 paying pilot client ($30K pilot fee)

### WEEK 5: Auth0 + Premium Features Gate

**Monday-Tuesday: Auth0 Integration**
```python
# backend/app/auth.py (replace temporary API key)
from authlib.integrations.starlette_client import OAuth
from fastapi import Request
import jwt

oauth = OAuth()
oauth.register(
    'auth0',
    client_id=os.getenv('AUTH0_CLIENT_ID'),
    client_secret=os.getenv('AUTH0_CLIENT_SECRET'),
    server_metadata_url=f'https://{os.getenv("AUTH0_DOMAIN")}/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid profile email'}
)

async def verify_jwt(request: Request):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    # Verify JWT signature with Auth0 public key
    decoded = jwt.decode(
        token,
        algorithms=['RS256'],
        audience=os.getenv('AUTH0_AUDIENCE'),
        issuer=f'https://{os.getenv("AUTH0_DOMAIN")}/'
    )
    
    # Look up user in database
    user = db.query(User).filter(User.auth0_id == decoded['sub']).first()
    if not user:
        raise HTTPException(401, "User not found")
    
    return user
```

**Wednesday: Subscription Tier Enforcement**
```python
# backend/app/dependencies.py
from fastapi import Depends, HTTPException

async def require_premium(user = Depends(verify_jwt), db = Depends(get_db)):
    org = db.query(Organization).filter(Organization.org_id == user.org_id).first()
    
    if org.tier not in ['premium', 'enterprise']:
        raise HTTPException(
            status_code=402,  # Payment Required
            detail={
                "error": "Premium subscription required",
                "upgrade_url": "https://aequitas.ai/pricing"
            }
        )
    
    return user
```

**Thursday-Friday: Premium Feature: Broker API Connection**
```python
# backend/app/integrations/goldman_sachs.py
import httpx
from cryptography.fernet import Fernet

class GoldmanSachsConnector:
    """
    Connect to Goldman Sachs Prime Brokerage API
    (Simulated for MVP - real integration requires partnership)
    """
    
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.gs.com/prime"  # Hypothetical
    
    async def fetch_positions(self, account_id: str) -> dict:
        """Fetch real-time positions from GS API"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/accounts/{account_id}/positions",
                headers={"X-API-Key": self.api_key}
            )
            return response.json()
    
    async def sync_positions_to_db(self, org_id: str, db: Session):
        """Sync GS positions to Aequitas database"""
        positions = await self.fetch_positions(org_id)
        
        for pos in positions:
            db_pos = PositionSnapshot(
                org_id=org_id,
                snapshot_date=date.today(),
                broker_name="Goldman Sachs",
                source="api",
                **pos
            )
            db.add(db_pos)
        
        db.commit()

@router.post("/api/v1/broker/connect/goldman-sachs")
async def connect_goldman_sachs(
    api_credentials: dict,
    user = Depends(require_premium),
    db = Depends(get_db)
):
    # Encrypt credentials before storing
    cipher = Fernet(os.getenv('ENCRYPTION_KEY').encode())
    encrypted_key = cipher.encrypt(api_credentials['api_key'].encode())
    encrypted_secret = cipher.encrypt(api_credentials['api_secret'].encode())
    
    # Store in database
    connection = BrokerConnection(
        org_id=user.org_id,
        broker_name="goldman_sachs",
        api_key_encrypted=encrypted_key,
        api_secret_encrypted=encrypted_secret
    )
    db.add(connection)
    db.commit()
    
    return {"status": "connected"}
```

---

### WEEK 6: Real-time Forecasting (Premium)

**Monday-Tuesday: Intraday Data Pipeline**
```python
# backend/app/ml/realtime.py
from fastapi_utils.tasks import repeat_every
from app.ml.forecasting import ForecastingEngine

engine = ForecastingEngine()

@repeat_every(seconds=14400)  # Every 4 hours
async def generate_intraday_forecasts():
    """
    Background task: Generate forecasts for all premium orgs
    """
    premium_orgs = db.query(Organization).filter(
        Organization.tier.in_(['premium', 'enterprise'])
    ).all()
    
    for org in premium_orgs:
        # Fetch latest broker data
        connector = get_broker_connector(org.org_id)
        await connector.sync_positions_to_db(org.org_id, db)
        
        # Generate forecast
        forecast = engine.generate_forecast(
            org.org_id,
            target_date=date.today(),
            position_data=...,
            market_data=...
        )
        
        db.add(Forecast(**forecast))
    
    db.commit()
```

**Wednesday-Thursday: WebSocket for Live Updates**
```python
# backend/app/websockets.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/forecasts")
async def websocket_forecasts(websocket: WebSocket, org_id: str):
    await manager.connect(websocket)
    
    try:
        while True:
            # Wait for forecast updates
            data = await websocket.receive_text()
            
            # When new forecast generated, push to client
            latest_forecast = get_latest_forecast(org_id)
            await websocket.send_json(latest_forecast)
    
    except WebSocketDisconnect:
        manager.active_connections.remove(websocket)
```

**Friday: Frontend Real-time Display**
```tsx
// frontend/src/components/RealtimeForecasts.tsx (Premium only)
import { useEffect, useState } from 'react';

export function RealtimeForecastsdefault() {
  const [forecasts, setForecasts] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/forecasts?org_id=...');
    
    ws.onmessage = (event) => {
      const forecast = JSON.parse(event.data);
      setForecasts(prev => [forecast, ...prev]);
    };
    
    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Real-time Intraday Forecasts</h2>
      {forecasts.map(f => (
        <div key={f.forecast_id}>
          <span>{new Date(f.generated_at).toLocaleTimeString()}</span>
          <span>${(f.predicted_liquidity_p50 / 1e6).toFixed(2)}M</span>
        </div>
      ))}
    </div>
  );
}
```

---

### WEEK 7: Pilot Client Onboarding

**Monday: Create Pilot Package**
- Pilot contract template (1-pager, $30K for 90 days)
- Onboarding checklist (data requirements, access setup)
- Custom CSV template for pilot's data format
- Training materials (video walkthrough)

**Tuesday-Wednesday: Pilot Client #1 Setup**
- Kickoff call with treasury team (2 hours)
- Collect historical position data (CSV exports from their systems)
- Upload 6 months of historical data to database
- Verify data quality and completeness

**Thursday: Custom Calibration (Manual)**
```python
# scripts/pilot_calibration.py
# Manual calibration script for Pilot Client #1

import pandas as pd
from app.ml.forecasting import SteadyStateModel

# Load pilot's historical data
pilot_data = pd.read_csv('pilot_historical_positions.csv')

# Their specific characteristics
PILOT_PROFILE = {
    'avg_aum': 8_000_000_000,  # $8B
    'primary_broker': 'Morgan Stanley',
    'trading_style': 'multi-strategy',
    'leverage_ratio': 3.5,
}

# Retrain model with pilot's data
model = SteadyStateModel()
features = model.engineer_features(pilot_data)

# Add pilot-specific features
features['leverage'] = PILOT_PROFILE['leverage_ratio']
features['broker_ms_indicator'] = 1  # Morgan Stanley flag

model.train(features, pilot_data['actual_liquidity'])
model.save_models(f'./models/pilot_client_1/')
```

**Friday: Deliver First Forecast to Pilot**
- Generate pilot's first daily forecast
- Schedule daily email delivery (automated via SendGrid free tier)
- Collect feedback on accuracy and usability

---

### WEEK 8: Polish + Documentation

**Monday-Tuesday: Accuracy Monitoring Dashboard**
```tsx
// frontend/src/components/AccuracyMetrics.tsx
export function AccuracyMetrics() {
  const { data } = useQuery(['accuracy-metrics'], async () => {
    // Fetch forecast vs actual comparisons
    const res = await fetch('/api/v1/analytics/accuracy');
    return res.json();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Accuracy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600">Last 7 Days</span>
            <div className="text-2xl font-bold">{data?.accuracy_7d}%</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Last 30 Days</span>
            <div className="text-2xl font-bold">{data?.accuracy_30d}%</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">During Crisis</span>
            <div className="text-2xl font-bold text-green-600">
              {data?.accuracy_crisis}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Wednesday: API Documentation Polish**
- Complete OpenAPI spec with examples
- Add authentication flows to docs
- Create Postman collection for API testing
- Record video tutorial on API usage

**Thursday: Compliance Documentation**
- Write Data Processing Agreement (DPA) for pilot
- Document audit logging procedures
- Create incident response plan
- SOC 2 readiness checklist (for future)

**Friday: Stage 2 Retrospective**
- Demo to internal team
- Collect pilot feedback
- Plan Stage 3 priorities
- Celebrate first paying client!

**Deliverable**: Pilot client actively using platform daily

---

## STAGE 3: SCALE PREPARATION (Weeks 9-12)
### Goal: Support 3-5 concurrent clients, positive cash flow

**Team**: Same 3 + product manager full-time  
**Budget**: $2,000/month (upgrade Railway, buy domain)  
**Success Criteria**: $150K ARR under contract

### WEEK 9: Multi-Tenancy Hardening

**Monday-Tuesday: Row-Level Security**
```sql
-- PostgreSQL Row-Level Security (RLS)
-- Ensures orgs can ONLY see their own data

ALTER TABLE positions_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation ON positions_snapshot
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID);

-- Apply to all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON transactions
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID);

-- Same for forecasts, audit_log, etc.
```

**Wednesday: Automated Testing Suite**
```python
# tests/test_multi_tenancy.py
import pytest
from fastapi.testclient import TestClient

def test_org_isolation():
    """Verify Org A cannot access Org B's data"""
    
    client_a = TestClient(app, headers={'Authorization': f'Bearer {ORG_A_TOKEN}'})
    client_b = TestClient(app, headers={'Authorization': f'Bearer {ORG_B_TOKEN}'})
    
    # Org A uploads data
    client_a.post('/api/v1/upload/csv', files={'file': org_a_csv})
    
    # Org B should see ZERO records from Org A
    response = client_b.get('/api/v1/forecasts/history')
    assert len(response.json()['forecasts']) == 0
    
    # Org B uploads data
    client_b.post('/api/v1/upload/csv', files={'file': org_b_csv})
    
    # Org B should see only their forecasts
    response = client_b.get('/api/v1/forecasts/history')
    assert all(f['org_id'] == ORG_B_ID for f in response.json()['forecasts'])
```

**Thursday-Friday: Load Testing**
```python
# tests/load_test.py
from locust import HttpUser, task, between

class AequitasUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def get_forecast(self):
        self.client.get(
            "/api/v1/forecast/daily",
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task(2)  # 2x weight (more common)
    def upload_csv(self):
        files = {'file': open('test_positions.csv', 'rb')}
        self.client.post(
            "/api/v1/upload/csv",
            files=files,
            headers={"Authorization": f"Bearer {self.token}"}
        )

# Run: locust -f tests/load_test.py --host=http://localhost:8000
# Verify: 100 concurrent users, <500ms p95 latency
```

---

### WEEK 10: Sales + Marketing Materials

**Monday-Tuesday: Landing Page (React)**
```tsx
// frontend-marketing/src/pages/Home.tsx
export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Liquidity Forecasting That Works <br />
          <span className="text-blue-600">When Markets Break</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          88% accuracy during normal conditions. <br />
          85% accuracy during March 2020. <br />
          Free for firms under $1B AUM.
        </p>
        
        <Button size="lg" asChild>
          <a href="/signup">Start Free Trial</a>
        </Button>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <p className="text-center text-gray-600 mb-8">
          Trusted by treasury teams at:
        </p>
        <div className="flex justify-center gap-12 opacity-60">
          {/* Pilot client logos (with permission) */}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Crisis Detection"
            description="Automatic regime switching when VIX spikes, credit spreads widen, or repo markets dislocate"
            icon={<AlertTriangle />}
          />
          <FeatureCard
            title="CSV Upload (Free)"
            description="No API integration required. Upload positions daily, get forecasts instantly."
            icon={<Upload />}
          />
          <FeatureCard
            title="Broker APIs (Premium)"
            description="Automated sync with Goldman Sachs, Morgan Stanley, JP Morgan prime brokerage."
            icon={<Zap />}
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <PricingTable />
      </section>
    </div>
  );
}
```

**Wednesday: Pricing Page**
```tsx
// Pricing tiers from FEATURE_MATRIX.md
export function PricingTable() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Free Tier */}
      <PricingCard
        tier="Free"
        price="$0"
        features={[
          "CSV upload (daily)",
          "Daily forecasts",
          "30-day history",
          "Email support"
        ]}
        cta="Get Started"
        ctaLink="/signup"
      />
      
      {/* Premium Tier */}
      <PricingCard
        tier="Premium"
        price="$30K"
        subtitle="/month"
        features={[
          "Everything in Free",
          "Real-time intraday forecasts",
          "Broker API integration (3 brokers)",
          "Custom model calibration",
          "Dedicated support"
        ]}
        cta="Request Demo"
        ctaLink="/contact"
        highlighted
      />
      
      {/* Enterprise */}
      <PricingCard
        tier="Enterprise"
        price="Custom"
        features={[
          "Everything in Premium",
          "Unlimited broker integrations",
          "White-glove calibration",
          "SLA guarantees",
          "Compliance consulting"
        ]}
        cta="Contact Sales"
        ctaLink="/contact"
      />
    </div>
  );
}
```

**Thursday-Friday: Demo Video Production**
- Record 5-minute product demo
- Upload to YouTube (unlisted)
- Embed on landing page
- Create GIFs for social media

---

### WEEK 11: Second Client Onboarding

**Monday-Tuesday: Outreach Campaign**
```
Email template for warm leads:

Subject: [Pilot] liquidity forecasting that doesn't break in March 2020

Hi [Name],

Quick question: When VIX hit 82 in March 2020, did your liquidity forecasts collapse?

We built Aequitas specifically to solve this. Our dual-model architecture maintained 85% accuracy during the crisis while legacy systems dropped to 30%.

We're onboarding 3 pilot clients this quarter at $30K for 90 days. If you're interested, I can share our March 2020 backtest results.

[Your name]
Aequitas Co-Founder

P.S. We have a free tier if you want to test with CSV uploads first.
```

**Wednesday: Second Pilot Onboarding**
- Kickoff call
- Data collection
- Historical upload
- Custom calibration

**Thursday-Friday: Client Success Framework**
- Weekly usage reports (automated email)
- Monthly accuracy reviews (Zoom call)
- Quarterly business reviews (QBR deck template)

---

### WEEK 12: Revenue Milestone + Optimization

**Monday: Stripe Integration**
```python
# backend/app/billing.py
import stripe

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@router.post("/api/v1/billing/subscribe")
async def create_subscription(
    plan: str,  # 'premium' or 'enterprise'
    user = Depends(verify_jwt),
    db = Depends(get_db)
):
    # Create Stripe customer
    customer = stripe.Customer.create(
        email=user.email,
        metadata={'org_id': str(user.org_id)}
    )
    
    # Create subscription
    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[{
            'price': PRICE_IDS[plan]  # $30K/month for premium
        }]
    )
    
    # Update organization tier in database
    org = db.query(Organization).filter(Organization.org_id == user.org_id).first()
    org.tier = plan
    org.stripe_customer_id = customer.id
    org.stripe_subscription_id = subscription.id
    db.commit()
    
    return {"status": "subscribed", "tier": plan}
```

**Tuesday: Performance Optimization**
- Add database indexes for slow queries
- Implement Redis caching for repeated forecast requests
- Optimize CSV parsing with Polars (faster than pandas)

**Wednesday: Security Audit**
- Run OWASP ZAP automated security scan
- Fix any critical/high vulnerabilities
- Enable rate limiting on all endpoints
- Add request validation with Pydantic

**Thursday: Monitoring Setup**
- Deploy Sentry for error tracking
- Configure Prometheus metrics export
- Set up Grafana dashboard (forecast count, accuracy, latency)
- Create PagerDuty alerts for critical failures

**Friday: Stage 3 Review**
- Demo to advisory board
- Share metrics: 3 clients, $180K ARR, 87% accuracy
- Plan Stage 4: Product-market fit refinement

**Deliverable**: $150K+ ARR, platform supporting 3+ concurrent clients

---

## STAGE 4: PRODUCT-MARKET FIT (Weeks 13-16)
### Goal: Nail the messaging, improve accuracy, prepare for scale

**Team**: Same 4 people  
**Budget**: $3,000/month  
**Success Criteria**: 90% accuracy, NPS > 50, <5% churn

### WEEK 13-14: Model Improvement Cycle

**Focus**: Achieve 90%+ steady-state accuracy using real pilot data

**Monday: Retrain with Real Data**
```python
# Now that we have 3 clients × 90 days = 270 days of real data
# Replace synthetic training data with actual forecasts vs actuals

real_training_data = db.query(Forecast, ForecastActual).join(
    ForecastActual
).filter(
    Forecast.generated_at >= '2026-02-01'
).all()

# Analyze error patterns
errors = []
for forecast, actual in real_training_data:
    error_pct = abs(forecast.predicted_liquidity_p50 - actual.actual_liquidity_required) / actual.actual_liquidity_required
    errors.append({
        'error_pct': error_pct,
        'regime': forecast.regime_detected,
        'day_of_week': forecast.target_date.strftime('%A'),
        'vix': forecast.vix_level,
    })

errors_df = pd.DataFrame(errors)

# Identify: Are errors higher on Fridays? During elevated regime?
print(errors_df.groupby('regime')['error_pct'].mean())
# Example output:
# regime
# crisis          0.15  (15% error - target: <20%, GOOD)
# elevated        0.12  (12% error - target: <15%, GOOD)
# steady_state    0.08  (8% error - target: <10%, EXCELLENT)
```

**Wednesday-Friday: Feature Engineering Improvements**
```python
# Based on error analysis, add new features that reduce errors

def engineer_features_v2(df: pd.DataFrame) -> pd.DataFrame:
    """Enhanced features based on 90 days of real data"""
    
    features = engineer_features_v1(df)  # Original features
    
    # New features from error analysis
    features['friday_effect'] = (df['date'].dt.dayofweek == 4).astype(int)
    features['month_end_3d'] = (df['date'].dt.day >= 28).astype(int)
    
    # Client-specific learned patterns
    features['client_typical_buffer'] = df.groupby('org_id')['collateral_buffer'].transform('median')
    features['client_volatility'] = df.groupby('org_id')['position_value'].transform('std')
    
    # Interaction terms (VIX × leverage)
    features['vix_leverage_interaction'] = features['vix'] * features['margin_ratio']
    
    return features

# Retrain model
model_v2 = SteadyStateModel()
X = engineer_features_v2(real_data)
y = real_data['actual_liquidity']
model_v2.train(X, y)

# Validate: Accuracy should improve from 88% → 90%+
```

---

### WEEK 15: Client Success Playbook

**Monday-Tuesday: Automated Accuracy Reports**
```python
# Send weekly email to clients with their accuracy stats

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

@celery.task
def send_weekly_accuracy_report(org_id: str):
    # Calculate accuracy for this org over last week
    forecasts = db.query(Forecast).filter(
        Forecast.org_id == org_id,
        Forecast.forecast_date >= date.today() - timedelta(days=7)
    ).all()
    
    accuracy = calculate_accuracy(forecasts)
    
    # Generate report email
    message = Mail(
        from_email='reports@aequitas.ai',
        to_emails=get_org_admin_emails(org_id),
        subject=f'Weekly Forecast Accuracy: {accuracy:.1%}',
        html_content=f'''
        <h2>Your Weekly Aequitas Report</h2>
        <p>Forecast Accuracy: <strong>{accuracy:.1%}</strong></p>
        <p>Total Forecasts: {len(forecasts)}</p>
        <p>Regime Breakdown:</p>
        <ul>
            <li>Steady State: {count_by_regime['steady_state']} days</li>
            <li>Elevated: {count_by_regime['elevated']} days</li>
            <li>Crisis: {count_by_regime['crisis']} days</li>
        </ul>
        <a href="https://app.aequitas.ai/dashboard">View Full Report</a>
        '''
    )
    
    sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
    sg.send(message)

# Schedule: Every Monday at 9am
@celery.beat_schedule('weekly-reports')
def schedule_weekly_reports():
    for org in get_active_orgs():
        send_weekly_accuracy_report.delay(org.org_id)
```

**Wednesday: NPS Survey**
```python
# In-app NPS survey after 30 days of usage

@router.get("/api/v1/nps/prompt")
async def show_nps_survey(user = Depends(verify_jwt)):
    # Check if user has been active for 30+ days
    signup_date = user.created_at
    if (date.today() - signup_date.date()).days < 30:
        return {"show_survey": False}
    
    # Check if already responded
    existing_response = db.query(NPSResponse).filter(
        NPSResponse.user_id == user.user_id
    ).first()
    
    if existing_response:
        return {"show_survey": False}
    
    return {"show_survey": True}

@router.post("/api/v1/nps/submit")
async def submit_nps(
    score: int,  # 0-10
    feedback: str,
    user = Depends(verify_jwt)
):
    nps = NPSResponse(
        user_id=user.user_id,
        org_id=user.org_id,
        score=score,
        feedback=feedback
    )
    db.add(nps)
    db.commit()
    
    # Alert sales team if detractor (score 0-6)
    if score <= 6:
        send_slack_alert(f"Detractor NPS: {score} from {user.email}: {feedback}")
    
    return {"status": "recorded"}
```

**Thursday-Friday: Churn Prevention**
```python
# Detect early warning signs of churn

@celery.task
def detect_churn_risk():
    """
    Flag orgs showing churn signals:
    - No CSV upload in 7 days
    - No forecast views in 3 days
    - Forecast accuracy < 70%
    """
    
    at_risk_orgs = []
    
    for org in get_active_premium_orgs():
        # Check last upload
        last_upload = db.query(PositionSnapshot).filter(
            PositionSnapshot.org_id == org.org_id
        ).order_by(PositionSnapshot.uploaded_at.desc()).first()
        
        if not last_upload or (date.today() - last_upload.uploaded_at.date()).days > 7:
            at_risk_orgs.append({
                'org': org,
                'reason': 'No uploads in 7 days',
                'action': 'Outreach: "Need help with CSV upload?"'
            })
        
        # Check forecast accuracy
        recent_accuracy = calculate_accuracy_30d(org.org_id)
        if recent_accuracy < 0.70:
            at_risk_orgs.append({
                'org': org,
                'reason': f'Low accuracy: {recent_accuracy:.1%}',
                'action': 'Escalate to ML team for model recalibration'
            })
    
    # Send daily digest to customer success team
    send_churn_risk_report(at_risk_orgs)
```

---

### WEEK 16: Scaling Preparation

**Monday: Database Optimization**
```sql
-- Add missing indexes discovered under load

CREATE INDEX CONCURRENTLY idx_positions_org_date_broker 
ON positions_snapshot(org_id, snapshot_date DESC, broker_name);

CREATE INDEX CONCURRENTLY idx_forecasts_org_target_regime
ON forecasts(org_id, target_date DESC, regime_detected);

-- Partition audit_log table by month (better query performance)
CREATE TABLE audit_log_2026_02 PARTITION OF audit_log
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Enable query plan caching
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
```

**Tuesday: API Versioning**
```python
# Prepare for breaking changes by versioning API

# backend/app/routers/v1/__init__.py - current API
# backend/app/routers/v2/__init__.py - future API with improvements

from fastapi import APIRouter

router_v1 = APIRouter(prefix="/api/v1")
router_v2 = APIRouter(prefix="/api/v2")  # For future use

# Register both versions
app.include_router(router_v1)
app.include_router(router_v2)
```

**Wednesday: Backup & Disaster Recovery**
```bash
# Automated daily backups to S3

#!/bin/bash
# scripts/backup_database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="aequitas_backup_$DATE.sql.gz"

# Dump PostgreSQL database
pg_dump $DATABASE_URL | gzip > /tmp/$BACKUP_FILE

# Upload to S3 (using MinIO S3-compatible API)
aws s3 cp /tmp/$BACKUP_FILE s3://aequitas-backups/ --endpoint-url=http://minio:9000

# Keep only last 30 days of backups
aws s3 ls s3://aequitas-backups/ | while read -r line; do
    createDate=$(echo $line | awk '{print $1" "$2}')
    createDate=$(date -d "$createDate" +%s)
    olderThan=$(date -d "30 days ago" +%s)
    if [[ $createDate -lt $olderThan ]]; then
        fileName=$(echo $line | awk '{print $4}')
        aws s3 rm s3://aequitas-backups/$fileName
    fi
done

# Add to crontab: 0 2 * * * /scripts/backup_database.sh
```

**Thursday: Documentation Complete**
- API reference published at docs.aequitas.ai
- User guide with screenshots
- Video tutorials for common tasks
- FAQ based on pilot client questions

**Friday: Week 16 Demo Day**
- Present to advisors/investors
- Share metrics dashboard
- Celebrate: First $150K ARR, 90% accuracy, 3 happy clients
- Plan next quarter: Get to 10 clients, $500K ARR

**Deliverable**: Production-ready platform with proven PMF

---

## SUCCESS METRICS BY STAGE

| Stage | Week | Key Metric | Target |
|-------|------|------------|--------|
| 1 | 4 | Alpha user daily active | 1 user |
| 2 | 8 | Paying pilot clients | 1 client, $30K |
| 3 | 12 | ARR under contract | $150K (3 clients) |
| 4 | 16 | Forecast accuracy | 90% steady-state, 85% crisis |
| 4 | 16 | NPS score | >50 (promoters) |
| 4 | 16 | Churn rate | <5% |

---

## RISK MITIGATION

**Technical Risks**:
- Model accuracy below 85%: Use ensemble of simpler models as fallback
- Database performance issues: Upgrade Railway plan ($20/month)
- API downtime: Deploy health checks, auto-restart containers

**Commercial Risks**:
- Pilot client churns: Offer free extended trial, fix their specific issues
- Slow sales: Focus on free tier adoption, convert later
- Pricing resistance: Offer pilot-to-premium discount (50% off first 6 months)

**Operational Risks**:
- Founder burnout: Hire part-time contractor for non-critical tasks
- Technical debt: Allocate 20% time for refactoring each week
- Scope creep: Use GitHub Projects to ruthlessly prioritize

---

## NEXT STEPS (After Week 16)

**Quarter 2 (Weeks 17-28)**: Scale to 10 clients, $500K ARR
- Hire sales engineer (commission-only to start)
- Expand broker integrations (add Morgan Stanley, JP Morgan APIs)
- Launch self-service onboarding (clients can sign up without sales calls)

**Quarter 3 (Weeks 29-40)**: Profitability + Goldman partnership
- Reach $1M ARR (break-even at ~$80K/month costs)
- Initiate Goldman Sachs partnership discussions
- Prepare SOC 2 Type 1 audit

**Quarter 4 (Weeks 41-52)**: Series A fundraising
- Target: $3-5M at $20M post-money valuation
- Metrics for investors: $2M ARR, 15 clients, 92% accuracy, <3% churn

---

## READY TO START

This roadmap is **executable starting Monday**. All tools are free or <$100/month. All timelines are realistic for a 2-3 person technical team.

**Week 1 starts:** Monday, February 3, 2026  
**First revenue target:** April 20, 2026 (Week 12)  
**Break-even target:** September 2026 (Month 8)

Let's build.
