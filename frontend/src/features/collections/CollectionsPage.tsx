import React, { useEffect, useState } from 'react';
import { apiClient } from '../../core/api';
import { Tag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SweetModal } from '../../components/SweetModal';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: { id: string; name: string }[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  items: MediaItem[];
}

export const CollectionsPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({});
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'confirm' as 'success' | 'error' | 'confirm',
    title: '',
    message: ''
  });

  const fetchCollections = async () => {
    try {
      const response = await apiClient.get('/collection');
      setCollections(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const triggerDeleteConfirmation = (id: string) => {
    setSelectedCollectionId(id);
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: '¿Desintegrar Colección?',
      message: '¿Estás seguro de que deseas eliminar esta colección espacial por completo? Esta acción es irreversible.'
    });
  };

  const executeDeleteCollection = async () => {
    if (!selectedCollectionId) return;

    try {
      await apiClient.delete(`/collection/${selectedCollectionId}`);
      setCollections(collections.filter(c => c.id !== selectedCollectionId));
      
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Colección Eliminada',
        message: 'La carpeta y sus registros han sido removidos de la bitácora.'
      });
    } catch (err) {
      console.error(err);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Fallo del Sistema',
        message: 'No se pudo eliminar la colección en este momento.'
      });
    } finally {
      setSelectedCollectionId(null);
    }
  };

  const handleCancelDelete = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    setSelectedCollectionId(null);
  };

  const handleAddTag = async (e: React.FormEvent, mediaId: string) => {
    e.preventDefault();
    const tagName = tagInputs[mediaId];
    if (!tagName || !tagName.trim()) return;

    try {
      await apiClient.post(`/collection/media/${mediaId}/tags`, { tagName });
      setTagInputs({ ...tagInputs, [mediaId]: '' });
      fetchCollections();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F3F4F6', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Mis Álbumes Cósmicos</h1>
          <button onClick={() => navigate('/search')} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Volver al Buscador
          </button>

          <button 
            onClick={() => navigate('/compare')} 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#A855F7', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '0.5rem' }}
          >
            ✨ Abrir Comparador IA
          </button>
        </div>

        {collections.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '4rem' }}>Aún no has archivado ningún fragmento del espacio.</p>
        ) : (
          collections.map((col) => (
            <div key={col.id} style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1F2937', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFF' }}>{col.name}</h2>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{col.description}</p>
                </div>
                <button onClick={() => triggerDeleteConfirmation(col.id)} style={{ padding: '0.5rem', backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Grid Interno de MediaItems */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {col.items.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#1F2937', borderRadius: '8px', overflow: 'hidden', border: '1px solid #374151', display: 'flex', flexDirection: 'column' }}>
                    <img src={item.url} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h4 style={{ fontWeight: 'bold', color: '#FFF', marginBottom: '0.5rem', fontSize: '1rem' }}>{item.title}</h4>
                      
                      {/* Renderizado de Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                        {item.tags.map((t) => (
                          <span key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#111827', color: '#3B82F6', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #3B82F6' }}>
                            <Tag size={10} /> {t.name}
                          </span>
                        ))}
                      </div>

                      {/* Formulario de Asignación de Tags */}
                      <form onSubmit={(e) => handleAddTag(e, item.id)} style={{ display: 'flex', marginTop: 'auto', gap: '0.25rem' }}>
                        <input type="text" value={tagInputs[item.id] || ''} onChange={(e) => setTagInputs({ ...tagInputs, [item.id]: e.target.value })} placeholder="Nueva etiqueta..." style={{ flexGrow: 1, padding: '0.4rem', fontSize: '0.85rem', borderRadius: '4px', backgroundColor: '#111827', border: '1px solid #4B5563', color: '#FFF', outline: 'none' }} />
                        <button type="submit" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', backgroundColor: '#4B5563', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <SweetModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={() => {
          if (modalConfig.type === 'confirm') {
            executeDeleteCollection();
          } else {
            setModalConfig({ ...modalConfig, isOpen: false });
          }
        }}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};