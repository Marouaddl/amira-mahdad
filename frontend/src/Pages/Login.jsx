import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { username: 'admin', password }); // Débogage
    try {
      const res = await API.post('/auth/login', { username: 'admin', password });
      console.log('Login success:', res.data); // Débogage
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message); // Débogage détaillé
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      {showError && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center animate-fade-in">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-montserrat font-medium">Mot de passe incorrect</span>
          </div>
        </div>
      )}
      <div className="text-center">
        <h1 className="text-5xl font-montserrat" style={{ color: '#F59E0B' }}>
          BONJOUR <span style={{ color: 'white' }}>AMIRA</span>
        </h1>
        <p className="mt-4 text-white font-montserrat">Entrez le mot de passe</p>
        <form onSubmit={handleSubmit}>
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-64 p-3 pl-10 pr-10 bg-transparent border ${
                  isFocused ? 'border-amber-400' : 'border-[#F59E0B]'
                } text-white font-montserrat focus:outline-none transition-colors`}
                placeholder="••••••••"
              />
              <button
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B] focus:outline-none"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      showPassword
                        ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                        : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 w-64 py-3 bg-[#F59E0B] text-black font-montserrat font-bold hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
          >
            CONNEXION
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;