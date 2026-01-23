const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 */
function authenticateToken(jwtSecret) {
  return (req, res, next) => {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Access denied",
        message: "No authentication token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({
        error: "Invalid token",
        message: "Authentication token is invalid or expired",
      });
    }
  };
}

/**
 * Middleware to check if user has admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin access required",
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
};
