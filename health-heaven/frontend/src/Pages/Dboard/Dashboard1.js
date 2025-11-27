import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import DashboardContent from '../Dboard/pages/Dashboard'; // Renamed import
import AppointmentsPage from './pages/Appointments';
import HealthMetricsPage from './pages/HealthMetrics';
import AnalyticsPage from './pages/Analytics';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [userProfile] = useState({
    name: "John Doe",
    age: 32,
    bloodType: "A+",
    height: 175,
    emergencyContact: "Jane Doe (+1 234-567-8900)",
    lastCheckup: "2024-02-15",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  });

  const [appointments] = useState([
    { id: 1, doctor: "Dr. Sarah Smith", date: "2024-03-20", time: "10:00 AM", specialty: "Cardiologist" },
    { id: 2, doctor: "Dr. John Davis", date: "2024-03-25", time: "2:30 PM", specialty: "General Physician" },
  ]);

  const [healthMetrics] = useState([
    { 
      date: "2024-03-15",
      weight: 70,
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 36.6,
      bloodSugar: 95,
      sleepHours: 7.5,
      stressLevel: 3
    },
    { 
      date: "2024-03-14",
      weight: 70.5,
      bloodPressure: "118/79",
      heartRate: 70,
      temperature: 36.5,
      bloodSugar: 92,
      sleepHours: 8,
      stressLevel: 2
    },
  ]);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent appointments={appointments} healthMetrics={healthMetrics} />;
      case 'appointments':
        return <AppointmentsPage appointments={appointments} />;
      case 'health':
        return <HealthMetricsPage healthMetrics={healthMetrics} />;
      case 'analytics':
        return <AnalyticsPage healthMetrics={healthMetrics} />;
      case 'profile':
        return <ProfilePage userProfile={userProfile} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardContent appointments={appointments} healthMetrics={healthMetrics} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        healthMetrics={healthMetrics}
      />

      <div className="flex-1">
        <Header activeTab={activeTab} userProfile={userProfile} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;