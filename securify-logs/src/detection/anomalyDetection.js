/**
 * Anomaly detection based on behavior patterns
 */

const anomalyStore = new Map();

const ANALYSIS_WINDOW = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean up every 5 minutes

/**
 * Analyze request for anomalies
 */
function detectAnomalies(req) {
  const flags = [];
  const ip = req.ip || "unknown";
  const now = Date.now();

  if (!anomalyStore.has(ip)) {
    anomalyStore.set(ip, {
      paths: new Map(),
      methods: new Map(),
      errorCount: 0,
      requestCount: 0,
      timestamps: [],
    });
  }

  const profile = anomalyStore.get(ip);
  profile.timestamps = profile.timestamps.filter(
    (ts) => now - ts < ANALYSIS_WINDOW
  );
  profile.timestamps.push(now);
  profile.requestCount++;

  // Track path access patterns
  const path = req.path || req.originalUrl;
  profile.paths.set(path, (profile.paths.get(path) || 0) + 1);

  // Track HTTP methods
  const method = req.method;
  profile.methods.set(method, (profile.methods.get(method) || 0) + 1);

  // Detect unusual request volume spike
  const recentRequests = profile.timestamps.filter(
    (ts) => now - ts < 60000
  ).length; // Last minute
  if (recentRequests > 100) {
    flags.push("VOLUME_SPIKE");
  }

  // Detect scanning behavior (accessing many different paths)
  if (profile.paths.size > 50) {
    flags.push("SCANNING_BEHAVIOR");
  }

  // Detect unusual method usage (too many POST/PUT/DELETE vs GET)
  const postCount = profile.methods.get("POST") || 0;
  const getCount = profile.methods.get("GET") || 0;
  if (postCount > 20 && getCount < 5) {
    flags.push("UNUSUAL_METHOD_RATIO");
  }

  // Detect accessing non-existent paths repeatedly
  if (req.statusCode === 404) {
    profile.errorCount++;
    if (profile.errorCount > 10) {
      flags.push("REPEATED_404");
    }
  }

  return flags;
}

/**
 * Clean up old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, profile] of anomalyStore.entries()) {
    profile.timestamps = profile.timestamps.filter(
      (ts) => now - ts < ANALYSIS_WINDOW
    );
    if (profile.timestamps.length === 0) {
      anomalyStore.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);

module.exports = detectAnomalies;
