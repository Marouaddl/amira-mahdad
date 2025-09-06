import React, { useState, useEffect } from 'react';
import API from '../api';
import aa from '../assets/aa.jpg';
import bb from '../assets/bb.jpg'; // Importation de l'image bb.jpg

const AboutSection = () => {
  const [profile, setProfile] = useState({
    description: 'Architecte diplômé avec 8 années d\'expérience dans la conception de projets résidentiels, commerciaux et publics...',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setProfile({ description: res.data.description || profile.description });
      } catch (err) {
        console.error('Erreur fetch about:', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <section id="apropos" className="bg-black text-white px-4 sm:px-6 md:px-20 py-6 sm:py-8 md:py-12 border-t border-orange-500">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-6 sm:w-10 h-0.5 bg-orange-500" />
        <h2 className="text-xl sm:text-2xl font-semibold">À PROPOS</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
        <div className="sm:w-1/2 space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed">
          <p>{profile.description}</p>
          <p>
            Mon approche méthodique intègre une analyse approfondie du contexte, une écoute attentive des besoins
            des clients et l’application des dernières innovations technologiques et matériaux durables.
          </p>
          <p className="text-orange-400 font-medium">
            Spécialisé dans l'architecture bioclimatique et les certifications environnementales,
            je conçois des espaces qui respectent notre planète.
          </p>
          <div>
            <h3 className="uppercase text-white font-semibold mb-2 sm:mb-3 text-xs sm:text-sm tracking-wider">
              Expertise Technique
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500" /> AutoCAD
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500" /> Design d’intérieur
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500" /> Architecture Durable
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500" /> SketchUp
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500" /> Urbanisme
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500" /> 3ds Max
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-1/2 relative">
          <div className="border border-orange-500 p-1 sm:p-2 relative">
            <div
              className="w-full h-48 sm:h-80 bg-gray-800 border border-gray-700 rounded-md overflow-hidden"
              style={{
                backgroundImage: `url(${bb})`, // Utilisation de l'image importée bb.jpg
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute top-0 right-0 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-r-2 border-orange-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;