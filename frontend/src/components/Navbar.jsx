import { Eye } from 'lucide-react';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between border-b border-orange-500">
      {/* Gauche - Logo et Titre */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Losange */}
        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-orange-500 rotate-45 flex-shrink-0"></div>

        {/* Titre + Sous-titre */}
        <div className="leading-tight min-w-0">
          <h1 className="text-[11px] sm:text-xs font-medium whitespace-nowrap">
            PANNEAU <span className="text-orange-500">D'ADMINISTRATION</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] text-gray-400 whitespace-nowrap">
            Gestion du portfolio
          </p>
        </div>
      </div>

      {/* Droite - Bouton Voir le site */}
      <a
        href="/portfolio"
        className="bg-white text-orange-600 font-semibold flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 whitespace-nowrap"
      >
        <Eye size={12} className="sm:size-[14px]" />
        <span className="text-[10px] sm:text-xs">VOIR LE SITE</span>
      </a>
    </nav>
  );
};

export default Navbar;