import React, { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { auth } from '../firebaseConfig';
import axios from 'axios';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  link: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const UserRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get(`${API_URL}/api/recommendations`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to fetch recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Lightbulb className="mr-2" />
        Personalized Recommendations
      </h2>
      {recommendations.length > 0 ? (
        <ul className="space-y-4">
          {recommendations.map((recommendation) => (
            <li key={recommendation.id} className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">{recommendation.title}</h3>
              <p className="text-gray-600 mb-2">{recommendation.description}</p>
              <a
                href={recommendation.link}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                {recommendation.action}
                <ArrowRight size={16} className="ml-1" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available at the moment. Keep using ChillBroo to get personalized suggestions!</p>
      )}
    </div>
  );
};

export default UserRecommendations;