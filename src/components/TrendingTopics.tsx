import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const TrendingTopics: React.FC = () => {
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/trending-topics`);
      setTrends(response.data.trends);
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError('Failed to fetch trending topics. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading trending topics...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <TrendingUp className="mr-2" />
        Trending Topics
      </h2>
      <ul className="space-y-2">
        {trends.map((trend, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            {trend}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;