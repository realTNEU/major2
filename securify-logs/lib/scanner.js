const net = require('net');
const http = require('http');

/**
 * Pure Node.js Port Scanner (replaces external nmap dependency)
 * @param {string} target - The target to scan (default: localhost)
 * @returns {Promise<string>}
 */
async function runNodeScanner(target = 'localhost') {
  const portsToScan = [80, 443, 3000, 4000, 8080, 27017, 3306, 5432, 6379];
  let openPorts = [];

  console.log(`[securify-logs] Starting internal Node.js port scan on ${target}...`);

  const checkPort = (port) => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      
      socket.on('connect', () => {
        openPorts.push(port);
        socket.destroy();
        resolve();
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve();
      });
      
      socket.on('error', () => {
        socket.destroy();
        resolve();
      });
      
      socket.connect(port, target);
    });
  };

  await Promise.all(portsToScan.map(port => checkPort(port)));

  let resultString = `Internal Node.js Port Scan completed on ${target}:\n\nPORT     STATE\n`;
  portsToScan.forEach(port => {
    if (openPorts.includes(port)) {
      resultString += `${port}/tcp   open\n`;
    }
  });

  return resultString;
}

/**
 * Pure Node.js Vulnerability Scanner (replaces external Burp Suite)
 * Makes an HTTP request and checks for common security headers and misconfigurations.
 */
function runVulnScanner(target = 'localhost') {
  // Ensure target has http:// prefix and default port if needed
  const formattedTarget = target.startsWith('http') ? target : `http://${target}:3000`;
  
  console.log(`[securify-logs] Running internal Node.js vulnerability scan against ${formattedTarget}...`);
  return new Promise((resolve) => {
    const issues = [];
    
    // Attempt an HTTP GET request to check the server's response headers
    const req = http.get(formattedTarget, (res) => {
      const headers = res.headers;
      
      if (!headers['strict-transport-security']) {
        issues.push({ type: "Missing HSTS Header", severity: "High", path: "/" });
      }
      if (!headers['x-frame-options']) {
        issues.push({ type: "Missing X-Frame-Options", severity: "Medium", path: "/" });
      }
      if (!headers['x-content-type-options']) {
        issues.push({ type: "Missing X-Content-Type-Options", severity: "Low", path: "/" });
      }
      if (!headers['content-security-policy']) {
        issues.push({ type: "Missing Content-Security-Policy", severity: "High", path: "/" });
      }
      if (headers['x-powered-by']) {
        issues.push({ type: `Information Exposure: X-Powered-By (${headers['x-powered-by']})`, severity: "Low", path: "/" });
      }
      
      resolve({
        status: "succeeded",
        issues: issues.length > 0 ? issues : [{ type: "No basic header vulnerabilities found", severity: "Info", path: "/" }]
      });
    });

    req.on('error', (e) => {
      resolve({
        status: "failed",
        issues: [{ type: `Connection error: ${e.message}`, severity: "Critical", path: "/" }]
      });
    });
    
    req.end();
  });
}

module.exports = {
  runNmapScan: runNodeScanner,    // Exported under the old name so dashboard.js doesn't break
  triggerBurpScan: runVulnScanner // Exported under the old name
};
