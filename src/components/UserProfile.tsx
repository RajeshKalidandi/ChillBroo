import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import axios from 'axios';

interface UserProfileData {
  name: string;
  company: string;
  industry: string;
  platforms: string[];
  contentType: string;
}

const UserProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    company: '',
    industry: '',
    platforms: [],
    contentType: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-profile`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setProfileData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to fetch profile data');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePlatformChange = (platform: string) => {
    setProfileData((prevData) => {
      const updatedPlatforms = prevData.platforms.includes(platform)
        ? prevData.platforms.filter((p) => p !== platform)
        : [...prevData.platforms, platform];
      return { ...prevData, platforms: updatedPlatforms };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const idToken = await auth.currentUser?.getIdToken();
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user-profile`,
        profileData,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="company" className="block mb-1">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={profileData.company}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="industry" className="block mb-1">Industry</label>
          <select
            id="industry"
            name="industry"
            value={profileData.industry}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select an industry</option>
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Platforms</label>
          {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok'].map((platform) => (
            <label key={platform} className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={profileData.platforms.includes(platform)}
                onChange={() => handlePlatformChange(platform)}
                className="mr-2"
              />
              {platform}
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="contentType" className="block mb-1">Primary Content Type</label>
          <select
            id="contentType"
            name="contentType"
            value={profileData.contentType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a content type</option>
            <option value="text">Text Posts</option>
            <option value="images">Images</option>
            <option value="videos">Videos</option>
            <option value="mixed">Mixed Content</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;