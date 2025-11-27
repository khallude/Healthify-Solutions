const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Middleware to verify the JWT token
const autheMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  console.log("Authorization Header:", token); // Debugging token

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to check admin access
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Access Denied. Admins only.' });
  }
};

module.exports = { autheMiddleware, adminMiddleware };
