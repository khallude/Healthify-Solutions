const express = require("express");
const router = express.Router();
const { adminLogin, verifyAdminOTP } = require("../Controller/authController");

// ✅ Admin Login (Step 1: Request OTP)
router.post("/admin/login", adminLogin);

// ✅ Admin OTP Verification (Step 2: Verify OTP & Get JWT)
router.post("/admin/verify-otp", verifyAdminOTP);

module.exports = router;
