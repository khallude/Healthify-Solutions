const Admin = require("../models/Admin");
const crypto = require("crypto"); // For generating a random OTP
const sendEmail = require("../utils/sendEmail");

// ✅ Generate a 6-digit OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const generateAndSendOTP = async (adminId, email) => {
  try {
    console.log("🔹 Starting OTP generation...");

    // ✅ Verify if adminId is valid
    const admin = await Admin.findById(adminId);
    if (!admin) {
      console.error("❌ Admin not found for ID:", adminId);
      throw new Error("Admin not found");
    }

    // ✅ Generate OTP & Expiry Time (Increase expiry as needed)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 🔹 Extend to 15 minutes
    console.log(`🔹 Generated OTP: ${otp}, Expiry: ${otpExpiry}`);

    // ✅ Store OTP in the Admin Model
    await Admin.findByIdAndUpdate(
      adminId,
      { otp, otpExpiry },
      { new: true } // Returns updated document
    );

    console.log("✅ OTP stored successfully for Admin:", admin.email);

    // ✅ Prepare Email Content
    const message = `Your OTP for login verification is: ${otp}. It will expire in 15 minutes.`;

    // ✅ Send OTP Email with Error Handling
    try {
      const emailResponse = await sendEmail({
        to: email,
        subject: "Admin OTP Verification",
        text: message,
      });

      console.log("✅ Email sent successfully:", emailResponse);
      console.log("✅ OTP sent to admin:", email);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      throw new Error("Failed to send OTP email");
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ Error generating/sending OTP:", error);
    throw new Error("Failed to generate and send OTP");
  }
};

module.exports = { generateAndSendOTP };
