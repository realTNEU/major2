# Demo Backend

A complete example application demonstrating **securify-logs** library in action. This backend server serves multiple API endpoints while being monitored by the securify-logs security middleware.

## 📋 What This Does

- **Runs a demo Express server** with various API endpoints
- **Integrates securify-logs** middleware for security monitoring
- **Generates test traffic** including normal and suspicious requests
- **Displays all activity** in the securify-logs dashboard

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs the demo backend dependencies AND securify-logs from the local package.

### 2. Start MongoDB

Ensure MongoDB is running on localhost:27017 (or update `.env`):

```bash
# On Windows (if using MongoDB service)
net start MongoDB

# Or locally
mongod
```

### 3. Create User Account (One-time)

```bash
npm run create-user
```

This script creates an account for accessing the dashboard. You'll be prompted for:
- Username
- Password  
- Role (admin or viewer)

**Tip:** Create an admin account to trigger scans from the dashboard.

### 4. Terminal 1 - Start Backend Server

```bash
npm start
```

Output:
```
✅ Demo Backend Server running on http://localhost:3000
📊 SecurifyLogs Dashboard: http://localhost:9000
```

### 5. Terminal 2 - Start Traffic Generator

```bash
npm run generate-traffic
```

This sends realistic and suspicious traffic to the backend, which appears in the dashboard.

### 6. Terminal 3 - View Dashboard

Open browser to **http://localhost:9000** and log in with your created account.

Watch as:
- Requests appear in the log table
- Statistics update in real-time
- Suspicious requests get flagged
- Admin can trigger vulnerability scans

## 📁 Folder Structure

```
demo-backend/
├── .env.example          # Configuration template
├── package.json          # Dependencies (includes securify-logs)
├── server.js             # Express app with securify-logs integrated
├── traffic-generator.js  # Sends dummy traffic (normal + suspicious)
└── README.md             # This file
```

## ⚙️ Configuration

Copy `.env.example` to `.env` and customize:

```bash
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=securify_demo

# Dashboard port
SECURIFY_DASHBOARD_PORT=9000

# JWT Secret (change in production!)
SECURIFY_JWT_SECRET=your-super-secret-jwt-key-change-in-production

# App port
PORT=3000

# Environment
NODE_ENV=development
```

## 🔌 API Endpoints

The demo backend provides these endpoints (all monitored):

```
GET  /api/users              # List users
GET  /api/products           # List products
POST /api/login              # User login (send username, password)
GET  /api/search?q=<query>   # Search endpoint
GET  /api/health             # Health check
```

## 🚨 Traffic Generator Patterns

The traffic generator sends:

### ✅ Normal Requests (70%)
- User list fetches
- Product queries
- Health checks
- Legitimate searches
- Normal logins

### 🚨 Suspicious Requests (30%)
- **SQL Injection**: `?q=' OR 1=1--`
- **XSS Attack**: `?q=<script>alert('xss')</script>`
- **Path Traversal**: `/../../admin`
- **Command Injection**: `?q=test; rm -rf /`
- **Large Payloads**: Oversized request bodies
- **Scanning**: Requests to non-existent paths
- **Rate Limiting**: Burst of rapid requests

## 📊 Dashboard Features

Once running, access the dashboard at **http://localhost:9000**:

### 🔐 Login Page
- Secure JWT authentication
- Session management

### 📈 Dashboard Page
- **Real-time statistics** (total, suspicious, threat rate)
- **Request log table** with filtering
- **Auto-refresh** every 5-10 seconds
- **24-hour trends**

### 🔍 Scans Page
- **Manual scan triggers** (admin only)
- **Scan history** with status
- **Detailed findings** per scan
- **Severity levels** (critical, high, medium, low)

## 🔑 Security Features Demonstrated

### Detection
- ✅ 12+ attack pattern recognition
- ✅ Behavior-based anomaly detection
- ✅ Rate limiting per IP
- ✅ Unusual activity flagging

