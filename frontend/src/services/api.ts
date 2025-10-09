import axios from 'axios';

// Detect the correct backend port
const getBackendURL = () => {
  // Default to 4000, but allow override via Vite env variables
  const port = import.meta.env.VITE_BACKEND_PORT || '4000';
  return `http://localhost:${port}/api`;
};

const api = axios.create({
  baseURL: getBackendURL(),
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    console.error('❌ Full Error:', error);
    
    // Check if it's a network error
    if (!error.response) {
      console.error('❌ Network Error: Backend server might be down or unreachable');
      error.isNetworkError = true;
      error.message = 'Network Error: Cannot connect to server. Please check if the backend is running.';
    }
    
    return Promise.reject(error);
  }
);

export default api;