import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    generateFrameworkAndKeywords();
  }, [generatedContent, platform]);

  const generateFrameworkAndKeywords = async () => {
    setIsLoading(true);
    try {
      const [frameworkResponse, keywordsResponse] = await Promise.all([
        axios.post('/api/generate-framework', { content: generatedContent, platform }),
        axios.post('/api/generate-keywords', { content: generatedContent })
      ]);

      setFramework(frameworkResponse.data.framework);
      setKeywords(keywordsResponse.data.keywords);
    } catch (error) {
      console.error('Error generating framework and keywords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading framework and keywords...</div>;
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Content Framework</h2>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Suggested Structure:</h3>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{framework}</pre>
      </div>
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
    </div>
  );
};

export default ContentFramework;