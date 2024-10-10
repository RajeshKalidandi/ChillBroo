import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  const generateContent = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const response = await axios.post('/api/generate-content', { prompt });
      setContent(response.data.content);
    } catch (err) {
      console.error('Error generating content:', err);
      setError('An error occurred while generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Content Generator</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your content prompt here..."
          className="w-full h-32 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateContent}
          disabled={isGenerating || !prompt.trim()}
          className={`mt-4 flex items-center justify-center w-full py-2 px-4 rounded-md text-white font-semibold ${
            isGenerating || !prompt.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isGenerating ? (
            <>
              <Sparkles className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" />
              Generate Content
            </>
          )}
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {content && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Generated Content:</h2>
          <p className="whitespace-pre-wrap mb-4">{content}</p>
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center py-2 px-4 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600"
          >
            {isCopied ? (
              <>
                <Check className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;