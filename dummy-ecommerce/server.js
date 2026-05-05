require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import securify-logs locally
const securify = require('../securify-logs');

const app = express();
const PORT = process.env.PORT || 3001;

// Deliberate security gap: Missing response headers (X-Frame-Options, CSP, HSTS, etc.)
// We will NOT use helmet.

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize securify-logs BEFORE the routes
securify.init(app, {
  dashboardPort: 4001,
  logToFile: true,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/securify-ecommerce',
  geminiApiKey: process.env.GEMINI_API_KEY || null
});

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const miscRoutes = require('./routes/misc');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', miscRoutes); // health, config, debug, admin panel

app.listen(PORT, () => {
  console.log(`[dummy-ecommerce] Server running on http://localhost:${PORT}`);
  console.log(`[dummy-ecommerce] Securify dashboard expected on http://localhost:4001`);
});
