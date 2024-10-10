import { auth } from '../firebaseConfig';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const connectTwitter = async () => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.get(`${API_URL}/api/auth/twitter`, {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    window.location.href = response.data.authUrl;
  } catch (error) {
    console.error('Error connecting to Twitter:', error);
    throw error;
  }
};

export const postToTwitter = async (content: string) => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.post(`${API_URL}/api/post/twitter`, 
      { content },
      { headers: { 'Authorization': `Bearer ${idToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    throw error;
  }
};