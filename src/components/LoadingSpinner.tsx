import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900">
      <img 
        src="/images/logo.png" 
        alt="ChillBroo Logo" 
        className="w-24 h-24 object-contain mb-8"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))' }}
      />
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      <p className="text-white text-xl mt-4 font-semibold">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;