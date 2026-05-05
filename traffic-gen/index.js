const payloads = require('./payloads');

const TARGET_URL = 'http://localhost:3000';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  'sqlmap/1.5.8#stable (https://sqlmap.org)',
  'Mozilla/5.0 (compatible; Nikto/2.1.6)'
];

const IPS = [
  '192.168.1.10',
  '10.0.0.5',
  '203.0.113.42',
  '198.51.100.23',
  '8.8.8.8'
];

async function sendRequest(reqData) {
  try {
    const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const randomIP = IPS[Math.floor(Math.random() * IPS.length)];

    const options = {
      method: reqData.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': randomUA,
        'X-Forwarded-For': randomIP
      }
    };

    if (reqData.body) {
      options.body = JSON.stringify(reqData.body);
    }

    await fetch(reqData.url, options);
  } catch (error) {
    // Ignore fetch errors if server is down during test
  }
}

async function runAgent(agentId) {
  console.log(`[Agent ${agentId}] Started traffic generation.`);
  while (true) {
    const req = payloads[Math.floor(Math.random() * payloads.length)];
    await sendRequest(req);
    // Random delay between 100ms and 1500ms
    const delay = Math.floor(Math.random() * 1400) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

console.log('--- Starting Multi-Agent Traffic Generator ---');
const NUM_AGENTS = 5;

for (let i = 1; i <= NUM_AGENTS; i++) {
  runAgent(i);
}
