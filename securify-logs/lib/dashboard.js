const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { Log, Admin } = require('./db');
const { runNmapScan, triggerBurpScan } = require('./scanner');
const { analyzeLogsBatch } = require('./ai');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-securify-key-change-me';

/**
 * Starts the dashboard Express server.
 * @param {number} port - The port to listen on.
 */
function start(port) {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  // --- Auth Middleware ---
  const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. Please log in.' });

    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- API Routes ---

  // Login
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '12h' });
      
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 12 * 60 * 60 * 1000 });
      res.json({ message: 'Logged in successfully', token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Logout
  app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  // Verify Auth
  app.get('/api/me', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
  });

  // Fetch Logs
  app.get('/api/logs', authenticateToken, async (req, res) => {
    try {
      const logs = await Log.find().sort({ timestamp: -1 }).limit(1000);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  // Stats for Charts
  app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
      // Aggregate flags for pie chart
      const logs = await Log.find({}, { flags: 1, timestamp: 1 });
      const threatCounts = {};
      let totalRequests = logs.length;
      let totalThreats = 0;

      logs.forEach(log => {
        if (log.flags && log.flags.length > 0) {
          totalThreats++;
          log.flags.forEach(flag => {
            threatCounts[flag] = (threatCounts[flag] || 0) + 1;
          });
        }
      });

      const pieData = Object.keys(threatCounts).map(name => ({
        name,
        value: threatCounts[name]
      }));

      res.json({
        totalRequests,
        totalThreats,
        pieData
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Active Scanning
  app.post('/api/scan', authenticateToken, async (req, res) => {
    const { tool, target } = req.body;
    try {
      if (tool === 'nmap') {
        const result = await runNmapScan(target);
        res.json({ result });
      } else if (tool === 'burp') {
        const result = await triggerBurpScan(target);
        res.json({ result: JSON.stringify(result, null, 2) });
      } else {
        res.status(400).json({ error: 'Invalid tool' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Scan failed' });
    }
  });

  // AI Insights
  app.post('/api/insights', authenticateToken, async (req, res) => {
    try {
      // Fetch latest 200 logs for analysis
      const logs = await Log.find().sort({ timestamp: -1 }).limit(200);
      const markdownReport = await analyzeLogsBatch(logs);
      res.json({ report: markdownReport });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  });

  // --- Serve React App ---
  const uiPath = path.join(__dirname, '../dashboard-ui/dist');
  app.use(express.static(uiPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(uiPath, 'index.html'));
  });

  app.listen(port, () => {
    console.log(`[securify-logs] Secure Dashboard running at http://localhost:${port}`);
  });
}

module.exports = {
  start
};
