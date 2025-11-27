import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Mail,
  Pencil,
  X,
  Loader2,
  FileText,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const AppointmentScheduler = () => {
  const [appointmentData, setAppointmentData] = useState({
    doctorName: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    axios
      .get("http://localhost:5000/api/doctor/approved-doctors")
      .then((response) => {
        console.log("Fetched Doctors:", response.data); // ✅ Debugging log
        setDoctors(response.data);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err.response?.data || err); // ✅ Log errors properly
      });

    axios
      .get("http://localhost:5000/api/appointments/my-appointments", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Include Authorization token
      })
      .then((response) => {
        console.log("Fetched Appointments:", response.data);

        // ✅ Debugging log
        setAppointments(response.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching appointments:",
          err.response?.data || err
        );
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => {
      const newData = { ...prev, [name]: value };

      // If selecting a doctor, also update the doctor's image
      if (name === "doctorName") {
        const selectedDoctor = doctors.find((d) => d.fullName === value); // Fix here
        if (selectedDoctor) {
          newData.doctorImage = selectedDoctor.profilePictureUrl;
        }
      }

      return newData;
    });
  };

  const validateForm = (isEditMode = false) => {
    const errors = {};

    // Make doctorName and email required only for new appointments
    if (!isEditMode) {
      if (!appointmentData.doctorName) {
        errors.doctorName = "Doctor name is required";
      }
      if (!appointmentData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(appointmentData.email)) {
        errors.email = "Email address is invalid";
      }
    } else {
      // If in edit mode, validate email format only if it's provided
      if (
        appointmentData.email &&
        !/\S+@\S+\.\S+/.test(appointmentData.email)
      ) {
        errors.email = "Email address is invalid";
      }
    }

    if (!appointmentData.date) errors.date = "Appointment date is required";
    if (!appointmentData.time) errors.time = "Appointment time is required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    // 🔥 Find doctor ID based on selected doctor name
    const selectedDoctor = doctors.find(
      (doctor) => doctor.fullName === appointmentData.doctorName
    );

    if (!selectedDoctor) {
      setError("Selected doctor not found.");
      setLoading(false);
      return;
    }

    console.log("📤 Sending appointment data:", {
      doctorId: selectedDoctor._id, // 🔥 Correct doctor ID
      email: appointmentData.email,
      date: appointmentData.date,
      time: appointmentData.time,
      notes: appointmentData.notes,
    });

    try {
      const token = localStorage.getItem("token"); // ✅ Ensure token exists
      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId: selectedDoctor._id, // 🔥 Send doctor ID instead of name
          email: appointmentData.email,
          date: appointmentData.date,
          time: appointmentData.time,
          notes: appointmentData.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAppointments([...appointments, response.data]);
      setSuccess("Appointment scheduled successfully!");

      // Reset form
      setAppointmentData({
        doctorName: "",
        email: "",
        date: "",
        time: "",
        notes: "",
      });

      setFormErrors({});
    } catch (err) {
      console.error("🚨 Error Response:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Failed to schedule appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!appointmentId) {
      console.error("No appointment ID provided");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not authenticated");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/appointments/delete/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAppointments((prev) =>
          prev.filter((appt) => appt._id !== appointmentId)
        );
        console.log("Appointment deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting appointment:", err.response?.data || err);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setAppointmentData({
      // doctorName: appointment.doctorName,
      // email: appointment.email,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(true); // Ensure validation works correctly
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Ensure token is stored
      if (!token) {
        console.error("No token found in localStorage");
        setError("Unauthorized. Please log in again.");
        return;
      }

      if (!editingAppointment?._id) {
        console.error("Invalid appointment ID:", editingAppointment);
        setError("Invalid appointment ID. Please try again.");
        return;
      }

      console.log("Sending update request for ID:", editingAppointment._id);
      console.log("Token being sent:", token);

      const response = await axios.put(
        `http://localhost:5000/api/appointments/edit/${editingAppointment._id}`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request
          },
        }
      );

      console.log("Response received:", response.data);

      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === editingAppointment._id
            ? { ...appt, ...appointmentData }
            : appt
        )
      );

      setSuccess("Appointment updated successfully!");
      setOpenEditModal(false);
      setAppointmentData({ date: "", time: "", notes: "" });
      setFormErrors({});
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      if (err.response?.status === 403) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError("Failed to update appointment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const DoctorOption = ({ doctor }) => (
    <div className="flex items-center gap-4 px-3 py-2 border rounded-lg shadow-md bg-white">
      <img
        src={doctor.profilePictureUrl || "https://via.placeholder.com/120"}
        alt={doctor.fullName}
        className="w-12 h-12 rounded-full object-cover border"
      />
      <div>
        <div className="text-base font-semibold text-gray-800">
          {doctor.fullName}
        </div>
        <div className="text-sm text-gray-500">{doctor.specialty}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Schedule an Appointment
          </h1>
          <p className="mt-2 text-gray-600">
            Book, modify, or cancel your medical appointments
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <p>{success}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Doctor
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  name="doctorName"
                  value={appointmentData.doctorName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formErrors.doctorName ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white`}
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor.fullName}>
                      {doctor.fullName} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.doctorName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.doctorName}
                </p>
              )}
              {appointmentData.doctorName && (
                <div className="mt-2">
                  {doctors.map(
                    (doctor) =>
                      doctor.name === appointmentData.doctorName && (
                        <DoctorOption key={doctor._id} doctor={doctor} />
                      )
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={appointmentData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter your email"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  name="date"
                  value={appointmentData.date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formErrors.date ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
              </div>
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="time"
                  name="time"
                  value={appointmentData.time}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formErrors.time ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
              </div>
              {formErrors.time && (
                <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <textarea
                  name="notes"
                  value={appointmentData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Any special requirements or conditions..."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="h-5 w-5" />
                Schedule Appointment
              </>
            )}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Your Appointments
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No appointments scheduled.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const date = new Date(appointment.date);
                const formattedDate = date.toLocaleDateString("en-US");
                const formattedTime = appointment.time;

                return (
                  <div
                    key={appointment._id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={
                        appointment.doctor?.profilePictureUrl
                          ? appointment.doctor.profilePictureUrl
                          : "https://via.placeholder.com/60x60"
                      }
                      alt={appointment.doctor?.fullName || "Doctor Profile"}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.doctor?.fullName || "Unknown Doctor"}
                      </h3>
                      <div className="mt-1 space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formattedDate}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {formattedTime}
                        </p>
                        {appointment.notes && (
                          <p className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {appointment.notes}
                          </p>
                        )}
                        <p
                          className={`inline-block  items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold 
  ${appointment.status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""} 
  ${appointment.status === "Approved" ? "bg-green-100 text-green-700" : ""} 
  ${appointment.status === "Rejected" ? "bg-red-100 text-red-700" : ""} 
  ${appointment.status === "Completed" ? "bg-blue-100 text-blue-700" : ""}
`}
                        >
                          {appointment.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {openEditModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Edit Appointment
                </h2>
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        name="date"
                        value={appointmentData.date}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          formErrors.date ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.date}
                      </p>
                    )}
                  </div>

                  {/* Time Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="time"
                        name="time"
                        value={appointmentData.time}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          formErrors.time ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {formErrors.time && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.time}
                      </p>
                    )}
                  </div>

                  {/* Notes Input */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                      <textarea
                        name="notes"
                        value={appointmentData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Any special requirements or conditions..."
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setOpenEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Pencil className="h-5 w-5" />
                        Update Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
