const Doctor = require("../models/DdoctorModel");
const User = require("../models/Newuser");
const Appointment = require("../models/AppointmentModel"); 
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose")
// ✅ Get All Pending Doctors
exports.getPendingDoctors = async (req, res) => {
  try {
    console.log("Fetching pending doctors...");
    const pendingDoctors = await Doctor.find({ status: "Pending" });

    if (pendingDoctors.length === 0) {
      return res.status(404).json({ message: "No pending doctors found." });
    }

    res.status(200).json(pendingDoctors);
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Approve Doctor
exports.approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role; // Assuming role is attached to req.user

    console.log(`Doctor approval requested by ${userRole} for ID:`, id);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID format." });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.status === "Approved") {
      return res.status(400).json({ message: "Doctor is already approved." });
    }

    doctor.status = "Approved";
    await doctor.save();

    await sendEmail(
      doctor.email,
      "Account Approved",
      "Your account has been approved!"
    );

    res.status(200).json({ message: `Doctor approved successfully by ${userRole}.` });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Reject Doctor
exports.rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Rejecting doctor with ID:", id);

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.status === "Rejected") {
      return res.status(400).json({ message: "Doctor is already rejected." });
    }

    doctor.status = "Rejected";
    await doctor.save();

    await sendEmail(
      doctor.email,
      "Application Rejected",
      "Your application has been rejected. Please contact support for further information."
    );

    res.status(200).json({ message: "Doctor rejected successfully." });
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Ban/Unban User
// ✅ Toggle user ban status (Admin or SuperAdmin only)
exports.toggleUserBan = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Ensure only Admin or SuperAdmin can toggle status
    if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    console.log("Toggling user ban status for ID:", id);

    // ✅ Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Toggle user status between "Active" and "Banned"
    user.status = user.status === "Banned" ? "Active" : "Banned";
    await user.save();

    // ✅ Send email notification
    await sendEmail(
      user.email,
      "Account Status Update",
      `Your account status has been changed to ${user.status}`
    );

    res.status(200).json({
      message: `User successfully ${user.status === "Banned" ? "banned" : "unbanned"}.`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error toggling user ban status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password"); // Exclude password field if stored
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password field for security
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "fullName") // Get only the user's name
      .populate("doctor", "fullName") // Get only the doctor's name
      .select("appointmentId user doctor notes date time status"); // Select only the needed fields

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get All Rejected Doctors
exports.getRejectedDoctors = async (req, res) => {
  try {
    const rejectedDoctors = await Doctor.find({ status: "Rejected" });

    if (rejectedDoctors.length === 0) {
      return res.status(404).json({ message: "No rejected doctors found." });
    }

    res.status(200).json({ doctors: rejectedDoctors });
  } catch (error) {
    console.error("Error fetching rejected doctors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get All Pending Appointments
exports.getPendingAppointments = async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({ status: "Pending" });

    if (pendingAppointments.length === 0) {
      return res.status(404).json({ message: "No pending appointments found." });
    }

    res.status(200).json({ appointments: pendingAppointments });
  } catch (error) {
    console.error("Error fetching pending appointments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get All Banned Users
exports.bannedUsers = async (req, res) => {
  try {
    const bannedUsers = await User.find({ status: "Banned" });

    if (bannedUsers.length === 0) {
      return res.status(404).json({ message: "No banned users found." });
    }

    res.status(200).json({ users: bannedUsers });
  } catch (error) {
    console.error("Error fetching banned users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params; // Doctor ID from the request params

    console.log("Deleting doctor with ID:", id);

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Delete doctor from database
    await Doctor.findByIdAndDelete(id);

    // Send ban notification email
    await sendEmail(
      doctor.email,
      "Account Banned",
      "Your account has been permanently removed due to a breach of regulations. If you believe this is a mistake, contact support."
    );

    res.status(200).json({ message: "Doctor account deleted successfully." });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send deletion email before removing the user
    await sendEmail({
      to: user.email,
      subject: "Account Deleted",
      text: `Dear ${user.fullName},\n\nYour account has been permanently deleted from our system. If you have any questions, please contact support.\n\nBest regards,\nAdmin Team`,
      htmlContent: `<p>Dear <strong>${user.fullName}</strong>,</p>
                    <p>Your account has been <strong>permanently deleted</strong> from our system. If you have any questions, please contact support.</p>
                    <p>Best regards,<br>Admin Team</p>`
    });

    // Delete user after sending email
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully and notified via email." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ✅ Get user details by ID
exports.userDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching user details for ID:", id);

    const user = await User.findById(id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
