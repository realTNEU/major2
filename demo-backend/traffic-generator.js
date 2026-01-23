/**
 * Traffic Generator
 * Sends dummy traffic to the demo backend server
 * This generates various types of requests to demonstrate securify-logs monitoring
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TRAFFIC_INTERVAL = 2000; // 2 seconds between requests
let isRunning = false;

// Request templates with different characteristics
const requestPatterns = [
  // Normal requests
  {
    name: 'User List Fetch',
    method: 'GET',
    path: '/api/users',
    weight: 3 // Higher weight = more frequent
  },
  {
    name: 'Product List Fetch',
    method: 'GET',
    path: '/api/products',
    weight: 3
  },
  {
    name: 'Health Check',
    method: 'GET',
    path: '/api/health',
    weight: 2
  },
  {
    name: 'Search Query',
    method: 'GET',
    path: '/api/search?q=laptop',
    weight: 2
  },
  {
    name: 'Login',
    method: 'POST',
    path: '/api/login',
    data: { username: 'demo_user', password: 'demo_pass' },
    weight: 2
  },
  
  // Suspicious/Attack-like requests
  {
    name: 'SQL Injection Attempt',
    method: 'GET',
    path: '/api/search?q=\' OR 1=1--',
    weight: 1,
    suspicious: true
  },
  {
    name: 'XSS Attempt',
    method: 'GET',
    path: '/api/search?q=<script>alert(\'xss\')</script>',
    weight: 1,
    suspicious: true
  },
  {
    name: 'Path Traversal',
    method: 'GET',
    path: '/api/users/../../admin',
    weight: 1,
    suspicious: true
  },
  {
    name: 'Command Injection',
    method: 'GET',
    path: '/api/search?q=test; rm -rf /',
    weight: 1,
    suspicious: true
  },
  {
    name: 'Large Request',
    method: 'POST',
    path: '/api/login',
    data: { username: 'a'.repeat(10000), password: 'b'.repeat(10000) },
    weight: 1,
    suspicious: true
  }
];

// Expand patterns by weight
const expandedPatterns = [];
requestPatterns.forEach(pattern => {
  for (let i = 0; i < pattern.weight; i++) {
    expandedPatterns.push(pattern);
  }
});

/**
 * Send a single request
 */
async function sendRequest(pattern) {
  try {
    const config = {
      method: pattern.method.toLowerCase(),
      url: `${BASE_URL}${pattern.path}`,
      timeout: 5000,
      validateStatus: () => true // Accept all status codes
    };

    if (pattern.data) {
      config.data = pattern.data;
    }

    const response = await axios(config);
    
    const isSuspicious = pattern.suspicious ? '🚨' : '✅';
    console.log(`${isSuspicious} [${pattern.method}] ${pattern.name} - ${response.status}`);
    
    return { success: true, pattern, status: response.status };
  } catch (error) {
    console.error(`❌ [${pattern.method}] ${pattern.name} - ${error.message}`);
    return { success: false, pattern, error: error.message };
  }
}

/**
 * Generate traffic bursts (multiple requests in quick succession)
 */
async function trafficBurst(count = 5) {
  console.log(`\n🌊 Traffic burst: ${count} requests`);
  const promises = [];
  
  for (let i = 0; i < count; i++) {
    const pattern = expandedPatterns[Math.floor(Math.random() * expandedPatterns.length)];
    promises.push(sendRequest(pattern));
  }
  
  await Promise.allSettled(promises);
}

/**
 * Generate rate limit attack (many requests from same source)
 */
async function rateLimitAttack(count = 20) {
  console.log(`\n⚡ Rate limit attack simulation: ${count} rapid requests`);
  
  for (let i = 0; i < count; i++) {
    const pattern = expandedPatterns[Math.floor(Math.random() * expandedPatterns.length)];
    await sendRequest(pattern);
    
    if ((i + 1) % 5 === 0) {
      console.log(`  ${i + 1}/${count} requests sent...`);
    }
  }
}

/**
 * Generate scanning pattern (many different paths)
 */
async function scanningPattern(count = 15) {
  console.log(`\n🔍 Scanning pattern simulation: testing different paths`);
  
  const paths = [
    '/api/users',
    '/api/admin',
    '/api/config',
    '/api/settings',
    '/api/database',
    '/api/backup',
    '/admin',
    '/login',
    '/api.json',
    '/config.php',
    '/wp-admin',
    '/.git/config',
    '/.env',
    '/app/config',
    '/data/users'
  ];
  
  for (let i = 0; i < count && i < paths.length; i++) {
    const pattern = {
      name: `Scan Path ${i + 1}`,
      method: 'GET',
      path: paths[i],
      weight: 1,
      suspicious: true
    };
    
    await sendRequest(pattern);
  }
}

/**
 * Main traffic generation loop
 */
async function generateTraffic() {
  isRunning = true;
  let requestCount = 0;

  console.log('\n' + '='.repeat(60));
  console.log('🚀 Traffic Generator Started');
  console.log('='.repeat(60));
  console.log(`Target: ${BASE_URL}`);
  console.log(`Generating traffic every ${TRAFFIC_INTERVAL}ms`);
  console.log('Press Ctrl+C to stop\n');

  const scenarios = [
    async () => {
      // Normal traffic
      const pattern = expandedPatterns[Math.floor(Math.random() * expandedPatterns.length)];
      await sendRequest(pattern);
      requestCount++;
    },
    async () => {
      // Burst every 30 requests
      if (requestCount % 30 === 0) {
        await trafficBurst(3);
        requestCount += 3;
      }
    },
    async () => {
      // Rate limit attack every 60 requests
      if (requestCount % 60 === 0) {
        await rateLimitAttack(10);
        requestCount += 10;
      }
    },
    async () => {
      // Scanning pattern every 90 requests
      if (requestCount % 90 === 0) {
        await scanningPattern(8);
        requestCount += 8;
      }
    }
  ];

  // Main loop
  const interval = setInterval(async () => {
    try {
      for (const scenario of scenarios) {
        await scenario();
      }
      
      // Every 50 requests, show stats
      if (requestCount % 50 === 0) {
        console.log(`\n📊 [${new Date().toLocaleTimeString()}] Total requests sent: ${requestCount}\n`);
      }
    } catch (error) {
      console.error('Scenario error:', error.message);
    }
  }, TRAFFIC_INTERVAL);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n✋ Stopping traffic generator...');
    clearInterval(interval);
    isRunning = false;
    console.log(`\n📈 Total requests sent: ${requestCount}`);
    console.log('✅ Traffic generator stopped\n');
    process.exit(0);
  });
}

/**
 * Start traffic generation
 */
async function start() {
  console.log('⏳ Waiting for server to be ready...');
  
  let connected = false;
  for (let i = 0; i < 10; i++) {
    try {
      await axios.get(`${BASE_URL}/api/health`, { timeout: 2000 });
      connected = true;
      break;
    } catch (error) {
      console.log(`  Attempt ${i + 1}/10... server not ready yet`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!connected) {
    console.error('\n❌ Could not connect to server at', BASE_URL);
    console.error('Make sure the backend server is running: npm start');
    process.exit(1);
  }

  console.log('✅ Server is ready!\n');
  generateTraffic();
}

// Start the traffic generator
start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
