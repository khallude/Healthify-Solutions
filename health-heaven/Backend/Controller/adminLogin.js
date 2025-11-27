const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required!" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Check if the admin is active
    if (admin.status !== "active") {
      return res
        .status(403)
        .json({ message: "Admin account is inactive. Contact SuperAdmin." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate OTP and set expiry (valid for 10 minutes)
    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    // Send OTP via email
    await sendEmail(
      admin.email,
      "Admin Login OTP",
      `Your OTP for login is: ${otp}`
    );

    res.status(200).json({
      message: "OTP sent to your email. Please verify to complete login.",
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
