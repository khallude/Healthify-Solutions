import { useEffect, useState } from "react";
import { Calendar, CheckCircle } from "lucide-react";

const getColorClass = (color) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return colors[color] || colors.blue;
};

const workingDaysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeOptions = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const lunchOptions = ["12:00 PM - 12:30 PM", "01:00 PM - 01:30 PM", "02:00 PM - 02:30 PM"];

export default function Dashboard() {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [latestBooking, setLatestBooking] = useState(null); // ✅ Keep Latest Booking
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  const [workingDay, setWorkingDay] = useState(""); // ✅ Single Dropdown
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lunchBreak, setLunchBreak] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated. Please log in.");

        // ✅ Fetch Availability
        const availabilityRes = await fetch("http://localhost:5000/api/doctor/availability", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!availabilityRes.ok) throw new Error("Failed to fetch availability.");
        const availabilityData = await availabilityRes.json();
        setAvailability(availabilityData);

        setWorkingDay(availabilityData.workingDays?.[0] || ""); // ✅ Single Selection
        setStartTime(availabilityData.workingHours?.startTime || "");
        setEndTime(availabilityData.workingHours?.endTime || "");
        setLunchBreak(availabilityData.lunchBreak || "");

        // ✅ Fetch Latest Booking
        const bookingRes = await fetch("http://localhost:5000/api/doctor/latest-booking", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!bookingRes.ok) throw new Error("Failed to fetch latest booking.");
        const bookingData = await bookingRes.json();
        setLatestBooking(bookingData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated. Please log in.");

      const response = await fetch("http://localhost:5000/api/doctor/update-availability", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workingDays: [workingDay], startTime, endTime, lunchBreak }), // ✅ Send as array
      });

      if (!response.ok) throw new Error("Failed to update availability.");

      alert("Availability updated successfully!");
    } catch (error) {
      console.error("Error updating availability:", error);
      alert(error.message);
    }
  };

  const stats = [
    {
      title: "Total Appointments",
      value: loading ? "Loading..." : totalAppointments,
      trend: "+12%",
      color: "purple",
      icon: "Calendar",
    },
    {
      title: "Appointments Completed",
      value: loading ? "Loading..." : completedAppointments,
      trend: "+8%",
      color: "purple",
      icon: "CheckCircle",
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Doctor</h1>
        <p className="text-gray-600">Here's what's happening with your patients today.</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${getColorClass(stat.color)}`}>
                {stat.icon === "Calendar" && <Calendar className="h-6 w-6" />}
                {stat.icon === "CheckCircle" && <CheckCircle className="h-6 w-6" />}
              </div>
              <span className="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* LATEST BOOKING */}
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Booking</h3>
        {latestBooking ? (
          <div>
            <p><strong>Patient:</strong> {latestBooking.patientName}</p>
            <p><strong>Date:</strong> {latestBooking.date}</p>
            <p><strong>Time:</strong> {latestBooking.time}</p>
          </div>
        ) : (
          <p className="text-gray-500">No recent bookings available.</p>
        )}
      </div>

      {/* AVAILABILITY SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Availability</h3>

        <label className="block text-gray-700 font-medium">Working Day</label>
        <select
          className="w-full p-2 border rounded-md"
          value={workingDay}
          onChange={(e) => setWorkingDay(e.target.value)}
        >
          <option value="">Select a Day</option>
          {workingDaysOptions.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <label className="block mt-4 text-gray-700 font-medium">Working Hours</label>
        <div className="flex gap-2">
          <select className="p-2 border rounded-md" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
            <option value="">Start Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select className="p-2 border rounded-md" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
            <option value="">End Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleUpdateAvailability}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Update Availability
        </button>
      </div>
    </>
  );
}
