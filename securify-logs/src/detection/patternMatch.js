/**
 * Advanced pattern matching for security threats
 * Detects SQL Injection, XSS, Path Traversal, Command Injection, etc.
 */
module.exports = function detectPatterns(req) {
  const flags = [];

  let payload = "";
  try {
    payload = JSON.stringify({
      query: req.query,
      body: req.body,
      params: req.params,
      url: req.originalUrl,
      headers: req.headers,
    }).toLowerCase();
  } catch {
    return flags;
  }

  // SQL Injection patterns (enhanced)
  const sqlPatterns = [
    /(\bunion\b.*\bselect\b)/i,
    /(\bor\b\s*['"]?\d+['"]?\s*=\s*['"]?\d+)/i,
    /(--\s|#\s|\/\*)/,
    /(\bselect\b.*\bfrom\b.*\bwhere\b)/i,
    /(\bdrop\b.*\btable\b)/i,
    /(\binsert\b.*\binto\b)/i,
    /(\bupdate\b.*\bset\b)/i,
    /(\bdelete\b.*\bfrom\b)/i,
    /(\bexec(\s|\()|execute(\s|\())/i,
    /(;.*(\bdrop|\bdelete|\bupdate))/i,
  ];

  if (sqlPatterns.some((pattern) => pattern.test(payload))) {
    flags.push("SQLI_PATTERN");
  }

  // XSS patterns (enhanced)
  const xssPatterns = [
    /<script[^>]*>.*<\/script>/i,
    /<iframe[^>]*>/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /onclick\s*=/i,
    /javascript:/i,
    /<img[^>]+src[^>]*>/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i,
  ];

  if (xssPatterns.some((pattern) => pattern.test(payload))) {
    flags.push("XSS_PATTERN");
  }

  // Path Traversal patterns
  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e\\/i,
    /\.\.\%2f/i,
  ];

  if (pathTraversalPatterns.some((pattern) => pattern.test(payload))) {
    flags.push("PATH_TRAVERSAL");
  }

  // Command Injection patterns
  const commandInjectionPatterns = [
    /;\s*(ls|cat|wget|curl|bash|sh|nc|netcat)/i,
    /\|\s*(ls|cat|wget|curl|bash|sh)/i,
    /`.*`/,
    /\$\(.*\)/,
  ];

  if (commandInjectionPatterns.some((pattern) => pattern.test(payload))) {
    flags.push("COMMAND_INJECTION");
  }

  // LDAP Injection
  if (/(\*\)|&|\||\(|\))/i.test(payload) && /uid|cn|ou|dc/i.test(payload)) {
    flags.push("LDAP_INJECTION");
  }

  // XXE (XML External Entity)
  if (/<!entity/i.test(payload) || /<!doctype.*system/i.test(payload)) {
    flags.push("XXE_ATTEMPT");
  }

  // Suspicious User-Agent
  const userAgent = req.headers["user-agent"] || "";
  const suspiciousAgents = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /acunetix/i,
    /burp/i,
    /metasploit/i,
  ];

  if (suspiciousAgents.some((pattern) => pattern.test(userAgent))) {
    flags.push("SUSPICIOUS_USER_AGENT");
  }

  return flags;
};
