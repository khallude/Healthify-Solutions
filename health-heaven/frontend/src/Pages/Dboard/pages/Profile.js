import React from 'react';
import { Mail, Phone, MapPin, Calendar, Activity, Shield } from 'lucide-react';

export default function ProfilePage({ userProfile }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 space-y-4 sm:space-y-0 sm:space-x-4">
            <img
              src={userProfile.profileImage}
              alt={userProfile.name}
              className="h-32 w-32 rounded-full border-4 border-white shadow-md"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-gray-500">Patient ID: #123456</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{userProfile.age} years</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Activity className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="font-medium">{userProfile.bloodType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p className="font-medium">Blue Cross Blue Shield</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>+1 234-567-8900</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>123 Health Street, Medical City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Medical History</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Allergies</p>
                <p className="text-gray-600 mt-1">Penicillin, Peanuts</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Chronic Conditions</p>
                <p className="text-gray-600 mt-1">None</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Past Surgeries</p>
                <p className="text-gray-600 mt-1">Appendectomy (2018)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            <div className="space-y-3">
              <DocumentRow
                title="Latest Blood Work"
                date="2024-02-15"
                type="PDF"
                size="2.4 MB"
              />
              <DocumentRow
                title="Vaccination Record"
                date="2024-01-20"
                type="PDF"
                size="1.8 MB"
              />
              <DocumentRow
                title="Insurance Card"
                date="2024-01-01"
                type="JPG"
                size="856 KB"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ title, date, type, size }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">Added on {date}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500">{type} • {size}</span>
        <button className="text-blue-600 hover:text-blue-700">Download</button>
      </div>
    </div>
  );
}
