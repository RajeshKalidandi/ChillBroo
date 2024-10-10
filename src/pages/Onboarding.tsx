import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, SkipForward } from 'lucide-react';

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

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        // TODO: Send userData to backend
        console.log('User data:', userData);
        navigate('/dashboard');
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

// Update StepOne, StepTwo, and StepThree components to include error handling
// For brevity, I'll only show the updated StepOne component

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

// ... (StepTwo and StepThree components)

export default Onboarding;