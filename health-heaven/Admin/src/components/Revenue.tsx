import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Trash2, Shield, AlertCircle, Search, RefreshCw } from "lucide-react";

// Admin interface
interface Admin {
  _id: string;
  username: string;
  email: string;
  status: string;
}

// Admin Management Component
const AdminManagement: React.FC = () => {
  // State for Admins List
  const [admins, setAdmins] = useState<Admin[]>([]);
  
  // State for Form Data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", // Password field for admin creation
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Get JWT Token
  const token = localStorage.getItem("token");

  // Fetch All Admins (SuperAdmin Only)
  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<{ admins: Admin[] }>(
        "http://localhost:5000/api/admin/get-all-admins",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to load administrators. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission (Create Admin)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/api/admin/create-admin",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAdmins(); // Refresh the list
      setFormData({ username: "", email: "", password: "" }); // Reset form
    } catch (error: any) {
      console.error("Error creating admin:", error);
      setError(error.response?.data?.message || "Failed to create administrator");
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Deletion
  const handleDelete = async (adminId: string) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    setLoading(true);
    setError("");
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/delete-admin/${adminId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAdmins(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting admin:", error);
      setError(error.response?.data?.message || "Failed to delete administrator");
    } finally {
      setLoading(false);
    }
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin => 
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Shield className="mr-2 text-indigo-600" size={28} />
          Admin Management
        </h1>
        <button 
          onClick={fetchAdmins} 
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Admin Creation Form */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
            <UserPlus className="mr-2 text-indigo-600" size={20} />
            Create New Admin
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input 
                  type="text" 
                  id="username"
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input 
                  type="password" 
                  id="password"
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                    Create Admin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Admin List Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Administrator List</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            
            {loading && admins.length === 0 ? (
              <div className="py-8 flex justify-center items-center">
                <RefreshCw className="animate-spin mr-2 h-5 w-5 text-indigo-600" />
                <p className="text-gray-500">Loading administrators...</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No administrators found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{admin.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            admin.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDelete(admin._id)} 
                            className="text-red-600 hover:text-red-900 inline-flex items-center transition-colors focus:outline-none focus:underline"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;