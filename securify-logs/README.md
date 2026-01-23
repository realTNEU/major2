# SecurifyLogs - Security Monitoring Middleware

> A comprehensive Node.js security monitoring middleware with threat detection, vulnerability scanning, and modern dashboard.

## Features

✅ **Real-time API Monitoring**
- Logs all incoming API requests
- Captures request metadata (method, path, IP, status, duration)
- Persistent logging to MongoDB

✅ **Advanced Threat Detection**
- SQL Injection pattern detection
- XSS (Cross-Site Scripting) detection
- Command Injection detection
- LDAP Injection detection
- XXE (XML External Entity) detection
- Path Traversal detection
- Suspicious User-Agent detection
- Rate limiting detection
- Anomaly detection (behavior-based)

✅ **Vulnerability Scanning**
- Scheduled security scans via cron jobs
- Port scanning capabilities
- SQL Injection testing
- XSS vulnerability testing
- Directory traversal testing
- Security header validation
- Full automated security assessments

✅ **Modern Dashboard**
- Clean, minimalistic, and elegant UI
- Dark/Light mode toggle
- Secure login with JWT authentication
- Real-time log viewing with filters
- Vulnerability scan results viewer
- Security statistics and insights
- Admin-only scan triggering
- Responsive design

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Admin/Viewer)
- Secure password hashing with bcrypt
- Session management
- Account creation script (no signup)

## Installation

### 1. Clone and Install

```bash
cd securify-logs
npm install
```

### 2. Install Dashboard Dependencies

```bash
cd dashboard-ui
npm install
cd ..
```

### 3. Create Admin Account

```bash
node scripts/createUser.js
```

Follow the prompts to create your first admin account.

## Configuration

### Basic Setup

Create a configuration object when initializing SecurifyLogs:

```javascript
const express = require('express');
const securifyLogs = require('securify-logs');

const app = express();

securifyLogs.init({
  app,
  mongoUri: 'mongodb://localhost:27017/securifylogs',
  jwtSecret: 'your-secret-key-change-in-production',
  dashboard: {
    enabled: true,
    port: 9000
  },
  securityScans: {
    enabled: true,
    target: 'localhost',
    schedules: {
      full: '0 2 * * *',        // Daily at 2 AM
      port_scan: '0 */6 * * *', // Every 6 hours
      sql_injection: '0 4 * * *', // Daily at 4 AM
      xss: '0 5 * * *'           // Daily at 5 AM
    }
  }
});

app.listen(3000, () => {
  console.log('App running on port 3000');
  console.log('Dashboard: http://localhost:9000');
});
```

### Configuration Options

#### Required
- **app** (Express app instance) - Your Express application
- **mongoUri** (string) - MongoDB connection URI
- **jwtSecret** (string) - Secret key for JWT token signing

#### Optional
- **dashboard** (object)
  - `enabled` (boolean, default: true) - Enable dashboard server
  - `port` (number, default: 9000) - Dashboard server port

- **securityScans** (object)
  - `enabled` (boolean, default: true) - Enable automated scans
  - `target` (string) - Target for security scans (e.g., 'localhost')
  - `schedules` (object) - Cron expressions for scan schedules

### Environment Variables

```bash
MONGO_URI=mongodb://user:pass@host:27017/securifylogs
JWT_SECRET=your-secret-key
DASHBOARD_PORT=9000
```

## Usage

### Access the Dashboard

1. Open your browser and navigate to `http://localhost:9000`
2. Log in with the credentials created in the setup script
3. View real-time logs and security scan results

### Create Additional Users

```bash
node scripts/createUser.js
```

You can create multiple users with different roles:
- **admin** - Can view logs, trigger scans, and manage the system
- **viewer** - Can only view logs and scan results

### API Endpoints

#### Authentication

