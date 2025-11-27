import React from 'react';
import { Plus } from 'lucide-react';

export default function AppointmentsList({ appointments }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
          <Plus className="h-5 w-5" />
          <span>New Appointment</span>
        </button>
      </div>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{appointment.doctor}</p>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{new Date(appointment.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{appointment.time}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
}