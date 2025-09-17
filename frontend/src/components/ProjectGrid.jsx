// frontend/src/components/ProjectGrid.js
import React, { useState, useEffect } from 'react';
import { GoLocation } from 'react-icons/go';
import ProjectModal from './ProjectModal'; // Corrected import (fix typo)
import API from '../api';

const ProjectGrid = ({ category = 'TOUS' }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await API.get('/projects');
        console.log('Fetched Projects:', res.data);

        const filtered = category === 'TOUS'
          ? res.data
          : res.data.filter((p) => p.category === category);

        // Trust backend URLs; only ensure null safety
        const updatedProjects = filtered.map((project) => ({
          ...project,
          image: project.image || null,
          additionalImages: (project.additionalImages || []).map((img) => img || null),
        }));

        setProjects(updatedProjects);
      } catch (err) {
        console.error('Erreur fetch projects:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  if (loading) {
    return (
      <section id="projets" className="px-3 sm:px-6 pb-8 sm:pb-16 pt-2 sm:pt-4 min-h-screen">
        <div className="grid grid-cols-1 gap-3 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-xl h-48 sm:h-80">
              <div className="h-32 sm:h-48 bg-gray-700 rounded-t-xl"></div>
              <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="h-2 sm:h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projets" className="px-2 sm:px-4 md:px-8 lg:px-12 pb-10 sm:pb-20 pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto">
        {category !== 'TOUS' && (
          <div className="mb-4 sm:mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-3">
              Projets <span className="text-orange-500">{category}</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer group relative bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-lg hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2"
            >
              <div className="relative h-40 sm:h-60 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <img
                  src={project.image || 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    console.error('Image failed to load:', project.image);
                    e.target.src = 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                
                <span className="absolute top-2 sm:top-4 right-2 sm:right-4 text-[10px] sm:text-xs font-bold bg-orange-500 text-black px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg z-20">
                  {project.category}
                </span>
                
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <button className="w-full bg-orange-500 text-black font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded-lg transform hover:scale-105 transition-transform duration-200 text-[10px] sm:text-sm">
                    Voir le projet
                  </button>
                </div>
              </div>
              
              <div className="p-2 sm:p-5 md:p-6">
                <div className="flex justify-between items-start mb-1 sm:mb-3">
                  <h3 className="font-bold text-white text-base sm:text-lg line-clamp-1">{project.title}</h3>
                  <span className="text-[10px] sm:text-xs text-orange-400 bg-orange-500/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                    {project.year}
                  </span>
                </div>
                
                <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex items-center text-xs sm:text-sm text-orange-400">
                  <GoLocation className="mr-1 sm:mr-2" size={12} sm:size={14} />
                  <span className="truncate">{project.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-16">
            <div className="text-orange-500 text-4xl sm:text-6xl mb-2 sm:mb-4">📷</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Aucun projet n'est disponible dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
      
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default ProjectGrid;