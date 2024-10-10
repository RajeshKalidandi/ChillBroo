import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';

const API_URL = import.meta.env.VITE_API_URL;

interface ConnectedAccount {
  platform: string;
  username: string;
}

const SocialMediaIntegration: React.FC = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/connected-accounts`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch connected accounts');
      const data = await response.json();
      setConnectedAccounts(data.connectedAccounts);
    } catch (err) {
      setError('Failed to fetch connected accounts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectAccount = async (platform: string) => {
    // Implement OAuth flow for the selected platform
    console.log(`Connecting to ${platform}...`);
  };

  if (isLoading) return <div>Loading social media integrations...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Social Media Integrations</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Connected Accounts</h3>
        {connectedAccounts.map((account, index) => (
          <div key={index} className="mb-2">
            <span className="font-medium">{account.platform}:</span> {account.username}
          </div>
        ))}
        <h3 className="text-xl font-semibold mt-6 mb-4">Connect New Account</h3>
        <div className="flex space-x-4">
          {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((platform) => (
            <button
              key={platform}
              onClick={() => connectAccount(platform)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Connect {platform}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;