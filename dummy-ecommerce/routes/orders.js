const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, adminOnly } = require('../lib/auth');
const cartService = require('../lib/cart');

const ordersPath = path.join(__dirname, '../data/orders.json');
let orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

const productsPath = path.join(__dirname, '../data/products.json');
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Deliberate security gap: No input validation on negative quantities
router.post('/checkout', protect, (req, res) => {
  const cart = cartService.getCart(req.user.id);
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let total = 0;
  const items = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    total += (product ? product.price : 0) * item.qty; // accepts negative quantities
    
    // Decrement stock
    if (product) {
      product.stock -= item.qty;
    }
    
    return {
      productId: item.productId,
      qty: item.qty,
      price: product ? product.price : 0
    };
  });

  const newOrder = {
    id: orders.length + 1,
    userId: req.user.id,
    items,
    total,
    status: 'processing',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  cartService.clearCart(req.user.id);

  res.status(201).json(newOrder);
});

router.get('/', protect, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

// Deliberate security gap: get single order WITHOUT ownership check (IDOR)
router.get('/:id', protect, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Deliberate security gap: list ALL orders - admin only but weak auth check 
// (Wait, user instructions say "but auth check is weak — deliberate gap" - let's skip adminOnly and just use protect)
router.get('/all', protect, (req, res) => {
  // Should be adminOnly, but we are missing it intentionally
  res.json(orders);
});

module.exports = router;
