# SecurifyLogs - Complete Project

A production-ready **Node.js security monitoring library** with real-time threat detection, vulnerability scanning, and an elegant dashboard for tracking API security.

```
.
├── securify-logs/          ← The Library Package
│   ├── src/
│   ├── scripts/
│   ├── dashboard-ui/
│   ├── package.json
│   └── [README, SETUP, API docs, etc.]
│
├── demo-backend/           ← Example Implementation
│   ├── server.js           (Express app using securify-logs)
│   ├── traffic-generator.js (Sends test traffic)
│   ├── package.json
│   └── README.md
│
└── This README
```

## 🎯 Quick Start (5 minutes)

### Step 1: Install & Setup

```bash
# Navigate to demo backend
cd demo-backend
npm install

# Create your admin account
npm run create-user
```

Follow prompts to create username/password. Choose `admin` role to trigger scans.

### Step 2: Terminal 1 - Start Backend

```bash
npm start
```

```
✅ Demo Backend Server running on http://localhost:3000
📊 SecurifyLogs Dashboard: http://localhost:9000
```

### Step 3: Terminal 2 - Generate Traffic

```bash
npm run generate-traffic
```

This sends realistic + suspicious traffic to your backend.

### Step 4: View Dashboard

Open **http://localhost:9000** in your browser and log in.

Watch real-time:
- 📊 Request logs
- 🚨 Threat detection  
- 📈 Statistics
- 🔍 Vulnerability scans

---

## 📦 The Library: `securify-logs/`

**Your reusable security monitoring package** for any Node.js + Express application.

### What It Does

✅ **Captures all API calls** - Every request/response logged  
✅ **Detects threats** - 12+ attack patterns (SQL injection, XSS, etc.)  
✅ **Analyzes behavior** - Rate limiting, anomaly detection  
✅ **Scans vulnerabilities** - Port scanning, header validation, etc.  
✅ **Provides dashboard** - Real-time monitoring on separate port  
✅ **Manages authentication** - JWT + bcrypt passwords  

### How to Use It

```javascript
// In any Express app
const securifyLogs = require('securify-logs');
const { init } = securifyLogs;

// Initialize once at startup
await init({
  mongodbUri: 'mongodb://localhost:27017',
  mongodbDbName: 'my_app',
  jwtSecret: 'your-secret-key',
  dashboardPort: 9000
});

// Start your Express app
app.listen(3000);
```

That's it! Now all your API calls are monitored.

### Key Features

#### 🔍 Threat Detection
- SQL injection patterns
- XSS attacks
- Path traversal  
- Command injection
- LDAP injection
- XXE vulnerabilities
- Suspicious user-agents

#### 📊 Behavior Analysis
- Volume spike detection (>100 requests/min)
- Scanning behavior (>50 unique paths)
- Method ratio anomalies
- Repeated 404 patterns

#### 🛡️ Security Scanning
- Port scanning
- SQL injection testing
- XSS vulnerability testing
- Directory traversal checks
- Security header validation

#### 🔐 Authentication & Authorization
- JWT tokens (24h expiration)
- Bcrypt password hashing
- Role-based access (admin/viewer)
- HTTPOnly cookies
- No signup endpoint (secure)

---

## 🔧 Demo Backend: `demo-backend/`

**A complete example** showing how to integrate securify-logs into your application.

### What It Includes

```
demo-backend/
├── server.js              # Express app + securify-logs integration
├── traffic-generator.js   # Sends test traffic (normal + suspicious)
├── .env.example           # Configuration template
├── package.json           # Depends on securify-logs locally
└── README.md              # Detailed documentation
```

### API Endpoints (All Monitored)

```
GET  /api/users              # List users
GET  /api/products           # List products  
POST /api/login              # Login endpoint
GET  /api/search?q=...       # Search (vulnerable to injection)
GET  /api/health             # Health check
```

### Traffic Generator Features

Automatically sends:
- ✅ Normal requests (user list, product search, etc.)
- 🚨 SQL injection attempts
- 🚨 XSS payloads
- 🚨 Path traversal
- 🚨 Command injection
- 🚨 Rate limit attacks
- 🚨 Scanning patterns

All appear in the dashboard in real-time!

---

## 🏗️ Architecture

```
Request Flow
============

API Call
   ↓
securify-logs Middleware
   ├─ Pattern Detection (threats)
   ├─ Rate Limiting (abuse)
   ├─ Anomaly Detection (behavior)
   └─ Store in MongoDB
   ↓
Your Endpoint Response
   ↓
Dashboard (separate port 9000)
   ├─ View Requests
   ├─ Filter & Search
   ├─ Trigger Scans
   └─ Review Findings
```

---

## 🚀 Production Deployment

### Using the Library in Your App

