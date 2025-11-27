import React, { useState, useEffect } from 'react';
import { Calendar, Search, Bell, Clock, Filter } from 'lucide-react';

interface User {
  _id: string;
  fullName: string;
}

interface Doctor {
  _id: string;
  fullName: string;
}

interface Appointment {
  _id: string;
  appointmentId?: number;
  user: User | null;
  doctor: Doctor;
  date: string;
  time: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface AppointmentResponse {
  success: boolean;
  appointments: Appointment[];
}

interface AppointmentManagementProps {
  darkMode: boolean;
}

const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/all-appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data: AppointmentResponse = await response.json();
        setAppointments(data.success ? data.appointments : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      // Safely check user name
      (appointment.user?.fullName?.toLowerCase().includes(searchLower) ?? false) ||
      // Safely check doctor name
      (appointment.doctor?.fullName?.toLowerCase().includes(searchLower) ?? false) ||
      // Check date
      (appointment.date?.toLowerCase().includes(searchLower) ?? false) ||
      // Check appointment ID
      (appointment.appointmentId?.toString().includes(searchTerm) ?? false)
    );
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white'}`}>
        {/* Header Section */}
        <div className={`px-8 py-6 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Calendar className="w-7 h-7 text-blue-500" />
              <span>Appointment Management</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:min-w-[300px]">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-white text-gray-900 placeholder-gray-500 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className={`p-2.5 rounded-lg border ${
                  darkMode 
                    ? 'border-gray-600 hover:bg-gray-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                } transition-colors`}
              >
                <Filter className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg font-medium">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className={`text-center py-12 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
            <p className="text-lg font-medium">Error: {error}</p>
            <p className="text-sm mt-2">Please try refreshing the page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Appointment ID</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Patient Name</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Doctor</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notes</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredAppointments.map(appointment => (
                  <tr 
                    key={appointment._id}
                    className={`${
                      darkMode 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-blue-50/50'
                    } transition-colors duration-150`}
                  >
                    <td className={`px-6 py-4 text-sm font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      #{appointment.appointmentId || appointment._id.slice(-6)}
                    </td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.user?.fullName || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.doctor?.fullName || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {appointment.date}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Approved'
                          ? 'bg-green-100 text-green-700 ring-1 ring-green-700/10'
                          : appointment.status === 'Rejected'
                            ? 'bg-red-100 text-red-700 ring-1 ring-red-700/10'
                            : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-700/10'
                      }`}>
                        <Bell className="w-3 h-3" />
                        {appointment.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {appointment.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAppointments.length === 0 && (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No appointments found matching your search.</p>
                <p className="text-sm mt-1">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;