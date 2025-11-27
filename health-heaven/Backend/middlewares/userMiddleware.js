const jwt = require("jsonwebtoken");

const userAuthMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token payload: userId missing" });
    }

    req.user = { userId: decoded.userId, username: decoded.username, role: "user" };

    next();
  });
};

module.exports = userAuthMiddleware;
