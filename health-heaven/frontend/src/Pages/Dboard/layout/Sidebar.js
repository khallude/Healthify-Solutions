import React from 'react';
import { Activity, LogOut } from 'lucide-react';
import Navigation from './Navigation';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  userProfile,
  healthMetrics,
}) {
  const navigate = useNavigate(); // Initialize the navigate function from react-router-dom

  const handleLogout = () => {
    console.log('Logging out...');
    // Clear token on logout
    localStorage.removeItem('token');
    navigate('/login'); // Navigate to login after logout
  };

  const handleNavigateToHomepage = () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      navigate('/homepage'); // Navigate to homepage if token exists
    } else {
      console.log('No token found, redirecting to login...');
      navigate('/login'); // Redirect to login if no token
      // navigate('/homepage'); 
    }
  };

  return (
    <aside
      className={`bg-white shadow-lg ${
        isSidebarOpen ? 'w-80' : 'w-20'
      } transition-all duration-300 flex flex-col sticky top-0 h-screen`}
    >
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-blue-600 flex-shrink-0" />
          {isSidebarOpen && (
             <h1
             className="text-xl font-bold text-gray-900 cursor-pointer"
             onClick={handleNavigateToHomepage} // On click, navigate to homepage
           >
             {localStorage.getItem('token') ? 'Healthify' : 'Healthify'}
           </h1>
          )}
        </div>
        <button
          className="md:hidden block p-2 text-gray-600 rounded-full hover:bg-gray-100"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      {isSidebarOpen && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">{userProfile.name}</h3>
              <p className="text-sm text-gray-500">
                Age: {userProfile.age} • Blood: {userProfile.bloodType}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation
        isSidebarOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Logout Section */}
      {isSidebarOpen && (
        <div className="mt-auto p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
}

function QuickStat({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 text-gray-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
