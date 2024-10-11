import React, { useState } from 'react';
import { Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    // This is a placeholder. Replace with actual API call to generate content
    setGeneratedContent(`Generated content for ${platform}: ${prompt}`);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setPlatform('twitter')}
          className={`flex items-center px-3 py-2 rounded-md ${platform === 'twitter' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <Twitter size={18} className="mr-2" />
          Twitter
        </button>
        <button
          onClick={() => setPlatform('instagram')}
          className={`flex items-center px-3 py-2 rounded-md ${platform === 'instagram' ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <Instagram size={18} className="mr-2" />
          Instagram
        </button>
        <button
          onClick={() => setPlatform('linkedin')}
          className={`flex items-center px-3 py-2 rounded-md ${platform === 'linkedin' ? 'bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <Linkedin size={18} className="mr-2" />
          LinkedIn
        </button>
      </div>
      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your content prompt here..."
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          rows={3}
        ></textarea>
      </div>
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
      >
        <Send size={18} className="mr-2" />
        Generate Content
      </button>
      {generatedContent && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Generated Content:</h3>
          <p>{generatedContent}</p>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;