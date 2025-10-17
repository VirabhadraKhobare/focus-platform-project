import axios from 'axios';


// Detect the correct backend URL for production and development
// Priority:
// 1. runtime override (window.__BACKEND_URL__)
// 2. build-time VITE_BACKEND_URL (recommended for Vercel/Render)
// 3. in production builds, use relative `/api` so the client talks to same origin
// 4. in dev, fall back to localhost with VITE_BACKEND_PORT
let runtimeOverride: string | null = null;

const getBackendURL = () => {
  // runtime override (can be injected via a small <script> in index.html)
  if (typeof window !== 'undefined' && (window as any).__BACKEND_URL__) {
    runtimeOverride = (window as any).__BACKEND_URL__;
    console.info('Using runtime backend override:', runtimeOverride);
    return `${runtimeOverride.replace(/\/$/, '')}/api`;
  }

  // build-time env (Vite)
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (backendUrl) {
    console.info('Using VITE_BACKEND_URL:', backendUrl);
    return `${backendUrl.replace(/\/$/, '')}/api`;
  }

  // In production builds prefer a relative path so the browser talks to the same origin
  if (import.meta.env.PROD) {
    console.warn('VITE_BACKEND_URL not set — using relative "/api" so the frontend uses the current origin. Set VITE_BACKEND_URL in Vercel for explicit backend.');
    return '/api';
  }

  // Fallback to localhost for local development
  const port = import.meta.env.VITE_BACKEND_PORT || '4000';
  const fallback = `http://localhost:${port}/api`;
  console.info('No backend env found — falling back to', fallback);
  return fallback;
};

// Allow programmatic runtime override (useful for previews or manual testing)
export const setRuntimeBackend = (url: string | null) => {
  runtimeOverride = url;
  if (typeof window !== 'undefined') (window as any).__BACKEND_URL__ = url;
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