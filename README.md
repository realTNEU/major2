# Securify-Logs Toolkit

A complete, self-contained Node.js cybersecurity log analysis toolkit. It intercepts HTTP requests on a host Express application, analyzes them in real-time for vulnerabilities and suspicious patterns, and projects the findings to a real-time dashboard.

## Project Structure

This workspace is divided into three interconnected applications:

1. **`securify-logs/`** - The core Node.js middleware library and real-time dashboard server.
2. **`dummy-server/`** - A mock Express server that consumes the `securify-logs` library for testing.
3. **`traffic-gen/`** - A Node.js script that fires a mix of normal and malicious traffic at the dummy server.

---

## 🚀 Quick Start Guide

To see the toolkit in action, you'll need three separate terminal windows open in the root directory.

### 1. Install Dependencies
Install packages for the core library and the dummy server (the dummy server locally links the library).
```bash
cd securify-logs
npm install

cd ../dummy-server
npm install
```

### 2. Start the Dummy Server & Dashboard
In your first terminal, start the dummy server. The `securify-logs` library will automatically boot up its real-time dashboard alongside it.
```bash
cd dummy-server
npm start
```
*Expected Output:*
```text
[securify-logs] Dashboard running at http://localhost:4000
[dummy-server] Running on http://localhost:3000
```

### 3. Launch the Traffic Generator
In a second terminal, start the traffic generator to bombard the dummy server with SQL injections, XSS payloads, path traversals, and normal traffic.
```bash
cd traffic-gen
npm start
```

### 4. Monitor the Traffic
1. **Console Logs**: Look back at your dummy server terminal. You'll see precise, timestamped HTTP access logs outputted by the interceptor.
2. **Real-time Dashboard**: Open your browser and navigate to [http://localhost:4000](http://localhost:4000). You'll see a live-updating table of all requests, complete with bright red threat badges highlighting exactly what vulnerabilities were detected (e.g., `SQL_INJECTION`, `XSS_PAYLOAD`).

---

## 🛡️ Detected Threat Vectors

The underlying Analysis Engine (`securify-logs/lib/engine.js`) scans every request for the following threats:
- **SQL Injection**: Detects common payloads like `' OR 1=1` and `DROP TABLE`.
- **Cross-Site Scripting (XSS)**: Identifies rogue `<script>` tags and JavaScript execution attempts.
- **Path Traversal**: Flags unauthorized directory climbing (e.g., `../../etc/passwd`).
- **Shell Injection**: Detects chained commands like `; rm -rf /`.
- **Suspicious User Agents**: Flags automated vulnerability scanners (e.g., `sqlmap`, `nikto`).
- **Oversized Payloads**: Flags requests with abnormally large string bodies to prevent DoS.
