// Backend/routes/protectedRoute.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// Example of a protected route
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
