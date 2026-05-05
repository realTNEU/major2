const middleware = require('./lib/middleware');
const dashboard = require('./lib/dashboard');
const { connectDB } = require('./lib/db');
const ai = require('./lib/ai');


/**
 * Initialize the securify-logs toolkit.
 * @param {import('express').Application} app - The Express app to intercept.
 * @param {Object} options - Configuration options.
 * @param {number} [options.dashboardPort=4000] - Port for the dashboard server.
 * @param {boolean} [options.logToFile=false] - Whether to log to a file.
 */
function init(app, options = {}) {
  const config = {
    dashboardPort: options.dashboardPort || 4000,
    logToFile: !!options.logToFile,
    mongoUrl: options.mongoUrl,
    geminiApiKey: options.geminiApiKey
  };

  // Initialize AI Integration
  ai.initAI(config.geminiApiKey);

  // Attach middleware immediately to intercept all requests
  // Mongoose will buffer save() calls if the DB isn't connected yet.
  app.use(middleware(config));

  // Connect to MongoDB
  connectDB(config.mongoUrl).then(() => {
    // Start the dashboard server
    dashboard.start(config.dashboardPort);
  }).catch(err => {
    console.error('[securify-logs] MongoDB connection failed:', err);
  });
}

module.exports = {
  init,
};
