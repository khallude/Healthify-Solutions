const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (userId, role, expiresIn = '1h') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.sign(
    {
      userId,
      role, // Include additional claims like role
    },
    process.env.JWT_SECRET,
    {
      expiresIn,
      audience: 'healthify-app',
      issuer: 'healthify-server',
    }
  );
};

// Verify Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    return null; // Return null to indicate invalid token
  }
};

module.exports = { generateToken, verifyToken };
