import React, { useState } from 'react';
import NavbarP from '../components/NavbarP';
import ProfileHeader from '../components/ProfileHeader';
import StatsSection from '../components/StatsSection';
import PortfolioTabs from '../components/PortfolioTabs';
import ProjectGrid from '../components/ProjectGrid';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('TOUS');

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      <NavbarP />
      <main className="max-w-7xl mx-auto pt-20">
        <ProfileHeader />
        <StatsSection />
        <PortfolioTabs onCategoryChange={setActiveCategory} />
        <ProjectGrid category={activeCategory} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;