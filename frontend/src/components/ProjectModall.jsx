import React, { useState, useEffect } from 'react';
import { GoLocation, GoCalendar } from 'react-icons/go';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProjectModall = ({ project, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [videoError, setVideoError] = useState(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!project) return null;

  console.log('Project Data:', project);
  console.log('Video URL:', project.video);

  const allMedia = [
    project.image ? { type: 'image', src: project.image } : null,
    project.video ? { type: 'video', src: project.video } : null,
    ...(project.additionalImages || []).map(img => ({ type: 'image', src: img })),
  ].filter(media => media);

  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === allMedia.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? allMedia.length - 1 : prevIndex - 1
    );
  };

  const selectMedia = (index) => {
    setCurrentMediaIndex(index);
    setVideoError(null); // Reset video error on media change
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex justify-center items-start px-2 sm:px-4 overflow-y-auto py-4 sm:py-8">
      <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-4 sm:p-6 w-full max-w-4xl relative border border-orange-500/30 shadow-lg sm:shadow-2xl backdrop-blur-sm my-auto">
        <button
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white hover:text-orange-500 transition-colors duration-200 z-50 bg-black/70 p-2 rounded-full hover:bg-orange-500/20"
          onClick={onClose}
          aria-label="Fermer"
        >
          <FaTimes size={18} />
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative">
            <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden">
              {allMedia.length > 0 ? (
                allMedia[currentMediaIndex].type === 'image' ? (
                  <img
                    src={allMedia[currentMediaIndex].src}
                    alt={`${project.title} - Image ${currentMediaIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                      console.error('Image loading failed:', allMedia[currentMediaIndex].src, e);
                    }}
                  />
                ) : (
                  <>
                    {videoError ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-red-400">{videoError}</span>
                      </div>
                    ) : (
                      <video
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                        poster={project.image || 'https://via.placeholder.com/300x200?text=Preview+Video'}
                        onError={(e) => {
                          console.error('Video loading failed:', allMedia[currentMediaIndex].src, e.nativeEvent);
                          setVideoError('Impossible de charger la vidéo. Veuillez vérifier le fichier.');
                          e.target.poster = 'https://via.placeholder.com/300x200?text=Video+Error';
                        }}
                      >
                        <source src={allMedia[currentMediaIndex].src} type="video/mp4" />
                        <source src={allMedia[currentMediaIndex].src} type="video/quicktime" />
                        Votre navigateur ne supporte pas la vidéo.
                      </video>
                    )}
                  </>
                )
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">Aucun média disponible</span>
                </div>
              )}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-orange-500 transition-colors duration-200"
                    aria-label="Média précédent"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-orange-500 transition-colors duration-200"
                    aria-label="Média suivant"
                  >
                    <FaChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentMediaIndex + 1} / {allMedia.length}
                  </div>
                </>
              )}
            </div>
            {allMedia.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {allMedia.map((media, index) => (
                  <div
                    key={index}
                    className={`relative h-14 w-14 sm:h-16 sm:w-16 cursor-pointer rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      currentMediaIndex === index ? 'border-orange-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => selectMedia(index)}
                    aria-label={`Afficher le média ${index + 1}`}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.src}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      >
                        <source src={media.src} type="video/mp4" />
                        <source src={media.src} type="video/quicktime" />
                      </video>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(100vh-150px)]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{project.title}</h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <span className="bg-orange-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <div className="flex items-center text-orange-400 text-xs">
                  <GoCalendar className="mr-1" size={12} />
                  <span>{project.year}</span>
                </div>
                <div className="flex items-center text-orange-400 text-xs">
                  <GoLocation className="mr-1" size={12} />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 border-l-2 border-orange-500 pl-2">
                Description du Projet
              </h3>
              <p className="text-gray-300 leading-relaxed text-justify text-sm">
                {project.description || 'Aucune description disponible pour ce projet.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <h4 className="text-orange-400 text-xs font-semibold mb-1">Catégorie</h4>
                <p className="text-white text-sm">{project.category}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <h4 className="text-orange-400 text-xs font-semibold mb-1">Année</h4>
                <p className="text-white text-sm">{project.year}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg sm:col-span-2">
                <h4 className="text-orange-400 text-xs font-semibold mb-1">Localisation</h4>
                <p className="text-white text-sm">{project.location}</p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-orange-500/20 text-sm">
              En savoir plus
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black/80 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default ProjectModall;