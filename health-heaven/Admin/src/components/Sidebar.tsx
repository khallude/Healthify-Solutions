import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  darkMode: boolean;
  unreadNotifications: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  menuItems, 
  activeSection, 
  setActiveSection, 
  darkMode,
  unreadNotifications
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className={`w-64 min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Healthify
        </h2>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center w-full px-4 py-2 text-left transition-colors ${
                  activeSection === item.id
                    ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-700'}`
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'notifications' && unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleLogout} 
          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-800 dark:text-red-400"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
