const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, adminOnly } = require('../lib/auth');

const productsPath = path.join(__dirname, '../data/products.json');
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = products.slice(startIndex, endIndex);
  res.json({ page, limit, total: products.length, products: results });
});

// Deliberate security gap: search echoes 'q' unsanitised
router.get('/search', (req, res) => {
  const { q } = req.query;
  const results = products.filter(p => p.name.toLowerCase().includes((q || '').toLowerCase()) || p.description.toLowerCase().includes((q || '').toLowerCase()));
  
  // VULNERABLE RESPONSE
  res.send(`
    <html>
      <body>
        <h1>Search results for: ${q}</h1>
        <pre>${JSON.stringify(results, null, 2)}</pre>
      </body>
    </html>
  `);
});

router.get('/category/:cat', (req, res) => {
  const results = products.filter(p => p.category.toLowerCase() === req.params.cat.toLowerCase());
  res.json(results);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Admin routes
router.post('/', protect, adminOnly, (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id', protect, adminOnly, (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.delete('/:id', protect, adminOnly, (req, res) => {
  products = products.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: 'Product removed' });
});

module.exports = router;
