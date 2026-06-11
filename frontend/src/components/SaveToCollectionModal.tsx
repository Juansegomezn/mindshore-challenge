import { useEffect, useState } from 'react';
import { apiClient } from '../core/api';
import { FolderPlus, X } from 'lucide-react';
import { SweetModal } from './SweetModal';

interface Collection {
  id: string;
  name: string;
  description: string;
}

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItem: {
    id: string;
    title: string;
    description: string;
    url: string;
    mediaType: string;
  } | null;
  onNotify: (success: boolean) => void;
}

export const SaveToCollectionModal = ({ isOpen, onClose, mediaItem, onNotify }: SaveModalProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success' as 'success' | 'error', title: '', message: '' });

  const fetchCollections = async () => {
    try {
      const response = await apiClient.get('/collection');
      setCollections(response.data);
    } catch (err) {
      console.error('Error al traer colecciones', err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const response = await apiClient.post('/collection', {
        name: newFolderName,
        description: 'Colección creada desde el visor de exploración.'
      });
      setCollections([response.data, ...collections]);
      setNewFolderName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creando colección', err);
    }
  };

  const handleSaveMedia = async (collectionId: string) => {
    if (!mediaItem) return;
    setLoading(true);

    try {
      await apiClient.post(`/collection/${collectionId}/media`, {
        mediaId: mediaItem.id,
        title: mediaItem.title,
        description: mediaItem.description,
        url: mediaItem.url,
        mediaType: mediaItem.mediaType
      });
      onNotify(true);
      onClose();
    } catch (err) {
      console.error('Error guardando elemento', err);
      onNotify(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !modalConfig.isOpen) return null;

  return (
    <>
    {isOpen && mediaItem && (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '450px', color: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Archivar en Colección</h3>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: '#9CA3AF' }} />
        </div>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
          Selecciona una carpeta espacial para resguardar la imagen: <strong style={{ color: '#FFF' }}>{mediaItem.title}</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
          {collections.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', textAlign: 'center' }}>No tienes carpetas creadas.</p>
          ) : (
            collections.map((col) => (
              <button key={col.id} onClick={() => handleSaveMedia(col.id)} disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px', color: '#FFF', textAlign: 'left', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s' }}>
                📁 {col.name}
              </button>
            ))
          )}
        </div>

        <hr style={{ borderColor: '#1F2937', marginBottom: '1rem' }} />

        {!showCreateForm ? (
          <button onClick={() => setShowCreateForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: 'none', color: '#3B82F6', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
            <FolderPlus size={16} /> Crear nueva carpeta espacial
          </button>
        ) : (
          <form onSubmit={handleCreateCollection} style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" required value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Nombre de la colección..." style={{ flexGrow: 1, padding: '0.5rem', borderRadius: '4px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF', outline: 'none' }} />
            <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563EB', border: 'none', borderRadius: '4px', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}>Crear</button>
          </form>
        )}
      </div>
    </div>
    )}

    <SweetModal 
      isOpen={modalConfig.isOpen}
      type={modalConfig.type}
      title={modalConfig.title}
      message={modalConfig.message}
      onConfirm={() => { setModalConfig({ ...modalConfig, isOpen: false }); if(modalConfig.type === 'success') onClose(); }}
    />
    </>
  );
};