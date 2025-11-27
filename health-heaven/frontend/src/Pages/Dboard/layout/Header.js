import React from 'react';
import { Bell } from 'lucide-react';

export default function Header({ activeTab, userProfile, notificationCount }) {
  const getTabLabel = (tab) => {
    const labels = {
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      health: 'Health Metrics',
      analytics: 'Analytics',
      profile: 'Profile',
      settings: 'Settings',
    };
    return labels[tab] || tab;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {getTabLabel(activeTab)}
          </h2>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Checkup</p>
              <p className="text-sm font-medium">{userProfile.lastCheckup}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Emergency Contact</p>
              <p className="text-sm font-medium">{userProfile.emergencyContact}</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <span 
                  className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full"
                >
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}