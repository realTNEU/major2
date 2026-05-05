// Removed chalk
const { recordRequest } = require('./reporter');

const BASE_URL = 'http://localhost:3001';

/**
 * 
 * @param {string} type 'LEGIT' | 'SUSPICIOUS' | 'ATTACK'
 * @param {string} method 
 * @param {string} path 
 * @param {object} headers 
 * @param {object} body 
 */
async function sendRequest(type, method, path, headers = {}, body = null) {
  const start = Date.now();
  let status = 'ERR';
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    status = res.status;
    
    // consume body to avoid memory leaks
    await res.text(); 
  } catch (err) {
    // server down or connection refused
    status = 'FAIL';
  }

  const duration = Date.now() - start;
  recordRequest(type, duration);

  const timeStr = new Date().toLocaleTimeString('en-GB', { hour12: false });
  
  let colorCode = '\x1b[32m'; // green
  if (type === 'SUSPICIOUS') colorCode = '\x1b[33m'; // yellow
  else if (type === 'ATTACK') colorCode = '\x1b[31m'; // red

  console.log(`${colorCode}[${timeStr}] [${type}] ${method.padEnd(6)} ${path} → ${status} (${duration}ms)\x1b[0m`);
  
  return { status };
}

// Random delay helper with jitter (±20%)
function wait(baseMs) {
  const jitter = baseMs * 0.2;
  const delay = baseMs + (Math.random() * jitter * 2 - jitter);
  return new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = { sendRequest, wait };
