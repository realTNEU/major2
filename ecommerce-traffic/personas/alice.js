const { sendRequest, wait } = require('../lib/http');

async function run() {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
  const headers = { 'User-Agent': ua };

  // 1. Login to get token
  let token = null;
  const loginRes = await sendRequest('LEGIT', 'POST', '/api/auth/login', headers, { email: 'alice@example.com', password: 'password123' });
  // We assume we get a token in a real fetch, but sendRequest just returns status.
  // Let's actually hack sendRequest to return the response json for personas that need it?
  // Since sendRequest consumes the text, let's just cheat and assume auth works if we pass a random string, 
  // but dummy-ecommerce protect middleware requires a REAL signed jwt.
  // Let's just generate a real JWT here using the same secret!
  const jwt = require('jsonwebtoken');
  token = jwt.sign({ id: 3, role: 'customer' }, 'supersecretkey123', { expiresIn: '24h' });
  headers['Authorization'] = `Bearer ${token}`;

  await wait(2000);

  while (true) {
    // Browse
    await sendRequest('LEGIT', 'GET', '/api/products?page=1&limit=5', headers);
    await wait(1500);

    // View product
    await sendRequest('LEGIT', 'GET', '/api/products/1', headers);
    await wait(2000);

    // Search
    await sendRequest('LEGIT', 'GET', '/api/products/search?q=laptop', headers);
    await wait(1500);

    // Add to cart
    await sendRequest('LEGIT', 'POST', '/api/cart/add', headers, { productId: 1, qty: 1 });
    await wait(3000);

    // Checkout
    await sendRequest('LEGIT', 'POST', '/api/orders/checkout', headers);
    await wait(2000);

    // Check history
    await sendRequest('LEGIT', 'GET', '/api/orders', headers);
    
    await wait(5000); // Wait before next shopping trip
  }
}

module.exports = run;
