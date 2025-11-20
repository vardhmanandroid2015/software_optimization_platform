# Performance Optimization Platform

## 📋 Overview

This is an end-to-end performance optimization platform with:
- **Backend**: FastAPI (Python) with 5 analysis modules
- **Frontend**: React + Vite with real-time dashboards
- **Features**: Software, Hardware, Network, I/O, and Monitoring analysis

📊 Dashboard - Overview with quick actions

💻 Software - Code profiling + DB optimization

🖥️ Hardware - Resource monitoring + scaling recommendations + historical charts

🌐 Network - Performance metrics + regional analysis + protocol optimizations

📦 I/O & Infrastructure - Container management + load balancer + scaling

📈 Monitoring - Real-time metrics + alerts + optimization history

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+ 
- Node.js 16+
- npm or yarn

---

## 📁 Project Structure

```
performance-optimizer/
├── backend/
│   ├── main.py
│   ├── analyzer.py
│   ├── hardware_monitor.py
│   ├── network_analyzer.py
│   ├── orchestration.py
│   ├── monitoring.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── PerformanceOptimizer.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔧 Backend Setup

### Step 1: Create Backend Directory

```bash
mkdir -p performance-optimizer/backend
cd performance-optimizer/backend
```

### Step 2: Create Python Files

Create these 6 files with the provided code:
1. `main.py` - FastAPI application
2. `analyzer.py` - Software analysis
3. `hardware_monitor.py` - Hardware monitoring  
4. `network_analyzer.py` - Network analysis
5. `orchestration.py` - Container orchestration
6. `monitoring.py` - Metrics & alerts

### Step 3: Create requirements.txt

```txt
# FastAPI and web server
fastapi
uvicorn[standard]
pydantic

# CORS support
python-multipart

# System monitoring
psutil

# Async support
aiofiles

# Optional: Docker/Kubernetes integration
docker
kubernetes

# Optional: Database drivers
asyncpg  # PostgreSQL
aiomysql # MySQL
motor    # MongoDB

# Optional: Redis for caching
redis
aioredis

# Optional: Monitoring & metrics
prometheus-client
```

### Step 4: Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### Step 5: Create .env File

```bash
# .env
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 6: Run Backend Server

```bash
python main.py

# Or with uvicorn:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run at: http://localhost:8000**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

---

## 💻 Frontend Setup

### Step 1: Create React Project

```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
npm install lucide-react axios
```

### Step 3: Update Files

Replace these files with the provided code:
1. `src/App.jsx`
2. `src/PerformanceOptimizer.jsx`

Ensure `src/main.jsx` has:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 4: Fix App.jsx

```jsx
import React from 'react';
import PerformanceOptimizer from "./PerformanceOptimizer";

const App = () => {
  return <PerformanceOptimizer />;  // Add return statement!
};

export default App;
```

### Step 5: Configure API URL

In `PerformanceOptimizer.jsx`, ensure:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### Step 6: Run Frontend

```bash
npm run dev
```

**Frontend will run at: http://localhost:5173**

---

## 🧪 Testing the Integration

### 1. Test Backend API

Open http://localhost:8000/docs and try these endpoints:

```bash
# Health check
GET /api/health

# Run analysis
POST /api/analysis/full
Body: {"target_path": ".", "deep_scan": false}

# Get hardware metrics
GET /api/hardware/metrics

# Get network performance
GET /api/network/performance

# Get containers
GET /api/infrastructure/containers

# Get monitoring metrics
GET /api/monitoring/metrics
```

### 2. Test Frontend

1. Open http://localhost:5173
2. Click "Run Full Analysis" button
3. Wait for results to load
4. Navigate through different tabs
5. Try "Export Report" and "Auto-Optimize"

### 3. Check Browser Console

Press F12 to open DevTools and check:
- No CORS errors
- API calls succeed (Network tab)
- No JavaScript errors (Console tab)

---

## 🐛 Troubleshooting

### Problem: Blank Page

**Solution**: Check `App.jsx` has return statement:
```jsx
const App = () => {
  return <PerformanceOptimizer />;
};
```

### Problem: CORS Error

**Solution**: Check backend .env file:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Problem: Connection Refused

**Solutions**:
1. Ensure backend is running on port 8000
2. Check firewall settings
3. Verify API_BASE_URL in React code

### Problem: Module Not Found (Python)

**Solution**:
```bash
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall
pip install -r requirements.txt
```

### Problem: psutil Errors on Windows

**Solution**: 
1. Install Visual C++ Build Tools
2. Or use mock data (already implemented as fallback)

---

## 📊 API Endpoints Reference

### Analysis
- `POST /api/analysis/full` - Run complete analysis
- `GET /api/software/profile` - Code profiling
- `GET /api/software/database` - Database analysis

### Hardware
- `GET /api/hardware/metrics` - Current metrics
- `GET /api/hardware/history` - Historical data
- `GET /api/hardware/recommendations` - Scaling suggestions

### Network
- `GET /api/network/performance` - Network metrics
- `GET /api/network/regions` - Regional performance
- `GET /api/network/optimizations` - Network suggestions

### Infrastructure
- `GET /api/infrastructure/containers` - Container status
- `GET /api/infrastructure/load-balancer` - LB config
- `POST /api/infrastructure/scale` - Scale services

### Monitoring
- `GET /api/monitoring/metrics` - Real-time metrics
- `GET /api/monitoring/alerts` - Active alerts
- `GET /api/monitoring/history` - Optimization history

### Utilities
- `POST /api/optimize/auto` - Auto-optimization
- `GET /api/report/export` - Export report

---

## 🔐 Production Deployment

### Backend (FastAPI)

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (React)

```bash
# Build for production
npm run build

# Serve with nginx or similar
npx serve -s dist
```

### Docker Deployment

Create `Dockerfile` for backend:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t perf-optimizer-api .
docker run -p 8000:8000 perf-optimizer-api
```

---

## 🎯 Features Implemented

### ✅ Software Optimization
- Code efficiency analysis
- Profiling hot functions
- Database query optimization
- Async pattern detection

### ✅ Hardware Monitoring
- CPU, Memory, Disk metrics
- Real-time monitoring
- Scaling recommendations
- Resource forecasting

### ✅ Network Analysis
- Latency measurement
- Throughput testing
- Regional performance
- Protocol optimization

### ✅ I/O & Infrastructure
- Container health monitoring
- Load balancer configuration
- Resource limit tracking
- Auto-scaling support

### ✅ Monitoring & Alerts
- Real-time metrics collection
- Alert management
- Optimization history
- Performance trends

---

## 📈 Next Steps

1. **Add Authentication**: Implement JWT tokens
2. **Database Integration**: Add PostgreSQL/MongoDB
3. **Real Monitoring**: Integrate Prometheus/Grafana
4. **Kubernetes**: Add K8s orchestration
5. **AI Recommendations**: ML-based optimization
6. **Notifications**: Email/Slack alerts
7. **Multi-tenancy**: Support multiple projects

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 🤝 Support

- API Documentation: http://localhost:8000/docs
- GitHub Issues: Create an issue for bugs
- Email: support@example.com

---

## 🎉 Success!

You now have a fully functional performance optimization platform!

Visit: http://localhost:5173 to start optimizing! 🚀