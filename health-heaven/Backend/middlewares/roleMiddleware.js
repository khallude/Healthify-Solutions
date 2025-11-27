// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");
// const Ddoctor = require("../models/DdoctorModel");

// // ✅ Role Verification Middleware (Admin & Doctor)
// const verifyRole = (requiredRoles) => {
//   return async (req, res, next) => {
//     try {
//       // Ensure token exists
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res
//           .status(401)
//           .json({ message: "Unauthorized: No token provided." });
//       }

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       let user = null;

//       // ✅ Identify User (Admin or Doctor)
//       if (["SuperAdmin", "Admin"].includes(decoded.role)) {
//         user = await Admin.findById(decoded.adminId); // ✅ Use adminId consistently
//       } else if (decoded.role === "Doctor") {
//         user = await Ddoctor.findById(decoded.adminId); // Ensure doctors also use adminId
//       }

//       if (!user) {
//         return res
//           .status(404)
//           .json({ message: "My my name is Crazy boy Usama." });
//       }

//       // ✅ Check Active Status
//       if (
//         (decoded.role === "Doctor" && user.status !== "Approved") ||
//         (["SuperAdmin", "Admin"].includes(decoded.role) &&
//           user.status !== "active")
//       ) {
//         return res
//           .status(403)
//           .json({ message: "Access denied. User not active or approved." });
//       }

//       // ✅ Verify Role Authorization
//       if (!requiredRoles.includes(decoded.role)) {
//         return res
//           .status(403)
//           .json({ message: "Access denied. Insufficient permissions." });
//       }

//       // ✅ Attach User to Request Object
//       req.user = user; // Attach the verified user
//       next();
//     } catch (error) {
//       console.error("Role verification error:", error);
//       res.status(401).json({ message: "Unauthorized: Invalid token." });
//     }
//   };
// };

// // ✅ Specific Middleware for Doctors
// const isDoctor = verifyRole(["Doctor"]);

// // ✅ Specific Middleware for Admins (Including SuperAdmin)
// const isAdmin = verifyRole(["Admin", "SuperAdmin"]);

// // ✅ Specific Middleware for SuperAdmin Only
// const isSuperAdmin = verifyRole(["SuperAdmin"]);

// module.exports = { verifyRole, isDoctor, isAdmin, isSuperAdmin };


// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");
// const Ddoctor = require("../models/DdoctorModel");

// // ✅ Role Verification Middleware (Admin & Doctor)
// const verifyRole = (requiredRoles) => {
//   return async (req, res, next) => {
//     try {
//       // Ensure token exists
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res
//           .status(401)
//           .json({ message: "Unauthorized: No token provided." });
//       }

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("Decoded Token:", decoded); // Debugging log

//       let user = null;

//       // ✅ Identify User (Admin or Doctor)
//       if (["SuperAdmin", "Admin"].includes(decoded.role)) {
//         // user = await Admin.findById(decoded.adminId); 
//         user = await Admin.findById(decoded.adminId || decoded._id); // ✅ Correct field

//       } else if (decoded.role === "Doctor") {
//         user = await Ddoctor.findById(decoded.doctorId); // ✅ Ensure correct field for doctors
//       }

//       if (!user) {
//         return res.status(404).json({ message: "User not found." });
//       }

//       // ✅ Check Active Status
//       if (
//         (decoded.role === "Doctor" && user.status !== "Approved") ||
//         (["SuperAdmin", "Admin"].includes(decoded.role) &&
//           user.status.toLowerCase() !== "active")
//       ) {
//         return res
//           .status(403)
//           .json({ message: "Access denied. User not active or approved." });
//       }

//       // ✅ Verify Role Authorization
//       if (!requiredRoles.includes(decoded.role)) {
//         return res
//           .status(403)
//           .json({ message: "Access denied. Insufficient permissions." });
//       }

//       // ✅ Attach User to Request Object
//       req.user = { ...user.toObject(), role: decoded.role }; // Ensure role is carried forward
//       next();
//     } catch (error) {
//       console.error("Role verification error:", error);
//       res.status(401).json({ message: "Unauthorized: Invalid token." });
//     }
//   };
// };

// // ✅ Specific Middleware for Doctors
// const isDoctor = verifyRole(["Doctor"]);

// // ✅ Specific Middleware for Admins (Including SuperAdmin)
// const isAdmin = verifyRole(["Admin", "SuperAdmin"]);

// // ✅ Specific Middleware for SuperAdmin Only
// const isSuperAdmin = verifyRole(["SuperAdmin"]);

// module.exports = { verifyRole, isDoctor, isAdmin, isSuperAdmin };

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Ddoctor = require("../models/DdoctorModel");

// ✅ Role Verification Middleware (Admin & Doctor)
const verifyRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      // Ensure token exists
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Debugging log

      let user = null;

      // ✅ Identify User (Admin or Doctor)
      if (["SuperAdmin", "Admin"].includes(decoded.role)) {
        user = await Admin.findById(decoded.adminId || decoded._id); 
      } else if (decoded.role === "Doctor") {
        user = await Ddoctor.findById(decoded.id); // ✅ FIXED: Use "id" instead of "doctorId"
      }

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // ✅ Check Active Status
      if (
        (decoded.role === "Doctor" && user.status !== "Approved") ||
        (["SuperAdmin", "Admin"].includes(decoded.role) &&
          user.status.toLowerCase() !== "active")
      ) {
        return res.status(403).json({ message: "Access denied. User not active or approved." });
      }

      // ✅ Verify Role Authorization
      if (!requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      // ✅ Attach User to Request Object
      req.user = { ...user.toObject(), role: decoded.role };
      next();
    } catch (error) {
      console.error("Role verification error:", error);
      res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
  };
};

// ✅ Specific Middleware for Doctors
const isDoctor = verifyRole(["Doctor"]);

// ✅ Specific Middleware for Admins (Including SuperAdmin)
const isAdmin = verifyRole(["Admin", "SuperAdmin"]);

// ✅ Specific Middleware for SuperAdmin Only
const isSuperAdmin = verifyRole(["SuperAdmin"]);

module.exports = { verifyRole, isDoctor, isAdmin, isSuperAdmin };
