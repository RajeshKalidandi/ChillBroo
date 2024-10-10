import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import ContentFramework from '../components/ContentFramework';
import ContentRecommendations from '../components/ContentRecommendations';
import SocialMediaPreview from '../components/SocialMediaPreview';

const API_URL = import.meta.env.VITE_API_URL;

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('short');
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [keywords, setKeywords] = useState('');

  const selectFramework = async () => {
    setIsLoading(true);
    setError('');
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/select-framework`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ prompt, platform }),
      });

      if (!response.ok) {
        throw new Error('Failed to select framework');
      }

      const data = await response.json();
      setSelectedFramework(data.selectedFramework);
    } catch (err) {
      setError('An error occurred while selecting the framework. Please try again.');
      console.error('Error selecting framework:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async () => {
    if (!selectedFramework) {
      await selectFramework();
    }

    setIsLoading(true);
    setError('');
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/generate-content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          prompt, 
          platform, 
          tone, 
          length, 
          selectedFramework,
          targetAudience,
          callToAction,
          keywords: keywords.split(',').map(k => k.trim())
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      console.log('Generated content:', data.content);
      setGeneratedContent(data.content);
    } catch (err) {
      setError(err.message || 'An error occurred while generating content. Please try again.');
      console.error('Error generating content:', err);
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
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Content Generator</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="platform" className="block mb-2 font-semibold">Platform</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div>
          <label htmlFor="tone" className="block mb-2 font-semibold">Tone</label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="humorous">Humorous</option>
            <option value="serious">Serious</option>
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="length" className="block mb-2 font-semibold">Length</label>
        <select
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="targetAudience" className="block mb-2 font-semibold">Target Audience</label>
        <input
          type="text"
          id="targetAudience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Millennials interested in tech"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="callToAction" className="block mb-2 font-semibold">Call to Action</label>
        <input
          type="text"
          id="callToAction"
          value={callToAction}
          onChange={(e) => setCallToAction(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Sign up for our newsletter"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="keywords" className="block mb-2 font-semibold">Keywords (comma-separated)</label>
        <input
          type="text"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. AI, social media, marketing"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="prompt" className="block mb-2 font-semibold">Content Idea</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter your content idea here..."
        ></textarea>
      </div>
      <div className="mb-6">
        <label htmlFor="interests" className="block mb-2 font-semibold">Your Interests (comma-separated)</label>
        <input
          type="text"
          id="interests"
          value={userInterests.join(', ')}
          onChange={handleInterestChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. technology, marketing, social media"
        />
      </div>
      <button
        onClick={generateContent}
        disabled={isLoading || !prompt}
        className="w-full bg-blue-500 text-white p-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400 transition duration-300"
      >
        {isLoading ? 'Generating...' : 'Generate Content'}
      </button>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {selectedFramework && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h2 className="text-xl font-semibold mb-2">Selected Framework:</h2>
          <p>{selectedFramework}</p>
        </div>
      )}
      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Content:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="whitespace-pre-wrap">{generatedContent}</p>
          </div>
          <SocialMediaPreview platform={platform} content={generatedContent} />
          <button
            onClick={saveContent}
            className="mt-4 bg-green-500 text-white p-2 rounded font-semibold hover:bg-green-600 transition duration-300"
          >
            Save Content
          </button>
        </div>
      )}
      {generatedContent && (
        <>
          <ContentFramework generatedContent={generatedContent} platform={platform} />
          <ContentRecommendations userContent={generatedContent} userInterests={userInterests} />
        </>
      )}
    </div>
  );
};

export default ContentGenerator;