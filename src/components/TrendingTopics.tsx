import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface TrendingTopicsProps {
  topics: string[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <Link
            key={index}
            to={`/generate?topic=${encodeURIComponent(topic)}`}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            <TrendingUp className="w-5 h-5 text-blue-500 mr-3" />
            <span className="text-gray-800 font-medium">{topic}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;