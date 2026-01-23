#!/usr/bin/env node

/**
 * Script to create user accounts for SecurifyLogs dashboard
 * Usage: node scripts/createUser.js
 */

const mongoose = require("mongoose");
const readline = require("readline");
const User = require("../src/database/models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createUser() {
  console.log("\n=== SecurifyLogs - Create User Account ===\n");

  try {
    // Get MongoDB URI
    const mongoUri = await question(
      "Enter MongoDB URI (default: mongodb://localhost:27017/securify_demo): "
    );
    const uri = mongoUri.trim() || "mongodb://localhost:27017/securify_demo";

    // Connect to MongoDB
    console.log("\nConnecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✓ Connected to MongoDB\n");

    // Get user details
    const username = await question("Enter username (min 3 characters): ");
    if (!username || username.length < 3) {
      throw new Error("Username must be at least 3 characters");
    }

    const email = await question("Enter email: ");
    if (!email || !email.includes("@")) {
      throw new Error("Valid email required");
    }

    const password = await question("Enter password (min 6 characters): ");
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const roleInput = await question(
      "Enter role (admin/viewer, default: viewer): "
    );
    const role = roleInput.trim().toLowerCase() || "viewer";

    if (!["admin", "viewer"].includes(role)) {
      throw new Error('Role must be either "admin" or "viewer"');
    }

    // Create user
    const user = new User({
      username: username.trim(),
      email: email.trim(),
      password,
      role,
    });

    await user.save();

    console.log("\n✓ User created successfully!");
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Created: ${user.createdAt}\n`);
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    if (error.code === 11000) {
      console.error("  Username or email already exists.\n");
    }
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

createUser();
