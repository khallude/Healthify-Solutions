// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   // Extract token from the 'Authorization' header and remove 'Bearer ' prefix if present
//   const token = req.headers['authorization']?.split(' ')[1];

//   if (!token) return res.status(403).json({ message: 'No token provided' });

//   // Verify the token
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

//     // Attach userId (and possibly other data like username) to the request object
//     req.userId = decoded.userId; // Assumes 'userId' is in the token payload
//     req.username = decoded.username; // If you want to attach the username as well
//     next(); // Proceed to the next middleware or route handler
//   });
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    console.log("Decoded Token:", decoded); // 🛑 Debugging log

    // Ensure the token contains adminId
    if (!decoded.adminId) {
      return res.status(400).json({ message: "Invalid token payload: adminId missing" });
    }

    req.user = {
      adminId: decoded.adminId, // ✅ Corrected to match your OTP function
      username: decoded.username,
    };

    next();
  });
};

module.exports = authMiddleware;



// const adminAuthMiddleware = (req, res, next) => {
//   // Extract token from the Authorization header
//   const token = req.headers["authorization"]?.split(" ")[1];

//   if (!token) {
//     return res.status(403).json({ message: "No token provided" });
//   }

//   // Verify the token
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }

//     // ✅ Ensure the token contains adminId and role
//     if (!decoded.adminId || decoded.role !== "admin") {
//       return res.status(403).json({ message: "Access denied! Admins only." });
//     }

//     // ✅ Attach `adminId` and `role` to the request object
//     req.user = {
//       adminId: decoded.adminId,
//       role: decoded.role,
//     };

//     next(); // Proceed to the next middleware/controller
//   });
// };

// ✅ Correct export of both middlewares
