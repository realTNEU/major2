/**
 * The Analysis Engine.
 * Detects security vulnerabilities and suspicious patterns.
 */

function analyzeRequest(req, res, duration) {
  const flags = [];

  // Data to analyze
  const url = req.url || '';
  const bodyStr = req.body ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : '';
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  
  // Combine all strings to easily check patterns
  const combinedStr = `${url} ${bodyStr}`.toLowerCase();

  // 1. SQL Injection attempts
  const sqliPatterns = [
    /'\s*or\s*1\s*=\s*1/i,
    /--$/,
    /union\s+select/i,
    /;\s*drop\s+table/i
  ];
  if (sqliPatterns.some(pattern => pattern.test(combinedStr))) {
    flags.push('SQL_INJECTION');
  }

  // 2. XSS payloads
  const xssPatterns = [
    /<script\b[^>]*>[\s\S]*?<\/script>/i,
    /onerror\s*=\s*['"]?javascript:/i,
    /javascript:/i
  ];
  if (xssPatterns.some(pattern => pattern.test(combinedStr))) {
    flags.push('XSS_PAYLOAD');
  }

  // 3. Path traversal
  if (combinedStr.includes('../') || combinedStr.includes('..\\')) {
    flags.push('PATH_TRAVERSAL');
  }

  // 4. Shell injection
  const shellPatterns = [
    /;\s*rm\s+-rf/i,
    /;\s*cat\s+\/etc\//i,
    /\|\s*bash/i,
    /;\s*ls\s+-l/i
  ];
  if (shellPatterns.some(pattern => pattern.test(combinedStr))) {
    flags.push('SHELL_INJECTION');
  }

  // 5. Oversized body (> 2MB roughly for strings)
  if (bodyStr.length > 2 * 1024 * 1024) {
    flags.push('OVERSIZED_BODY');
  }

  // 6. Scanner UAs
  const scannerUAs = ['sqlmap', 'nikto', 'curl', 'nmap', 'postman'];
  if (!userAgent || scannerUAs.some(ua => userAgent.includes(ua))) {
    flags.push('SUSPICIOUS_USER_AGENT');
  }

  // Missing important headers
  if (!req.headers['host']) {
    flags.push('MISSING_HOST_HEADER');
  }

  return flags;
}

module.exports = {
  analyzeRequest
};
