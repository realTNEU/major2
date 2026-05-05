# Securify-Logs Toolkit

A complete, self-contained Node.js cybersecurity log analysis toolkit. It intercepts HTTP requests on a host Express application, analyzes them in real-time for vulnerabilities and suspicious patterns, and projects the findings to a real-time React dashboard with an integrated Gemini AI threat analyst.

## Project Structure

This workspace is divided into interconnected applications:

1. **`securify-logs/`** - The core Node.js middleware library, real-time security dashboard, and Gemini AI integration.
2. **`dummy-server/`** (Phase 1-3) - A basic mock Express server used for initial testing.
3. **`traffic-gen/`** (Phase 1-3) - A simple Node.js script that fires basic malicious traffic at the `dummy-server`.
4. **`dummy-ecommerce/`** (Phase 4) - A realistic, fully-featured Express e-commerce backend built with deliberate security vulnerabilities (IDOR, XSS, PCI violations) to properly test the toolkit.
5. **`ecommerce-traffic/`** (Phase 4) - An advanced traffic orchestrator that simulates a realistic blend of legitimate shoppers and 4 distinct attacker personas (Credential Stuffers, Scrapers, Injectors, Card Testers).

---

## 🚀 Quick Start Guide: Phase 4 Validation

To see the complete toolkit in action, we recommend running the **Phase 4 E-Commerce Validation Environment**.

### 1. Prerequisites & Installation

The project uses npm workspaces. You can install all dependencies from the root directory:
```bash
npm install
```

Make sure you have a local instance of MongoDB running on `mongodb://localhost:27017`.

*(Optional but Recommended)* Create a `.env` file in the `dummy-ecommerce` directory to enable the Gemini AI Threat Analyst:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Start the E-Commerce Server & Dashboard
In your first terminal, start the dummy-ecommerce server. The `securify-logs` library will automatically boot up its real-time dashboard on port `4001`.
```bash
cd dummy-ecommerce
npm start
```
*Expected Output:*
```text
[securify-logs] Gemini AI integration enabled.
[dummy-ecommerce] Server running on http://localhost:3001
[dummy-ecommerce] Securify dashboard expected on http://localhost:4001
[securify-logs] Connected to MongoDB
[securify-logs] Secure Dashboard running at http://localhost:4001
```

### 3. Launch the Advanced Traffic Orchestrator
In a second terminal, start the traffic generator to bombard the ecommerce server with realistic shopping traffic mixed with coordinated attacks.
```bash
cd ecommerce-traffic
npm start
```

### 4. Monitor the Traffic and AI Insights
1. **Real-time Dashboard**: Open your browser and navigate to [http://localhost:4001](http://localhost:4001). You will be prompted to log in (Credentials: `admin` / `admin123`).
2. **Log Explorer**: View a live-updating table of all requests, complete with bright threat badges highlighting exactly what vulnerabilities were detected (e.g., `SQL_INJECTION`, `PCI_VIOLATION`, `IDOR_ATTEMPT`).
3. **AI Insights**: Click the **Generate AI Report** button to have Google Gemini analyze the recent traffic patterns. It will identify the credential stuffing and scraping campaigns orchestrated by the traffic generator and provide mitigation strategies!

---

## 🛡️ Detected Threat Vectors

The underlying Analysis Engine (`securify-logs/lib/engine.js`) scans every request for the following threats:
- **SQL Injection**: Detects common payloads like `' OR 1=1` and `DROP TABLE`.
- **Cross-Site Scripting (XSS)**: Identifies rogue `<script>` tags and JavaScript execution attempts.
- **Path Traversal**: Flags unauthorized directory climbing (e.g., `../../etc/passwd`).
- **Shell Injection**: Detects chained commands like `; rm -rf /`.
- **PCI Violations**: Detects raw credit card numbers being transmitted in request bodies.
- **Suspicious User Agents**: Flags automated vulnerability scanners (e.g., `sqlmap`, `nikto`) and scraping tools.
- **Oversized Payloads**: Flags requests with abnormally large string bodies to prevent DoS.
