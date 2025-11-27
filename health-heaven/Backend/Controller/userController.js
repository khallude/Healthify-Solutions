const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Newuser = require("../models/Newuser");
const sendEmail = require("../utils/sendEmail");
const welcomeEmail = require("../utils/welcomeTemplate");
// ✅ Register User
exports.registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      age,
      bloodType,
      phone,
      address,
      allergies,
      chronicConditions,
      password,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await Newuser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the profile image URL if uploaded
    const profileImage = req.file
      ? `/uploads/users/${req.file.filename}`
      : null;

    // Create a new user with default status "Active"
    const newUser = new Newuser({
      fullName,
      email,
      age,
      bloodType,
      phone,
      address,
      allergies,
      chronicConditions,
      profileImage,
      password: hashedPassword,
      status: "Active", // Default status
    });

    // Save user to the database
    await newUser.save();
    const welcomeMessage = welcomeEmail(fullName);


    // ✅ Send the welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to Our Platform!",
      text: welcomeMessage.text,
      html: welcomeMessage.htmlContent,
    });
   

    // Return response with user details
    res.status(201).json({
      message: "User created successfully.",
      user: {
        userId: newUser.userId,
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profileImage: newUser.profileImage,
        status: newUser.status, // Include user status
      },
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(500)
      .json({ message: "Error creating user.", error: error.message });
  }
};

// ✅ Login User with Status Check
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await Newuser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // ✅ Check user status before allowing login
    if (user.status === "Banned") {
      return res
        .status(403)
        .json({
          message:
            "Your account has been banned. Contact support for assistance.",
        });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: "User" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        status: user.status, // Include user status in login response
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get User Profile (Including Status)
exports.getUserProfile = async (req, res) => {
  try {
    // Validate if userId is present in the decoded token
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in again." });
    }

    // Fetch user data from the database
    const user = await Newuser.findById(req.user.userId).select(
      "fullName email age bloodType phone address allergies chronicConditions profileImage status"
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with user data
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      bloodType: user.bloodType,
      phone: user.phone,
      address: user.address,
      allergies: user.allergies,
      chronicConditions: user.chronicConditions,
      profileImage: user.profileImage,
      status: user.status, // Include status in response
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving user data.", error: error.message });
  }
};

// ✅ Update User Status (Admin Only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    // Validate input
    if (!["Active", "Banned"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Allowed values: Active, Banned." });
    }

    // Find and update the user status
    const updatedUser = await Newuser.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: `User status updated to ${status}.`,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        status: updatedUser.status, // Return updated status
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error.message);
    res
      .status(500)
      .json({ message: "Error updating user status.", error: error.message });
  }
};
