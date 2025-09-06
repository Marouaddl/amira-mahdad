import React, { useState, useEffect } from 'react';

const EditProjectModal = ({ isOpen, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    location: '',
    category: '',
    description: '',
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainVideo, setMainVideo] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
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
      setMainImage(project.image ? { preview: project.image, isExisting: true } : null);
      setMainVideo(project.video ? { preview: project.video, isExisting: true } : null); // Ajout de la vidéo existante
      setExistingAdditionalImages(project.additionalImages || []);
      setAdditionalImages([]);
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]), isExisting: false });
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
      setMainVideo({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]), isExisting: false });
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + additionalImages.length + existingAdditionalImages.length > 4) {
      alert('Maximum 4 images supplémentaires autorisées');
      return;
    }
    setAdditionalImages((prev) => [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file), isExisting: false }))]);
  };

  const removeAdditionalImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
  };

  const removeMainVideo = () => {
    setMainVideo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('year', formData.year);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    if (mainImage && !mainImage.isExisting && mainImage.file) {
      formDataToSend.append('image', mainImage.file);
    }
    if (mainVideo && !mainVideo.isExisting && mainVideo.file) {
      formDataToSend.append('video', mainVideo.file);
    }
    additionalImages.forEach((img) => {
      if (img.file) formDataToSend.append('additionalImages', img.file);
    });

    const projectData = {
      ...formData,
      image: mainImage ? (mainImage.isExisting ? mainImage.preview : null) : project.image,
      video: mainVideo ? (mainVideo.isExisting ? mainVideo.preview : null) : project.video,
      additionalImages: [...existingAdditionalImages, ...additionalImages.map(img => img.isExisting ? img.preview : null)],
    };
    onSave(projectData, formDataToSend);
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="bg-black border border-orange-500 rounded-lg p-2 sm:p-4 w-full max-w-md max-h-[90vh] flex flex-col">
        <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-white">MODIFIER LE PROJET</h2>
        <div className="overflow-y-auto flex-grow pr-1 sm:pr-2 mb-2 sm:mb-4">
          <div className="mb-2 sm:mb-4">
            <label className="block text-xs sm:text-sm mb-1 text-white">IMAGE PRINCIPALE</label>
            <div className="relative h-24 sm:h-32 mb-1 sm:mb-2 border-2 border-orange-500 rounded">
              {mainImage ? (
                <>
                  <img src={mainImage.preview} alt="Nouvelle image principale" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100"
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
            />
            <label
              htmlFor="main-image-upload"
              className="bg-orange-500 text-black px-2 sm:px-3 py-1 rounded cursor-pointer text-xs sm:text-sm inline-block"
            >
              Changer l'image principale
            </label>
          </div>
          <div className="mb-2 sm:mb-4">
            <label className="block text-xs sm:text-sm mb-1 text-white">
              VIDÉO PRINCIPALE (max 50 Mo, MP4/MOV)
            </label>
            <div className="relative h-24 sm:h-32 mb-1 sm:mb-2 border-2 border-orange-500 rounded">
              {mainVideo ? (
                <>
                  <video controls className="w-full h-full object-cover">
                    <source src={mainVideo.preview} type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                  <button
                    type="button"
                    onClick={removeMainVideo}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100"
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
              Changer la vidéo principale
            </label>
          </div>
          <div className="mb-2 sm:mb-4">
            <label className="block text-xs sm:text-sm mb-1 text-white">IMAGES SUPPLÉMENTAIRES (max 4)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-1 sm:mb-2">
              {existingAdditionalImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative h-16 sm:h-20 group">
                  <img src={img} alt={`Media ${index}`} className="w-full h-full object-cover rounded border border-gray-500" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index, true)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
              {additionalImages.map((img, index) => (
                <div key={`new-${index}`} className="relative h-16 sm:h-20 group">
                  <img src={img.preview} alt={`New media ${index}`} className="w-full h-full object-cover rounded border border-gray-500" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100"
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
              disabled={existingAdditionalImages.length + additionalImages.length >= 4}
            />
            <label
              htmlFor="additional-images-upload"
              className={`px-2 sm:px-3 py-1 rounded cursor-pointer text-xs sm:text-sm inline-block ${
                existingAdditionalImages.length + additionalImages.length >= 4
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-orange-500 text-black'
              }`}
            >
              Ajouter des images
            </label>
            <p className="text-gray-400 text-[8px] sm:text-[10px] mt-1">
              {existingAdditionalImages.length + additionalImages.length}/4 images ajoutées
            </p>
          </div>
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
              SAUVEGARDER
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProjectModal;