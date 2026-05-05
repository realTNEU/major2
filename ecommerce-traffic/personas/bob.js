const { sendRequest, wait } = require('../lib/http');
const jwt = require('jsonwebtoken');

async function run() {
  const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
  
  // Power shopper is Bob (id: 4)
  const token = jwt.sign({ id: 4, role: 'customer' }, 'supersecretkey123', { expiresIn: '24h' });
  const headers = { 
    'User-Agent': ua,
    'Authorization': `Bearer ${token}`
  };

  while (true) {
    // Rapid browsing
    await sendRequest('LEGIT', 'GET', '/api/products', headers);
    await wait(300);
    
    await sendRequest('LEGIT', 'GET', '/api/products/category/electronics', headers);
    await wait(400);

    // Add multiple items fast
    await sendRequest('LEGIT', 'POST', '/api/cart/add', headers, { productId: 2, qty: 1 });
    await wait(200);
    await sendRequest('LEGIT', 'POST', '/api/cart/add', headers, { productId: 3, qty: 1 });
    await wait(200);
    
    // Checkout
    await sendRequest('LEGIT', 'POST', '/api/orders/checkout', headers);
    
    await wait(2000); // shorter reset than Alice
  }
}

module.exports = run;
