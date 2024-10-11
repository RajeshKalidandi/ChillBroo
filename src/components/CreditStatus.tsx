import React from 'react';
import { Link } from 'react-router-dom';
import { useCredits } from '../hooks/useCredits';

const CreditStatus: React.FC = () => {
  const credits = useCredits();

  if (credits === null) return null;

  return (
    <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <p className="text-lg font-semibold">
        Available Credits: <span className="text-blue-600 dark:text-blue-400">{credits}</span>
      </p>
      {credits < 20 && (
        <div className="mt-2">
          <p className="text-red-500 dark:text-red-400">Your credits are running low!</p>
          <Link to="/pricing" className="text-blue-500 hover:underline">
            Purchase more credits
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreditStatus;