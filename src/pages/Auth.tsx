import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LocationState {
  userData?: {
    name: string;
    company: string;
    industry: string;
    platforms: string[];
    contentType: string;
  };
}

const Auth: React.FC = () => {
  const location = useLocation();
  const { userData } = location.state as LocationState || {};

  return (
    <div className="max-w-md mx-auto mt-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to ChillBroo</h1>
      {userData ? (
        <p className="mb-8">Thank you for completing the onboarding process. Please login or register to continue.</p>
      ) : (
        <p className="mb-8">Please login or register to access ChillBroo.</p>
      )}
      <div className="space-y-4">
        <Link
          to="/login"
          className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          state={{ userData }}
          className="block w-full bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Auth;