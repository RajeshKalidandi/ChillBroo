import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, SkipForward, Zap, Target, Rocket } from 'lucide-react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { motion } from 'framer-motion';

interface UserData {
  name: string;
  company: string;
  industry: string;
  platforms: string[];
  contentType: string;
  goals: string[];
}

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    company: '',
    industry: '',
    platforms: [],
    contentType: '',
    goals: [],
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
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
    } else if (currentStep === 3) {
      if (userData.goals.length === 0) {
        newErrors.goals = 'Please select at least one goal';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        // Navigate to the auth page instead of submitting data
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
    navigate('/dashboard');
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8 bg-white rounded-lg shadow-xl">
      <motion.h1 
        className="text-4xl font-bold text-center text-indigo-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to ChillBroo
      </motion.h1>
      <motion.p 
        className="text-xl text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Let's set up your account and supercharge your social media strategy!
      </motion.p>
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                i <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {i < step ? <Check size={20} /> : i}
            </motion.div>
            {i < 4 && <div className={`w-24 h-1 ${i < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && <StepOne userData={userData} updateUserData={updateUserData} errors={errors} />}
        {step === 2 && <StepTwo userData={userData} updateUserData={updateUserData} errors={errors} />}
        {step === 3 && <StepThree userData={userData} updateUserData={updateUserData} errors={errors} />}
        {step === 4 && <StepFour />}
      </motion.div>

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <motion.button
            onClick={handleBack}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </motion.button>
        )}
        <motion.button
          onClick={handleSkip}
          className="bg-gray-100 text-gray-600 py-2 px-4 rounded-md font-semibold hover:bg-gray-200 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip
          <SkipForward className="ml-2" size={16} />
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {step === 4 ? 'Get Started' : 'Next'}
          <ArrowRight className="ml-2" size={16} />
        </motion.button>
      </div>
    </div>
  );
};

const StepOne: React.FC<{
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  errors: Partial<UserData>;
}> = ({ userData, updateUserData, errors }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">Tell us about yourself</h2>
    <div>
      <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
        Name
      </label>
      <input
        type="text"
        id="name"
        value={userData.name}
        onChange={(e) => updateUserData({ name: e.target.value })}
        className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Your name"
      />
      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
    </div>
    <div>
      <label htmlFor="company" className="block mb-1 font-medium text-gray-700">
        Company (optional)
      </label>
      <input
        type="text"
        id="company"
        value={userData.company}
        onChange={(e) => updateUserData({ company: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Your company name"
      />
    </div>
    <div>
      <label htmlFor="industry" className="block mb-1 font-medium text-gray-700">
        Industry
      </label>
      <select
        id="industry"
        value={userData.industry}
        onChange={(e) => updateUserData({ industry: e.target.value })}
        className={`w-full p-2 border rounded-md ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Select an industry</option>
        <option value="tech">Technology</option>
        <option value="finance">Finance</option>
        <option value="healthcare">Healthcare</option>
        <option value="education">Education</option>
        <option value="ecommerce">E-commerce</option>
        <option value="other">Other</option>
      </select>
      {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
    </div>
  </div>
);

const StepTwo: React.FC<{
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  errors: Partial<UserData>;
}> = ({ userData, updateUserData, errors }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">Your Content Strategy</h2>
    <div>
      <label className="block mb-1 font-medium text-gray-700">Platforms</label>
      <div className="grid grid-cols-2 gap-4">
        {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'].map((platform) => (
          <label key={platform} className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <input
              type="checkbox"
              checked={userData.platforms.includes(platform)}
              onChange={(e) => {
                const updatedPlatforms = e.target.checked
                  ? [...userData.platforms, platform]
                  : userData.platforms.filter((p) => p !== platform);
                updateUserData({ platforms: updatedPlatforms });
              }}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span>{platform}</span>
          </label>
        ))}
      </div>
      {errors.platforms && <p className="text-red-500 text-sm mt-1">{errors.platforms}</p>}
    </div>
    <div>
      <label htmlFor="contentType" className="block mb-1 font-medium text-gray-700">
        Primary Content Type
      </label>
      <select
        id="contentType"
        value={userData.contentType}
        onChange={(e) => updateUserData({ contentType: e.target.value })}
        className={`w-full p-2 border rounded-md ${errors.contentType ? 'border-red-500' : 'border-gray-300'}`}
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
);

const StepThree: React.FC<{
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  errors: Partial<UserData>;
}> = ({ userData, updateUserData, errors }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">Your Goals</h2>
    <p className="text-gray-600">Select your primary goals for using ChillBroo:</p>
    <div className="grid grid-cols-2 gap-4">
      {[
        'Increase brand awareness',
        'Generate leads',
        'Boost engagement',
        'Drive website traffic',
        'Improve customer service',
        'Increase sales',
        'Build community',
        'Establish thought leadership',
      ].map((goal) => (
        <label key={goal} className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <input
            type="checkbox"
            checked={userData.goals.includes(goal)}
            onChange={(e) => {
              const updatedGoals = e.target.checked
                ? [...userData.goals, goal]
                : userData.goals.filter((g) => g !== goal);
              updateUserData({ goals: updatedGoals });
            }}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span>{goal}</span>
        </label>
      ))}
    </div>
    {errors.goals && <p className="text-red-500 text-sm mt-1">{errors.goals}</p>}
  </div>
);

const StepFour: React.FC = () => (
  <div className="space-y-6 text-center">
    <h2 className="text-3xl font-bold text-indigo-600">You're All Set!</h2>
    <p className="text-xl text-gray-600">
      Thank you for completing the onboarding process. We're excited to help you create amazing content!
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <FeatureCard
        icon={<Zap className="w-12 h-12 text-indigo-500" />}
        title="AI-Powered Content"
        description="Generate engaging posts with our advanced AI technology"
      />
      <FeatureCard
        icon={<Target className="w-12 h-12 text-indigo-500" />}
        title="Targeted Strategies"
        description="Reach your audience with personalized content strategies"
      />
      <FeatureCard
        icon={<Rocket className="w-12 h-12 text-indigo-500" />}
        title="Growth Analytics"
        description="Track your progress and optimize your social media performance"
      />
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    {icon}
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Onboarding;