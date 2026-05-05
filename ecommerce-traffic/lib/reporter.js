// Removed chalk

let stats = {
  total: 0,
  legit: 0,
  suspicious: 0,
  attack: 0,
  responseTimes: []
};

function recordRequest(type, responseTimeMs) {
  stats.total++;
  if (type === 'LEGIT') stats.legit++;
  else if (type === 'SUSPICIOUS') stats.suspicious++;
  else if (type === 'ATTACK') stats.attack++;

  stats.responseTimes.push(responseTimeMs);
  if (stats.responseTimes.length > 1000) {
    stats.responseTimes.shift(); // Keep moving average size bounded
  }
}

function printSummary() {
  const avg = stats.responseTimes.length > 0 
    ? (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length).toFixed(1) 
    : 0;

  const pct = (val) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  console.log(`\x1b[36m
  ╔══════════════════════════════════╗
  ║  Traffic Summary (last 60s)      ║
  ║  Total requests:  ${stats.total.toString().padEnd(14)} ║
  ║  LEGIT:           ${stats.legit.toString().padEnd(4)} (${pct(stats.legit).toString().padStart(2)}%)      ║
  ║  SUSPICIOUS:      ${stats.suspicious.toString().padEnd(4)} (${pct(stats.suspicious).toString().padStart(2)}%)      ║
  ║  ATTACK:          ${stats.attack.toString().padEnd(4)} (${pct(stats.attack).toString().padStart(2)}%)      ║
  ║  Avg response:    ${avg}ms           ║
  ╚══════════════════════════════════╝
  \x1b[0m`);

  // Reset for next 60s
  stats = {
    total: 0, legit: 0, suspicious: 0, attack: 0, responseTimes: []
  };
}

module.exports = { recordRequest, printSummary };
