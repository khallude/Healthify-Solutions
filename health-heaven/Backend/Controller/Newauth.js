const User = require("../models/Newuser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const WelcomeEmail = require("../utils/test/WelcomeEmail");

// ✅ User Registration
exports.registerUser = async (req, res) => {
  try {
    const { fullName, age, bloodType, email, phone, address, password, confirmPassword, allergies, chronicConditions } = req.body;

    // ✅ Validate required fields
    if (!fullName || !age || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All required fields must be filled!" });
    }

    // ✅ Validate age
    if (isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Age must be a valid number greater than 0!" });
    }

    // ✅ Validate password strength
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, include a special character, an uppercase letter, and a number",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    // ✅ Validate email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use!" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      fullName,
      age,
      bloodType,
      email,
      phone,
      address,
      allergies,
      chronicConditions,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Generate welcome email content
    const htmlContent = WelcomeEmail(fullName);

    // ✅ Send Welcome Email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Healthify",
        text: "Registration successful!",
        html: htmlContent,
      });
      console.log(`Welcome email sent successfully to: ${email}`);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      return res.status(500).json({ message: "Account created but email delivery failed" });
    }

    res.status(201).json({ message: `Welcome, ${fullName}! Account created successfully` });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // ✅ Check if user is banned
    if (user.status === "Banned") {
      return res.status(403).json({ message: "Your account has been banned." });
    }

    // ✅ Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: user._id, role: "User" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// ✅ Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};