// const express = require('express');
// const { register, login, getUserDetails } = require('../Controller/Newauth');
// const NewauthMiddleware = require('../middlewares/NewauthMiddleware');


// const router = express.Router();

// // Signup Route
// router.post('/signup', register);
// // Login Route
// router.post('/login', login);
// router.get('/user',NewauthMiddleware, getUserDetails);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../Controller/Newauth");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

module.exports = router;
