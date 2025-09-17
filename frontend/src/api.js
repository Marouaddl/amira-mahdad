import axios from 'axios';

console.log('REACT_APP_API_URL:', import.meta.env.VITE_API_URL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://amira-mahdad-backend.onrender.com/api',
});

// Interceptor باش يزيد التوكن
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token added to request:', token);
  } else {
    console.log('No token found in localStorage');
  }
  return config;
}, (error) => Promise.reject(error));

export default API;
