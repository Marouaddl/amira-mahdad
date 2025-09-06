import React, { useState } from 'react';

const PortfolioTabs = ({ onCategoryChange }) => {
  const [activeTab, setActiveTab] = useState('TOUS');
  const tabs = ['TOUS', 'RENOVATION', 'RESIDENTIEL', 'COMMERCIAL', 'PUBLIC', 'EDUCATION'];

  const handleClick = (tab) => {
    setActiveTab(tab);
    onCategoryChange(tab);
  };

  return (
    <section className="px-3 sm:px-6 pt-6 sm:pt-12 pb-4 sm:pb-8 text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">PORTFOLIO</h2>
      <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-6">
        Une sélection de mes réalisations architecturales récentes
      </p>
      <div className="flex flex-wrap justify-center gap-1 sm:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleClick(tab)}
            className={`px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase rounded border transition-all duration-200 ${
              activeTab === tab
                ? 'bg-orange-500 text-black'
                : 'border-orange-500 text-orange-500 hover:bg-orange-500/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
};

export default PortfolioTabs;