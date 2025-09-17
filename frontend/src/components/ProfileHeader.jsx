import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhoneAlt, FaDownload, FaEye } from 'react-icons/fa';
import API from '../api';
import aa from '../assets/aa.jpg';

const ProfileHeader = () => {
  const [profile, setProfile] = useState({
    fullName: 'Amira Rihab Mahdad', // Hardcoded to enforce requirement
    title: 'Architecte DPLG',
    description: 'Spécialisée en conception architecturale moderne...',
    experience: '8',
    email: 'amira.mahdad@email.com',
    phone: '+213 XX XX XX XX',
    location: 'Alger, Algérie',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        // Preserve the hardcoded fullName, merge other fields
        setProfile((prev) => ({
          ...prev,
          ...res.data,
          fullName: 'Amira Rihab Mahdad', // Enforce the name
        }));
      } catch (err) {
        console.error('Erreur fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // Simplified function to format "Amira Rihab Mahdad"
  const formatName = () => (
    <>
      Amira Rihab <span className="text-orange-500 font-bold">Mahdad</span>
    </>
  );

  // Function to download the existing CV
  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/cv_amira_mahdad.pdf'; // Path relative to public folder
    link.download = 'cv_amira_mahdad.pdf'; // Downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to scroll to the "MES RÉALISATIONS" section (ID "projets")
  const handleScrollToProjects = () => {
    const projectsSection = document.getElementById('projets');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="accueil"
      className="bg-black flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-12 px-3 sm:px-6 py-6 sm:py-12 md:py-16 border-b border-orange-500"
    >
      <div className="md:w-1/2">
        <p className="text-xs sm:text-sm text-orange-500 uppercase tracking-wider mb-1 sm:mb-3 flex items-center">
          <span className="inline-block w-4 sm:w-6 h-0.5 bg-orange-500 mr-1 sm:mr-2"></span>
          Architecte professionnelle
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight mb-1 sm:mb-2">
          {formatName()}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium mb-3 sm:mb-6">{profile.title}</p>
        <p className="text-gray-400 leading-relaxed mb-4 sm:mb-8 max-w-xs sm:max-w-md md:max-w-xl">{profile.description}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-10">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-black font-medium px-3 sm:px-5 py-1.5 sm:py-2.5 rounded transition-all text-xs sm:text-sm"
          >
            <FaDownload className="text-xs sm:text-sm" />
            <span>PORTFOLIO PDF</span>
          </button>
          <button
            onClick={handleScrollToProjects}
            className="flex items-center gap-1 sm:gap-2 border border-white hover:border-orange-500 text-white hover:text-orange-500 font-medium px-3 sm:px-5 py-1.5 sm:py-2.5 rounded transition-all text-xs sm:text-sm"
          >
            <FaEye className="text-xs sm:text-sm" />
            <span>MES RÉALISATIONS</span>
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-white transition-colors">
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FaEnvelope className="text-orange-500 text-xs sm:text-sm" />
            </div>
            <span className="text-xs sm:text-sm">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-white transition-colors">
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FaPhoneAlt className="text-orange-500 text-xs sm:text-sm" />
            </div>
            <span className="text-xs sm:text-sm">{profile.phone}</span>
          </div>
        </div>
      </div>
      <div className="relative md:w-1/2 flex justify-center items-center w-full">
        <div className="relative w-full max-w-xs sm:max-w-md md:max-w-md h-48 sm:h-72 md:h-96 border-2 border-orange-500 p-1 sm:p-2 rounded-lg">
          <div
            className="w-full h-full bg-gray-800 border border-gray-700 rounded-md overflow-hidden"
            style={{
              backgroundImage: `url(${aa})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <span className="sr-only">Photo de Amira Rihab Mahdad</span>
          </div>
          <div className="absolute -bottom-3 sm:-bottom-5 left-2 sm:left-5 bg-black border border-orange-500 px-3 sm:px-5 py-1 sm:py-2 rounded-lg text-center shadow-lg hover:scale-105 transition-transform">
            <div className="text-orange-500 text-lg sm:text-xl font-bold">{profile.experience}</div>
            <div className="text-[8px] sm:text-[10px] text-white uppercase tracking-wider">ANNÉES D'EXPÉRIENCE</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;