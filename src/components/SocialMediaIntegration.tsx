import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
}

const SocialMediaIntegration: React.FC = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newConnection, setNewConnection] = useState({ platform: '', username: '' });

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

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add the new connection to Firestore
      await addDoc(collection(db, 'connected_accounts'), {
        userId: user.uid,
        platform: newConnection.platform,
        username: newConnection.username,
      });

      showSuccessToast(`Connected to ${newConnection.platform} successfully`);
      setNewConnection({ platform: '', username: '' });
      fetchConnectedAccounts();
    } catch (error) {
      console.error('Error connecting account:', error);
      showErrorToast('Failed to connect account');
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
                  {account.platform}: {account.username}
                </span>
                <button
                  onClick={() => handleDisconnect(account.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Disconnect
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Connect New Account</h3>
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="platform" className="block mb-1">Platform</label>
            <select
              id="platform"
              value={newConnection.platform}
              onChange={(e) => setNewConnection({ ...newConnection, platform: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a platform</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
          <div>
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={newConnection.username}
              onChange={(e) => setNewConnection({ ...newConnection, username: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;