import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';

const API_URL = import.meta.env.VITE_API_URL;

interface ContentFrameworkProps {
  generatedContent: string;
  platform: string;
}

interface KeywordSuggestion {
  keyword: string;
  score: number;
}

const ContentFramework: React.FC<ContentFrameworkProps> = ({ generatedContent, platform }) => {
  const [framework, setFramework] = useState<string>('');
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (generatedContent && platform) {
      generateFrameworkAndKeywords();
    }
  }, [generatedContent, platform]);

  const generateFrameworkAndKeywords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const [frameworkResponse, keywordsResponse] = await Promise.all([
        axios.post(`${API_URL}/api/generate-framework`, 
          { content: generatedContent, platform },
          { headers: { 'Authorization': `Bearer ${idToken}` } }
        ),
        axios.post(`${API_URL}/api/generate-keywords`, 
          { content: generatedContent },
          { headers: { 'Authorization': `Bearer ${idToken}` } }
        )
      ]);

      setFramework(frameworkResponse.data.framework);
      setKeywords(keywordsResponse.data.keywords);
    } catch (error) {
      console.error('Error generating framework and keywords:', error);
      setError('Failed to generate framework and keywords. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="mt-8 bg-white p-6 rounded-lg shadow-md">Loading framework and keywords...</div>;
  }

  if (error) {
    return <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-red-500">{error}</div>;
  }

  if (!framework && !keywords.length) {
    return null;
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Content Framework</h2>
      {framework && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Suggested Structure:</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{framework}</pre>
        </div>
      )}
      {keywords.length > 0 && (
        <div>
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