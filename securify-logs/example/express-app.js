/**
 * Example Express app using SecurifyLogs
 *
 * Usage:
 *   1. Make sure MongoDB is running
 *   2. node example/express-app.js
 *   3. Access dashboard at http://localhost:9000
 *   4. Test the API at http://localhost:3000/test
 */

const express = require("express");
const securifyLogs = require("../src");

const app = express();

// Middleware
app.use(express.json());

// Initialize SecurifyLogs
securifyLogs.init({
  app,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/securifylogs",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret-in-production",
  dashboard: {
    enabled: true,
    port: 9000,
  },
  securityScans: {
    enabled: true,
    target: "localhost",
    schedules: {
      full: "0 2 * * *", // Daily at 2 AM
      port_scan: "0 */6 * * *", // Every 6 hours
      sql_injection: "0 4 * * *", // Daily at 4 AM
      xss: "0 5 * * *", // Daily at 5 AM
    },
  },
});

// Example routes
app.get("/test", (req, res) => {
  res.json({ message: "Hello from SecurifyLogs!", timestamp: new Date() });
});

app.post("/api/users", (req, res) => {
  res.json({ created: true, userId: 123 });
});

app.get("/api/users/:id", (req, res) => {
  res.json({ id: req.params.id, name: "John Doe" });
});

// Start app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`App running on: http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:9000`);
  console.log(`\nCreate an admin account first:`);
  console.log(`  node scripts/createUser.js`);
  console.log(`========================================\n`);
});
