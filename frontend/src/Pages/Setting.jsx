import React, { useState } from 'react';
import API from '../api';

const Setting = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setStatus('Veuillez remplir tous les champs');
      setTimeout(() => setStatus(''), 3000);
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus('Les nouveaux mots de passe ne correspondent pas');
      setTimeout(() => setStatus(''), 3000);
      return;
    }
    try {
      await API.put('/settings/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setStatus('Mot de passe changé avec succès !');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Erreur lors du changement de mot de passe');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white px-6 py-10">
      <h2 className="text-lg font-bold mb-6">
        <span className="border-b-2 border-orange-500 pb-1">PARAMÈTRES</span>
      </h2>
      <div className="border border-orange-500 rounded p-5 w-full max-w-md">
        <h3 className="text-sm font-semibold border-b border-orange-500 pb-2 mb-4 uppercase tracking-wide">
          CHANGER LE MOT DE PASSE
        </h3>
        {status && <p className="text-sm text-orange-500 mb-4">{status}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs mb-1 block">MOT DE PASSE ACTUEL</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full bg-black border border-orange-500 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs mb-1 block">NOUVEAU MOT DE PASSE</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full bg-black border border-orange-500 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs mb-1 block">CONFIRMER LE NOUVEAU MOT DE PASSE</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-black border border-orange-500 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <button type="submit" className="bg-orange-500 text-black font-bold text-sm px-4 py-2 rounded">
            ENREGISTRER
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;