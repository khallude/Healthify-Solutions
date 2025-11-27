import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  Search, Bell, Settings, Calendar, Users, Activity, Pill, FileText,
  MessageSquare, LogOut, Menu, ChevronRight, Home, MoreVertical
} from "lucide-react";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch("http://localhost:5000/api/doctor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    navigate("/Doctorlogin");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-white min-h-screen shadow-lg transition-all duration-300 ease-in-out fixed left-0 top-0`}>
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            {sidebarOpen && <span className="text-xl font-bold text-gray-900">Healthify</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            {sidebarOpen ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="mt-6">
          {[
            { title: "Dashboard", icon: Home, path: "/" },
            { title: "Appointments", icon: Calendar, path: "/appointments" },
            { title: "Profile", icon: Users, path: "/profile" },

            // { title: "Patients", icon: Users, path: "/patients" },
            // { title: "Prescriptions", icon: Pill, path: "/prescriptions" },
            // { title: "Medical Records", icon: FileText, path: "/records" },
            { title: "Messages", icon: MessageSquare, path: "/messages", notifications: 4 },
            { title: "Add Blog", icon: FileText, path: "/addblog" },
            { title: "Blog List", icon: FileText, path: "/bloglist" },
          ].map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center px-4 py-3 mb-1 mx-2 rounded-lg transition-colors ${
                location.pathname === item.path ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3 flex-1 text-sm">{item.title}</span>}
              {sidebarOpen && item.notifications && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.notifications}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        {sidebarOpen && (
          <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
            {loading ? (
              <p className="text-sm text-gray-500">Loading profile...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <div className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="relative">
                  <img className="h-10 w-10 rounded-full ring-2 ring-white" src={profile?.profilePictureUrl} alt={profile?.fullName} />
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full ring-2 ring-white"></span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{profile?.fullName}</h3>
                  <p className="text-xs text-gray-500">{profile?.specialty}</p>
                </div>
                <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-100 transition-colors">
                  <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer transition-colors" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <Link to="/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <img className="h-8 w-8 rounded-full" src={profile?.profilePictureUrl} alt="Profile" />
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
