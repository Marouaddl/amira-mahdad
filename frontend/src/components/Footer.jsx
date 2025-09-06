import React from 'react';
import { FaGem } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-orange-500 text-white px-6 md:px-20 py-8 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <FaGem className="text-orange-500 text-xl" />
          <div>
            <h4 className="uppercase font-semibold text-sm">
              <span className="text-white">Amira </span>
              <span className="text-orange-500">Mahdad</span>
            </h4>
            <p className="text-xs text-gray-400">Architecte DPLG</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center">
          © 2025 Amira Mahdad. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;