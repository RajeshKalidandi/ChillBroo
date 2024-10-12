import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { auth } from '../firebaseConfig';

interface Resource {
  title: string;
  url: string;
  source: string;
  type: 'course' | 'article' | 'tool';
}

const API_URL = import.meta.env.VITE_API_URL;

const ContentCreationResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get(`${API_URL}/api/content-resources`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      setResources(response.data.resources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to fetch resources. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResourceIcon = (type: 'course' | 'article' | 'tool') => {
    switch (type) {
      case 'course':
        return <Book size={16} className="mr-2" />;
      case 'article':
        return <LinkIcon size={16} className="mr-2" />;
      case 'tool':
        return <RefreshCw size={16} className="mr-2" />;
    }
  };

  if (isLoading) {
    return <div>Loading resources...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Book className="mr-2" />
        Content Creation Resources
      </h2>
      {resources.length > 0 ? (
        <ul className="space-y-4">
          {resources.map((resource, index) => (
            <li key={index} className="border-b pb-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                {renderResourceIcon(resource.type)}
                {resource.title}
              </a>
              <p className="text-sm text-gray-500 mt-1">Source: {resource.source}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No resources available at the moment. Please try again later.</p>
      )}
      <button
        onClick={fetchResources}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Refresh Resources
      </button>
    </div>
  );
};

export default ContentCreationResources;
