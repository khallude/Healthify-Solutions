const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Already hashed before saving
  role: { type: String, enum: ["SuperAdmin", "Admin"], default: "Admin" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  otp: { type: String },
  otpExpiry: { type: Date },
});

module.exports = mongoose.model("Admin", adminSchema);
