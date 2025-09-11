import React, { useState, useEffect } from 'react';

const ProjectModal = ({ isOpen, onClose, project, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    location: '',
    category: '',
    description: '',
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainVideo, setMainVideo] = useState(null);
  const [mainVideoFile, setMainVideoFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        year: project.year || '',
        location: project.location || '',
        category: project.category || '',
        description: project.description || '',
      });
      setMainImage(project.image || null);
      setMainImageFile(null);
      setMainVideo(project.video || null);
      setMainVideoFile(null);
      const additionalImgs = project.additionalImages || [];
      setAdditionalImages(additionalImgs);
      setExistingAdditionalImages(additionalImgs);
      setAdditionalImageFiles([]);
    } else {
      resetForm();
    }
  }, [project]);

  const resetForm = () => {
    setFormData({
      title: '',
      year: '',
      location: '',
      category: '',
      description: '',
    });
    setMainImage(null);
    setMainImageFile(null);
    setMainVideo(null);
    setMainVideoFile(null);
    setAdditionalImages([]);
    setAdditionalImageFiles([]);
    setExistingAdditionalImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      setMainImage(URL.createObjectURL(file));
    }
  };

  const handleMainVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        alert('La vidéo doit être inférieure à 50 Mo.');
        return;
      }
      if (!['video/mp4', 'video/mov', 'video/quicktime'].includes(file.type)) {
        alert('Formats vidéo acceptés : MP4, MOV.');
        return;
      }
      setMainVideoFile(file);
      setMainVideo(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + additionalImages.length > 4) {
      alert('Maximum 4 images supplémentaires autorisées');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAdditionalImageFiles((prev) => [...prev, ...files]);
    setAdditionalImages((prev) => [...prev, ...newImages.map((img) => img.preview)]);
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImageFile(null);
  };

  const removeMainVideo = () => {
    setMainVideo(null);
    setMainVideoFile(null);
  };

  const removeAdditionalImage = (index) => {
    if (index < existingAdditionalImages.length) {
      setExistingAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - existingAdditionalImages.length;
      setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit triggered', { formData, mainImageFile, mainVideoFile, additionalImageFiles });

    if (!formData.title || !formData.year || !formData.location || !formData.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (mode === 'create' && !mainImageFile && !mainVideoFile) {
      alert('Veuillez sélectionner une image ou une vidéo principale');
      return;
    }

    const projectDataToSave = {
      ...formData,
      id: project?.id,
    };

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('year', formData.year);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    if (mainImageFile) {
      formDataToSend.append('image', mainImageFile);
    }
    if (mainVideoFile) {
      formDataToSend.append('video', mainVideoFile);
    }
    additionalImageFiles.forEach((file) => {
      formDataToSend.append('additionalImages', file);
    });

    // Débogage du FormData avant transmission
    for (let pair of formDataToSend.entries()) {
      console.log('FormData before send:', pair[0], pair[1]);
    }

    onSave(projectDataToSave, formDataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="bg-black border border-orange-500 rounded-lg p-2 sm:p-4 w-full max-w-md max-h-[90vh] flex flex-col">
        <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-white">
          {mode === 'edit' ? 'MODIFIER LE PROJET' : 'NOUVEAU PROJET'}
        </h2>
        <div className="overflow-y-auto flex-grow pr-1 sm:pr-2 mb-2 sm:mb-4">
          {/* Image principale */}
          <div className="mb-2 sm:mb-4">
            <label className="block text-xs sm:text-sm mb-1 text-white">
              IMAGE PRINCIPALE {mode === 'create' && '*'}
            </label>
            <div className="relative h-24 sm:h-32 mb-1 sm:mb-2 border-2 border-orange-500 rounded">
              {mainImage ? (
                <>
                  <img src={mainImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-1 sm:top-1 right-1 sm:right-1 bg-red-500 text-white text-xs w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center rounded-full"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                  Aucune image sélectionnée
                </div>
              )}
            </div>
            <input
              type="file"
              id="main-image-upload"
              onChange={handleMainImageChange}
              className="hidden"
              accept="image/*"
              required={mode === 'create' && !mainImage && !mainVideo}
            />
            <label
              htmlFor="main-image-upload"
              className="bg-orange-500 text-black px-2 sm:px-3 py-1 rounded cursor-pointer text-xs sm:text-sm inline-block"
            >
              {mainImage ? 'Changer' : 'Sélectionner'} l'image principale
            </label>
          </div>
          {/* Vidéo principale */}
          <div className="mb-2 sm:mb-4">
            <label className="block text-xs sm:text-sm mb-1 text-white">
              VIDÉO PRINCIPALE (max 50 Mo, MP4/MOV)
            </label>
            <div className="relative h-24 sm:h-32 mb-1 sm:mb-2 border-2 border-orange-500 rounded">
              {mainVideo ? (
                <>
                  <video controls className="w-full h-full object-cover">
                    <source src={mainVideo} type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                  <button
                    type="button"
                    onClick={removeMainVideo}
                    className="absolute top-1 sm:top-1 right-1 sm:right-1 bg-red-500 text-white text-xs w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center rounded-full"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                  Aucune vidéo sélectionnée
                </div>
              )}
            </div>
            <input
              type="file"
              id="main-video-upload"
              onChange={handleMainVideoChange}
              className="hidden"
              accept="video/mp4,video/mov,video/quicktime"
            />
            <label
              htmlFor="main-video-upload"
              className="bg-orange-500 text-black px-2 sm:px-3 py-1 rounded cursor-pointer text-xs sm:text-sm inline-block"
            >
              {mainVideo ? 'Changer' : 'Sélectionner'} la vidéo principale
            </label>
          </div>
          {/* Images supplémentaires */}
          <div className="mb-2 sm:mb-4">
            <label className="block text-xs sm:text-sm mb-1 text-white">IMAGES SUPPLÉMENTAIRES (max 4)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-1 sm:mb-2">
              {additionalImages.map((img, index) => (
                <div key={index} className="relative h-16 sm:h-20 group">
                  <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover rounded border border-gray-500" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-0 sm:top-0 right-0 sm:right-0 bg-red-500 text-white text-xs w-3 sm:w-4 h-3 sm:h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              id="additional-images-upload"
              onChange={handleAdditionalImagesChange}
              className="hidden"
              accept="image/*"
              disabled={additionalImages.length >= 4}
            />
            <label
              htmlFor="additional-images-upload"
              className={`px-2 sm:px-3 py-1 rounded cursor-pointer text-xs sm:text-sm inline-block ${
                additionalImages.length >= 4
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-orange-500 text-black'
              }`}
            >
              Ajouter des images
            </label>
            <p className="text-gray-400 text-[8px] sm:text-[10px] mt-1">{additionalImages.length}/4 images ajoutées</p>
          </div>
          {/* Formulaire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-white">
            <div>
              <label className="text-xs sm:text-sm block mb-1">Titre *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-black border border-orange-500 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Année *</label>
              <input
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full bg-black border border-orange-500 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Localisation *</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-black border border-orange-500 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Catégorie *</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-black border border-orange-500 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
                required
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="text-xs sm:text-sm block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-black border border-orange-500 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="mt-2 sm:mt-auto pt-1 sm:pt-2 border-t border-orange-500">
          <div className="flex justify-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-black px-2 sm:px-4 py-1 sm:py-1.5 rounded text-xs sm:text-sm"
            >
              ANNULER
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-black px-2 sm:px-4 py-1 sm:py-1.5 rounded font-bold text-xs sm:text-sm"
            >
              {mode === 'edit' ? 'SAUVEGARDER' : 'CRÉER'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectModal;