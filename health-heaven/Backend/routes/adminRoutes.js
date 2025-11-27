const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  verifyAdminOTP,
  createAdmin,
  deleteAdmin,
  getAllAdmins, // ✅ Import getAllAdmins
  getAdminProfile,
  sendMailToDoctor,
  sendCustomEmail,
  doctorDetail
} = require("../Controller/adaminController"); // ✅ Fixed typo in file name

const {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  toggleUserBan,
  getAllDoctors, // ✅ Import getAllDoctors
  getAllUsers, // ✅ Import getAllUsers
  getAllAppointments, // ✅ Import getAllAppointments
   deleteDoctor,  // ✅ Import deleteDoctor
   getRejectedDoctors, // ✅ Import getRejectedDoctors
   getPendingAppointments, // ✅ Import getPendingAppointments
   bannedUsers, // ✅ Import bannedUsers
   deleteUser, // ✅ Import unbanUsers
   userDetail
} = require("../Controller/adminManagment");

const verifyToken = require("../middlewares/authMiddleware");
const { verifyRole } = require("../middlewares/roleMiddleware");

// ✅ Admin login and OTP verification
router.post("/login", loginAdmin);
router.post("/verify-otp", verifyToken, verifyAdminOTP);

// ✅ SuperAdmin can create new Admins
router.post(
  "/create-admin",
  verifyToken,
  verifyRole(["SuperAdmin"]),
  createAdmin
);

// ✅ Admins can view their own profile
router.get("/profile", verifyToken, verifyRole(["SuperAdmin", "Admin"]), getAdminProfile);


// ✅ SuperAdmin can view all admins
router.get(
  "/get-all-admins",
  verifyToken,
  verifyRole(["SuperAdmin"]),
  getAllAdmins
);

// ✅ SuperAdmin can delete an admin
router.delete(
  "/delete-admin/:adminId",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  deleteAdmin
);

// ✅ Allow both SuperAdmin and Admin to view pending doctors
router.get(
  "/pending-doctors",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  getPendingDoctors
);
// ✅ Allow both SuperAdmin and Admin to view banned doctors
router.delete(
  "/delete-doctor/:id",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  deleteDoctor
);

router.get(
  "/banned-users/",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  bannedUsers
);

// router.put(
//   "/unban-user/:id",
//   verifyToken,
//   verifyRole(["SuperAdmin", "Admin"]),
//   unbanUsers
// );

router.get(
  "/doctor-detail/:id", // Use :id as a route parameter
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  doctorDetail
);

router.delete(
  "/delete-user/:id", // Use :id as a route parameter
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  deleteUser
);

router.get(
  "/user-detail/:id",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  userDetail
);

router.post(
  "/usr-email",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  sendCustomEmail
);




router.get(
  "/pending-appointments",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  getPendingAppointments
);

router.get(
  "/rejected-doctors",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  getRejectedDoctors
);

// Direcr Mail from Admin to doctor
router.post("/send-mail", sendMailToDoctor);

// ✅ Only SuperAdmin can approve/reject doctors
router.post(
  "/approve-doctor/:id",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  approveDoctor
);

router.post(
  "/reject-doctor/:id",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  rejectDoctor
);

// ✅ Only SuperAdmin can ban/unban users
router.put(
  "/toggle-user-ban/:id",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  toggleUserBan
);

// ✅ SuperAdmin or Admin can get all doctors
router.get(
  "/all-doctors",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  getAllDoctors
);

// ✅ SuperAdmin or Admin can get all users
router.get(
  "/all-users",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  getAllUsers
);

// ✅ SuperAdmin or Admin can get all appointments
router.get(
  "/all-appointments",
  verifyToken,
  verifyRole(["SuperAdmin", "Admin"]),
  getAllAppointments
);

module.exports = router;
