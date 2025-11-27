const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const NewauthMiddleware = require("../middlewares/NewauthMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware"); // ✅ Updated import
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserStatus,
} = require("../Controller/userController");

// ✅ Register a new user with profile image upload
router.post("/newuser", upload.single("userImage"), registerUser);

// ✅ Login user
router.post("/login", loginUser);

// ✅ Fetch authenticated user's details (Active users only)
router.get("/user", NewauthMiddleware, getUserProfile);

// ✅ Update user status (Admin or SuperAdmin only)
router.put("/status/:id", isAdmin, updateUserStatus);

module.exports = router;
