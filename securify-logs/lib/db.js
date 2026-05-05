const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  method: String,
  url: String,
  route: String,
  headers: mongoose.Schema.Types.Mixed,
  body: mongoose.Schema.Types.Mixed,
  ip: String,
  statusCode: Number,
  responseTime: Number,
  userAgent: String,
  flags: [String]
});

const Log = mongoose.model('Log', logSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password before saving
adminSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

adminSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

async function connectDB(mongoUrl) {
  if (!mongoUrl) {
    throw new Error("mongoUrl is required in configuration to store logs.");
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log('[securify-logs] Connected to MongoDB');
    
    // Create default admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({ username: 'admin', password: 'admin123' });
      console.log('[securify-logs] Default admin created (admin / admin123)');
    }
  } catch (error) {
    console.error('[securify-logs] MongoDB connection error:', error.message);
  }
}

module.exports = {
  Log,
  Admin,
  connectDB
};
