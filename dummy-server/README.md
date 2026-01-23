# Dummy Server with SecurifyLogs Integration

This is a test server integrated with the **securify-logs** library that automatically logs all API requests, detects threats, and displays them in a dashboard.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Dummy Server
```bash
npm start
```

### 3. Server will start with:
- **Backend API**: http://localhost:4000
- **Dashboard**: http://localhost:9000
- **Health Check**: http://localhost:4000/health

### 4. Login to Dashboard
Open http://localhost:9000 in your browser and log in with:
- **Username**: `ameya`
- **Password**: `ameya123`

### 5. Generate Traffic
In a new terminal, navigate to the `traffic-gen` folder:
```bash
cd ../traffic-gen
npm start
```

This will send 10 requests per second to the dummy server for 5 minutes (configurable in .env).

## What Gets Monitored?

The dummy server exposes these endpoints that are automatically monitored:

- **50 Resource Endpoints**: `/api/v1/resource/1` through `/api/v1/resource/50`
- **User Endpoints**: `/api/v1/users` (GET, POST)
- **Product Endpoint**: `/api/v1/products` (GET)
- **Order Endpoints**: `/api/v1/orders` (GET, POST)
- **Health Check**: `/health`
- **Root**: `/`

## What SecurifyLogs Does?

1. **Request Logging**: All requests are logged with:
   - Method, path, status code, response time
   - Source IP, user agent
   - Request/response headers and body

2. **Threat Detection**: Automatically detects:
   - SQL injection attempts
   - XSS attacks
   - Unusual patterns
   - Rate limiting anomalies

3. **Security Scanning**: Scheduled cron jobs:
   - Full scan (daily at 2 AM)
   - Port scanning (every 6 hours)
   - SQL injection testing (daily at 4 AM)
   - XSS vulnerability check (daily at 5 AM)

4. **Real-time Dashboard**: View all threats and logs in real-time at http://localhost:9000

## Environment Variables

Configuration in `.env`:

```env
# Server
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017/securify_demo

# SecurifyLogs
SECURIFY_JWT_SECRET=dummy-server-secret-key
DASHBOARD_PORT=9000
```

## Database Setup

Make sure MongoDB is running on localhost:27017:

```bash
# Start MongoDB (if installed locally)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

## Architecture

```
Dummy Server (4000)
    ↓
SecurifyLogs Middleware
    ↓
    ├─ Request Logging
    ├─ Threat Detection
    ├─ MongoDB Storage
    └─ Dashboard Server (9000)
```

## Traffic Generation Pattern

The traffic-gen tool sends:
- **10 requests/second** by default (RPS=10 in .env)
- **5 minutes** duration (DURATION=300 in .env)
- **Random endpoints** from the 50+ available
- **Various HTTP methods**: GET, POST, PUT, DELETE
- **Random user agents** to simulate real traffic

## Troubleshooting

### Server won't start
- Ensure MongoDB is running
- Check if port 4000 is available: `netstat -an | findstr :4000`
- Check .env file for correct configuration

### Dashboard not accessible
- Verify port 9000 is free
- Check if dashboard initialization completed in server logs
- Clear browser cache and try again

### No requests showing in dashboard
- Make sure traffic-gen is running
- Verify requests are reaching the server (check console logs)
- Wait a moment for logs to appear in dashboard

## Files

- `index.js` - Main Express server with securify-logs integration
- `database.js` - MongoDB connection setup (legacy)
- `.env` - Environment configuration
- `package.json` - Dependencies

## Next Steps

1. Start the dummy server: `npm start`
2. Open dashboard at http://localhost:9000
3. Run traffic generator to see real-time threat detection
4. Check security scans results on the Scans tab
5. Review detected threats in real-time

Happy testing! 🔒
