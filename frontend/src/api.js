import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if backend URL differs
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to requests for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;