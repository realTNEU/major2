# SecurifyLogs - API Examples

Complete examples for using the SecurifyLogs API.

## Table of Contents
1. [Authentication](#authentication)
2. [Request Logs](#request-logs)
3. [Statistics](#statistics)
4. [Vulnerability Scans](#vulnerability-scans)
5. [Complete Examples](#complete-examples)

## Authentication

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookie:** Sets `token` cookie (httpOnly, maxAge: 24h)

### Get Current User

**Endpoint:** `GET /api/auth/me`

**Request:**
```bash
curl -X GET http://localhost:9000/api/auth/me \
  -H "Cookie: token=YOUR_TOKEN"
```

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-24T10:30:00Z",
    "lastLogin": "2024-01-24T15:45:00Z"
  }
}
```

### Logout

**Endpoint:** `POST /api/auth/logout`

**Request:**
```bash
curl -X POST http://localhost:9000/api/auth/logout \
  -H "Cookie: token=YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Request Logs

### Get All Logs

**Endpoint:** `GET /api/logs`

**Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50) - Items per page
- `suspicious` (string) - Filter suspicious: "true" or "false"
- `method` (string) - Filter by HTTP method: GET, POST, PUT, DELETE
- `startDate` (ISO string) - Start date filter
- `endDate` (ISO string) - End date filter
- `search` (string) - Search in path or IP

**Request:**
```bash
# All logs
curl -X GET http://localhost:9000/api/logs \
  -H "Cookie: token=YOUR_TOKEN"

# Suspicious only
curl -X GET "http://localhost:9000/api/logs?suspicious=true" \
  -H "Cookie: token=YOUR_TOKEN"

# POST requests from today
curl -X GET "http://localhost:9000/api/logs?method=POST&startDate=2024-01-24T00:00:00Z" \
  -H "Cookie: token=YOUR_TOKEN"

# Search for specific IP
curl -X GET "http://localhost:9000/api/logs?search=192.168.1.1" \
  -H "Cookie: token=YOUR_TOKEN"
```

**Response:**
```json
{
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "method": "GET",
      "path": "/api/users",
      "ip": "192.168.1.1",
      "statusCode": 200,
      "duration": 45,
      "userAgent": "Mozilla/5.0...",
      "suspicious": false,
      "flags": [],
      "createdAt": "2024-01-24T15:45:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "method": "GET",
      "path": "/api/users?id=1' OR '1'='1",
      "ip": "192.168.1.50",
      "statusCode": 400,
      "duration": 12,
      "userAgent": "sqlmap/1.4",
      "suspicious": true,
      "flags": ["SQLI_PATTERN", "SUSPICIOUS_USER_AGENT"],
      "createdAt": "2024-01-24T15:44:30Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "pages": 25
  }
}
```

---

## Statistics

### Get Dashboard Statistics

**Endpoint:** `GET /api/stats`

**Request:**
```bash
curl -X GET http://localhost:9000/api/stats \
  -H "Cookie: token=YOUR_TOKEN"
```

**Response:**
```json
{
  "overview": {
    "totalRequests": 5432,
    "suspiciousRequests": 23,
    "requests24h": 1240,
    "suspicious24h": 8,
    "threatRate": "0.42"
  },
  "topPaths": [
    { "path": "/api/users", "count": 234 },
    { "path": "/api/posts", "count": 198 },
    { "path": "/api/comments", "count": 165 }
  ],
  "topIPs": [
    { "ip": "192.168.1.1", "count": 456 },
    { "ip": "192.168.1.50", "count": 89 },
    { "ip": "10.0.0.1", "count": 72 }
  ],
  "methodDistribution": [
    { "_id": "GET", "count": 3200 },
    { "_id": "POST", "count": 1500 },
    { "_id": "PUT", "count": 450 },
    { "_id": "DELETE", "count": 282 }
  ],
  "recentScans": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "scanType": "full",
      "target": "localhost",
      "status": "completed",
      "summary": { "critical": 0, "high": 1, "medium": 2, "low": 3, "info": 1 },
      "createdAt": "2024-01-24T14:00:00Z"
    }
  ]
}
```

---

## Vulnerability Scans

### Get All Scans

**Endpoint:** `GET /api/scans`

**Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string) - pending, running, completed, failed
- `scanType` (string) - port_scan, sql_injection, xss, directory_traversal, full

**Request:**
```bash
# All scans
curl -X GET http://localhost:9000/api/scans \
  -H "Cookie: token=YOUR_TOKEN"

# Completed scans only
curl -X GET "http://localhost:9000/api/scans?status=completed" \
  -H "Cookie: token=YOUR_TOKEN"

# Full scans
curl -X GET "http://localhost:9000/api/scans?scanType=full" \
  -H "Cookie: token=YOUR_TOKEN"
```

**Response:**
```json
{
  "scans": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "scanType": "full",
      "target": "localhost",
      "status": "completed",
      "summary": {
        "critical": 0,
        "high": 1,
        "medium": 2,
        "low": 3,
        "info": 0
      },
      "duration": 45230,
      "startedAt": "2024-01-24T14:00:00Z",
      "completedAt": "2024-01-24T14:01:00Z",
      "createdAt": "2024-01-24T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "pages": 7
  }
}
```

### Get Scan Details

**Endpoint:** `GET /api/scans/:id`

**Request:**
```bash
curl -X GET http://localhost:9000/api/scans/507f1f77bcf86cd799439013 \
  -H "Cookie: token=YOUR_TOKEN"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "scanType": "full",
  "target": "localhost",
  "status": "completed",
  "findings": [
    {
      "severity": "high",
      "title": "MongoDB Port Exposed",
      "description": "Port 27017 appears to be accessible from external networks",
      "recommendation": "Ensure MongoDB is only accessible from trusted networks and requires authentication"
    },
    {
      "severity": "medium",
      "title": "Missing Security Headers",
      "description": "The following security headers are missing: X-Content-Type-Options, X-Frame-Options",
      "recommendation": "Add recommended security headers to all HTTP responses"
    }
  ],
  "summary": {
    "critical": 0,
    "high": 1,
    "medium": 1,
    "low": 0,
    "info": 0
  },
  "duration": 45230,
  "startedAt": "2024-01-24T14:00:00Z",
  "completedAt": "2024-01-24T14:01:00Z",
  "createdAt": "2024-01-24T14:00:00Z"
}
```

### Trigger Manual Scan (Admin Only)

**Endpoint:** `POST /api/scans/trigger`

**Required:** Admin role

**Request Body:**
```json
{
  "scanType": "full",
  "target": "localhost"
}
```

**Request:**
```bash
curl -X POST http://localhost:9000/api/scans/trigger \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_ADMIN_TOKEN" \
  -d '{
    "scanType": "full",
    "target": "localhost"
  }'
```

**Scan Types:**
- `full` - Complete security scan
- `port_scan` - Port scanning
- `sql_injection` - SQL injection testing
- `xss` - XSS vulnerability testing
- `directory_traversal` - Directory traversal testing

**Response:**
```json
{
  "success": true,
  "message": "Scan triggered successfully",
  "scanType": "full",
  "target": "localhost"
}
```

### Get Scheduled Scans

**Endpoint:** `GET /api/scans/scheduled`

**Request:**
```bash
curl -X GET http://localhost:9000/api/scans/scheduled \
  -H "Cookie: token=YOUR_TOKEN"
```

**Response:**
```json
{
  "scans": [
    {
      "schedule": "0 2 * * *",
      "scanType": "full",
      "target": "localhost"
    },
    {
      "schedule": "0 */6 * * *",
      "scanType": "port_scan",
      "target": "localhost"
    },
    {
      "schedule": "0 4 * * *",
      "scanType": "sql_injection",
      "target": "localhost"
    },
    {
      "schedule": "0 5 * * *",
      "scanType": "xss",
      "target": "localhost"
    }
  ]
}
```

---

## Complete Examples

### JavaScript (Fetch API)

```javascript
// Login
async function login(username, password) {
  const response = await fetch('http://localhost:9000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  return await response.json();
}

// Get logs
async function getLogs(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `http://localhost:9000/api/logs?${params}`,
    { credentials: 'include' }
  );
  return await response.json();
}

