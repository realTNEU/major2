require('dotenv').config();
const express = require('express');
const securifyLogs = require('securify-logs');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize securify-logs middleware
const { init: initSecurifyLogs } = securifyLogs;

// Initialize securify-logs with configuration
(async () => {
  try {
    await initSecurifyLogs({
      app, // Pass Express app instance
      mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      dashboard: {
        enabled: true,
        port: parseInt(process.env.SECURIFY_DASHBOARD_PORT) || 9000
      },
      jwtSecret: process.env.SECURIFY_JWT_SECRET || 'default-secret',
      securityScans: {
        enabled: true
      }
    });
    console.log('\n✅ SecurifyLogs initialized successfully!');
  } catch (err) {
    console.error('Failed to initialize securify-logs:', err.message);
    process.exit(1);
  }
})();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API endpoints
app.get('/api/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ] 
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 101, name: 'Laptop', price: 999.99 },
      { id: 102, name: 'Phone', price: 599.99 }
    ]
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    res.json({ 
      success: true, 
      token: 'demo-token-' + Date.now(),
      message: 'Login successful' 
    });
  } else {
    res.status(400).json({ success: false, message: 'Missing credentials' });
  }
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  res.json({ 
    query: q, 
    results: [
      { id: 1, title: 'Result 1', relevance: 0.95 },
      { id: 2, title: 'Result 2', relevance: 0.87 }
    ] 
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Demo Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 SecurifyLogs Dashboard: http://localhost:${process.env.SECURIFY_DASHBOARD_PORT || 9000}`);
  console.log(`\n📝 To generate test traffic, run: npm run generate-traffic`);
  console.log(`👤 To create user account, run: npm run create-user\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✋ Shutting down...');
  process.exit(0);
});
