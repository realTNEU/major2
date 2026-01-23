/**
 * Core initialization for SecurifyLogs
 */
const { connectDB } = require("../database/connect");
const requestLogger = require("../middleware/requestLogger");
const startDashboard = require("../dashboard/server");
const { validateConfig, defaultConfig } = require("./config");
const { initializeScans } = require("../utils/cronScanner");

async function init(userConfig) {
  // Merge user config with defaults
  const config = {
    ...defaultConfig,
    ...userConfig,
    dashboard: { ...defaultConfig.dashboard, ...userConfig.dashboard },
    securityScans: { ...defaultConfig.securityScans, ...userConfig.securityScans }
  };

  // Validate configuration
  validateConfig(config);

  console.log("[SecurifyLogs] Initializing...");

  // Connect to MongoDB
  await connectDB(config.mongoUri);

  // Attach request logging middleware to express app
  config.app.use(requestLogger(config));

  // Start dashboard with authentication
  if (config.dashboard?.enabled) {
    const dashboardConfig = {
      port: config.dashboard.port,
      jwtSecret: config.jwtSecret
    };
    startDashboard(dashboardConfig);
  }

  // Initialize security scanning
  if (config.securityScans?.enabled) {
    initializeScans(config);
  }

  console.log("[SecurifyLogs] Initialization complete!");

  return {
    config,
    stop: async () => {
      console.log("[SecurifyLogs] Shutting down...");
    }
  };
}

module.exports = init;