// Get stats
async function getStats() {
  const response = await fetch('http://localhost:9000/api/stats', {
    credentials: 'include'
  });
  return await response.json();
}

// Trigger scan
async function triggerScan(scanType, target) {
  const response = await fetch('http://localhost:9000/api/scans/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ scanType, target })
  });
  return await response.json();
}

// Usage
(async () => {
  const loginRes = await login('admin', 'password');
  console.log('Logged in:', loginRes.user);

  const logs = await getLogs({ suspicious: true });
  console.log('Suspicious logs:', logs.logs);

  const stats = await getStats();
  console.log('Statistics:', stats);

  const scanRes = await triggerScan('full', 'localhost');
  console.log('Scan triggered:', scanRes.message);
})();
```

### CURL (Command Line)

```bash
#!/bin/bash

# Login and get token
LOGIN=$(curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}')

TOKEN=$(echo $LOGIN | jq -r '.token')

# Get logs
curl -X GET "http://localhost:9000/api/logs?suspicious=true" \
  -H "Authorization: Bearer $TOKEN"

# Get stats
curl -X GET http://localhost:9000/api/stats \
  -H "Authorization: Bearer $TOKEN"

# Trigger scan
curl -X POST http://localhost:9000/api/scans/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"scanType":"full","target":"localhost"}'
```

### Python (Requests)

```python
import requests
import json
from datetime import datetime, timedelta

