import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Mail,
  FileText,
  AlertCircle,
  X,
  Eye
} from 'lucide-react';

interface Doctor {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  profilePictureUrl: string;
  certificateUrl: string;
  govIDUrl: string;
  status: string;
  createdAt: string;
  fees?: number;
  location?: string;
}

interface DoctorDetails extends Doctor {
  fees: number;
  location: string;
}

interface DoctorManagementProps {
  darkMode: boolean;
}

const DoctorManagement: React.FC<DoctorManagementProps> = ({ darkMode }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/all-doctors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch doctors');
      
      const data = await response.json();
      setDoctors(data.doctors || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (doctorId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/doctor-detail/${doctorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch doctor details');

      const data = await response.json();
      setDoctorDetails(data);
      setShowDetailsDialog(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to fetch doctor details');
    }
  };

  const handleApproveDoctor = async (doctorId: string) => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/approve-doctor/${doctorId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Some APIs require an empty body
        }
      );
  
      // 🔹 Handle JSON response properly
      const data = await response.json(); 
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to approve doctor");
      }
  
      // ✅ Success - Show the correct success message
      alert(data.message);  // Will now correctly display "Doctor approved successfully by Admin."
      
      await fetchDoctors();
      setShowDropdown(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve doctor");
    }
  };
  
  const handleRejectDoctor = async (doctorId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-doctor/${doctorId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: "Not meeting criteria" }), // Optional if backend accepts a reason
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject doctor");
      }
  
      await fetchDoctors();
      setShowDropdown(null);
      alert("Doctor has been rejected successfully");
    } catch (err) {
      console.error("Error rejecting doctor:", err);
      alert(err instanceof Error ? err.message : "Failed to reject doctor");
    }
  };
  

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("http://localhost:5000/api/admin/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorEmail: selectedDoctor.email,
          subject: emailSubject,
          message: emailContent
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      alert('Email sent successfully');
      setShowEmailDialog(false);
      setEmailContent('');
      setEmailSubject('');
      setSelectedDoctor(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send email');
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-doctor/${doctorId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete doctor');

      await fetchDoctors();
      setShowDropdown(null);
      alert('Doctor has been deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && doctor.status.toLowerCase() === currentTab;
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
        <h3 className="text-lg font-semibold">Error Loading Doctors</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Stethoscope className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Doctor Management</h1>
            <p className="text-sm text-gray-600">Manage and verify medical professionals</p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
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
                placeholder="Search doctors..."
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
                  <th className="text-left p-4 font-semibold">Doctor</th>
                  <th className="text-left p-4 font-semibold">Specialty</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Experience</th>
                  <th className="text-left p-4 font-semibold">Join Date</th>
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doctor.profilePictureUrl || "https://via.placeholder.com/120"}
                          alt={doctor.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{doctor.fullName}</div>
                          <div className="text-sm text-gray-600">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{doctor.specialty}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doctor.status === "Approved" ? "bg-green-100 text-green-800" :
                        doctor.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td className="p-4">{doctor.experience} years</td>
                    <td className="p-4">{new Date(doctor.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === doctor._id ? null : doctor._id)}
                          className="p-1 hover:bg-gray-100 rounded-md"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {showDropdown === doctor._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                            <button
                              onClick={() => {
                                setShowDropdown(null);
                                fetchDoctorDetails(doctor._id);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <a
                              href={doctor.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              View Certificate
                            </a>
                            {doctor.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveDoctor(doctor._id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectDoctor(doctor._id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setShowEmailDialog(true);
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Mail className="h-4 w-4" />
                              Send Email
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doctor._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <AlertCircle className="h-4 w-4" />
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

      {/* Doctor Details Modal */}
      {showDetailsDialog && doctorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Doctor Details</h2>
              <button onClick={() => setShowDetailsDialog(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img
                  src={doctorDetails.profilePictureUrl}
                  alt={doctorDetails.fullName}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{doctorDetails.fullName}</h3>
                  <p className="text-gray-600">{doctorDetails.specialty}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {doctorDetails.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {doctorDetails.phone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {doctorDetails.location}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Professional Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Experience:</span> {doctorDetails.experience} years
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Consultation Fee:</span> ${doctorDetails.fees}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doctorDetails.status === "Approved" ? "bg-green-100 text-green-800" :
                        doctorDetails.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {doctorDetails.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Documents</h4>
                  <div className="space-y-2">
                    <a
                      href={doctorDetails.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Certificate
                    </a>
                    <a
                      href={doctorDetails.govIDUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Government ID
                    </a>
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
                  value={selectedDoctor?.email || ''}
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

export default DoctorManagement;