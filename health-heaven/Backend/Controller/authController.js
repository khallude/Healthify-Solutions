const jwt = require("jsonwebtoken");

exports.verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required!" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Validate OTP and expiration
    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(401).json({ message: "Invalid or expired OTP!" });
    }

    // Clear OTP fields after successful verification
    admin.otp = null;
    admin.otpExpiry = null;
    await admin.save();

    // Generate JWT token (valid for 7 days)
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP verified. Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
