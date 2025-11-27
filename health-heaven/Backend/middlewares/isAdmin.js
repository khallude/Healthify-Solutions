// middlewares/isAdmin.js
const Admin = require("../models/Admin");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.adminId);
    if (!admin || (admin.role !== "Admin" && admin.role !== "SuperAdmin")) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.admin = admin; // Attach admin data to the request
    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};

module.exports = isAdmin;
