import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, VerifyOTP } from './Pages/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import DoctorManagement from './components/DoctorManagement';
import PatientManagement from './components/PatientManagement';
import AppointmentManagement from './components/AppointmentManagement';
import Revenue from './components/Revenue';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import AdminProfile from './components/AdminProfile';
import { BarChart3, Users, UserCog, Calendar, Bell, Settings as SettingsIcon, Layout, Sun, Moon } from 'lucide-react';

// Protected Routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const OTPRoute = ({ children }: { children: React.ReactNode }) => {
  const tempToken = localStorage.getItem('tempToken');
  return tempToken ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Doctor Registration',
      message: 'Dr. Sarah Smith has registered and is awaiting approval',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'System Update',
      message: 'Platform maintenance scheduled for tonight at 2 AM EST',
      time: '1 hour ago',
      read: false
    }
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layout size={20} /> },
    { id: 'doctors', label: 'Doctors', icon: <UserCog size={20} /> },
    { id: 'patients', label: 'Patients', icon: <Users size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    { id: 'revenue', label: 'Admin Management', icon: <BarChart3 size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard darkMode={darkMode} />;
      case 'doctors':
        return <DoctorManagement darkMode={darkMode} />;
      case 'patients':
        return <PatientManagement darkMode={darkMode} />;
      case 'appointments':
        return <AppointmentManagement darkMode={darkMode} />;
      case 'revenue':
        return <Revenue darkMode={darkMode} />;
      case 'notifications':
        return <Notifications darkMode={darkMode} notifications={notifications} setNotifications={setNotifications} />;
      case 'settings':
        return <Settings darkMode={darkMode} />;
      default:
        return <Dashboard darkMode={darkMode} />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPRoute><VerifyOTP /></OTPRoute>} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
              <div className="flex">
                <Sidebar 
                  menuItems={menuItems} 
                  activeSection={activeSection} 
                  setActiveSection={setActiveSection}
                  darkMode={darkMode}
                  unreadNotifications={unreadNotifications}
                />
                
                <main className="flex-1 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Healthify Admin Panel
                    </h1>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setActiveSection('notifications')}
                        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Bell size={20} className={darkMode ? 'text-white' : 'text-gray-800'} />
                        {unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadNotifications}
                          </span>
                        )}
                      </button>
                    
                      <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center"
                      >
                        AD
                      </button>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2 rounded-lg ${
                          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                        } hover:opacity-80 transition-opacity`}
                      >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  {showProfile && (
                    <AdminProfile 
                      darkMode={darkMode} 
                      onClose={() => setShowProfile(false)} 
                    />
                  )}
                  
                  {renderActiveSection()}
                </main>
              </div>
            </div>
          </PrivateRoute>
        }/>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;