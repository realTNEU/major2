const express = require('express');
const securify = require('securify-logs');

const app = express();
const dotenv = require('dotenv')
dotenv.config()
// console.log(process.env.GEMINI_API_KEY)
// Middleware to parse JSON and URL-encoded bodies for test routes
app.use(express.json({ limit: '5mb' })); 
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Initialize securify-logs BEFORE the routes
securify.init(app, { 
  dashboardPort: 4000, 
  logToFile: true,
  mongoUrl: 'mongodb://localhost:27017/securify-logs-test',
  geminiApiKey: process.env.GEMINI_API_KEY // Optional AI integration
});

// Basic test routes
app.get('/', (req, res) => {
  res.send('Welcome to the Dummy Server!');
});

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

app.post('/upload', (req, res) => {
  res.json({ message: 'Upload received', size: JSON.stringify(req.body).length });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/products', (req, res) => {
  res.json([
    { id: 101, name: 'Laptop', price: 999 },
    { id: 102, name: 'Phone', price: 699 }
  ]);
});

app.post('/cart', (req, res) => {
  res.json({ message: 'Item added to cart', cartId: 'abc-123' });
});

app.post('/checkout', (req, res) => {
  res.json({ message: 'Payment processed successfully' });
});

app.get('/admin/settings', (req, res) => {
  // A vulnerable endpoint if not protected properly
  res.json({ dbString: 'mysql://root:password@localhost/db' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[dummy-server] Running on http://localhost:${PORT}`);
});
