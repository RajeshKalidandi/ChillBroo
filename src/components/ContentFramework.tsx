import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { showErrorToast } from '../utils/toast';

const API_URL = import.meta.env.VITE_API_URL;

interface ContentFrameworkProps {
  generatedContent: string;
  platform: string;
}

interface KeywordSuggestion {
  keyword: string;
  score: number;
}

interface Framework {
  name: string;
  description: string;
  structure: string;
  usage: string;
  useCase: string;
}

const ContentFramework: React.FC<ContentFrameworkProps> = ({ generatedContent, platform }) => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFrameworks();
  }, []);

  useEffect(() => {
    if (generatedContent && platform && selectedFramework) {
      generateKeywords();
    }
  }, [generatedContent, platform, selectedFramework]);

  const fetchFrameworks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get(`${API_URL}/api/content-frameworks`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      setFrameworks(response.data.frameworks);
      if (response.data.frameworks.length > 0) {
        setSelectedFramework(response.data.frameworks[0]);
      }
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      setError('Failed to fetch frameworks. Please try again.');
      showErrorToast('Failed to fetch frameworks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateKeywords = async () => {
    setIsLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.post(`${API_URL}/api/generate-keywords`, 
        { content: generatedContent },
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );
      setKeywords(response.data.keywords);
    } catch (error) {
      console.error('Error generating keywords:', error);
      // We're not setting an error state or showing a toast for keyword generation failure
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    const truncatedContent = generatedContent.length > 280 ? generatedContent.slice(0, 277) + '...' : generatedContent;

    switch (platform) {
      case 'twitter':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-xl">
            <div className="mb-2">
              <p className="font-bold">User Name</p>
              <p className="text-gray-500">@username</p>
            </div>
            <p className="mb-3">{truncatedContent}</p>
            <div className="flex justify-between text-gray-500">
              <span>💬 0</span>
              <span>🔁 0</span>
              <span>❤️ 0</span>
              <span>📊 0</span>
            </div>
          </div>
        );
      case 'facebook':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xl">
            <div className="mb-2">
              <p className="font-bold">User Name</p>
              <p className="text-xs text-gray-500">Just now · 🌍</p>
            </div>
            <p className="mb-3">{generatedContent}</p>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-gray-500">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↪️ Share</span>
              </div>
            </div>
          </div>
        );
      case 'instagram':
        return (
          <div className="bg-white border border-gray-200 rounded-lg max-w-sm">
            <div className="p-3">
              <p className="font-bold">username</p>
            </div>
            <div className="p-3">
              <p><span className="font-bold mr-2">username</span>{truncatedContent}</p>
            </div>
            <div className="p-3 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>📤</span>
                </div>
                <span>🏷️</span>
              </div>
            </div>
          </div>
        );
      case 'linkedin':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xl">
            <div className="mb-2">
              <p className="font-bold">User Name</p>
              <p className="text-xs text-gray-500">Job Title at Company</p>
              <p className="text-xs text-gray-500">Just now · 🌐</p>
            </div>
            <p className="mb-3">{generatedContent}</p>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-gray-500">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↪️ Share</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="mt-8 bg-white p-6 rounded-lg shadow-md">Loading...</div>;
  }

  if (error) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchFrameworks} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!frameworks.length) {
    return null;
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Content Framework</h2>
      <div className="mb-4">
        <label htmlFor="framework-select" className="block mb-2 font-medium">Select Framework:</label>
        <select
          id="framework-select"
          value={selectedFramework?.name}
          onChange={(e) => setSelectedFramework(frameworks.find(f => f.name === e.target.value) || null)}
          className="w-full p-2 border rounded"
        >
          {frameworks.map((framework) => (
            <option key={framework.name} value={framework.name}>{framework.name}</option>
          ))}
        </select>
      </div>
      {selectedFramework && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{selectedFramework.name} Framework</h3>
          <p className="mb-2">{selectedFramework.description}</p>
          <h4 className="text-lg font-medium mb-2">Structure:</h4>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{selectedFramework.structure}</pre>
          <h4 className="text-lg font-medium mt-4 mb-2">Usage:</h4>
          <p>{selectedFramework.usage}</p>
          <h4 className="text-lg font-medium mt-4 mb-2">Use Case:</h4>
          <p>{selectedFramework.useCase}</p>
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Content Preview</h3>
        {renderPreview()}
      </div>
      {keywords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Suggested Keywords:</h3>
          <ul className="grid grid-cols-2 gap-2">
            {keywords.map((keyword, index) => (
              <li key={index} className="bg-blue-100 p-2 rounded">
                <span className="font-medium">{keyword.keyword}</span>
                <span className="text-sm text-gray-600 ml-2">Score: {keyword.score.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContentFramework;