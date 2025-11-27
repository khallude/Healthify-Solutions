import React from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';



export default function AppointmentsPage({ appointments }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
          <p className="text-gray-500">Manage your upcoming and past appointments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{appointment.doctor}</h3>
                <p className="text-blue-600">{appointment.specialty}</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Upcoming</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Medical Center, Floor 3</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                Reschedule
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}