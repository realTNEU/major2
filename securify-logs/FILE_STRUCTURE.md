# SecurifyLogs - File Structure & Documentation

Complete file listing and purposes for the SecurifyLogs project.

## Documentation Files

### 📄 README.md
**Main documentation** - Complete feature overview, installation, usage, configuration
- Features list
- Installation steps
- Configuration options
- Database schemas
- Security best practices
- Troubleshooting guide
- Project structure

### 📄 QUICKSTART.md  
**5-minute setup guide** - Get running in minutes
- Prerequisites
- Installation steps
- Account creation
- Testing
- Troubleshooting

### 📄 SETUP.md
**Detailed setup guide** - Step-by-step installation
- Prerequisites verification
- Installation steps
- Configuration (environment variables)
- Running the application
- Verification steps
- Troubleshooting
- Performance tips
- Production checklist

### 📄 API_EXAMPLES.md
**API documentation** - Complete API reference with examples
- Authentication endpoints
- Log retrieval examples
- Statistics endpoints
- Vulnerability scan endpoints
- Code examples (JavaScript, CURL, Python)
- Error responses

### 📄 PROJECT_SUMMARY.md
**Project overview** - Architecture and component summary
- Architecture diagram
- Component descriptions
- Technology stack
- Detected threats
- File structure
- How it works
- Security features

### 📄 .env.example
**Configuration template** - Environment variables reference
- MongoDB URI
- JWT secret
- Dashboard port
- Environment settings

---

## Backend Source Files

### Core Module (`src/core/`)

#### `init.js` (68 lines)
- Main initialization function
- Config merging with defaults
- Middleware attachment
- Dashboard startup
- Security scan initialization

#### `config.js` (39 lines)
- Configuration validation
- Default configuration object
- Required vs optional settings

### Database Module (`src/database/`)

#### `connect.js` (26 lines)
- MongoDB connection management
- Connection status tracking
- Error handling

#### Models (`models/`)

**`User.js` (71 lines)**
- User schema with email, username, password
- bcrypt password hashing pre-hook
- comparePassword method
- Role-based access (admin/viewer)
- Timestamps

**`RequestLog.js` (20 lines)**
- Request logging schema
- Tracks method, path, IP, status, duration
- User-agent logging
- Suspicious flag
- Security flags array

**`VulnerabilityScan.js` (42 lines)**
- Vulnerability scan schema
- Scan types and status tracking
- Findings with severity levels
- Summary statistics
- Duration and timestamp tracking

### Detection Module (`src/detection/`)

**`patternMatch.js` (113 lines)**
- SQL injection detection (9 patterns)
- XSS detection (11 patterns)
- Path traversal detection
- Command injection detection
- LDAP injection detection
- XXE detection
- Suspicious user-agent detection

**`rateLimiter.js` (30 lines)**
- In-memory rate limiting
- 20 requests per 10 seconds per IP
- Efficient timestamp-based tracking
- Automatic cleanup

**`anomalyDetection.js` (84 lines)**
- Behavior-based threat detection
- Request volume spike detection
- Scanning behavior detection
- Method ratio anomalies
- 404 error pattern detection
- Automatic data cleanup

### Middleware Module (`src/middleware/`)

**`requestLogger.js` (50 lines)**
- Request interception
- Multi-layer detection (pattern, rate, anomaly)
- Asynchronous logging
- Error handling

**`auth.js` (46 lines)**
- JWT token verification
- Role-based authorization
- Admin access checking
- Token refresh handling

### Dashboard Module (`src/dashboard/`)

**`server.js` (360+ lines)**
- Express API server
- CORS and security middleware
- Authentication routes (login, logout, me)
- Log retrieval with filtering and pagination
- Statistics aggregation
- Vulnerability scan endpoints
- Admin-only scan triggering
- Static React file serving

### Utilities Module (`src/utils/`)

**`securityScanner.js` (185 lines)**
- Port scanning simulation
- SQL injection testing
- XSS vulnerability testing
- Directory traversal testing
- Security header validation
- Full scan orchestration
- Simulated findings generation

**`cronScanner.js` (137 lines)**
- Cron job scheduling
- Scan execution
- Scan result storage
- Schedule initialization
- Job management

### Main Entry Point

**`src/index.js` (5 lines)**
- Main module export
- Exports init function

---

## Frontend Source Files (`dashboard-ui/`)

### Configuration Files

**`package.json` (23 lines)**
- React dependencies
- Vite build tool
- Dev dependencies

**`vite.config.js` (15 lines)**
- Vite build configuration
- API proxy setup
- Build output directory

