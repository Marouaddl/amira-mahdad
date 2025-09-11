import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectModal from '../components/ProjectModal';
import Profil from './Profil';
import Setting from './Setting';
import { MdOutlineAdd } from 'react-icons/md';
import { FaEdit, FaTrash, FaUser, FaSync } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import { PiRuler } from 'react-icons/pi';
import { FiSettings } from 'react-icons/fi';
import API from '../api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Projets');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('edit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/projects');
      console.log('API response for projects:', res.data);
      
      if (Array.isArray(res.data)) {
        const updatedProjects = res.data.map(project => {
          // Correction de l'URL des images - ne pas ajouter /uploads/ si déjà présent
          const imageUrl = project.image 
            ? project.image.startsWith('http') 
              ? project.image 
              : project.image.startsWith('/uploads/')
                ? `${API.defaults.baseURL}${project.image}`
                : `${API.defaults.baseURL}/uploads/${project.image}`
            : null;
            
          const additionalImagesUrls = (project.additionalImages || []).map(img => 
            img.startsWith('http') 
              ? img 
              : img.startsWith('/uploads/')
                ? `${API.defaults.baseURL}${img}`
                : `${API.defaults.baseURL}/uploads/${img}`
          );
          
          return {
            ...project,
            image: imageUrl,
            additionalImages: additionalImagesUrls,
          };
        });
        
        setProjects(updatedProjects);
        console.log('Projects fetched with corrected URLs:', updatedProjects);
      } else {
        console.warn('API response is not an array:', res.data);
        setProjects([]);
        setError('Format de réponse inattendu du serveur');
      }
    } catch (err) {
      console.error('Erreur fetch projects:', err);
      setError('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSaveProject = async (projectData, formDataToSend) => {
    try {
      setError(null);
      console.log('Saving project data:', projectData);
      console.log('Form data entries:', Array.from(formDataToSend.entries()));
      
      const apiUrl = '/projects';
      let response;
      
      if (modalMode === 'edit' && projectData.id) {
        response = await API.put(`${apiUrl}/${projectData.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await API.post(apiUrl, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      console.log('API response:', response.data);
      
      // Recharger les projets après une sauvegarde réussie
      await fetchProjects();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur sauvegarde projet:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde';
      setError(`Erreur: ${errorMessage}`);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await API.delete(`/projects/${projectId}`);
        // Recharger les projets après suppression
        await fetchProjects();
      } catch (err) {
        console.error('Erreur suppression projet:', err);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject({
      ...project,
      image: project.image || null,
      additionalImages: project.additionalImages || [],
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchProjects();
  };

  const ProjectCard = ({ project }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
      <div className="bg-black text-white border border-orange-400 rounded-xl overflow-hidden w-full sm:w-64 h-80 flex flex-col">
        <div className="h-28 flex-shrink-0 overflow-hidden relative">
          {project.image && !imageError ? (
            <img
              src={project.image}
              alt={project.title || 'Project Image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load:', project.image);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
              {project.video ? 'Vidéo disponible' : 'Aucune image'}
            </div>
          )}
          {project.video && (
            <div className="absolute top-1 right-1 bg-orange-500 text-black text-xs px-1 rounded">
              VIDÉO
            </div>
          )}
        </div>
        <div className="p-3 bg-black flex flex-col flex-grow">
          <div className="flex justify-between items-start">
            <span className="bg-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded">{project.category}</span>
            <div className="text-xs text-gray-400">{project.year}</div>
          </div>
          <h3 className="text-md font-semibold mt-1 line-clamp-1">{project.title}</h3>
          <p className="text-xs text-gray-300 mt-2 line-clamp-2">{project.description}</p>
          <div className="flex items-center text-xs text-gray-400 mt-2">
            <GoLocation className="mr-1" />
            {project.location}
          </div>
          <div className="flex justify-between items-center mt-auto pt-2">
            <button
              onClick={() => handleEditProject(project)}
              className="flex items-center justify-center bg-orange-500 text-black px-2 py-1 rounded text-xs font-bold w-28"
            >
              <FaEdit className="mr-1" />
              MODIFIER
            </button>
            <button
              onClick={() => handleDeleteProject(project.id)}
              className="text-orange-500 p-1"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* Affichage des erreurs */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-900 border border-red-700 rounded-md flex items-center">
          <span className="text-red-200">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-white">×</button>
        </div>
      )}
     
      <div className="px-4 sm:px-6 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row items-center bg-black border border-[#D97706] rounded p-1 w-full sm:w-fit">
          <button
            className={`flex items-center gap-1 px-3 py-2 sm:px-2 sm:py-1 rounded text-xs sm:text-sm ${
              activeTab === 'Projets' ? 'bg-[#D97706] text-black' : 'text-white'
            } w-full sm:w-auto mb-2 sm:mb-0 justify-center sm:justify-start`}
            onClick={() => setActiveTab('Projets')}
          >
            <PiRuler size={14} className="sm:size-4" />
            PROJETS
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 sm:px-2 sm:py-1 rounded text-xs sm:text-sm ${
              activeTab === 'Profil' ? 'bg-[#D97706] text-black' : 'text-white'
            } w-full sm:w-auto mb-2 sm:mb-0 justify-center sm:justify-start`}
            onClick={() => setActiveTab('Profil')}
          >
            <FaUser size={14} className="sm:size-4" />
            PROFIL
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 sm:px-2 sm:py-1 rounded text-xs sm:text-sm ${
              activeTab === 'Paramètres' ? 'bg-[#D97706] text-black' : 'text-white'
            } w-full sm:w-auto justify-center sm:justify-start`}
            onClick={() => setActiveTab('Paramètres')}
          >
            <FiSettings size={14} className="sm:size-4" />
            PARAMÈTRES
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-8">
        {activeTab === 'Projets' && (
          <div className="px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 mt-4">
              <h2 className="text-lg font-bold">
                <span className="relative">
                  GEST
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>
                </span>
                ION DES PROJETS
              </h2>
              
              <div className="flex gap-2 mt-4 sm:mt-0">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1 bg-gray-700 text-white px-3 py-1.5 rounded font-bold text-xs"
                  title="Actualiser"
                >
                  <FaSync size={15} />
                </button>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1 bg-orange-500 text-black px-3 py-1.5 rounded font-bold text-xs"
                >
                  <MdOutlineAdd size={15} />
                  NOUVEAU PROJET
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">Chargement des projets...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Aucun projet trouvé. Cliquez sur "NOUVEAU PROJET" pour commencer.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'Profil' && <Profil />}
        {activeTab === 'Paramètres' && <Setting />}
      </div>
      
      {showModal && (
        <ProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          project={selectedProject}
          onSave={handleSaveProject}
          mode={modalMode}
        />
      )}
    </div>
  );
};

export default Admin;