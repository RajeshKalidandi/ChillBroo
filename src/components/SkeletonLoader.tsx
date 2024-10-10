import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg h-32"></div>
        ))}
      </div>
      <div className="mt-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="bg-white p-6 rounded-lg h-48"></div>
      </div>
      <div className="mt-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;