import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  darkMode: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, darkMode }) => {
  const isPositive = change.startsWith('+');

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</span>
        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {value}
        </span>
        <span
          className={`text-sm ${
            isPositive
              ? 'text-green-500'
              : 'text-red-500'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

export default StatsCard