class SecurifyLogsClient:
    def __init__(self, base_url='http://localhost:9000'):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()

    def login(self, username, password):
        """Login and get JWT token"""
        response = self.session.post(
            f'{self.base_url}/api/auth/login',
            json={'username': username, 'password': password}
        )
        if response.status_code == 200:
            self.token = response.json()['token']
            self.session.headers.update({'Authorization': f'Bearer {self.token}'})
            return response.json()
        raise Exception('Login failed')

    def get_logs(self, suspicious=None, method=None, limit=50):
        """Get request logs"""
        params = {'limit': limit}
        if suspicious is not None:
            params['suspicious'] = str(suspicious).lower()
        if method:
            params['method'] = method

        response = self.session.get(
            f'{self.base_url}/api/logs',
            params=params
        )
        return response.json()

    def get_stats(self):
        """Get dashboard statistics"""
        response = self.session.get(f'{self.base_url}/api/stats')
        return response.json()

    def get_scans(self, status=None, scan_type=None):
        """Get vulnerability scans"""
        params = {}
        if status:
            params['status'] = status
        if scan_type:
            params['scanType'] = scan_type

        response = self.session.get(
            f'{self.base_url}/api/scans',
            params=params
        )
        return response.json()

    def trigger_scan(self, scan_type, target='localhost'):
        """Trigger a manual security scan"""
        response = self.session.post(
            f'{self.base_url}/api/scans/trigger',
            json={'scanType': scan_type, 'target': target}
        )
        return response.json()

# Usage
client = SecurifyLogsClient()
client.login('admin', 'password')

# Get suspicious logs
logs = client.get_logs(suspicious=True, limit=100)
print(f"Found {len(logs['logs'])} suspicious requests")

# Get statistics
stats = client.get_stats()
print(f"Threat rate: {stats['overview']['threatRate']}%")

# Trigger full scan
scan = client.trigger_scan('full')
print(f"Scan triggered: {scan['message']}")
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access denied",
  "message": "No authentication token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Scan not found"
}
```

### 503 Service Unavailable
```json
{
  "error": "Database not connected",
  "message": "Please try again later"
}
```

---

## Rate Limiting & Performance Tips

- **Default limit**: 20 requests per 10 seconds per IP
- **Pagination**: Use `limit` parameter to reduce response size
- **Filters**: Use date filters to narrow down results
- **Caching**: Dashboard auto-refreshes every 5-10 seconds

---

**API Documentation Complete!** 📚
