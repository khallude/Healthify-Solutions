const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming User model stores admin info
      required: true,
    },
    otp: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6, // Assuming OTP is a 6-digit number
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "10m", // OTP expires after 10 minutes, adjust as needed
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);
