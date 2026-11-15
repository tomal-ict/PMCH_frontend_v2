import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000
});

// Interceptor to add JWT token if stored and handle FormData headers cleanly
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pmch_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser / Axios automatically set multipart/form-data boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
