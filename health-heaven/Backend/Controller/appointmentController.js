const mongoose = require("mongoose");
const Appointment = require("../models/AppointmentModel");
const User = require("../models/Newuser");
const Doctor = require("../models/DdoctorModel");
const sendEmail = require("../utils/sendEmail");

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    if (appointment.user.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can't delete this appointment" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting appointment", error: error.message });
  }
};

// Get User Appointments
exports.getUserAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const appointments = await Appointment.find({
      user: req.user.userId,
    }).populate("doctor");
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// const mongoose = require("mongoose");
// const Appointment = require("../models/AppointmentModel");
// const User = require("../models/Newuser");
// const Doctor = require("../models/DdoctorModel");
// const sendEmail = require("../utils/sendEmail");

// Helper function to convert time to minutes
const toMinutes = (time) => {
  try {
    let hour, minute, period;

    // Check if the time is in 12-hour format (contains AM/PM)
    if (time.includes("AM") || time.includes("PM")) {
      const match = time.match(/(\d+):(\d+) (AM|PM)/);
      if (!match) throw new Error("Invalid 12-hour format");

      [hour, minute, period] = match.slice(1);
      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);

      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
    } else {
      // Handle 24-hour format (e.g., "14:48")
      const match = time.match(/^(\d{2}):(\d{2})$/);
      if (!match) throw new Error("Invalid 24-hour format");

      [hour, minute] = match.slice(1).map(Number);
    }

    return hour * 60 + minute;
  } catch (error) {
    console.error("Invalid time format:", time, "-", error.message);
    return null;
  }
};

// Helper function to check if a time is valid
const isValidTime = (time, start, end, lunchStart, lunchEnd) => {
  const t = toMinutes(time);
  const s = toMinutes(start);
  const e = toMinutes(end);
  const lStart = toMinutes(lunchStart);
  const lEnd = toMinutes(lunchEnd);

  if ([t, s, e, lStart, lEnd].includes(null)) return false;

  return t >= s && t < e && (t < lStart || t >= lEnd);
};

// Example test cases
console.log(toMinutes("09:00 AM")); // 540
console.log(toMinutes("05:00 PM")); // 1020
console.log(toMinutes("14:48"));    // 888
console.log(toMinutes("23:43"));    // 1423
console.log(isValidTime("14:30", "09:00 AM", "05:00 PM", "12:00 PM", "01:00 PM")); // true
console.log(isValidTime("12:30", "09:00 AM", "05:00 PM", "12:00 PM", "01:00 PM")); // false

const moment = require("moment");

// Book an Appointment
exports.bookAppointment = async (req, res) => {
  try {
    console.log("Received appointment request:", req.body);

    const { doctorId, date, time, notes } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const doctor = await Doctor.findById(doctorId);
    const user = await User.findById(req.user.userId);

    if (!doctor) return res.status(400).json({ message: "Doctor not found." });
    if (!user) return res.status(400).json({ message: "User not found." });
    if (doctor.status !== "Approved") return res.status(400).json({ message: "Doctor is not available." });

    if (!doctor.workingHours) {
      return res.status(400).json({ message: "Doctor working hours not set." });
    }

    const { startTime, endTime, lunchBreak } = doctor.workingHours;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Doctor's working hours are incomplete." });
    }

    let lunchStart = null, lunchEnd = null;
    if (lunchBreak) {
      const parts = lunchBreak.split("-");
      if (parts.length === 2) {
        [lunchStart, lunchEnd] = parts;
      } else {
        return res.status(400).json({ message: "Invalid lunch break format." });
      }
    }

    console.log(doctor.workingHours);
    if (!isValidTime(time, startTime, endTime, lunchStart ?? "00:00", lunchEnd ?? "00:00")) {
      return res.status(400).json({ message: "Invalid appointment time." });
    }

    // ✅ Check if the slot is already booked
    const existingAppointment = await Appointment.findOne({ doctor: doctorId, date, time });
    if (existingAppointment) {
      // Get the next 4 available slots
      const availableSlots = await getNextAvailableSlots(doctorId, date, time);

      return res.status(400).json({
        message: "This time slot is already booked.",
        availableSlots: availableSlots.length > 0 ? availableSlots : ["No available slots today."],
      });
    }

    const appointment = new Appointment({
      user: req.user.userId,
      doctor: doctorId,
      date,
      time,
      notes,
      status: "Pending",
    });

    await appointment.save();
    console.log("Appointment created:", appointment);

    try {
      await sendEmail({
        to: user.email,
        subject: "Appointment Pending",
        text: `Your appointment with Dr. ${doctor.fullName} on ${date} at ${time} is pending approval.`,
      });
      await sendEmail({
        to: doctor.email,
        subject: "New Appointment Request",
        text: `You have a new appointment request from ${user.fullName} on ${date} at ${time}.`,
      });
      await sendEmail({
        to: "shealthify@gmail.com",
        subject: "New Appointment Request",
        text: `${user.fullName} has booked an appointment with Dr. ${doctor.fullName} on ${date} at ${time}.`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }

    res.status(201).json({ message: "Appointment booked! Waiting for doctor approval." });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
};

/**
 * Function to get the next 4 available slots
 */
const getNextAvailableSlots = async (doctorId, date, bookedTime) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.workingHours) return [];

  const { startTime, endTime } = doctor.workingHours;

  let availableSlots = [];
  let currentSlot = moment(startTime, "hh:mm A");
  const endSlot = moment(endTime, "hh:mm A");

  while (currentSlot.isBefore(endSlot)) {
    const formattedSlot = currentSlot.format("h:mm A");
    const existingAppointment = await Appointment.findOne({ doctor: doctorId, date, time: formattedSlot });

    if (!existingAppointment) {
      availableSlots.push(formattedSlot);
    }

    currentSlot.add(30, "minutes");
  }

  // Get the next 4 available slots after the booked time
  return availableSlots.filter((slot) => moment(slot, "h:mm A").isAfter(moment(bookedTime, "h:mm A"))).slice(0, 4);
};


