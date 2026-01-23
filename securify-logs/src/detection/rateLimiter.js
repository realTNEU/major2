const requestMap = new Map();

// simple in-memory rate detection
module.exports = function detectRateAbuse(req) {
  const ip = req.ip || "unknown";
  const now = Date.now();

  const WINDOW_MS = 10_000; // 10 seconds
  const MAX_REQUESTS = 20;

  if (!requestMap.has(ip)) {
    requestMap.set(ip, []);
  }

  // keep timestamps within window
  const timestamps = requestMap.get(ip).filter((ts) => now - ts < WINDOW_MS);

  timestamps.push(now);
  requestMap.set(ip, timestamps);

  return timestamps.length > MAX_REQUESTS;
};
