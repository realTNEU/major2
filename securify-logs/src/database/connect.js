const mongoose = require("mongoose");

let isConnected = false;

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("[SecurifyLogs] MongoDB connected");
  } catch (err) {
    isConnected = false;
    console.error("[SecurifyLogs] MongoDB connection failed:", err.message);
  }
}

function dbReady() {
  return isConnected;
}

module.exports = {
  connectDB,
  dbReady,
};
