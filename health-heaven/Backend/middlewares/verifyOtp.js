// middleware/verifyOtp.js
const Admin = require("../models/Admin");

const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }

    // Ensure adminId is extracted from the JWT in req.user (via verifyToken)
    const adminId = req.user.adminId;

    // Find the admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Validate OTP and expiry
    if (!admin.otp || admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP!" });
    }

    // ✅ Clear OTP after successful verification (one-time use)
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    // Attach the verified admin to the request object for later use
    req.admin = admin;

    next(); // Proceed to the next function (controller)
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyOtp;
