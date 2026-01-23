// src/core/config.js
/**
 * Configuration validation for SecurifyLogs
 */
function validateConfig(config) {
  if (!config.app) {
    throw new Error("Express app instance is required");
  }

  if (!config.mongoUri) {
    throw new Error("MongoDB URI is required");
  }

  if (!config.jwtSecret) {
    throw new Error("JWT secret is required for authentication");
  }

  if (config.dashboard?.enabled && !config.dashboard.port) {
    throw new Error("Dashboard port must be defined when enabled");
  }

  if (config.securityScans?.enabled && !config.securityScans.target) {
    console.warn("[SecurifyLogs] Security scans enabled but no target specified");
  }

  return true;
}

/**
 * Default configuration
 */
const defaultConfig = {
  app: null,
  mongoUri: null,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  dashboard: {
    enabled: true,
    port: 9000
  },
  securityScans: {
    enabled: true,
    target: 'localhost',
    schedules: {
      full: '0 2 * * *',        // Daily at 2 AM
      port_scan: '0 */6 * * *', // Every 6 hours
      sql_injection: '0 4 * * *', // Daily at 4 AM
      xss: '0 5 * * *'           // Daily at 5 AM
    }
  }
};

module.exports = { validateConfig, defaultConfig };

