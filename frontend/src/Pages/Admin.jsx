import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectModal from '../components/ProjectModal';
import Profil from './Profil';
import Setting from './Setting';
import { MdOutlineAdd } from 'react-icons/md';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import { PiRuler } from 'react-icons/pi';
import { FiSettings } from 'react-icons/fi';
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Projets');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('edit');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://amira-mahdad-backend.onrender.com/api/projects');
      console.log('API response for projects:', res.data); // Débogage
      const updatedProjects = res.data.map(project => ({
        ...project,
        image: project.image ? `https://amira-mahdad-backend.onrender.com/uploads/${project.image}` : null,
        additionalImages: (project.additionalImages || []).map(img => `https://amira-mahdad-backend.onrender.com/uploads/${img}`),
      }));
      setProjects(updatedProjects);
      console.log('Projects fetched:', updatedProjects);
    } catch (err) {
      console.error('Erreur fetch projects:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSaveProject = async (projectData, formDataToSend) => {
    console.log('Saving project:', projectData, formDataToSend);
    for (let pair of formDataToSend.entries()) {
      console.log('FormData received:', pair[0], pair[1]); // Débogage
    }
    try {
      const apiUrl = 'https://amira-mahdad-backend.onrender.com/api/projects';
      if (modalMode === 'edit' && projectData.id) {
        await axios.put(`${apiUrl}/${projectData.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const response = await axios.post(apiUrl, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('API response:', response.data); // Débogage
      }
      await fetchProjects();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur sauvegarde projet:', err.response?.data || err.message);
      alert(`Erreur lors de la sauvegarde: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await axios.delete(`https://amira-mahdad-backend.onrender.com/api/projects/${projectId}`);
        await fetchProjects();
      } catch (err) {
        console.error('Erreur suppression projet:', err.response?.data || err.message);
        alert('Erreur lors de la suppression');
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

  const ProjectCard = ({ project }) => (
    <div className="bg-black text-white border border-orange-400 rounded-xl overflow-hidden w-full sm:w-64 h-80 flex flex-col">
      <div className="h-28 flex-shrink-0 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title || 'Project Image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              console.log('Image failed to load:', project.image);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No Image</div>
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

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      
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
              <button
                onClick={handleAddProject}
                className="flex items-center gap-1 bg-orange-500 text-black px-3 py-1.5 rounded font-bold text-xs mt-4 sm:mt-0 w-full sm:w-auto justify-center"
              >
                <MdOutlineAdd size={15} />
                NOUVEAU PROJET
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
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