exports.editAppointment = async (req, res) => {
  try {
    const { date, time, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized: Access denied" });
    }

    const doctor = await Doctor.findById(appointment.doctor);
    if (!doctor) return res.status(400).json({ message: "Doctor not found." });

    // Ensure working hours are set
    if (!doctor.workingHours || !doctor.workingHours.startTime || !doctor.workingHours.endTime || !doctor.workingHours.lunchBreak) {
      return res.status(400).json({ message: "Doctor's working hours are not properly set." });
    }

    const { startTime, endTime, lunchBreak } = doctor.workingHours;
    const [lunchStart, lunchEnd] = lunchBreak.split("-");
    
    if (!lunchStart || !lunchEnd) {
      return res.status(400).json({ message: "Invalid lunch break format." });
    }

    // Validate new time slot
    if (time && !isValidTime(time, startTime, endTime, lunchStart, lunchEnd)) {
      return res.status(400).json({ message: "Invalid appointment time." });
    }

    // Check if another appointment exists at the new time
    if (time) {
      const existingAppointment = await Appointment.findOne({ doctor: appointment.doctor, date, time });
      if (existingAppointment && existingAppointment._id.toString() !== appointment._id.toString()) {
        return res.status(400).json({ message: "Time slot already booked." });
      }
    }

    // Update the appointment
    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.notes = notes || appointment.notes;
    await appointment.save();

    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment", error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Doctor ID and date are required" });
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ message: "Cannot book appointments for past dates" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== "Approved") {
      return res.status(400).json({ message: "Doctor not available" });
    }

    if (!doctor.workingHours || !doctor.workingHours.startTime || !doctor.workingHours.endTime) {
      return res.status(400).json({ message: "Doctor's working hours are incomplete" });
    }

    const { startTime, endTime } = doctor.workingHours;
    const lunchBreak = doctor.lunchBreak || "12:30-1:00"; // Default lunch break

    const [lunchStart, lunchEnd] = lunchBreak.split("-");

    // Generate available time slots (excluding lunch break)
    let availableSlots = generateTimeSlots(startTime, endTime, lunchStart, lunchEnd);

    // Fetch booked appointments
    const bookedAppointments = await Appointment.find({ doctor: doctorId, date }).select("time");
    const bookedTimes = bookedAppointments.map(appt => formatTime(new Date(appt.time)));

    // Remove booked slots
    availableSlots = availableSlots.filter(slot => !bookedTimes.includes(slot));

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("❌ Error fetching available slots:", error);
    res.status(500).json({ message: "Error fetching available slots", error: error.message });
  }
};

// 🕒 Converts 12-hour format (AM/PM) to minutes since midnight
function convertToMinutes(time) {
  const [hour, minute] = time.match(/\d+/g).map(Number);
  const period = time.includes("PM") ? "PM" : "AM";

  let militaryHour = hour;
  if (period === "PM" && hour !== 12) militaryHour += 12;
  if (period === "AM" && hour === 12) militaryHour = 0;

  return militaryHour * 60 + minute; // Return total minutes
}

// ⏳ Generates available time slots (excluding lunch break)
function generateTimeSlots(startTime, endTime, lunchStart, lunchEnd) {
  const timeSlots = [];
  let start = convertToMinutes(startTime);
  let end = convertToMinutes(endTime);
  let lunchBreakStart = convertToMinutes(lunchStart);
  let lunchBreakEnd = convertToMinutes(lunchEnd);

  while (start < end) {
    if (start >= lunchBreakStart && start < lunchBreakEnd) {
      start = lunchBreakEnd; // Skip lunch break
    } else {
      timeSlots.push(formatTime(start));
      start += 30; // Add 30 minutes
    }
  }
  return timeSlots;
}

// 🕒 Formats minutes since midnight to 12-hour format with AM/PM
function formatTime(minutes) {
  let hours = Math.floor(minutes / 60);
  let mins = minutes % 60;
  let period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 0 to 12
  mins = mins.toString().padStart(2, "0");

  return `${hours}:${mins} ${period}`;
}
