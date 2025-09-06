import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [contactInfo, setContactInfo] = useState({
    email: 'amira.mahdad@email.com',
    phone: '+213 XX XX XX XX',
    location: 'Alger, Algérie',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setContactInfo({
          email: res.data.email || 'amira.mahdad@email.com',
          phone: res.data.phone || '+213 XX XX XX XX',
          location: res.data.location || 'Alger, Algérie',
        });
      } catch (err) {
        console.error('Erreur fetch contact:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/contact', formData); // Envoie à /api/contact via baseURL
      if (response.status === 200) {
        setStatus('Message envoyé avec succès !');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setStatus('Erreur lors de l\'envoi du message.');
    }
  };

  return (
    <section id="contact" className="bg-black text-white px-4 sm:px-6 md:px-20 py-6 sm:py-8 md:py-12 border-t border-orange-500">
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4 md:mb-10">
        <div className="w-10 sm:w-14 h-0.5 bg-orange-500" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">CONTACT</h2>
        <div className="w-10 sm:w-14 h-0.5 bg-orange-500" />
      </div>
      <p className="text-center text-xs sm:text-sm md:text-base text-gray-300 mb-4 sm:mb-6 md:mb-10">
        Discutons de votre projet architectural
      </p>
      {status && <p className="text-center text-xs sm:text-sm md:text-base text-orange-500 mb-4">{status}</p>}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
        <div className="sm:w-1/2 space-y-4 sm:space-y-6">
          <h3 className="uppercase text-white font-semibold mb-2 sm:mb-3 text-xs sm:text-sm md:text-base tracking-wider">Informations</h3>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-transparent text-orange-500 text-lg sm:text-xl"><FaEnvelope /></div>
            <div>
              <p className="uppercase text-xs sm:text-sm text-gray-400">Email</p>
              <p className="text-sm sm:text-base font-semibold text-white">{contactInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-transparent text-orange-500 text-lg sm:text-xl"><FaPhoneAlt /></div>
            <div>
              <p className="uppercase text-xs sm:text-sm text-gray-400">Téléphone</p>
              <p className="text-sm sm:text-base font-semibold text-white">{contactInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-transparent text-orange-500 text-lg sm:text-xl"><FaMapMarkerAlt /></div>
            <div>
              <p className="uppercase text-xs sm:text-sm text-gray-400">Localisation</p>
              <p className="text-sm sm:text-base font-semibold text-white">{contactInfo.location}</p>
            </div>
          </div>
        </div>
        <div className="sm:w-1/2 border border-gray-600 rounded-md p-3 sm:p-6">
          <h3 className="uppercase text-white font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base tracking-wider">Message</h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prénom"
                className="w-full sm:w-1/2 bg-black border border-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-white placeholder-gray-400"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nom"
                className="w-full sm:w-1/2 bg-black border border-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-white placeholder-gray-400"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-black border border-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-white placeholder-gray-400"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez votre projet . . ."
              rows="3 sm:rows-4"
              className="w-full bg-black border border-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-white placeholder-gray-400"
              required
            />
            <button type="submit" className="bg-orange-500 text-black text-xs sm:text-sm md:text-base font-semibold w-full py-1.5 sm:py-2">
              ENVOYER LE MESSAGE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;