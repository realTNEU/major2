const cron = require("node-cron");
const VulnerabilityScan = require("../database/models/VulnerabilityScan");
const {
  scanPorts,
  testSQLInjection,
  testXSS,
  testDirectoryTraversal,
  checkSecurityHeaders,
  runFullScan,
} = require("../utils/securityScanner");

let cronJobs = [];

/**
 * Execute a security scan
 */
async function executeScan(scanType, target) {
  console.log(`[CronScanner] Starting ${scanType} scan for ${target}...`);

  const scan = await VulnerabilityScan.create({
    scanType,
    target,
    status: "running",
    startedAt: new Date(),
  });

  try {
    let findings = [];

    switch (scanType) {
      case "port_scan":
        findings = await scanPorts(target);
        break;
      case "sql_injection":
        findings = await testSQLInjection(target);
        break;
      case "xss":
        findings = await testXSS(target);
        break;
      case "directory_traversal":
        findings = await testDirectoryTraversal(target);
        break;
      case "full":
        findings = await runFullScan(target);
        break;
      default:
        findings = await runFullScan(target);
    }

    // Calculate summary
    const summary = {
      critical: findings.filter((f) => f.severity === "critical").length,
      high: findings.filter((f) => f.severity === "high").length,
      medium: findings.filter((f) => f.severity === "medium").length,
      low: findings.filter((f) => f.severity === "low").length,
      info: findings.filter((f) => f.severity === "info").length,
    };

    const completedAt = new Date();
    const duration = completedAt - scan.startedAt;

    scan.findings = findings;
    scan.summary = summary;
    scan.status = "completed";
    scan.completedAt = completedAt;
    scan.duration = duration;

    await scan.save();

    console.log(
      `[CronScanner] Scan completed: ${findings.length} findings (Critical: ${summary.critical}, High: ${summary.high})`
    );

    return scan;
  } catch (error) {
    console.error(`[CronScanner] Scan failed:`, error.message);
    scan.status = "failed";
    await scan.save();
    throw error;
  }
}

/**
 * Schedule security scans
 */
function scheduleScan(schedule, scanType, target) {
  // Validate cron expression
  if (!cron.validate(schedule)) {
    throw new Error(`Invalid cron expression: ${schedule}`);
  }

  const job = cron.schedule(
    schedule,
    async () => {
      try {
        await executeScan(scanType, target);
      } catch (error) {
        console.error(`[CronScanner] Scheduled scan error:`, error.message);
      }
    },
    {
      scheduled: true,
    }
  );

  cronJobs.push({ schedule, scanType, target, job });

  console.log(
    `[CronScanner] Scheduled ${scanType} scan for ${target} at: ${schedule}`
  );

  return job;
}

/**
 * Initialize default scans based on configuration
 */
function initializeScans(config) {
  if (!config.securityScans?.enabled) {
    console.log("[CronScanner] Security scans disabled");
    return;
  }

  const { target, schedules } = config.securityScans;

  if (!target) {
    console.warn("[CronScanner] No target specified for security scans");
    return;
  }

  // Default schedules
  const defaultSchedules = {
    full: "0 2 * * *", // Daily at 2 AM
    port_scan: "0 */6 * * *", // Every 6 hours
    sql_injection: "0 4 * * *", // Daily at 4 AM
    xss: "0 5 * * *", // Daily at 5 AM
    ...schedules,
  };

  // Schedule scans
  Object.entries(defaultSchedules).forEach(([scanType, schedule]) => {
    try {
      scheduleScan(schedule, scanType, target);
    } catch (error) {
      console.error(
        `[CronScanner] Failed to schedule ${scanType}:`,
        error.message
      );
    }
  });

  console.log(`[CronScanner] Initialized ${cronJobs.length} scheduled scans`);
}

/**
 * Stop all scheduled scans
 */
function stopAllScans() {
  cronJobs.forEach((job) => job.job.stop());
  cronJobs = [];
  console.log("[CronScanner] All scheduled scans stopped");
}

/**
 * Get active scan schedules
 */
function getActiveScans() {
  return cronJobs.map((job) => ({
    schedule: job.schedule,
    scanType: job.scanType,
    target: job.target,
  }));
}

module.exports = {
  executeScan,
  scheduleScan,
  initializeScans,
  stopAllScans,
  getActiveScans,
};
