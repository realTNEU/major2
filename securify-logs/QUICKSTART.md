# SecurifyLogs - Quick Start (5 Minutes)

## Prerequisites
- Node.js v16+
- MongoDB running locally
- 5 minutes of your time ⏱️

## 1️⃣ Install Dependencies (2 min)

```bash
cd securify-logs
npm install
cd dashboard-ui && npm install && cd ..
```

## 2️⃣ Build Dashboard (1 min)

```bash
cd dashboard-ui && npm run build && cd ..
```

## 3️⃣ Create Admin Account (1 min)

```bash
node scripts/createUser.js
```

Example values:
```
Username: admin
Email: admin@example.com
Password: YourSecurePassword123
Role: admin
```

## 4️⃣ Start Application (1 min)

```bash
node example/express-app.js
```

You should see:
```
App running on: http://localhost:3000
Dashboard: http://localhost:9000
```

## 5️⃣ Login to Dashboard

1. Open browser: `http://localhost:9000`
2. Enter credentials from step 3
3. See real-time logs! 🎉

## Test It Out

```bash
# Generate some logs
curl http://localhost:3000/test
curl http://localhost:3000/test?id=<test>

# Check dashboard for logs
# Refresh page or wait 5 seconds
```

---

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed configuration
- Read [README.md](README.md) for full documentation
- Customize threat detection rules
- Deploy to your infrastructure

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB error | Start MongoDB: `mongod` |
| Port in use | Change port in example/express-app.js |
| Login fails | Run: `node scripts/createUser.js` |
| Blank dashboard | Rebuild: `cd dashboard-ui && npm run build && cd ..` |

---

**That's it! You're monitoring API security.** 🔒
