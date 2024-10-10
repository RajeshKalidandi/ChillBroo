import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import ContentFramework from '../components/ContentFramework';
import ContentRecommendations from '../components/ContentRecommendations';

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('short');
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateContent = async () => {
    setIsLoading(true);
    setError('');
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ prompt, platform, tone, length }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError('An error occurred while generating content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/save-content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ content: generatedContent, platform }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save content');
      }

      console.log('Content saved successfully');
    } catch (err) {
      setError('Failed to save content');
      console.error(err);
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(interest => interest.trim());
    setUserInterests(interests);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Content Generator</h1>
      <div className="mb-4">
        <label htmlFor="platform" className="block mb-2">Platform</label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="tone" className="block mb-2">Tone</label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="humorous">Humorous</option>
          <option value="serious">Serious</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="length" className="block mb-2">Length</label>
        <select
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="prompt" className="block mb-2">Prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="interests" className="block mb-2">Your Interests (comma-separated)</label>
        <input
          type="text"
          id="interests"
          value={userInterests.join(', ')}
          onChange={handleInterestChange}
          className="w-full p-2 border rounded"
          placeholder="e.g. technology, marketing, social media"
        />
      </div>
      <button
        onClick={generateContent}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Generating...' : 'Generate Content'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {generatedContent && (
        <>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Generated Content:</h2>
            <p className="p-2 bg-gray-100 rounded">{generatedContent}</p>
            <button
              onClick={saveContent}
              className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Save Content
            </button>
          </div>
          <ContentFramework generatedContent={generatedContent} platform={platform} />
          <ContentRecommendations userContent={generatedContent} userInterests={userInterests} />
        </>
      )}
    </div>
  );
};

export default ContentGenerator;