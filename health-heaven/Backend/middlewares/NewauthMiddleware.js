const jwt = require("jsonwebtoken");
const User = require("../models/Newuser");

const NewauthMiddleware = async (req, res, next) => {
  try {
    // ✅ Extract the token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch the user from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure the user is active
    if (user.status.toLowerCase() !== "active") { 
      return res.status(403).json({ message: `Access denied. User is ${user.status}` });
    }
    

    // ✅ Attach the user to the request object
    req.user = user;

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("User authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = NewauthMiddleware;
