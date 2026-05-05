const { sendRequest, wait } = require('../lib/http');

async function run() {
  const headers = { 'User-Agent': 'Scrapy/2.6' };

  while (true) {
    // Enumerate users
    await sendRequest('ATTACK', 'GET', '/api/users', headers);
    await wait(500);

    for (let i = 1; i <= 20; i++) {
      await sendRequest('SUSPICIOUS', 'GET', `/api/users/${i}`, headers);
      await wait(300);
    }

    // IDOR probes on orders
    for (let i = 1; i <= 15; i++) {
      await sendRequest('ATTACK', 'GET', `/api/orders/${i}`, headers);
      await wait(300);
    }

    await sendRequest('ATTACK', 'GET', '/api/admin/panel', headers);
    await sendRequest('ATTACK', 'GET', '/api/debug/routes', headers);
    await sendRequest('ATTACK', 'GET', '/api/config', headers);

    await wait(15000); // Sleep before next scrape cycle
  }
}

module.exports = run;