```
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

#### Logs

```
GET /api/logs?page=1&limit=50&suspicious=true&method=POST&startDate=...&endDate=...
```

#### Statistics

```
GET /api/stats
```

Returns overview stats, top paths, top IPs, method distribution, recent scans.

#### Vulnerability Scans

```
GET /api/scans
GET /api/scans/:id
POST /api/scans/trigger (admin only)
GET /api/scans/scheduled
```

### Triggered Scans

Admin users can trigger manual scans from the dashboard:

```javascript
// Manual scan via API
fetch('/api/scans/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    scanType: 'full', // or 'port_scan', 'sql_injection', 'xss', 'directory_traversal'
    target: 'localhost'
  })
})
```

## Dashboard UI

### Features

- **Dashboard Page**
  - Overview statistics cards
  - Request log table with real-time updates
  - Filtering by HTTP method, suspicious flag, date range
  - Pagination support

- **Vulnerability Scans Page**
  - View all scans with status
  - Trigger new scans (admin only)
  - Filter by scan type and status
  - View detailed findings with severity levels

- **Theme Support**
  - Light mode (default)
  - Dark mode toggle
  - Persistent theme preference

### Technology Stack

- React 18
- Vite (build tool)
- Vanilla CSS with CSS variables for theming
- Responsive design

### Building the Dashboard

```bash
cd dashboard-ui
npm run build
```

This generates the production build in `dashboard-ui/dist/`.

## Monitoring Detected Threats

All suspicious requests are:
1. Flagged with relevant security labels
2. Stored in MongoDB with full details
3. Visible in the dashboard
4. Logged to the console with warnings

### Security Flags

- **RATE_ABUSE** - Excessive requests from single IP
- **SQLI_PATTERN** - SQL Injection attempt detected
- **XSS_PATTERN** - Cross-Site Scripting attempt detected
- **PATH_TRAVERSAL** - Directory traversal attempt
- **COMMAND_INJECTION** - Command injection attempt
- **LDAP_INJECTION** - LDAP injection attempt
- **XXE_ATTEMPT** - XML External Entity attack
- **SUSPICIOUS_USER_AGENT** - Known security tool user agent
- **VOLUME_SPIKE** - Unusual spike in request volume
- **SCANNING_BEHAVIOR** - Scanning-like behavior detected
- **UNUSUAL_METHOD_RATIO** - Unusual HTTP method usage
- **REPEATED_404** - Repeated 404 errors (path enumeration)

## Database Schema

### RequestLog

```javascript
{
  method: String,           // HTTP method
  path: String,            // Request URL path
  ip: String,              // Client IP address
  statusCode: Number,      // HTTP response status
  duration: Number,        // Request duration in ms
  userAgent: String,       // User agent string
  suspicious: Boolean,     // Flagged as suspicious
  flags: [String],         // Security flags
  createdAt: Date          // Timestamp
}
```

### User

```javascript
{
  username: String,        // Unique username
  email: String,           // Unique email
  password: String,        // Bcrypt hashed
  role: String,            // 'admin' or 'viewer'
  createdAt: Date,         // Account creation date
  lastLogin: Date          // Last login timestamp
}
```

### VulnerabilityScan

```javascript
{
  scanType: String,        // Type of scan
  target: String,          // Target of scan
  status: String,          // pending/running/completed/failed
  findings: [{
    severity: String,      // critical/high/medium/low/info
    title: String,
    description: String,
    recommendation: String
  }],
  summary: {
    critical: Number,
    high: Number,
    medium: Number,
    low: Number,
    info: Number
  },
  duration: Number,        // Scan duration in ms
  startedAt: Date,
  completedAt: Date,
  createdAt: Date
}
```

## Security Best Practices

1. **Change JWT Secret** - Update `jwtSecret` in production
2. **Use HTTPS** - Always use HTTPS in production
3. **Secure MongoDB** - Require authentication and restrict access
4. **Environment Variables** - Never commit secrets to version control
5. **Regular Updates** - Keep dependencies up to date
6. **Strong Passwords** - Enforce strong password policies for users
7. **IP Whitelisting** - Consider restricting dashboard access by IP
8. **Rate Limiting** - Increase limits for your use case
9. **Log Rotation** - Implement log rotation for old entries
10. **Backups** - Regular MongoDB backups

## Troubleshooting

### MongoDB Connection Issues

```
Error: MongoDB connection failed
```

- Check MongoDB is running
- Verify connection URI is correct
- Check network connectivity

### JWT Authentication Errors

```
Error: Invalid token
```

- Ensure JWT secret is consistent
- Check token hasn't expired
- Clear browser cookies and retry login

### Dashboard Not Loading

- Check dashboard port is not in use
- Verify port is open in firewall
- Check browser console for errors
- Try building the React app: `cd dashboard-ui && npm run build`

### Scans Not Running

- Check MongoDB connection
- Verify cron schedule syntax is valid
- Check server logs for errors
- Ensure target is reachable

## Development

### Project Structure

```
securify-logs/
├── src/
│   ├── core/              # Configuration and initialization
│   ├── database/          # MongoDB models and connections
│   ├── detection/         # Threat detection modules
│   ├── middleware/        # Express middleware
│   ├── dashboard/         # Dashboard API server
│   ├── utils/             # Utility functions
│   └── index.js           # Main export
├── dashboard-ui/          # React dashboard
├── scripts/               # Utility scripts
├── example/               # Example usage
└── package.json
```

### Running Example

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Run example app
node example/express-app.js

# Terminal 3: Access dashboard at http://localhost:9000
```

## Performance Considerations

- **Rate Limiter**: Default 20 requests per 10 seconds per IP
- **Log Storage**: Implement retention policy for old logs
- **Database Indexing**: Add indexes for frequently filtered fields
- **Memory**: Anomaly detection runs in-memory, clean up periodic ally

## Future Enhancements

- [ ] Integration with actual scanning tools (nmap, sqlmap)
- [ ] Email alerts for critical findings
- [ ] Multi-user dashboard collaboration
- [ ] Custom detection rules engine
- [ ] Export reports (PDF, CSV)
- [ ] Integration with SIEM systems
- [ ] Machine learning-based anomaly detection
- [ ] WebSocket for real-time updates
- [ ] Docker containerization
- [ ] Kubernetes deployment examples

## License

ISC

## Support

For issues, questions, or contributions, please refer to the project repository.

---

**SecurifyLogs** - Built with security in mind. 🔒
