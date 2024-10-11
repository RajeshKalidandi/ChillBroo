import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();
  const { plan } = useSelector((state: RootState) => state.user);

  const plans = [
    {
      name: 'Freemium',
      monthlyPrice: 0,
      annualPrice: 0,
      credits: 100,
      duration: '30 days',
      features: [
        'AI-powered content generation (limited)',
        'Basic analytics',
        '1 social media account',
        '10 posts per month',
        'Email support',
      ],
      notIncluded: [
        'Advanced analytics',
        'Team collaboration',
        'Custom branding',
        'Priority support',
      ],
    },
    {
      name: 'Starter',
      monthlyPrice: 29,
      annualPrice: 290,
      credits: 1000,
      features: [
        'AI-powered content generation',
        'Basic analytics',
        '5 social media accounts',
        '100 posts per month',
        'Email support',
      ],
      notIncluded: [
        'Advanced analytics',
        'Team collaboration',
        'Custom branding',
        'Priority support',
      ],
    },
    {
      name: 'Pro',
      monthlyPrice: 79,
      annualPrice: 790,
      credits: 5000,
      features: [
        'Everything in Starter, plus:',
        'Advanced analytics',
        '15 social media accounts',
        'Unlimited posts',
        'Team collaboration (up to 3 members)',
        'Custom branding',
        'Priority email support',
      ],
      notIncluded: [
        '24/7 phone support',
        'Dedicated account manager',
      ],
    },
    {
      name: 'Enterprise',
      monthlyPrice: 199,
      annualPrice: 1990,
      credits: 'Unlimited',
      features: [
        'Everything in Pro, plus:',
        'Unlimited social media accounts',
        'Unlimited team members',
        'Advanced team permissions',
        'Custom AI model training',
        'API access',
        '24/7 phone support',
        'Dedicated account manager',
      ],
      notIncluded: [],
    },
  ];

  const handleSelectPlan = (planName: string, price: number) => {
    if (planName === 'Freemium') {
      // If the user is selecting the Freemium plan, navigate to the dashboard
      navigate('/dashboard');
    } else {
      // For paid plans, navigate to the checkout page
      navigate('/checkout', { state: { planName, price: isAnnual ? price / 12 : price } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Unlock the full potential of your social media strategy with our flexible pricing options.
      </p>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="flex bg-gray-100 p-1 rounded-full">
            <button
              className={`px-4 py-2 rounded-full ${isAnnual ? 'bg-white shadow-md' : ''}`}
              onClick={() => setIsAnnual(true)}
            >
              Annual (Save 20%)
            </button>
            <button
              className={`px-4 py-2 rounded-full ${!isAnnual ? 'bg-white shadow-md' : ''}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((planOption, index) => (
          <motion.div
            key={planOption.name}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              planOption.name.toLowerCase() === plan ? 'border-4 border-blue-500' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">{planOption.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${isAnnual ? planOption.annualPrice / 12 : planOption.monthlyPrice}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              {planOption.credits && (
                <p className="text-green-600 mb-4">
                  {planOption.credits} credits per month
                </p>
              )}
              {planOption.duration && (
                <p className="text-blue-600 mb-4">
                  Free for {planOption.duration}
                </p>
              )}
              <button 
                className={`w-full py-2 rounded-md transition duration-300 ${
                  planOption.name.toLowerCase() === plan
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={() => handleSelectPlan(planOption.name, isAnnual ? planOption.annualPrice : planOption.monthlyPrice)}
                disabled={planOption.name.toLowerCase() === plan}
              >
                {planOption.name.toLowerCase() === plan ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
            <div className="bg-gray-50 p-8">
              <h3 className="font-semibold mb-4">Features:</h3>
              <ul className="space-y-2">
                {planOption.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="text-green-500 mr-2" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
                {planOption.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-400">
                    <X className="text-red-500 mr-2" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Not sure which plan is right for you?</h2>
        <p className="text-gray-600 mb-8">
          Our team is here to help you choose the perfect plan for your needs.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default Pricing;