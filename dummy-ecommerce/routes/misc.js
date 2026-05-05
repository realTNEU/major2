const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

// Deliberate security gap: config exposes mongoUrl and internal settings
router.get('/config', (req, res) => {
  res.json({
    env: process.env.NODE_ENV || 'development',
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/securify-ecommerce',
    jwtSecret: 'supersecretkey123', // exposed!
    dashboardPort: 4001
  });
});

// Deliberate security gap: lists all registered routes
router.get('/debug/routes', (req, res) => {
  // A simple mockup of route disclosure
  const routes = [
    'GET /api/products',
    'GET /api/products/search',
    'POST /api/auth/login',
    'GET /api/users',
    'GET /api/config',
    'GET /api/debug/routes',
    'POST /api/payments/process'
  ];
  res.json({ availableRoutes: routes });
});

// Deliberate security gap: returns admin stats with no auth check
router.get('/admin/panel', (req, res) => {
  res.json({
    totalUsers: 20,
    totalOrders: 15,
    revenue: 1450.50,
    activeSessions: 5
  });
});

module.exports = router;
