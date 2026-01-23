require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { init: initSecurifyLogs } = require('securify-logs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware (add BEFORE routes)
app.use(express.json());
app.use(morgan('combined'));

// Helper function to create handlers with variation
function makeHandler(i) {
  return (req, res) => {
    const delay = Math.random() * 100; // Random delay 0-100ms
    
    setTimeout(() => {
      // Add some variation to responses
      const shouldError = i % 10 === 0;
      const shouldSlow = i % 7 === 0;
      
      if (shouldSlow) {
        // Simulate slow response
        setTimeout(() => {
          if (shouldError) {
            res.status(500).json({ 
              ok: false, 
              id: i, 
              error: 'Internal server error',
              route: req.path 
            });
          } else {
            res.json({ 
              ok: true, 
              id: i, 
              route: req.path,
              data: `Resource ${i} data`,
              timestamp: new Date().toISOString()
            });
          }
        }, 200);
      } else {
        if (shouldError) {
          res.status(500).json({ 
            ok: false, 
            id: i, 
            error: 'Internal server error',
            route: req.path 
          });
        } else {
          res.json({ 
            ok: true, 
            id: i, 
            route: req.path,
            data: `Resource ${i} data`,
            timestamp: new Date().toISOString()
          });
        }
      }
    }, delay);
  };
}

// Initialize SecurifyLogs FIRST (before defining routes)
async function setupServer() {
  try {
    // Initialize securify-logs middleware BEFORE routes
    await initSecurifyLogs({
      app,
      mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/securify_demo',
      jwtSecret: process.env.SECURIFY_JWT_SECRET || 'your-secret-key-change-in-production',
      dashboard: {
        enabled: true,
        port: process.env.DASHBOARD_PORT || 9000
      },
      securityScans: {
        enabled: true
      }
    });

    // Create 50 endpoints with different HTTP methods (AFTER SecurifyLogs initialization)
    const endpoints = [];

    for (let i = 1; i <= 50; i++) {
      const path = `/api/v1/resource/${i}`;
      let method = 'get';
      
      // Mix HTTP methods
      if (i % 4 === 0) method = 'post';
      else if (i % 4 === 1) method = 'get';
      else if (i % 4 === 2) method = 'put';
      else if (i % 4 === 3) method = 'delete';
      
      app[method](path, makeHandler(i));
      endpoints.push({ method: method.toUpperCase(), path });
    }

    // Additional endpoints for variety
    app.get('/api/v1/users', makeHandler(51));
    app.post('/api/v1/users', makeHandler(52));
    app.get('/api/v1/products', makeHandler(53));
    app.get('/api/v1/orders', makeHandler(54));
    app.post('/api/v1/orders', makeHandler(55));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        endpoints: endpoints.length + 5,
        uptime: process.uptime()
      });
    });

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        message: 'Dummy Server for Evidence Collection',
        endpoints: endpoints.length + 5,
        health: '/health',
        docs: 'This server generates random API traffic for testing evidence collection'
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Start listening
    app.listen(PORT, () => {
      console.log(`✅ Dummy server listening on port ${PORT}`);
      console.log(`📊 SecurifyLogs Dashboard: http://localhost:${process.env.DASHBOARD_PORT || 9000}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`✅ SecurifyLogs middleware is active and logging all requests`);
    });

  } catch (error) {
    console.error('❌ Failed to initialize SecurifyLogs:', error);
    process.exit(1);
  }
}

// Run setup
setupServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
