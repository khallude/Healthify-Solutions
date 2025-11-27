const jwt = require('jsonwebtoken');
const Newuser = require('../models/Newuser');  // Updated import to 'newuser.js'


const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Newuser.findById(decoded.userId);  // Updated to use Newuser model
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };
