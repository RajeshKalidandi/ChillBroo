import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface ConnectedAccount {
  id: string;
  platform: string;
  accessToken: string;
  refreshToken: string;
  connectedAt: Date;
}

const SocialMediaIntegration: React.FC = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      const q = query(collection(db, 'connected_accounts'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const accounts: ConnectedAccount[] = [];
      querySnapshot.forEach((doc) => {
        accounts.push({ id: doc.id, ...doc.data() } as ConnectedAccount);
      });
      setConnectedAccounts(accounts);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      showErrorToast('Failed to fetch connected accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      const idToken = await user.getIdToken();
      const response = await axios.get(`${API_URL}/api/auth/${platform.toLowerCase()}`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      showErrorToast(`Failed to connect to ${platform}`);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await deleteDoc(doc(db, 'connected_accounts', accountId));
      showSuccessToast('Account disconnected successfully');
      fetchConnectedAccounts();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      showErrorToast('Failed to disconnect account');
    }
  };

  const refreshToken = async (accountId: string, platform: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      const idToken = await user.getIdToken();
      const response = await axios.post(`${API_URL}/api/refresh-token/${platform.toLowerCase()}`, 
        { accountId },
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );
      const updatedAccount = response.data;
      await updateDoc(doc(db, 'connected_accounts', accountId), updatedAccount);
      showSuccessToast('Token refreshed successfully');
      fetchConnectedAccounts();
    } catch (error) {
      console.error('Error refreshing token:', error);
      showErrorToast('Failed to refresh token');
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading social media integrations...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Social Media Integrations</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Connected Accounts</h3>
        {connectedAccounts.length === 0 ? (
          <p>No accounts connected yet.</p>
        ) : (
          <ul className="space-y-4">
            {connectedAccounts.map((account) => (
              <li key={account.id} className="flex items-center justify-between">
                <span>
                  {account.platform}: Connected on {new Date(account.connectedAt).toLocaleDateString()}
                </span>
                <div>
                  <button
                    onClick={() => refreshToken(account.id, account.platform)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Refresh Token
                  </button>
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Disconnect
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Connect New Account</h3>
        <div className="grid grid-cols-2 gap-4">
          {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((platform) => (
            <button
              key={platform}
              onClick={() => handleConnect(platform)}
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