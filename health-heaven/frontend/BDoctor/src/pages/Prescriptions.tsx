import React from 'react';
import { Plus, FileText } from 'lucide-react';

const prescriptions = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    status: 'Active',
    doctor: 'Dr. Emily White'
  },
  {
    id: 2,
    patient: 'Michael Chen',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    status: 'Active',
    doctor: 'Dr. James Wilson'
  },
  {
    id: 3,
    patient: 'Emma Davis',
    medication: 'Albuterol',
    dosage: '90mcg',
    frequency: 'As needed',
    startDate: '2024-03-10',
    endDate: '2024-09-10',
    status: 'Active',
    doctor: 'Dr. Sarah Palmer'
  }
];

export default function Prescriptions() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600">Manage patient prescriptions and medications</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          New Prescription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{prescription.patient}</h3>
                <p className="text-sm text-gray-500">{prescription.doctor}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Medication</p>
                <p className="text-base text-gray-900">{prescription.medication}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Dosage</p>
                  <p className="text-base text-gray-900">{prescription.dosage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Frequency</p>
                  <p className="text-base text-gray-900">{prescription.frequency}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="text-base text-gray-900">{prescription.startDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="text-base text-gray-900">{prescription.endDate}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
                {prescription.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}