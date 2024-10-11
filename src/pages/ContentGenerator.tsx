import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import ContentFramework from '../components/ContentFramework';
import ContentRecommendations from '../components/ContentRecommendations';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { useCredits } from '../hooks/useCredits';
import CreditStatus from '../components/CreditStatus';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const API_URL = import.meta.env.VITE_API_URL;

const ContentGenerator: React.FC = () => {
  const { user } = useAuth();
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
  const [templates, setTemplates] = useState<{ id: string; name: string; content: string }[]>([]);
  const [recentInfo, setRecentInfo] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const navigate = useNavigate();
  const credits = useCredits();
  const { credits: userCredits, plan } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchTemplates();
    fetchUserCredits();
  }, []);

  const fetchTemplates = async () => {
    try {
      const templatesSnapshot = await getDocs(collection(db, 'templates'));
      const templatesData = templatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as { name: string; content: string } }));
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      showErrorToast('Failed to fetch templates');
    }
  };

  const fetchUserCredits = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDocs(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserCredits(userDoc.data().credits || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching user credits:', error);
    }
  };

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

  const updateCredits = async (userId: string, amount: number) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      credits: increment(-amount)
    });
  };

  const generateContent = async () => {
    if (plan !== 'freemium' && (credits === null || credits < 10)) {
      showErrorToast('Not enough credits. Please purchase more credits to continue.');
      navigate('/pricing');
      return;
    }

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
          keywords: keywords.split(',').map(k => k.trim()),
          recentInfo
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

      // Deduct credits only for non-freemium users
      if (plan !== 'freemium') {
        await updateCredits(user!.uid, 10);
      }

      // Record usage
      await fetch(`${API_URL}/api/record-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          userId: user!.uid,
          action: 'Content Generation',
          amount: plan === 'freemium' ? 0 : 10
        })
      });

      showSuccessToast('Content generated successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred while generating content. Please try again.');
      console.error('Error generating content:', err);
      showErrorToast(err.message || 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      await addDoc(collection(db, 'generated_content'), {
        userId: user.uid,
        content: generatedContent,
        platform,
        createdAt: new Date()
      });

      showSuccessToast('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      showErrorToast('Failed to save content');
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(interest => interest.trim());
    setUserInterests(interests);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">AI Content Generator</h1>
      <CreditStatus />
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
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={recentInfo}
            onChange={(e) => setRecentInfo(e.target.checked)}
            className="mr-2"
          />
          Include recent information
        </label>
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
      <div className="mb-6">
        <label htmlFor="template" className="block mb-2 font-semibold">Use Template (Optional)</label>
        <select
          id="template"
          onChange={(e) => {
            const selectedTemplate = templates.find(t => t.id === e.target.value);
            if (selectedTemplate) {
              setPrompt(selectedTemplate.content);
            }
          }}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a template</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ContentGenerator;