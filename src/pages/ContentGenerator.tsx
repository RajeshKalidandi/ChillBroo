import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import ContentFramework from '../components/ContentFramework';
import ContentRecommendations from '../components/ContentRecommendations';

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('short');
  const [preferredService, setPreferredService] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [usedService, setUsedService] = useState('');
  const [userInterests, setUserInterests] = useState<string[]>([]);

  const generateContent = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_HYPERBOLIC_API_KEY}`,
          'HuggingFace-Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({ prompt, platform, tone, length, preferredService }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      setUsedService(data.usedService);
      setIsEditing(true);
    } catch (err) {
      setError('An error occurred while generating content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error: supabaseError } = await supabase
        .from('generated_content')
        .insert([
          { content: generatedContent, platform, user_id: userData.user.id }
        ]);

      if (supabaseError) throw supabaseError;
      console.log('Content saved:', data);
      setIsEditing(false);
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
        <label htmlFor="preferredService" className="block mb-2">Preferred Service (Optional)</label>
        <select
          id="preferredService"
          value={preferredService}
          onChange={(e) => setPreferredService(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">No preference</option>
          <option value="hyperbolic">Hyperbolic</option>
          <option value="deepseek">DeepSeek</option>
          <option value="ollama">Ollama</option>
          <option value="huggingface">HuggingFace</option>
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
            {isEditing ? (
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="w-full p-2 border rounded"
                rows={6}
              ></textarea>
            ) : (
              <p className="p-2 bg-gray-100 rounded">{generatedContent}</p>
            )}
            <div className="mt-2">
              {isEditing ? (
                <button
                  onClick={saveContent}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Save Content
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                >
                  Edit Content
                </button>
              )}
            </div>
          </div>
          
          <ContentFramework generatedContent={generatedContent} platform={platform} />
          <ContentRecommendations userContent={generatedContent} userInterests={userInterests} />
        </>
      )}
    </div>
  );
};

export default ContentGenerator;