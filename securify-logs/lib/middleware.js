const { analyzeRequest } = require('./engine');
const fs = require('fs');
const path = require('path');
const { Log } = require('./db');

function middleware(config) {
  // Try to set up file logging if required
  let logStream = null;
  if (config.logToFile) {
    const logFilePath = path.join(process.cwd(), 'securify-threats.log');
    logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
  }

  return function (req, res, next) {
    const startTime = process.hrtime();
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
      // Calculate response time
      const diff = process.hrtime(startTime);
      const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      // Log to console exactly as requested:
      // [timestamp] METHOD /route → STATUS (Xms)
      const route = req.route ? req.route.path : req.url;
      console.log(`[${timestamp}] ${req.method} ${route} → ${res.statusCode} (${durationMs}ms)`);

      // Analyze request for threats
      const flags = analyzeRequest(req, res, durationMs);

      const logEntry = new Log({
        method: req.method,
        url: req.url,
        route,
        headers: req.headers,
        body: req.body || null,
        ip: req.ip || req.connection.remoteAddress,
        statusCode: res.statusCode,
        responseTime: durationMs,
        userAgent: req.headers['user-agent'] || '',
        flags
      });

      // Store in MongoDB
      logEntry.save().catch(err => console.error('[securify-logs] Error saving log:', err.message));

      // Log to file if configured and if there are flags (optional: log all or just threats, assuming all)
      if (logStream) {
        logStream.write(JSON.stringify(logEntry) + '\n');
      }
    });

    next();
  };
}

module.exports = middleware;
