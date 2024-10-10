import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, SkipForward } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

interface UserData {
  name: string;
  company: string;
  industry: string;
  platforms: string[];
  contentType: string;
}

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    company: '',
    industry: '',
    platforms: [],
    contentType: '',
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        console.log('No authenticated user found');
      }
    };
    fetchUserId();
  }, []);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<UserData> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!userData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }
      if (!userData.industry) {
        newErrors.industry = 'Please select an industry';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (userData.platforms.length === 0) {
        newErrors.platforms = 'Please select at least one platform';
        isValid = false;
      }
      if (!userData.contentType) {
        newErrors.contentType = 'Please select a content type';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Instead of storing data, we'll navigate to the auth page
        navigate('/auth', { state: { userData } });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to ChillBroo</h1>
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i < step ? <Check size={16} /> : i}
            </div>
            {i < 3 && <div className={`w-16 h-1 ${i < step ? 'bg-blue-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && <StepOne userData={userData} updateUserData={updateUserData} errors={errors} />}
      {step === 2 && <StepTwo userData={userData} updateUserData={updateUserData} errors={errors} />}
      {step === 3 && <StepThree />}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-400 flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </button>
        )}
        <button
          onClick={handleSkip}
          className="bg-gray-100 text-gray-600 py-2 px-4 rounded-md font-semibold hover:bg-gray-200 flex items-center"
        >
          Skip
          <SkipForward className="ml-2" size={16} />
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 flex items-center"
        >
          {step === 3 ? 'Get Started' : 'Next'}
          <ArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );
};

// Move StepOne, StepTwo, and StepThree components outside of the Onboarding component
const StepOne: React.FC<{
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  errors: Partial<UserData>;
}> = ({ userData, updateUserData, errors }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Tell us about yourself</h2>
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={userData.name}
          onChange={(e) => updateUserData({ name: e.target.value })}
          className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="company" className="block mb-1 font-medium">
          Company (optional)
        </label>
        <input
          type="text"
          id="company"
          value={userData.company}
          onChange={(e) => updateUserData({ company: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="industry" className="block mb-1 font-medium">
          Industry
        </label>
        <select
          id="industry"
          value={userData.industry}
          onChange={(e) => updateUserData({ industry: e.target.value })}
          className={`w-full p-2 border rounded-md ${errors.industry ? 'border-red-500' : ''}`}
        >
          <option value="">Select an industry</option>
          <option value="tech">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
        {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
      </div>
    </div>
  </div>
);

const StepTwo: React.FC<{
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  errors: Partial<UserData>;
}> = ({ userData, updateUserData, errors }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Your Content Strategy</h2>
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Platforms</label>
        {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok'].map((platform) => (
          <label key={platform} className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={userData.platforms.includes(platform)}
              onChange={(e) => {
                const updatedPlatforms = e.target.checked
                  ? [...userData.platforms, platform]
                  : userData.platforms.filter((p) => p !== platform);
                updateUserData({ platforms: updatedPlatforms });
              }}
              className="mr-2"
            />
            {platform}
          </label>
        ))}
        {errors.platforms && <p className="text-red-500 text-sm mt-1">{errors.platforms}</p>}
      </div>
      <div>
        <label htmlFor="contentType" className="block mb-1 font-medium">
          Primary Content Type
        </label>
        <select
          id="contentType"
          value={userData.contentType}
          onChange={(e) => updateUserData({ contentType: e.target.value })}
          className={`w-full p-2 border rounded-md ${errors.contentType ? 'border-red-500' : ''}`}
        >
          <option value="">Select a content type</option>
          <option value="text">Text Posts</option>
          <option value="images">Images</option>
          <option value="videos">Videos</option>
          <option value="mixed">Mixed Content</option>
        </select>
        {errors.contentType && <p className="text-red-500 text-sm mt-1">{errors.contentType}</p>}
      </div>
    </div>
  </div>
);

const StepThree: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">You're All Set!</h2>
    <p className="text-lg mb-4">
      Thank you for completing the onboarding process. We're excited to help you create amazing content!
    </p>
    <ul className="list-disc list-inside space-y-2 mb-4">
      <li>Your personalized dashboard is ready</li>
      <li>Start generating content with AI assistance</li>
      <li>Explore trending topics in your industry</li>
      <li>Track your content performance</li>
    </ul>
    <p className="text-lg font-semibold">Click "Get Started" to begin your journey with ChillBroo!</p>
  </div>
);

export default Onboarding;