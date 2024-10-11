import React from 'react';

interface SocialMediaIntegrationProps {
  content: string;
}

const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({ content }) => {
  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Social Media Integration</h3>
      <p className="text-lg text-gray-600 mb-4">
        Direct posting to social media platforms is coming soon! 
        This feature will allow you to share your generated content directly to various social media platforms.
      </p>
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded" role="alert">
        <p className="font-bold">Stay tuned!</p>
        <p>We're working hard to bring you seamless integration with popular social media platforms.</p>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;