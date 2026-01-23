# SecurifyLogs - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [First Time Setup](#first-time-setup)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installations

```bash
node --version    # Should be v16+
npm --version     # Should be v7+
mongod --version  # Should be v4.4+
```

## Installation Steps

### Step 1: Clone/Setup Project

```bash
cd c:\Coding\major2
cd securify-logs
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- node-cron
- cookie-parser
- body-parser
- cors

### Step 3: Install Dashboard Dependencies

```bash
cd dashboard-ui
npm install
cd ..
```

This installs:
- react
- react-dom
- react-router-dom
- vite (build tool)

### Step 4: Build Dashboard (Production)

```bash
cd dashboard-ui
npm run build
cd ..
```

This creates the production build in `dashboard-ui/dist/`.

## Configuration

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the project root:

```bash
# Copy the example
cp .env.example .env

# Edit .env with your settings
```

Edit `.env`:

```
MONGO_URI=mongodb://localhost:27017/securifylogs
JWT_SECRET=your-super-secret-key-change-this
DASHBOARD_PORT=9000
PORT=3000
NODE_ENV=development
```

### Option 2: Code Configuration

Update `example/express-app.js` with your settings:

```javascript
securifyLogs.init({
  app,
  mongoUri: 'mongodb://localhost:27017/securifylogs',
  jwtSecret: 'your-secret-key',
  dashboard: {
    enabled: true,
    port: 9000
  },
  securityScans: {
    enabled: true,
    target: 'localhost'
  }
});
```

## Running the Application

### Step 1: Start MongoDB

**Windows:**
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or run mongod directly
mongod --dbpath "C:\data\db"
```

**macOS/Linux:**
```bash
mongod
```

Verify MongoDB is running:
```bash
mongosh  # Or mongo (older versions)
```

You should see a MongoDB shell prompt.

### Step 2: Create Admin Account

Open a new terminal in the project root:

```bash
node scripts/createUser.js
```

Follow the prompts:
```
=== SecurifyLogs - Create User Account ===

Enter MongoDB URI (default: mongodb://localhost:27017/securifylogs): [Press Enter]
Connecting to MongoDB...
✓ Connected to MongoDB

Enter username (min 3 characters): admin
Enter email: admin@securify.local
Enter password (min 6 characters): (enter strong password)
Enter role (admin/viewer, default: viewer): admin
✓ User created successfully!
```

Save these credentials - you'll need them to login.

### Step 3: Start the Application

Open another terminal in the project root:

```bash
node example/express-app.js
```

You should see:

```
========================================
App running on: http://localhost:3000
Dashboard: http://localhost:9000

Create an admin account first:
  node scripts/createUser.js
========================================

[SecurifyLogs] MongoDB connected
[SecurifyLogs] Initialized successfully
[SecurifyLogs] Dashboard listening on port 9000
```

## First Time Setup

### Access the Dashboard

1. Open your browser
2. Go to: `http://localhost:9000`
3. You should see the login page
4. Enter the credentials created in Step 2

### Dashboard Features (After Login)

#### Dashboard Page
- Overview statistics
- Request logs in real-time
- Filter by method, suspicious flag, date range
- Auto-refreshes every 5 seconds

#### Vulnerability Scans Page (Admin Only)
- View previous scans
- Trigger new scans
- View detailed findings
- Check scan status

### Test the API

Make requests to the backend to see logs in the dashboard:

```bash
# Simple GET request
curl http://localhost:3000/test

# POST request
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John"}'

# Test SQL injection detection
curl "http://localhost:3000/test?id=1' OR '1'='1"

# Test XSS detection
curl "http://localhost:3000/test?msg=<script>alert('xss')</script>"
```

Each request will appear in the dashboard logs within seconds.

### Create Additional Users

To create more users:

```bash
node scripts/createUser.js
```

Choose role:
- **admin** - Can view logs and trigger scans
- **viewer** - Can only view logs and scan results

## Verification

### Check MongoDB Connection

```bash
mongosh
> show databases
> use securifylogs
> db.requestlogs.findOne()  // Should show logs
> db.users.findOne()        // Should show your admin user
```

### Check Dashboard API

```bash
# Get current user info
curl -b "token=YOUR_TOKEN" http://localhost:9000/api/auth/me

# Get statistics
curl -b "token=YOUR_TOKEN" http://localhost:9000/api/stats

# Get request logs
curl -b "token=YOUR_TOKEN" http://localhost:9000/api/logs
```

### Test Threat Detection

The system should detect and flag:

```bash
# Rate limiting test (multiple requests quickly)
for i in {1..50}; do curl http://localhost:3000/test; done

# SQL Injection pattern
curl "http://localhost:3000/test?id=1' UNION SELECT NULL--"

# XSS pattern
curl "http://localhost:3000/test?input=<img onerror='alert(1)'>"

# Path traversal
curl "http://localhost:3000/../../../etc/passwd"
```

Watch these appear as "suspicious" in the dashboard.

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoError: connect ECONNREFUSED`

**Solution:**
```bash
# Start MongoDB
mongod

# Verify connection
mongosh
```

### Port Already in Use

**Error:** `Port 9000 is already in use`

**Solution:**
```bash
# Find and kill process using port 9000
# Windows
netstat -ano | findstr :9000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :9000
kill -9 <PID>

# Or change port in config
DASHBOARD_PORT=9001 node example/express-app.js
```

### Dashboard Blank/Not Loading

**Solution:**
```bash
# Rebuild React dashboard
cd dashboard-ui
npm run build
cd ..

# Clear browser cache (Ctrl+Shift+Delete)
# Then reload page
```

### Can't Login

**Error:** `Invalid credentials`

**Solution:**
```bash
# Create a new user
node scripts/createUser.js

# Or check MongoDB directly
mongosh
> use securifylogs
> db.users.find()
```

### Logs Not Appearing in Dashboard

**Solution:**
1. Check MongoDB is running
2. Verify requests are hitting the API:
   ```bash
   curl http://localhost:3000/test -v
   ```
3. Check browser network tab
4. Check server logs for errors

### Theme Not Persisting

**Solution:**
- Clear browser localStorage
- Ensure cookies are enabled
- Try incognito/private mode

### Scans Not Running

**Solution:**
1. Verify MongoDB is running
2. Check cron schedule syntax
3. Review server logs
4. Try triggering scan manually from dashboard (admin)

## Performance Tips

1. **Cleanup Old Logs:**
   ```bash
   mongosh
   > use securifylogs
   > db.requestlogs.deleteMany({createdAt: {$lt: new Date(Date.now() - 30*24*60*60*1000)}})
   ```

2. **Add Database Indexes:**
   ```bash
   mongosh
   > use securifylogs
   > db.requestlogs.createIndex({suspicious: 1})
   > db.requestlogs.createIndex({createdAt: -1})
   > db.users.createIndex({username: 1})
   ```

3. **Optimize Rate Limiter:**
   - Adjust limits in `src/detection/rateLimiter.js`
   - Increase `MAX_REQUESTS` for higher throughput

## Next Steps

1. Read [README.md](README.md) for full documentation
2. Customize detection rules in `src/detection/`
3. Configure security scan schedules
4. Set up email alerts (enhancement)
5. Deploy to production (see deployment guide)

## Production Deployment

### Important Security Steps

1. **Change JWT Secret:**
   ```bash
   JWT_SECRET=$(openssl rand -hex 32)
   ```

2. **Use Strong Passwords:**
   - Update all user passwords
   - Use a password manager

3. **Configure HTTPS:**
   - Get SSL certificate
   - Update dashboard config

4. **MongoDB Security:**
   - Enable authentication
   - Restrict network access
   - Enable TLS/SSL

5. **Environment Setup:**
   ```bash
   NODE_ENV=production
   ```

6. **Backup Strategy:**
   - Regular MongoDB backups
   - Retention policies

## Support

For issues or questions:
1. Check logs: `server console output`
2. Check MongoDB: `mongosh`
3. Refer to README.md
4. Review GitHub issues (if applicable)

---

**You're all set!** 🎉 Start monitoring your API security with SecurifyLogs.
