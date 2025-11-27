const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Newuser = require('../models/Newuser');

const router = express.Router();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error('Error: JWT_SECRET is not defined in environment variables.');
    process.exit(1); // Exit the application
}

// Environment variables
const { JWT_SECRET } = process.env;

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await Newuser.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' }); // Avoid revealing which field failed
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' }); // Same message for security
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response with token
        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        console.error('Login Error:', err); // Log error details for debugging
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
