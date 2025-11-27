import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isStatusBoxOpen, setIsStatusBoxOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated. Please log in.");

        const response = await fetch(
          "http://localhost:5000/api/appointments/doctor-appointments",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch appointments.");

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        alert(error.message);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-blue-600 bg-blue-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleStatusBox = (appointment) => {
    setSelectedAppointment(appointment);
    setIsStatusBoxOpen(true);
  };

  const closeStatusBox = () => {
    setSelectedAppointment(null);
    setIsStatusBoxOpen(false);
  };

  const updateStatus = async (newStatus) => {
    if (!selectedAppointment) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");

      const response = await fetch(
        `http://localhost:5000/api/doctor/appointment/${selectedAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status.");

      setAppointments((prev) =>
        prev.map((app) =>
          app._id === selectedAppointment._id
            ? { ...app, status: newStatus }
            : app
        )
      );
      closeStatusBox();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Appointments</h2>
          <p className="text-sm text-gray-500">Manage your appointments efficiently</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-gray-600 text-sm leading-normal">
              <th className="px-6 py-3 text-left font-semibold uppercase">Patient</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Notes</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Date & Time</th>
              <th className="px-4 py-3 text-left font-semibold uppercase w-24">Status</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 flex items-center">
                    {appointment.user ? (
                      <>
                        <img
                          src={appointment.user.image}
                          alt="Patient"
                          className="w-10 h-10 rounded-full mr-3 border border-gray-300"
                        />
                        <span className="font-medium">{appointment.user.fullName || "Unknown"}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">No Patient Info</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{appointment.notes || "-"}</td>
                  <td className="px-6 py-4">
                    {new Date(appointment.date).toLocaleString()}
                  </td>
                  <td className={`px-4 py-2 rounded-lg text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusBox(appointment)}
                      className="text-gray-500 hover:text-gray-700 transition"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isStatusBoxOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Update Status</h3>
            <div className="space-y-2">
              <button
                onClick={() => updateStatus("Approved")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus("Rejected")}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                Reject
              </button>
              <button
                onClick={closeStatusBox}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
