import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';

const API_URL = import.meta.env.VITE_API_URL;

interface UserSettings {
  notificationPreferences: {
    email: boolean;
    push: boolean;
  };
  contentPreferences: string[];
}

const UserSettings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    notificationPreferences: { email: false, push: false },
    contentPreferences: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/user-settings`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      setError('Failed to fetch user settings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/user-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error('Failed to update user settings');
      alert('Settings updated successfully');
    } catch (err) {
      setError('Failed to update user settings');
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading user settings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">User Settings</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notificationPreferences.email}
              onChange={(e) => setSettings({
                ...settings,
                notificationPreferences: { ...settings.notificationPreferences, email: e.target.checked }
              })}
              className="mr-2"
            />
            Receive email notifications
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notificationPreferences.push}
              onChange={(e) => setSettings({
                ...settings,
                notificationPreferences: { ...settings.notificationPreferences, push: e.target.checked }
              })}
              className="mr-2"
            />
            Receive push notifications
          </label>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-4">Content Preferences</h3>
        <div className="mb-4">
          {['Technology', 'Marketing', 'Finance', 'Health', 'Education'].map((preference) => (
            <label key={preference} className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={settings.contentPreferences.includes(preference)}
                onChange={(e) => {
                  const updatedPreferences = e.target.checked
                    ? [...settings.contentPreferences, preference]
                    : settings.contentPreferences.filter(p => p !== preference);
                  setSettings({ ...settings, contentPreferences: updatedPreferences });
                }}
                className="mr-2"
              />
              {preference}
            </label>
          ))}
        </div>
        <button
          onClick={updateSettings}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default UserSettings;