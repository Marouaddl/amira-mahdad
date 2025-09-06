import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // Icônes pour le menu burger

const NavbarP = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Détection de la section active
      const sections = ['accueil', 'projets', 'apropos', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction de scroll doux
  const smoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false); // Ferme le menu mobile après clic
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-sm py-1 sm:py-2 shadow-lg' : 'bg-black py-2 sm:py-3'} border-b border-orange-500`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex justify-between items-center">
        {/* Logo + Nom avec animation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-1 sm:space-x-2 cursor-pointer"
          onClick={() => smoothScroll('accueil')}
        >
          <div className="w-2 sm:w-3 h-2 sm:h-3 border-2 border-orange-500 rotate-45 transition-transform hover:rotate-90 duration-300" />
          <h1 className="text-xs sm:text-sm font-semibold tracking-wide">
            <span className="text-white">AMIRA</span>{' '}
            <span className="text-orange-500">MAHDAD</span>
          </h1>
        </motion.div>

        {/* Navigation avec indicateur actif (cachée sur mobile) */}
        <nav className="hidden md:flex space-x-4 sm:space-x-6">
          {['accueil', 'projets', 'apropos', 'contact'].map((item) => (
            <div key={item} className="relative">
              <button
                onClick={() => smoothScroll(item)}
                className={`text-xs sm:text-sm font-medium tracking-wide uppercase px-1 sm:px-2 py-1 transition-colors ${
                  activeSection === item ? 'text-orange-500' : 'text-white hover:text-orange-400'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
              
              {activeSection === item && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Menu mobile (visible sur mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Menu déroulant mobile */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-sm border-b border-orange-500 py-2">
              {['accueil', 'projets', 'apropos', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => smoothScroll(item)}
                  className={`block w-full text-left px-3 py-2 text-xs uppercase ${
                    activeSection === item ? 'text-orange-500' : 'text-white hover:text-orange-400'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarP;