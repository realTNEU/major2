const { sendRequest, wait } = require('../lib/http');
const injections = require('../payloads/injections');

async function run() {
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/100.0' };

  while (true) {
    // Normal request first
    await sendRequest('LEGIT', 'GET', '/api/products/search?q=', headers);
    await wait(1000);

    for (const payload of injections) {
      // 1. Search injection
      await sendRequest('ATTACK', 'GET', `/api/products/search?q=${encodeURIComponent(payload)}`, headers);
      await wait(500);
      
      // 2. Login injection
      await sendRequest('ATTACK', 'POST', '/api/auth/login', headers, { email: payload, password: "x" });
      await wait(500);

      // 3. User update injection
      await sendRequest('ATTACK', 'PUT', '/api/users/1', headers, { name: payload });
      await wait(500);
    }

    await wait(20000); // Wait before next sweep
  }
}

module.exports = run;