**`index.html` (12 lines)**
- React root element
- Asset references

### Styling

**`src/index.css` (180+ lines)**
- CSS variables for theming
- Light/dark mode definitions
- Base styles for all elements
- Button, card, badge styles
- Form styling
- Table styling
- Animations and transitions

### Context (State Management)

**`src/context/AuthContext.jsx` (70 lines)**
- User authentication state
- Login/logout functions
- Auth check on mount
- Error handling

**`src/context/ThemeContext.jsx` (40 lines)**
- Dark/light theme state
- LocalStorage persistence
- Theme toggle function

### Utilities

**`src/utils/helpers.js` (30 lines)**
- Date formatting
- Duration formatting
- Severity color mapping
- Status badge mapping

### Components

**`src/components/Header.jsx` (45 lines)**
- Navigation header
- Theme toggle button
- User info display
- Admin badge
- Logout button

**`src/components/Header.css` (70 lines)**
- Sticky header positioning
- User info styling
- Theme toggle styling
- Responsive design

### Pages

**`src/pages/Login.jsx` (60 lines)**
- Login form
- Credential validation
- Error message display
- Loading state

**`src/pages/Login.css` (90 lines)**
- Centered login card
- Form styling
- Error message styling
- Gradient background

**`src/pages/Dashboard.jsx` (110 lines)**
- Stats cards display
- Real-time log table
- Log filtering
- Pagination
- Auto-refresh (5 seconds)

**`src/pages/Dashboard.css` (130 lines)**
- Grid layout for stats
- Table styling
- Method badges
- Status code styling
- Flag display

**`src/pages/Scans.jsx` (150 lines)**
- Scan list display
- Manual scan triggering
- Filter options
- Detail modal
- Finding display

**`src/pages/Scans.css` (140 lines)**
- Scan item cards
- Summary statistics
- Modal styling
- Finding severity colors

### Main App Files

**`src/App.jsx` (70 lines)**
- Main application component
- Page routing
- Sidebar navigation
- Auth check

**`src/App.css` (70 lines)**
- Layout structure
- Sidebar styling
- Responsive design

**`src/main.jsx` (15 lines)**
- React root rendering
- Provider setup (Theme, Auth)

---

## Example & Scripts

**`example/express-app.js` (40 lines)**
- Example Express application
- SecurifyLogs initialization
- Sample routes
- Port and dashboard info

**`scripts/createUser.js` (90 lines)**
- Interactive user creation
- MongoDB connection handling
- Input validation
- Password hashing via bcrypt
- Role selection (admin/viewer)

---

## Configuration Files

**`package.json` (45 lines)**
- Project metadata
- Backend dependencies
- Dev dependencies
- Script definitions

**`.env.example` (10 lines)**
- Environment template
- Configuration reference

**`.gitignore` (40 lines)**
- Node modules ignore
- Build output ignore
- Environment files
- IDE/editor files
- Log files

---

## File Statistics

### Backend Files
- **JavaScript files**: 13
- **Total lines**: ~2500
- **Modules**: 4 (core, database, detection, dashboard)

### Frontend Files
- **JSX/JavaScript files**: 10
- **CSS files**: 5
- **Total lines**: ~1200
- **Components**: 4 (Header, Login, Dashboard, Scans)

### Configuration Files
- **JSON/JS files**: 3
- **Documentation files**: 6

### Total Project
- **Total files**: 40+
- **Total lines of code**: ~4000+
- **Dependencies**: 15+

---

## Key File Relationships

```
src/index.js
    ├─ init function
        ├─ core/init.js
        │   ├─ database/connect.js (MongoDB)
        │   ├─ middleware/requestLogger.js
        │   ├─ dashboard/server.js (API)
        │   └─ utils/cronScanner.js (Scans)
        │
        ├─ database/models/
        │   ├─ User.js
        │   ├─ RequestLog.js
        │   └─ VulnerabilityScan.js
        │
        ├─ detection/
        │   ├─ patternMatch.js
        │   ├─ rateLimiter.js
        │   └─ anomalyDetection.js
        │
        ├─ middleware/
        │   ├─ requestLogger.js
        │   └─ auth.js
        │
        ├─ utils/
        │   ├─ securityScanner.js
        │   └─ cronScanner.js
        │
        └─ dashboard/server.js (API Routes)
            ├─ /api/auth/* (Auth Context)
            ├─ /api/logs (Dashboard Page)
            ├─ /api/stats (Dashboard Page)
            └─ /api/scans/* (Scans Page)

dashboard-ui/src/
    ├─ main.jsx
    ├─ App.jsx
    ├─ context/
    │   ├─ AuthContext.jsx
    │   └─ ThemeContext.jsx
    ├─ components/
    │   └─ Header.jsx
    ├─ pages/
    │   ├─ Login.jsx
    │   ├─ Dashboard.jsx
    │   └─ Scans.jsx
    └─ utils/
        └─ helpers.js
```

