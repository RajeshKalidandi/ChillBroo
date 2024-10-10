import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';

const API_URL = import.meta.env.VITE_API_URL;

interface ContentRecommendationsProps {
  userContent: string;
  userInterests: string[];
}

interface Recommendation {
  topic: string;
  type: string;
  relevance: number;
}

const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({ userContent, userInterests }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userContent && userInterests.length > 0) {
      fetchRecommendations();
    }
  }, [userContent, userInterests]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.post(`${API_URL}/api/get-recommendations`, 
        { userContent, userInterests },
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="mt-8 bg-white p-6 rounded-lg shadow-md">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-red-500">{error}</div>;
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Content Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="font-medium text-lg">{rec.topic}</h3>
            <p className="text-sm text-gray-600">Type: {rec.type}</p>
            <p className="text-sm text-gray-600">Relevance: {rec.relevance.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRecommendations;