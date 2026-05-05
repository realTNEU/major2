const express = require('express');
const router = express.Router();
const { protect } = require('../lib/auth');
const cartService = require('../lib/cart');

router.get('/', protect, (req, res) => {
  const cart = cartService.getCart(req.user.id);
  res.json(cart);
});

router.post('/add', protect, (req, res) => {
  const { productId, qty } = req.body;
  const cart = cartService.addItem(req.user.id, productId, qty || 1);
  res.json(cart);
});

router.put('/update', protect, (req, res) => {
  const { productId, qty } = req.body;
  const cart = cartService.updateQty(req.user.id, productId, qty);
  res.json(cart);
});

router.delete('/remove/:productId', protect, (req, res) => {
  const cart = cartService.removeItem(req.user.id, parseInt(req.params.productId));
  res.json(cart);
});

module.exports = router;
