const mongoose = require("mongoose");

const fraudLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FraudLog", fraudLogSchema);
