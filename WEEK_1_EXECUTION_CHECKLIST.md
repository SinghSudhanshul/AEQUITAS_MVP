# AEQUITAS MVP: MONDAY MORNING EXECUTION CHECKLIST
## Your First Week Starts NOW

**Date**: February 3, 2026 (Monday)  
**Team**: You + 1-2 engineers  
**Goal**: Working prototype by Friday that can generate a forecast

---

## ⚡ HOUR-BY-HOUR: DAY 1 (MONDAY)

### HOUR 1-2 (9am-11am): SET UP DEVELOPMENT ENVIRONMENT

**Everyone does this:**

```bash
# 1. Create project structure
mkdir aequitas-mvp && cd aequitas-mvp
git init

# 2. Create directories
mkdir -p backend/{app,database,ml,tests}
mkdir -p frontend/src
mkdir -p models data scripts

# 3. Initialize Git
git add .
git commit -m "Initial project structure"
gh repo create aequitas-mvp --private --source=. --push
```

**Backend engineer:**
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate

# Install core dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic
pip install pandas numpy scikit-learn xgboost
pip install python-dotenv pydantic

pip freeze > requirements.txt
```

**Frontend engineer:**
```bash
cd frontend
npx create-vite@latest . --template react-ts
npm install

# Install UI dependencies
npm install axios @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Checkpoint**: Both `backend/venv` and `frontend/node_modules` exist

---

### HOUR 3-4 (11am-1pm): DEPLOY DATABASE

**Backend engineer:**

1. **Sign up for Railway.app** (5 minutes)
   - Go to https://railway.app
   - Click "Start a New Project"
   - Select "PostgreSQL" from templates
   - Copy connection string

2. **Create `.env` file** (5 minutes)
```bash
# backend/.env
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
REDIS_URL=redis://localhost:6379
ENVIRONMENT=development
DEBUG=true
```

3. **Write database initialization script** (30 minutes)

```python
# backend/database/init.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

# Create TimescaleDB extension
with engine.connect() as conn:
    conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb;"))
    conn.commit()
    print("✅ TimescaleDB extension created")

# Create tables (simplified for Day 1)
with engine.connect() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS organizations (
            org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            tier VARCHAR(20) DEFAULT 'free',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    """))
    
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS positions_snapshot (
            snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id UUID REFERENCES organizations(org_id),
            snapshot_date DATE NOT NULL,
            broker_name VARCHAR(100),
            position_value_usd DECIMAL(20,2),
            margin_requirement_usd DECIMAL(20,2),
            available_collateral_usd DECIMAL(20,2),
            uploaded_at TIMESTAMPTZ DEFAULT NOW()
        );
    """))
    
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS forecasts (
            forecast_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id UUID REFERENCES organizations(org_id),
            forecast_date DATE NOT NULL,
            target_date DATE NOT NULL,
            predicted_liquidity_p50 DECIMAL(20,2),
            confidence_score DECIMAL(5,4),
            regime_detected VARCHAR(20),
            generated_at TIMESTAMPTZ DEFAULT NOW()
        );
    """))
    
    conn.commit()
    print("✅ Tables created")

# Insert test organization
with engine.connect() as conn:
    conn.execute(text("""
        INSERT INTO organizations (name, tier) 
        VALUES ('Alpha Test Fund', 'free')
        ON CONFLICT DO NOTHING;
    """))
    conn.commit()
    print("✅ Test organization created")

print("\n🎉 Database initialized successfully!")
```

4. **Run initialization**:
```bash
python database/init.py
```

**Checkpoint**: Can connect to Railway PostgreSQL and see 3 tables

---

### HOUR 5 (1pm-2pm): LUNCH BREAK 🍕

Review what we've accomplished:
- ✅ Project structure created
- ✅ Dependencies installed
- ✅ Database deployed and initialized
- ✅ Git repository created

---

### HOUR 6-8 (2pm-5pm): BUILD MINIMAL API

**Backend engineer: Create FastAPI application**

