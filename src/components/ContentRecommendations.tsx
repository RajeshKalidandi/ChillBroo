import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ContentRecommendationsProps {
  userContent: string;
  userInterests: string[];
}

interface Recommendation {
  type: 'trend' | 'topic';
  topic?: string;
  traffic?: string;
  title?: string;
  snippet?: string;
}

const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({ userContent, userInterests }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [userContent, userInterests]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/get-recommendations', { userContent, userInterests });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Content Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border p-4 rounded-lg">
            {rec.type === 'trend' ? (
              <>
                <h3 className="font-medium text-lg">{rec.topic}</h3>
                <p className="text-sm text-gray-600">Traffic: {rec.traffic}</p>
              </>
            ) : (
              <>
                <h3 className="font-medium text-lg">{rec.title}</h3>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: rec.snippet || '' }}></p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRecommendations;