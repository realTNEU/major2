const mongoose = require("mongoose");

const RequestLogSchema = new mongoose.Schema({
  method: String,
  path: String,
  ip: String,
  statusCode: Number,
  duration: Number,
  userAgent: String,
  suspicious: Boolean,
  flags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RequestLog", RequestLogSchema);
