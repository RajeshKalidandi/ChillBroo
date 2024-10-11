import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const cache = new Map();

export const fetchWithCache = async (url, params = {}) => {
  const cacheKey = `${url}${JSON.stringify(params)}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await api.get(url, { params });
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Use this function in your components instead of direct API calls