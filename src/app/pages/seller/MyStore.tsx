import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Save, Eye, Edit2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface StoreImage {
  id: string;
  url: string;
  file?: File;
}

export function MyStore() {
  const [isEditing, setIsEditing] = useState(false);
  const [storeName, setStoreName] = useState('Mi Emprendimiento');
  const [storyTitle, setStoryTitle] = useState('Mi Historia');
  const [storyContent, setStoryContent] = useState(
    'Cuéntale a tus clientes la historia de tu emprendimiento. ¿Cómo comenzaste? ¿Qué te inspira? ¿Cuál es tu misión?'
  );
  const [coverImage, setCoverImage] = useState<StoreImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<StoreImage[]>([]);
  const [tempStoreName, setTempStoreName] = useState(storeName);
  const [tempStoryTitle, setTempStoryTitle] = useState(storyTitle);
  const [tempStoryContent, setTempStoryContent] = useState(storyContent);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage({ id: Date.now().toString(), url, file });
    }
  };

  const handleGalleryImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: StoreImage[] = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    setGalleryImages([...galleryImages, ...newImages]);
  };

  const removeGalleryImage = (id: string) => {
    const image = galleryImages.find(img => img.id === id);
    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  const handleSave = () => {
    setStoreName(tempStoreName);
    setStoryTitle(tempStoryTitle);
    setStoryContent(tempStoryContent);
    setIsEditing(false);
    toast.success('¡Cambios guardados!', {
      description: 'Tu tienda se ha actualizado correctamente.'
    });
  };

  const handleCancel = () => {
    setTempStoreName(storeName);
    setTempStoryTitle(storyTitle);
    setTempStoryContent(storyContent);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section con imagen de portada */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
        {coverImage ? (
          <img 
            src={coverImage.url} 
            alt="Portada de la tienda" 
            className="w-full h-full object-cover"
          />
        ) : (
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors w-full h-full"
          >
            <div className="text-center text-white">
              <Store className="size-20 mx-auto mb-4 opacity-50" />
              <p className="text-lg opacity-75 mb-2">Haz clic para agregar imagen de portada</p>
              <div className="flex items-center justify-center gap-2 text-sm opacity-60">
                <Upload className="size-4" />
                <span>Subir imagen</span>
              </div>
            </div>
          </button>
        )}
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        
        {/* Botón de cambiar portada cuando ya existe una imagen */}
        {coverImage && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors shadow-lg z-10"
          >
            <Upload className="size-4" />
            Cambiar Portada
          </motion.button>
        )}
        
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverImageUpload}
          className="hidden"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-12">
        {/* Tarjeta principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={tempStoreName}
                    onChange={(e) => setTempStoreName(e.target.value)}
                    className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 focus:outline-none w-full"
                    placeholder="Nombre de tu tienda"
                  />
                ) : (
                  <h1 className="text-4xl font-bold text-gray-900">{storeName}</h1>
                )}
                <p className="text-gray-600 mt-2">
                  Personaliza la historia de tu emprendimiento
                </p>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="size-5" />
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
                    >
                      <Save className="size-5" />
                      Guardar Cambios
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                  >
                    <Edit2 className="size-5" />
                    Editar Tienda
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8 space-y-8">
            {/* Sección de historia */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempStoryTitle}
                    onChange={(e) => setTempStoryTitle(e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-600 focus:outline-none flex-1"
                    placeholder="Título de tu historia"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{storyTitle}</h2>
                )}
              </div>
              
              {isEditing ? (
                <textarea
                  value={tempStoryContent}
                  onChange={(e) => setTempStoryContent(e.target.value)}
                  rows={8}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Cuéntale a tus clientes tu historia..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {storyContent}
                </p>
              )}
            </div>

            {/* Galería de fotos */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Galería de Fotos</h2>
                </div>
                
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
                  >
                    <Plus className="size-5" />
                    Agregar Fotos
                  </motion.button>
                )}
                
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesUpload}
                  className="hidden"
                />
              </div>

              <AnimatePresence mode="popLayout">
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group aspect-video rounded-xl overflow-hidden shadow-lg"
                      >
                        <img
                          src={image.url}
                          alt="Galería"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        {isEditing && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => removeGalleryImage(image.id)}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="size-4" />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300 p-12 text-center"
                  >
                    <ImageIcon className="size-16 mx-auto text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aún no has agregado fotos
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Comparte fotos de tus productos, tu proceso de trabajo, o tu equipo
                    </p>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => galleryInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
                      >
                        <Plus className="size-5" />
                        Agregar Fotos
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sección de vista previa */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Eye className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Vista previa de tu tienda
                    </h3>
                    <p className="text-sm text-gray-600">
                      Así es como los compradores verán tu tienda. Haz clic en "Editar Tienda" para personalizar tu historia y agregar más fotos.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Store({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}