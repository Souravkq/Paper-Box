/**
 * API Utility
 * Centralized axios instance with base URL
 */
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token from storage on every request
api.interceptors.request.use(cfg => {
  const user = JSON.parse(localStorage.getItem('pb_user') || 'null');
  if (user?.token) cfg.headers.Authorization = `Bearer ${user.token}`;
  return cfg;
});

export default api;