---

## Documentation Organization

```
📁 Root Documentation
├─ README.md                 (Main guide - start here)
├─ QUICKSTART.md             (5-min setup)
├─ SETUP.md                  (Detailed setup)
├─ API_EXAMPLES.md           (API reference)
├─ PROJECT_SUMMARY.md        (Architecture overview)
└─ FILE_STRUCTURE.md         (This file)
```

---

## How to Navigate

### For New Users
1. Start with **QUICKSTART.md** (5 minutes)
2. Read **README.md** for features
3. Follow **SETUP.md** for detailed setup

### For Developers
1. Read **PROJECT_SUMMARY.md** for architecture
2. Review **FILE_STRUCTURE.md** (this file)
3. Check **API_EXAMPLES.md** for integration
4. Examine source files in `src/`

### For API Integration
1. See **API_EXAMPLES.md** for all endpoints
2. Review authentication in `src/middleware/auth.js`
3. Check response formats in `src/dashboard/server.js`

### For Customization
1. Review `src/detection/` for threat patterns
2. Modify `src/utils/securityScanner.js` for scans
3. Update React components in `dashboard-ui/src/`

---

## What To Edit

### To Add New Detection Patterns
- Edit: `src/detection/patternMatch.js`
- Add regex patterns to detection functions

### To Change Rate Limits
- Edit: `src/detection/rateLimiter.js`
- Modify `MAX_REQUESTS` and `WINDOW_MS`

### To Customize Scans
- Edit: `src/utils/securityScanner.js`
- Add new scan functions
- Edit: `src/utils/cronScanner.js` for scheduling

### To Modify Dashboard Appearance
- Edit: `dashboard-ui/src/index.css` for styles
- Edit: `dashboard-ui/src/context/ThemeContext.jsx` for themes
- Modify React components in `dashboard-ui/src/pages/`

### To Add New API Endpoints
- Edit: `src/dashboard/server.js`
- Add new routes and handlers

---

## Testing Checklist

- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`cd dashboard-ui && npm install`)
- [ ] MongoDB running and accessible
- [ ] User created (`node scripts/createUser.js`)
- [ ] Dashboard built (`cd dashboard-ui && npm run build`)
- [ ] App starts (`node example/express-app.js`)
- [ ] Dashboard loads at `http://localhost:9000`
- [ ] Login works with created credentials
- [ ] API requests logged in dashboard
- [ ] Threat detection flags suspicious requests
- [ ] Stats update in real-time

---

## File Checklist

```
✓ src/
  ✓ index.js
  ✓ core/
    ✓ config.js
    ✓ init.js
  ✓ database/
    ✓ connect.js
    ✓ models/
      ✓ User.js
      ✓ RequestLog.js
      ✓ VulnerabilityScan.js
  ✓ detection/
    ✓ patternMatch.js
    ✓ rateLimiter.js
    ✓ anomalyDetection.js
  ✓ middleware/
    ✓ requestLogger.js
    ✓ auth.js
  ✓ dashboard/
    ✓ server.js
  ✓ utils/
    ✓ securityScanner.js
    ✓ cronScanner.js

✓ dashboard-ui/
  ✓ src/
    ✓ index.css
    ✓ App.jsx
    ✓ App.css
    ✓ main.jsx
    ✓ context/
      ✓ AuthContext.jsx
      ✓ ThemeContext.jsx
    ✓ components/
      ✓ Header.jsx
      ✓ Header.css
    ✓ pages/
      ✓ Login.jsx
      ✓ Login.css
      ✓ Dashboard.jsx
      ✓ Dashboard.css
      ✓ Scans.jsx
      ✓ Scans.css
    ✓ utils/
      ✓ helpers.js
  ✓ package.json
  ✓ vite.config.js
  ✓ index.html

✓ scripts/
  ✓ createUser.js

✓ example/
  ✓ express-app.js

✓ Documentation/
  ✓ README.md
  ✓ QUICKSTART.md
  ✓ SETUP.md
  ✓ API_EXAMPLES.md
  ✓ PROJECT_SUMMARY.md
  ✓ FILE_STRUCTURE.md

✓ Configuration/
  ✓ .env.example
  ✓ .gitignore
  ✓ package.json
```

---

**All files created and organized!** 🎉

Start with **README.md** or **QUICKSTART.md**.
