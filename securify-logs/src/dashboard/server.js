const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const { dbReady } = require("../database/connect");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const User = require("../database/models/User");
const RequestLog = require("../database/models/RequestLog");
const VulnerabilityScan = require("../database/models/VulnerabilityScan");
const { executeScan, getActiveScans } = require("../utils/cronScanner");

function startDashboard(config) {
  const app = express();
  const { port, jwtSecret } = config;

  // Middleware
  app.use(cors({ credentials: true, origin: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Serve static React build (will be created later)
  const staticPath = path.join(__dirname, "../../dashboard-ui/dist");
  app.use(express.static(staticPath));

  // ============== Public Routes ==============

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      db: dbReady() ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Missing credentials",
          message: "Username and password are required",
        });
      }

      if (!dbReady()) {
        return res.status(503).json({
          error: "Database not connected",
          message: "Please try again later",
        });
      }

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Username or password is incorrect",
        });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Username or password is incorrect",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role,
        },
        jwtSecret,
        { expiresIn: "24h" }
      );

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "strict",
      });

      res.json({
        success: true,
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("[Dashboard] Login error:", error.message);
      res.status(500).json({
        error: "Login failed",
        message: "An error occurred during login",
      });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
  });

  // Verify token / Get current user
  app.get("/api/auth/me", authenticateToken(jwtSecret), async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ============== Protected Routes ==============

  // Get request logs with filtering and pagination
  app.get("/api/logs", authenticateToken(jwtSecret), async (req, res) => {
    if (!dbReady()) {
      return res.status(503).json({
        error: "Database not connected",
        message: "Logs unavailable",
      });
    }

    try {
      const {
        page = 1,
        limit = 50,
        suspicious,
        method,
        startDate,
        endDate,
        search,
      } = req.query;

      const filter = {};

      if (suspicious === "true") {
        filter.suspicious = true;
      }

      if (method) {
        filter.method = method;
      }

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      if (search) {
        filter.$or = [
          { path: { $regex: search, $options: "i" } },
          { ip: { $regex: search, $options: "i" } },
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [logs, total] = await Promise.all([
        RequestLog.find(filter)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip(skip),
        RequestLog.countDocuments(filter),
      ]);

      res.json({
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (err) {
      console.error("[Dashboard] Query failed:", err.message);
      res.status(500).json({ error: "Query failed" });
    }
  });

  // Get statistics
  app.get("/api/stats", authenticateToken(jwtSecret), async (req, res) => {
    if (!dbReady()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    try {
      const now = new Date();
      const last24h = new Date(now - 24 * 60 * 60 * 1000);
      const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);

      const [
        totalRequests,
        suspiciousRequests,
        requests24h,
        suspicious24h,
        topPaths,
        topIPs,
        methodDistribution,
        recentScans,
      ] = await Promise.all([
        RequestLog.countDocuments(),
        RequestLog.countDocuments({ suspicious: true }),
        RequestLog.countDocuments({ createdAt: { $gte: last24h } }),
        RequestLog.countDocuments({
          suspicious: true,
          createdAt: { $gte: last24h },
        }),
        RequestLog.aggregate([
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
        RequestLog.aggregate([
          { $group: { _id: "$ip", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
        RequestLog.aggregate([
          { $group: { _id: "$method", count: { $sum: 1 } } },
        ]),
        VulnerabilityScan.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("-findings"),
      ]);

      res.json({
        overview: {
          totalRequests,
          suspiciousRequests,
          requests24h,
          suspicious24h,
          threatRate: totalRequests
            ? ((suspiciousRequests / totalRequests) * 100).toFixed(2)
            : 0,
        },
        topPaths: topPaths.map((p) => ({ path: p._id, count: p.count })),
        topIPs: topIPs.map((ip) => ({ ip: ip._id, count: ip.count })),
        methodDistribution,
        recentScans,
      });
    } catch (error) {
      console.error("[Dashboard] Stats error:", error.message);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Get vulnerability scans
  app.get("/api/scans", authenticateToken(jwtSecret), async (req, res) => {
    if (!dbReady()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    try {
      const { page = 1, limit = 20, status, scanType } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (scanType) filter.scanType = scanType;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [scans, total] = await Promise.all([
        VulnerabilityScan.find(filter)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip(skip),
        VulnerabilityScan.countDocuments(filter),
      ]);

      res.json({
        scans,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("[Dashboard] Scans query error:", error.message);
      res.status(500).json({ error: "Failed to fetch scans" });
    }
  });

  // Get single scan details
  app.get("/api/scans/:id", authenticateToken(jwtSecret), async (req, res) => {
    if (!dbReady()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    try {
      const scan = await VulnerabilityScan.findById(req.params.id);
      if (!scan) {
        return res.status(404).json({ error: "Scan not found" });
      }
      res.json(scan);
    } catch (error) {
      console.error("[Dashboard] Scan fetch error:", error.message);
      res.status(500).json({ error: "Failed to fetch scan" });
    }
  });

  // Trigger manual scan (admin only)
  app.post(
    "/api/scans/trigger",
    authenticateToken(jwtSecret),
    requireAdmin,
    async (req, res) => {
      try {
        const { scanType, target } = req.body;

        if (!scanType || !target) {
          return res.status(400).json({
            error: "Missing parameters",
            message: "scanType and target are required",
          });
        }

        // Execute scan asynchronously
        executeScan(scanType, target).catch((err) => {
          console.error("[Dashboard] Scan execution error:", err);
        });

        res.json({
          success: true,
          message: "Scan triggered successfully",
          scanType,
          target,
        });
      } catch (error) {
        console.error("[Dashboard] Trigger scan error:", error.message);
        res.status(500).json({ error: "Failed to trigger scan" });
      }
    }
  );

  // Get scheduled scans info
  app.get("/api/scans/scheduled", authenticateToken(jwtSecret), (req, res) => {
    try {
      const activeScans = getActiveScans();
      res.json({ scans: activeScans });
    } catch (error) {
      console.error("[Dashboard] Scheduled scans error:", error.message);
      res.status(500).json({ error: "Failed to fetch scheduled scans" });
    }
  });

  // Serve React app for all other routes
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Start server
  app.listen(port, "0.0.0.0", () => {
    console.log(`[SecurifyLogs] Dashboard listening on port ${port}`);
    console.log(`[SecurifyLogs] Access dashboard at: http://localhost:${port}`);
  });

  return app;
}

module.exports = startDashboard;
