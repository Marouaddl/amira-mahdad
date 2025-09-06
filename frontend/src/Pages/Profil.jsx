import React, { useState, useEffect } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaPhone } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import API from '../api';

const Profil = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    description: '',
    experience: '',
    email: '',
    phone: '',
    location: '',
    projectsCompleted: '',
    satisfiedClients: '',
    certifications: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setFormData({
          fullName: res.data.fullName || '',
          title: res.data.title || '',
          description: res.data.description || '',
          experience: res.data.experience || res.data.yearsExperience || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          location: res.data.location || '',
          projectsCompleted: res.data.projectsCompleted || '',
          satisfiedClients: res.data.satisfiedClients || '',
          certifications: res.data.certifications || '',
        });
      } catch (err) {
        console.error('Erreur fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Préparer les données pour l'envoi
      const dataToSend = {
        ...formData,
        // Assurer la compatibilité avec l'ancien champ yearsExperience
        yearsExperience: formData.experience
      };
      
      await API.put('/profile', dataToSend);
      alert('Informations enregistrées avec succès !');
      
      // Émettre un événement pour notifier les autres composants
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white px-6 py-10">
      <h2 className="text-2xl font-bold mb-8">
        <span className="border-b-4 border-orange-500 pb-2">PROFIL PERSONNEL</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Colonne de gauche - Informations générales */}
          <div className="border border-orange-500 rounded-lg p-6 space-y-6 bg-gray-900/50">
            <h3 className="text-base font-semibold border-b-2 border-orange-500 pb-2 uppercase tracking-wide">
              INFORMATIONS GÉNÉRALES
            </h3>
            
            <div>
              <label className="text-sm mb-2 block">NOM COMPLET</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Votre nom complet"
              />
            </div>
            
            <div>
              <label className="text-sm mb-2 block">TITRE PROFESSIONNEL</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Architecte DPLG"
              />
            </div>
            
            <div>
              <label className="text-sm mb-2 block">DESCRIPTION</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Décrivez votre parcours et spécialités..."
              />
            </div>
            
            <div>
              <label className="text-sm mb-2 block">ANNÉES D'EXPÉRIENCE</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: 8"
                min="0"
              />
            </div>
          </div>

          {/* Colonne de droite - Contact & Statistiques */}
          <div className="border border-orange-500 rounded-lg p-6 space-y-6 bg-gray-900/50">
            <h3 className="text-base font-semibold border-b-2 border-orange-500 pb-2 uppercase tracking-wide">
              CONTACT & STATISTIQUES
            </h3>
            
            <div className="relative">
              <label className="text-sm mb-2 block">EMAIL</label>
              <div className="flex items-center">
                <MdEmail className="absolute left-4 text-orange-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-orange-500 rounded-lg px-12 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="text-sm mb-2 block">TÉLÉPHONE</label>
              <div className="flex items-center">
                <FaPhone className="absolute left-4 text-orange-500" size={20} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black border border-orange-500 rounded-lg px-12 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+213 XX XX XX XX"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="text-sm mb-2 block">LOCALISATION</label>
              <div className="flex items-center">
                <GoLocation className="absolute left-4 text-orange-500" size={20} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-black border border-orange-500 rounded-lg px-12 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Alger, Algérie"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm mb-2 block">PROJETS RÉALISÉS</label>
              <input
                type="number"
                name="projectsCompleted"
                value={formData.projectsCompleted}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: 24"
                min="0"
              />
            </div>
            
            <div>
              <label className="text-sm mb-2 block">CLIENTS SATISFAITS</label>
              <input
                type="number"
                name="satisfiedClients"
                value={formData.satisfiedClients}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: 18"
                min="0"
              />
            </div>
            
            <div>
              <label className="text-sm mb-2 block">CERTIFICATIONS</label>
              <input
                type="number"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: 6"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Bouton d'enregistrement unique */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 text-black font-bold text-lg px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ENREGISTREMENT...
              </>
            ) : (
              'ENREGISTRER LES MODIFICATIONS'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profil;