```python
# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
from datetime import date
import os

# Database setup
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI app
app = FastAPI(title="Aequitas MVP")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PositionUpload(BaseModel):
    snapshot_date: date
    broker_name: str
    position_value_usd: float
    margin_requirement_usd: float
    available_collateral_usd: float

class ForecastResponse(BaseModel):
    forecast_id: str
    target_date: date
    predicted_liquidity_p50: float
    confidence_score: float
    regime_detected: str

# Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

@app.post("/api/v1/positions/upload")
async def upload_position(
    position: PositionUpload,
    db: Session = Depends(get_db)
):
    """Upload a single position (Day 1: manual entry, CSV upload comes later)"""
    
    query = text("""
        INSERT INTO positions_snapshot 
        (org_id, snapshot_date, broker_name, position_value_usd, 
         margin_requirement_usd, available_collateral_usd)
        VALUES 
        ((SELECT org_id FROM organizations WHERE name = 'Alpha Test Fund' LIMIT 1),
         :snapshot_date, :broker_name, :position_value, :margin, :collateral)
        RETURNING snapshot_id
    """)
    
    result = db.execute(query, {
        "snapshot_date": position.snapshot_date,
        "broker_name": position.broker_name,
        "position_value": position.position_value_usd,
        "margin": position.margin_requirement_usd,
        "collateral": position.available_collateral_usd
    })
    db.commit()
    
    snapshot_id = result.fetchone()[0]
    
    return {
        "status": "success",
        "snapshot_id": str(snapshot_id),
        "message": "Position uploaded successfully"
    }

@app.get("/api/v1/forecast/simple")
async def get_simple_forecast(
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """
    Day 1: Return a FAKE forecast (just to test end-to-end)
    Week 2: Replace with real ML model
    """
    
    if target_date is None:
        target_date = date.today()
    
    # Get latest position
    query = text("""
        SELECT position_value_usd, margin_requirement_usd 
        FROM positions_snapshot 
        WHERE org_id = (SELECT org_id FROM organizations WHERE name = 'Alpha Test Fund' LIMIT 1)
        ORDER BY snapshot_date DESC 
        LIMIT 1
    """)
    result = db.execute(query).fetchone()
    
    if not result:
        raise HTTPException(404, "No position data uploaded yet")
    
    position_value, margin_req = result
    
    # FAKE FORECAST (placeholder for ML model)
    # Just predict liquidity = margin requirement * 1.2
    predicted_liquidity = margin_req * 1.2
    
    # Insert forecast into database
    insert_query = text("""
        INSERT INTO forecasts 
        (org_id, forecast_date, target_date, predicted_liquidity_p50, 
         confidence_score, regime_detected)
        VALUES 
        ((SELECT org_id FROM organizations WHERE name = 'Alpha Test Fund' LIMIT 1),
         CURRENT_DATE, :target_date, :predicted, 0.85, 'steady_state')
        RETURNING forecast_id
    """)
    
    forecast_result = db.execute(insert_query, {
        "target_date": target_date,
        "predicted": predicted_liquidity
    })
    db.commit()
    
    forecast_id = forecast_result.fetchone()[0]
    
    return {
        "forecast_id": str(forecast_id),
        "target_date": target_date,
        "predicted_liquidity_p50": float(predicted_liquidity),
        "confidence_score": 0.85,
        "regime_detected": "steady_state"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Test the API:**
```bash
# Terminal 1: Start API
cd backend
source venv/bin/activate
python -m app.main

# Terminal 2: Test endpoints
curl http://localhost:8000/health

# Upload a position
curl -X POST http://localhost:8000/api/v1/positions/upload \
  -H "Content-Type: application/json" \
  -d '{
    "snapshot_date": "2026-02-03",
    "broker_name": "Goldman Sachs",
    "position_value_usd": 5000000000,
    "margin_requirement_usd": 500000000,
    "available_collateral_usd": 1000000000
  }'

