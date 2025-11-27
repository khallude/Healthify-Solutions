import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

const records = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    type: 'Lab Results',
    date: '2024-03-10',
    doctor: 'Dr. Emily White',
    size: '2.4 MB',
    status: 'Final'
  },
  {
    id: 2,
    patient: 'Michael Chen',
    type: 'X-Ray Report',
    date: '2024-03-12',
    doctor: 'Dr. James Wilson',
    size: '5.1 MB',
    status: 'Final'
  },
  {
    id: 3,
    patient: 'Emma Davis',
    type: 'Progress Notes',
    date: '2024-03-14',
    doctor: 'Dr. Sarah Palmer',
    size: '1.2 MB',
    status: 'Draft'
  }
];

export default function Records() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600">View and manage patient medical records</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search records..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Sort by: Recent
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.patient}</div>
                        <div className="text-sm text-gray-500">{record.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.doctor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      record.status === 'Final' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}