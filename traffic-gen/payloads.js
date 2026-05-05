// Pre-defined request configurations simulating normal and malicious traffic

const target = 'http://localhost:3000';

const payloads = [
  // --- NORMAL TRAFFIC ---
  {
    method: 'GET',
    url: `${target}/`,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },
  {
    method: 'GET',
    url: `${target}/users`,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },
  {
    method: 'GET',
    url: `${target}/products`,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },
  {
    method: 'POST',
    url: `${target}/cart`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
    body: { productId: 101 }
  },
  {
    method: 'POST',
    url: `${target}/checkout`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
    body: { paymentToken: 'tok_123' }
  },
  {
    method: 'GET',
    url: `${target}/admin/settings`,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },
  {
    method: 'POST',
    url: `${target}/login`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
    body: { username: 'admin', password: 'password123' }
  },

  // --- MALICIOUS TRAFFIC ---
  
  // 1. SQL Injection
  {
    method: 'POST',
    url: `${target}/login`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
    body: { username: "admin' OR 1=1 --", password: '' }
  },
  {
    method: 'GET',
    url: `${target}/users?id=1; drop table users`,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },

  // 2. XSS Payloads
  {
    method: 'POST',
    url: `${target}/upload`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
    body: { file: "<script>alert('xss')</script>" }
  },

  // 3. Path Traversal
  {
    method: 'GET',
    url: `${target}/users/../../../../etc/passwd`,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },

  // 4. Shell Injection
  {
    method: 'POST',
    url: `${target}/upload`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
    body: { "name": "test; rm -rf /" }
  },

  // 5. Scanner UAs
  {
    method: 'GET',
    url: `${target}/`,
    headers: { 'User-Agent': 'sqlmap/1.0.4#dev' }
  },
  {
    method: 'GET',
    url: `${target}/admin`,
    headers: { 'User-Agent': 'Nikto' }
  },

  // 6. Missing Host header (Node's fetch automatically adds Host, but we can try to send a weird request)
  // fetch() won't easily let us remove Host header completely. We'll skip missing host in standard fetch,
  // but we can simulate Oversized body.
  
  // 7. Oversized Body (we'll just use a small marker here and expand it in index.js)
  {
    method: 'POST',
    url: `${target}/upload`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
    body: { data: "OVERSIZE_ME" }
  }
];

module.exports = payloads;