1. **Install from npm** (when published):
   ```bash
   npm install securify-logs
   ```

2. **Or install locally**:
   ```bash
   npm install file:../securify-logs
   ```

3. **Initialize at startup**:
   ```javascript
   const { init } = require('securify-logs');
   
   await init({
     mongodbUri: process.env.MONGODB_URI,
     jwtSecret: process.env.JWT_SECRET,
     dashboardPort: 9000
   });
   ```

4. **That's it!** Your app is now monitored.

### Configuration

Required environment variables:

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=your_app_name
SECURIFY_JWT_SECRET=your-super-secret-key-change-this
SECURIFY_DASHBOARD_PORT=9000
```

### Create User Accounts

```bash
node securify-logs/scripts/createUser.js
```

Interactive script to create admin/viewer accounts without a signup endpoint.

---

## 📚 Documentation

All detailed docs are in `securify-logs/`:

- **[README.md](./securify-logs/README.md)** - Features & overview
- **[SETUP.md](./securify-logs/SETUP.md)** - Detailed installation guide
- **[QUICKSTART.md](./securify-logs/QUICKSTART.md)** - 5-minute setup
- **[API_EXAMPLES.md](./securify-logs/API_EXAMPLES.md)** - Complete API docs with code samples
- **[PROJECT_SUMMARY.md](./securify-logs/PROJECT_SUMMARY.md)** - Architecture & components
- **[FILE_STRUCTURE.md](./securify-logs/FILE_STRUCTURE.md)** - Code organization

---

## 🎓 Learning Path

1. **Run the demo** (this folder)
   ```bash
   cd demo-backend
   npm install && npm start
   ```

2. **See it in action** - http://localhost:9000

3. **Understand the code** - Check `server.js` for integration

4. **Read the docs** - See `securify-logs/README.md`

5. **Integrate into your app** - Copy the initialization pattern

---

## 🔐 Security Highlights

### What You Get

✅ **Automatic request logging** - Every API call captured  
✅ **Threat detection** - Suspicious patterns identified  
✅ **Behavior analysis** - Anomalies highlighted  
✅ **Vulnerability scanning** - Scheduled security tests  
✅ **Dashboard access control** - JWT + role-based  
✅ **Password security** - Bcrypt hashing  
✅ **No signup endpoint** - Accounts created by admin only  

### Best Practices

- Change `JWT_SECRET` before production
- Use MongoDB with authentication enabled
- Enable HTTPS/TLS for dashboard
- Regular backups of vulnerability findings
- Monitor the threat rate metric
- Review scans regularly for vulnerabilities

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime
- **Express 5.2** - Web framework
- **MongoDB 9.1** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled scanning

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS Variables** - Dark/light theme
- **Context API** - State management

### Monitoring
- **Regex pattern matching** - Attack detection
- **In-memory tracking** - Rate limiting
- **Behavior analysis** - Statistical detection
- **Vulnerability scanner** - Extensible framework

---

## 📊 Dashboard Overview

```
┌─ SecurifyLogs Dashboard ─┐
│                          │
│  [User] [Theme Toggle]   │
│  ───────────────────────  │
│                          │
│  📊 STATS               │
│  Total: 245            │
│  Suspicious: 34        │
│  Threat Rate: 13.9%    │
│                        │
│  📋 REQUEST LOG        │
│  GET /api/users   200  │
│  GET /search      200  │ ← SQL injection
│  POST /login      401  │
│  ⚠️ GETs /../../   403  │ ← Path traversal
│                        │
│  🔍 SCANS              │
│  Full Scan    [Admin]  │
│  SQL Testing  [Admin]  │
│  XSS Testing  [Admin]  │
│  
└────────────────────────┘
```

---

## ❓ FAQ

**Q: Can I use this in production?**
A: Yes! It's designed for production use. Change JWT_SECRET and use MongoDB authentication.

**Q: Does it slow down my app?**
A: No. Logging is asynchronous. Dashboard runs on separate port. Impact is minimal.

**Q: Can I customize threat patterns?**
A: Yes. Edit `securify-logs/src/detection/patternMatch.js` to add patterns.

**Q: How do I export reports?**
A: Access MongoDB directly to export findings. Dashboard has REST API (see API_EXAMPLES.md).

**Q: What about email alerts?**
A: Not included, but you can extend the cron scanner to send emails on findings.

---

## 📞 Support

- Check `[SETUP.md](./securify-logs/SETUP.md)` for troubleshooting
- Read `[API_EXAMPLES.md](./securify-logs/API_EXAMPLES.md)` for API usage
- Review code comments in `securify-logs/src/`

---

## 📄 License

ISC

---

**Ready to secure your API?** 🚀  
Start with: `cd demo-backend && npm install && npm start`