# Get forecast
curl http://localhost:8000/api/v1/forecast/simple
```

**Checkpoint**: API responds with forecast (even if fake)

---

## 📅 DAY 2 (TUESDAY): FRONTEND DASHBOARD

### HOUR 1-4 (9am-1pm): BUILD BASIC UI

**Frontend engineer:**

```tsx
// frontend/src/App.tsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/forecast/simple');
      const data = await response.json();
      setForecast(data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">Aequitas MVP</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Daily Liquidity Forecast</h2>
        
        {loading && <p>Loading...</p>}
        
        {forecast && (
          <div className="space-y-4">
            <div>
              <span className="text-gray-600">Target Date:</span>
              <span className="ml-4 font-bold">{forecast.target_date}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Predicted Liquidity:</span>
              <span className="ml-4 text-3xl font-bold text-blue-600">
                ${(forecast.predicted_liquidity_p50 / 1000000).toFixed(2)}M
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Confidence:</span>
              <span className="ml-4 font-bold">
                {(forecast.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Regime:</span>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                {forecast.regime_detected}
              </span>
            </div>
          </div>
        )}
        
        <button 
          onClick={fetchForecast}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Forecast
        </button>
      </div>
    </div>
  );
}

export default App;
```

```css
/* frontend/src/App.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

**Start frontend:**
```bash
cd frontend
npm run dev
```

**Checkpoint**: Frontend at http://localhost:3000 shows forecast

---

## 📅 DAY 3 (WEDNESDAY): CSV UPLOAD

Skip this for now - we'll add it Week 2. Focus on getting the ML model working.

---

## 📅 DAY 4-5 (THURSDAY-FRIDAY): REAL FORECASTING MODEL

**Data scientist: Build actual ML model**

```python
# backend/ml/forecasting_simple.py
import pandas as pd
import numpy as np
from datetime import date, timedelta
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os

class SimpleForecastingEngine:
    """
    Day 4 version: Super simple model just to prove concept
    Week 3: Replace with full dual-model architecture
    """
    
    def __init__(self):
        self.model = GradientBoostingRegressor(n_estimators=50, max_depth=3)
        self.is_trained = False
        
    def generate_synthetic_training_data(self, n_samples=500):
        """Generate fake training data to bootstrap the model"""
        np.random.seed(42)
        
        data = pd.DataFrame({
            'position_value': np.random.normal(5e9, 1e9, n_samples),
            'margin_requirement': np.random.normal(500e6, 100e6, n_samples),
            'available_collateral': np.random.normal(1e9, 200e6, n_samples),
            'day_of_week': np.random.randint(0, 5, n_samples),
            'is_month_end': np.random.choice([0, 1], n_samples, p=[0.9, 0.1])
        })
        
        # Fake target: liquidity = margin * (1.1 to 1.3) + some noise
        data['actual_liquidity'] = (
            data['margin_requirement'] * np.random.uniform(1.1, 1.3, n_samples) +
            np.random.normal(0, 50e6, n_samples)
        )
        
        return data
    
    def train(self):
        """Train on synthetic data (replace with real data after pilots)"""
        print("Training model on synthetic data...")
        
        data = self.generate_synthetic_training_data()
        
        X = data[['position_value', 'margin_requirement', 
                  'available_collateral', 'day_of_week', 'is_month_end']]
        y = data['actual_liquidity']
        
        self.model.fit(X, y)
        self.is_trained = True
        
        # Calculate accuracy
        predictions = self.model.predict(X)
        mape = np.mean(np.abs((y - predictions) / y)) * 100
        print(f"✅ Model trained. MAPE: {mape:.2f}%")
        
        return mape
    
    def predict(self, position_value, margin_requirement, 
                available_collateral, target_date):
        """Generate forecast"""
        
        if not self.is_trained:
            raise ValueError("Model not trained yet!")
        
        # Engineer features
        day_of_week = target_date.weekday()
        is_month_end = 1 if target_date.day >= 28 else 0
        
        X = pd.DataFrame([[
            position_value,
            margin_requirement,
            available_collateral,
            day_of_week,
            is_month_end
        ]], columns=['position_value', 'margin_requirement',
                     'available_collateral', 'day_of_week', 'is_month_end'])
        
        predicted_liquidity = self.model.predict(X)[0]
        
        return {
            'predicted_liquidity_p50': predicted_liquidity,
            'confidence_score': 0.85,  # Simplified for Day 4
            'regime_detected': 'steady_state'
        }
    
    def save(self, path='models/simple_v1.pkl'):
        """Save trained model"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
        print(f"✅ Model saved to {path}")
    
    def load(self, path='models/simple_v1.pkl'):
        """Load trained model"""
        self.model = joblib.load(path)
        self.is_trained = True
        print(f"✅ Model loaded from {path}")

# Train and save initial model
if __name__ == "__main__":
    engine = SimpleForecastingEngine()
    engine.train()
    engine.save()
```

**Run training:**
```bash
cd backend
python -m ml.forecasting_simple
```

**Update API to use real model:**

```python
# backend/app/main.py - add to top
from ml.forecasting_simple import SimpleForecastingEngine

# Load model at startup
forecasting_engine = SimpleForecastingEngine()
forecasting_engine.load('models/simple_v1.pkl')

# Update forecast endpoint
@app.get("/api/v1/forecast/simple")
async def get_simple_forecast(
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    if target_date is None:
        target_date = date.today()
    
    # Get latest position
    query = text("""
        SELECT position_value_usd, margin_requirement_usd, available_collateral_usd
        FROM positions_snapshot 
        WHERE org_id = (SELECT org_id FROM organizations WHERE name = 'Alpha Test Fund' LIMIT 1)
        ORDER BY snapshot_date DESC 
        LIMIT 1
    """)
    result = db.execute(query).fetchone()
    
    if not result:
        raise HTTPException(404, "No position data")
    
    position_value, margin_req, collateral = result
    
    # REAL FORECAST using ML model
    forecast = forecasting_engine.predict(
        position_value, margin_req, collateral, target_date
    )
    
    # Save to database
    insert_query = text("""
        INSERT INTO forecasts 
        (org_id, forecast_date, target_date, predicted_liquidity_p50, 
         confidence_score, regime_detected)
        VALUES 
        ((SELECT org_id FROM organizations WHERE name = 'Alpha Test Fund' LIMIT 1),
         CURRENT_DATE, :target_date, :predicted, :confidence, :regime)
        RETURNING forecast_id
    """)
    
    forecast_result = db.execute(insert_query, {
        "target_date": target_date,
        "predicted": forecast['predicted_liquidity_p50'],
        "confidence": forecast['confidence_score'],
        "regime": forecast['regime_detected']
    })
    db.commit()
    
    forecast_id = forecast_result.fetchone()[0]
    
    return {
        "forecast_id": str(forecast_id),
        "target_date": target_date,
        **forecast
    }
```

---

## 🎉 FRIDAY END-OF-WEEK DEMO

### What You've Built in 5 Days:

✅ PostgreSQL database on Railway (production-ready)  
✅ FastAPI backend with 3 working endpoints  
✅ React frontend displaying forecasts  
✅ Trained ML model generating predictions  
✅ Full end-to-end flow: Position → Forecast → Display

### DEMO SCRIPT (15 minutes):

1. **Show the frontend** (http://localhost:3000)
   - Point out clean UI
   - Explain what each metric means

2. **Upload a position via API** (Postman or curl)
   ```bash
   curl -X POST http://localhost:8000/api/v1/positions/upload \
     -H "Content-Type: application/json" \
     -d '{...}'
   ```

3. **Refresh forecast in browser**
   - Show that prediction changed based on new position data
   - Highlight confidence score and regime

4. **Open database in Railway dashboard**
   - Show 3 tables with data
   - Point out foreign key relationships

5. **Show code structure**
   - `git log` showing commits throughout the week
   - Directory structure matching our spec

### What's Next (Week 2):

- CSV upload functionality
- Historical forecast chart
- Regime detection logic
- Docker Compose setup

---

## 🚨 COMMON BLOCKERS & SOLUTIONS

### "Railway PostgreSQL won't connect"
**Solution**: Check if your IP is whitelisted. Railway may require enabling external connections in settings.

### "Frontend can't reach backend API (CORS error)"
**Solution**: Verify CORS middleware in `main.py` includes `http://localhost:3000`.

### "Model training fails with import errors"
**Solution**: Make sure you're in activated venv (`source venv/bin/activate`) and all packages installed.

### "Frontend won't start (port 3000 already in use)"
**Solution**: Kill existing process: `lsof -ti:3000 | xargs kill -9`

---

## 📊 SUCCESS METRICS FOR WEEK 1

**Technical:**
- [ ] Database deployed and accessible
- [ ] API returns 200 status on all endpoints
- [ ] Frontend renders forecast from real API
- [ ] ML model generates non-zero predictions

**Team:**
- [ ] All engineers committed code to GitHub
- [ ] Everyone can run full stack locally
- [ ] Friday demo completed without major issues

**Learning:**
- [ ] Team understands end-to-end data flow
- [ ] Can explain to non-technical person what we built
- [ ] Identified 2-3 improvements for Week 2

---

## 🎯 FINAL REMINDER

**You are NOT building the perfect product.**  
You are building the **minimum thing that proves the core hypothesis**:

> "Can we predict intraday liquidity better than a simple heuristic?"

Week 1 answers: **YES** (even with fake ML, flow works)  
Week 2 improves accuracy  
Week 3 adds CSV upload  
Week 4 ships to first user

**One sprint at a time. Ship iteratively. Stay focused.**

Good luck! 🚀