### Scanning
- ✅ Port scanning simulation
- ✅ SQL injection testing
- ✅ XSS vulnerability testing
- ✅ Directory traversal checks
- ✅ Security header validation
- ✅ Scheduled cron scans

### Authentication
- ✅ JWT tokens (24-hour expiration)
- ✅ Bcrypt password hashing
- ✅ HTTPOnly cookies
- ✅ Role-based access (admin/viewer)

## 🔧 How It Works

### 1. Server Initialization

```javascript
// server.js
const securifyLogs = require('securify-logs');
const { init } = securifyLogs;

// Initialize with config
initSecurifyLogs({
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.SECURIFY_JWT_SECRET,
  dashboardPort: process.env.SECURIFY_DASHBOARD_PORT
});
```

### 2. Middleware Integration

The securify-logs middleware automatically:
- Captures all incoming requests
- Runs threat detection (pattern matching, rate limiting, anomalies)
- Stores findings in MongoDB
- Runs dashboard API on separate port (9000)

### 3. Traffic Generation

```javascript
// traffic-generator.js
- Connects to backend at http://localhost:3000
- Sends mixed traffic (normal + suspicious)
- Includes attack patterns
- Simulates scanning behavior
```

### 4. Dashboard Viewing

Access http://localhost:9000 to:
- See all captured requests
- Filter by method, suspicious flag, date
- View statistics and trends
- Trigger vulnerability scans
- Review scan findings

## 📝 Common Tasks

### View MongoDB Data

```bash
# Connect to MongoDB shell
mongosh

# Use the database
use securify_demo

# View collections
show collections

# View requests
db.requestlogs.find().limit(10)

# View scans
db.vulnerabilityScans.find()

# View users
db.users.find()
```

### Change Traffic Generation Rate

Edit `traffic-generator.js`:

```javascript
const TRAFFIC_INTERVAL = 2000; // Change from 2 seconds to desired interval
```

### Add Custom API Endpoints

Edit `server.js`:

```javascript
app.get('/api/custom', (req, res) => {
  res.json({ custom: 'endpoint' });
});
```

This will automatically be monitored by securify-logs.

### Deploy to Production

1. Change `SECURIFY_JWT_SECRET` to a strong random value
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas instead of localhost
4. Set up HTTPS/TLS
5. Use PM2 or similar process manager
6. Configure reverse proxy (nginx)

## 🚀 Advanced Usage

### Customize Detection Rules

Edit `../securify-logs/src/detection/patternMatch.js` to add/modify threat patterns.

### Adjust Rate Limiting

Edit `../securify-logs/src/detection/rateLimiter.js`:

```javascript
const MAX_REQUESTS = 100;      // Requests per window
const WINDOW_MS = 60 * 1000;  // 1 minute window
```

### Schedule Security Scans

Edit `../securify-logs/src/utils/cronScanner.js`:

```javascript
// Change cron schedules
cron.schedule('0 2 * * *', executeScan); // Daily at 2 AM
```

## 🆘 Troubleshooting

### "Cannot find module 'securify-logs'"

```bash
# Reinstall with local path
npm install

# Or from root:
npm install file:../securify-logs
```

### "MongoDB connection failed"

```bash
# Check MongoDB is running
mongosh

# Check connection string in .env matches your setup
MONGODB_URI=mongodb://localhost:27017
```

### "Dashboard not loading"

- Ensure SECURIFY_DASHBOARD_PORT is not blocked
- Check securify-logs server started: check console output
- Verify credentials: create new user with `npm run create-user`

### "Traffic generator keeps failing"

```bash
# Check backend server is running
curl http://localhost:3000/api/health

# Check network connection
npm run generate-traffic
```

## 📚 See Also

- [Main README](../README.md) - Full securify-logs documentation
- [API Examples](../API_EXAMPLES.md) - API documentation with examples
- [SETUP Guide](../SETUP.md) - Detailed installation and configuration

## 📄 License

ISC

---

**Happy monitoring! 🎉**
