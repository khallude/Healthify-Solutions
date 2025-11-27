const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const { isDoctor } = require("../middlewares/roleMiddleware");
const {
  registerDoctor,
  loginDoctor,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllApprovedDoctors,
  updateAvailability,
  getDoctorProfile
} = require("../Controller/Ddcontroller"); // ✅ Ensure all functions are imported

const { upload } = require("../middlewares/multer");
const doctorMiddleware = require("../middlewares/doctorMiddleware");

// ✅ Doctor Registration Route
router.post(
  "/register-doctor",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "govID", maxCount: 1 },
  ]),
  registerDoctor
);

// ✅ Doctor Login Route
router.post("/login", loginDoctor);
router.get("/approved-doctors", getAllApprovedDoctors);
// ✅ Update Doctor Profile Route
router.put("/profile", verifyToken, isDoctor, updateDoctorProfile);

router.get("/get-profile" , getDoctorProfile);

// ✅ Get Doctor's Appointments Route
router.get("/appointments", verifyToken, isDoctor, getDoctorAppointments);

// 

router.put("/update-availability", verifyToken, isDoctor, updateAvailability);



// ✅ Update Appointment Status Route
router.put("/appointment/:id", doctorMiddleware, updateAppointmentStatus);

module.exports = router;
