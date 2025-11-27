import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  AlertCircle,
  X,
  Eye,
  User,
  Phone,
  MapPin,
  Droplet,
  Heart,
  Ban,
  UserX,
  Calendar,
  Clock
} from 'lucide-react';

interface Patient {
  _id: string;
  fullName: string;
  age: number;
  bloodType: string;
  email: string;
  phone: string;
  address: string;
  allergies: string;
  chronicConditions: string;
  profileImage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PatientResponse {
  user: Patient;
}

interface PatientManagementProps {
  darkMode: boolean;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ darkMode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/all-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch patients');
      
      const data = await response.json();
      setPatients(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/user-detail/${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch patient details');

      const data = await response.json() as PatientResponse;
      setSelectedPatient(data.user); // Access the user property from the response
      setShowDetailsDialog(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to fetch patient details');
    }
  };

  const handleToggleBan = async (patientId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/toggle-user-ban/${patientId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to update patient status');

      await fetchPatients();
      setShowDropdown(null);
      alert('Patient status updated successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update patient status');
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-user/${patientId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete patient');

      await fetchPatients();
      setShowDropdown(null);
      alert('Patient has been deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete patient');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/admin/user-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedPatient._id,
          subject: emailSubject,
          message: emailContent
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      alert('Email sent successfully');
      setShowEmailDialog(false);
      setEmailContent('');
      setEmailSubject('');
      setSelectedPatient(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send email');
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && patient.status.toLowerCase() === currentTab.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Error Loading Patients</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Patient Management</h1>
            <p className="text-sm text-gray-600">Manage and monitor patient accounts</p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
            {['all', 'active', 'banned'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`px-4 py-2 rounded-md text-sm ${
                  currentTab === tab
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-8 h-9 w-[300px] rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Patient</th>
                  <th className="text-left p-4 font-semibold">Contact</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Join Date</th>
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`http://localhost:5000${patient.profileImage}`}
                          alt={patient.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{patient.fullName}</div>
                          <div className="text-sm text-gray-600">{patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{patient.phone}</div>
                        <div className="text-gray-600">{patient.address}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        patient.status === "Active" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === patient._id ? null : patient._id)}
                          className="p-1 hover:bg-gray-100 rounded-md"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {showDropdown === patient._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                            <button
                              onClick={() => {
                                setShowDropdown(null);
                                fetchPatientDetails(patient._id);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowEmailDialog(true);
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Mail className="h-4 w-4" />
                              Send Email
                            </button>
                            <button
                              onClick={() => handleToggleBan(patient._id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Ban className="h-4 w-4" />
                              {patient.status === "Banned" ? "Unban" : "Ban"}
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <UserX className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {showDetailsDialog && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Patient Details</h2>
              <button onClick={() => setShowDetailsDialog(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <img
                  src={`http://localhost:5000${selectedPatient.profileImage}`}
                  alt={selectedPatient.fullName}
                  className="w-full h-48 rounded-lg object-cover"
                />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">{selectedPatient.fullName}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="text-gray-400" size={16} />
                      <span>Age: {selectedPatient.age} years</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full ${
                        selectedPatient.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - Contact & Location */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-sm">{selectedPatient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-sm">{selectedPatient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-sm">{selectedPatient.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Dates</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Created At</p>
                        <p className="font-medium text-sm">
                          {new Date(selectedPatient.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium text-sm">
                          {new Date(selectedPatient.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Medical Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Medical Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Droplet className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Blood Type</p>
                        <p className="font-medium text-sm">{selectedPatient.bloodType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Allergies</p>
                        <p className="font-medium text-sm">{selectedPatient.allergies || "None"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Chronic Conditions</p>
                        <p className="font-medium text-sm">{selectedPatient.chronicConditions || "None"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">System Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Patient ID</p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {selectedPatient.userId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Send Email</h2>
              <button onClick={() => setShowEmailDialog(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="email"
                  value={selectedPatient?.email || ''}
                  className="w-full p-2 border rounded-md bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={5}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEmailDialog(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;