import React, { useState, useEffect } from 'react';
import { FaCheck, FaSmile, FaCalendarAlt, FaAward } from 'react-icons/fa';
import API from '../api';

const StatsSection = () => {
  const [stats, setStats] = useState([
    { icon: <FaCheck className="text-orange-500" />, label: 'PROJETS RÉALISÉS', value: '0', description: 'Conceptions abouties avec excellence' },
    { icon: <FaSmile className="text-orange-500" />, label: 'CLIENTS SATISFAITS', value: '0', description: 'Relations clientèles durables' },
    { icon: <FaCalendarAlt className="text-orange-500" />, label: "ANNÉES D'EXPÉRIENCE", value: '0', description: 'Expertise confirmée' },
    { icon: <FaAward className="text-orange-500" />, label: 'CERTIFICATIONS', value: '0', description: 'Compétences reconnues' },
  ]);

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profile');
      const profileData = res.data;
      
      setStats([
        { 
          ...stats[0], 
          value: profileData.projectsCompleted ? `${profileData.projectsCompleted}` : '0',
          description: 'Conceptions abouties avec excellence'
        },
        { 
          ...stats[1], 
          value: profileData.satisfiedClients || '0',
          description: 'Relations clientèles durables'
        },
        { 
          ...stats[2], 
          value: profileData.experience || '0',
          description: 'Expertise confirmée'
        },
        { 
          ...stats[3], 
          value: profileData.certifications || '0',
          description: 'Compétences reconnues'
        },
      ]);
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur fetch stats:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Écouter les mises à jour depuis Admin
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  if (loading) {
    return (
      <section className="bg-black border-b border-orange-500/30 py-10 px-4 sm:py-16 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-800/60 rounded-lg p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-5">
                  <div className="p-2 sm:p-3 bg-gray-700 rounded-full w-8 h-8 sm:w-12 sm:h-12"></div>
                </div>
                <div className="h-6 sm:h-8 bg-gray-700 rounded mb-2 mx-auto w-3/4"></div>
                <div className="h-4 sm:h-6 bg-gray-700 rounded mb-2 sm:mb-3 mx-auto w-1/2"></div>
                <div className="h-3 sm:h-4 bg-gray-700 rounded mx-auto w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black border-b border-orange-500/30 py-10 px-4 sm:py-16 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/60 hover:bg-gray-900/80 border border-orange-500/20 hover:border-orange-500/40 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <div className="relative z-10">
                <div className="flex justify-center mb-3 sm:mb-5">
                  <div className="p-2 sm:p-3 bg-orange-500/20 rounded-full group-hover:bg-orange-500/30 transition-colors duration-300 flex items-center justify-center">
                    {React.cloneElement(stat.icon, { size: window.innerWidth < 640 ? 18 : 24 })}
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors duration-300">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm md:text-lg text-orange-500 font-medium mb-2 sm:mb-3 leading-tight sm:leading-normal">
                  {stat.label}
                </p>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight sm:leading-normal">
                  {stat.description}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;