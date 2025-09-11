import axios from 'axios';

console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL); // Débogage
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://amira-mahdad-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token added to request:', token); // Débogage
  } else {
    console.log('No token found in localStorage'); // Débogage
  }
  return config;
}, (error) => Promise.reject(error));

export default API;