# Quick Reference Guide

## 🚀 Get Started in 3 Steps

### Option A: Using Demo Backend (Recommended for Full Features)

**Step 1: Install Dependencies**
```bash
cd demo-backend
npm install
```

**Step 2: Create User Account**
```bash
npm run create-user
```
Choose **admin** role to trigger scans from dashboard.

**Step 3: Start Everything (3 Terminal Windows)**

**Terminal 1 - Backend Server:**
```bash
cd demo-backend
npm start
```
Runs on `http://localhost:3000`

**Terminal 2 - Traffic Generator:**
```bash
cd demo-backend
npm run generate-traffic
```
Sends test traffic automatically

**Terminal 3 - View Dashboard:**
Open browser: `http://localhost:9000`

---

### Option B: Using Dummy Server (Lightweight Testing)

**Step 1: Start Dummy Server**
```bash
cd dummy-server
npm install  # First time only
npm start
```
Runs on `http://localhost:4000`, Dashboard on `http://localhost:9000`

**Step 2: Generate Traffic**
```bash
cd traffic-gen
npm install  # First time only
npm start
```

**Step 3: View Dashboard**
Open browser: `http://localhost:9000`
Login: `ameya` / `ameya123`

---

## 📊 What to See

### Dashboard (http://localhost:9000)

```
STATS CARDS
├─ Total Requests: increases as traffic is generated
├─ Suspicious: shows flagged requests
├─ Threat Rate: percentage of suspicious
└─ 24h Requests: today's total

REQUEST LOG TABLE
├─ Shows all API calls
├─ Marks suspicious requests
├─ Filterable by method/status
└─ Real-time updates

SCANS PAGE (Admin Only)
├─ Manual scan triggers
├─ Scan history
└─ Detailed findings
```

---

## 🔍 How It Works

```
User sends request to backend
        ↓
securify-logs middleware intercepts
        ↓
┌─────────────────────────────┐
│ 1. Pattern Detection        │ ← Checks for attacks
│ 2. Rate Limiting            │ ← Checks for abuse
│ 3. Anomaly Detection        │ ← Checks for behavior
└─────────────────────────────┘
        ↓
Stores in MongoDB
        ↓
Dashboard displays in real-time
```

---

## 📁 File Organization

### securify-logs/ (Library)
```
├─ src/
│  ├─ core/          ← Configuration & initialization
│  ├─ database/      ← MongoDB models
│  ├─ detection/     ← Threat detection
│  ├─ middleware/    ← Request logging & auth
│  └─ utils/         ← Scanning & cron jobs
│
├─ dashboard-ui/     ← React dashboard
├─ scripts/          ← User creation
└─ [documentation]   ← README, SETUP, API docs
```

### demo-backend/ (Example App)
```
├─ server.js                ← Express app
├─ traffic-generator.js     ← Test traffic
├─ .env.example             ← Config template
└─ package.json
```

---

## ⚙️ Configuration

Create `.env` in `demo-backend/`:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=securify_demo

# Dashboard
SECURIFY_DASHBOARD_PORT=9000

# Security
SECURIFY_JWT_SECRET=your-secret-key

# App
PORT=3000
NODE_ENV=development
```

---

## 🔌 API Endpoints (All Monitored)

```
GET  /api/users              List users
GET  /api/products           List products
POST /api/login              Login (username, password)
GET  /api/search?q=...       Search
GET  /api/health             Health check
```

---

## 🚨 What Gets Detected

### ✅ Normal Traffic
- Regular API calls
- Legitimate searches
- Normal authentication

### 🚨 Suspicious Activity
- SQL Injection: `?q=' OR 1=1--`
- XSS: `?q=<script>alert('xss')</script>`
- Path Traversal: `/../../admin`
- Command Injection: `?q=test; rm -rf /`
- Large Payloads: Oversized requests
- Rate Limiting: >100 requests/min
- Scanning: >50 unique paths
- Anomalies: Unusual behavior patterns

---

## 🛠️ Common Commands

```bash
# Install
npm install

# Create user account
npm run create-user

# Start backend
npm start

# Generate traffic
npm run generate-traffic

# View MongoDB data
mongosh
use securify_demo
db.requestlogs.find().limit(5)
db.vulnerabilityScans.find()
```

---

## 📊 Dashboard Features

| Feature | Access | Description |
|---------|--------|-------------|
| Request Logs | All | See all API calls in real-time |
| Filters | All | Filter by method, status, date |
| Statistics | All | View threat metrics |
| Scans | Admin | Trigger manual security scans |
| Findings | Admin | Review vulnerability details |
| Theme | All | Toggle dark/light mode |
| Logout | All | End session |

---

## 🔐 Authentication

```
Login: username/password created with npm run create-user
Token: JWT (24-hour expiration)
Storage: HTTPOnly cookie
Roles: admin (full access) or viewer (read-only)
```

---

## ⚡ Troubleshooting

### Can't connect to backend from traffic generator
```bash
# Check backend is running
curl http://localhost:3000/api/health

# Verify port 3000 is not in use
netstat -ano | findstr :3000
```

### MongoDB connection failed
```bash
# Start MongoDB
mongod

# Or Windows service
net start MongoDB

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
```

### Dashboard won't load
```bash
# Verify it's running
curl http://localhost:9000

# Check port 9000 not blocked
netstat -ano | findstr :9000

# Create new user account
npm run create-user
```

### No traffic appearing in dashboard
```bash
# Check traffic generator is running
# Look for "⏳ Waiting for server to be ready"

# Verify both are on same machine
# Regenerate traffic: stop and restart generator
```

---

## 📚 Documentation

- **[README.md](./README.md)** - Overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Structure explained
- **[demo-backend/README.md](./demo-backend/README.md)** - How to run demo
- **[securify-logs/README.md](./securify-logs/README.md)** - Library docs
- **[securify-logs/API_EXAMPLES.md](./securify-logs/API_EXAMPLES.md)** - Complete API

---

## 🎓 Learning Path

1. **Run the demo** (this guide)
2. **Study server.js** (how to integrate)
3. **Review detection code** (understand threats)
4. **Customize patterns** (add your rules)
5. **Deploy to production** (with real MongoDB)

---

## 🚀 Next: Integrate Into Your App

```javascript
// your-app/server.js
const express = require('express');
const { init } = require('securify-logs');

const app = express();

// Initialize securify-logs
await init({
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.SECURIFY_JWT_SECRET,
  dashboardPort: 9000
});

// Your routes here - all automatically monitored!
app.get('/api/your-endpoint', (req, res) => {
  res.json({ data: 'value' });
});

app.listen(3000);
```

That's it! Your app is now secured and monitored.

---

**Happy monitoring! 🎉**
