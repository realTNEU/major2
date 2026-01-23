// src/middleware/requestLogger.js
const RequestLog = require("../database/models/RequestLog");
const detectRateAbuse = require("../detection/rateLimiter");
const detectPatterns = require("../detection/patternMatch");
const detectAnomalies = require("../detection/anomalyDetection");

module.exports = (config) => {
  return async function (req, res, next) {
    const start = Date.now();

    res.on("finish", async () => {
      const log = {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        statusCode: res.statusCode,
        duration: Date.now() - start,
        userAgent: req.headers["user-agent"] || "unknown",
        suspicious: false,
        flags: [],
      };

      // Run all detection systems
      if (detectRateAbuse(req)) {
        log.suspicious = true;
        log.flags.push("RATE_ABUSE");
      }

      const patternFlags = detectPatterns(req);
      if (patternFlags.length) {
        log.suspicious = true;
        log.flags.push(...patternFlags);
      }

      const anomalyFlags = detectAnomalies(req);
      if (anomalyFlags.length) {
        log.suspicious = true;
        log.flags.push(...anomalyFlags);
      }

      // Save to database
      try {
        await RequestLog.create(log);

        // Log suspicious activity to console
        if (log.suspicious) {
          console.warn(
            `[SecurifyLogs] Suspicious request detected: ${req.method} ${req.originalUrl} from ${req.ip} - Flags: ${log.flags.join(", ")}`
          );
        }
      } catch (error) {
        console.error("[SecurifyLogs] Failed to log request:", error.message);
      }
    });

    next();
  };
};

