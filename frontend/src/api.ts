// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Antes de cada requisição, injeta o token (se existir)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('token no interceptor:', token);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
