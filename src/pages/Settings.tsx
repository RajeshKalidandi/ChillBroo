import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ToggleTheme from '../components/ToggleTheme';

const Settings: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Theme</h2>
        <div className="flex items-center justify-between">
          <span>Current theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
          <ToggleTheme />
        </div>
      </div>

      {/* Other settings sections */}
    </div>
  );
};

export default Settings;