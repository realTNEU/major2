// In-memory cart store keyed by userId
const carts = new Map();

const getCart = (userId) => {
  if (!carts.has(userId)) {
    carts.set(userId, []);
  }
  return carts.get(userId);
};

const addItem = (userId, productId, qty) => {
  const cart = getCart(userId);
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  return cart;
};

const updateQty = (userId, productId, qty) => {
  const cart = getCart(userId);
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.qty = qty;
  }
  return cart;
};

const removeItem = (userId, productId) => {
  let cart = getCart(userId);
  cart = cart.filter(i => i.productId !== productId);
  carts.set(userId, cart);
  return cart;
};

const clearCart = (userId) => {
  carts.set(userId, []);
};

module.exports = { getCart, addItem, updateQty, removeItem, clearCart };
