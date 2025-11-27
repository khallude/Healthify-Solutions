import React from 'react';
import { Home, Calendar, Heart, LineChart, User, Settings } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'health', label: 'Health Metrics', icon: Heart },
  { id: 'analytics', label: 'Analytics', icon: LineChart },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navigation({ isSidebarOpen, activeTab, setActiveTab }) {
  return (
    <nav className="flex-1 pt-4">
      <div className="space-y-1 px-3">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span>{label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
