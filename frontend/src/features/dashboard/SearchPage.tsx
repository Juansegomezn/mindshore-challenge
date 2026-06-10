import React, { useState } from 'react';
import { apiClient } from '../../core/api';
import { Search, Compass, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SaveToCollectionModal } from '../../components/SaveToCollectionModal';

interface NasaItem {
  id: string;
  title: string;
  description: string;
  url: string;
  mediaType: string;
}

export const SearchPage = () => {
  const [items, setItems] = useState<NasaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [rover, setRover] = useState('');
  const [camera, setCamera] = useState('');
  const [earthDate, setEarthDate] = useState('');

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<NasaItem | null>(null);

  const openSaveModal = (item: NasaItem) => {
    setSelectedMedia(item);
    setIsModalOpen(true);
  };
  // --------------------------------------------

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) setLoading(true);

    try {
      const params: any = {};
      if (rover) {
        params.rover = rover;
        if (camera) params.camera = camera;
        if (earthDate) params.earthDate = earthDate;
      } else {
        if (q) params.q = q;
        if (yearStart) params.yearStart = yearStart;
      }

      const response = await apiClient.get('/nasa/search', { params });
      setItems(response.data);
    } catch (err) {
      console.error('Error buscando multimedia espacial', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F3F4F6', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <Compass size={36} style={{ color: '#3B82F6' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Centro de Exploración Cósmica</h1>
          <button 
            onClick={() => navigate('/collections')}
            style={{ marginLeft: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px', color: '#FFF', cursor: 'pointer' }}
          >
            <Folder size={16} /> Mis Colecciones
          </button>
        </div>

        {/* Panel de Filtros */}
        <form onSubmit={handleSearch} style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1F2937', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            
            {/* Selector de Modo de Exploración */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Modo de Búsqueda</label>
              <select value={rover} onChange={(e) => { setRover(e.target.value); setCamera(''); setEarthDate(''); }} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }}>
                <option value="">Librería Global NASA</option>
                <option value="curiosity">Marte: Rover Curiosity</option>
                <option value="opportunity">Marte: Rover Opportunity</option>
                <option value="spirit">Marte: Rover Spirit</option>
              </select>
            </div>

            {/* Filtros Condicionales en base al Modo */}
            {!rover ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Término (Palabra Clave)</label>
                  <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej: Nebula, Apollo..." style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Año de Inicio</label>
                  <input type="number" value={yearStart} onChange={(e) => setYearStart(e.target.value)} placeholder="Ej: 2021" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Cámara Especializada</label>
                  <select value={camera} onChange={(e) => setCamera(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }}>
                    <option value="">Todas las Cámaras</option>
                    <option value="fhaz">FHAZ (Front Hazard)</option>
                    <option value="rhaz">RHAZ (Rear Hazard)</option>
                    <option value="mast">MAST (Mast Camera)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Fecha Terrestre</label>
                  <input type="date" value={earthDate} onChange={(e) => setEarthDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                </div>
              </>
            )}
          </div>

          <button type="submit" style={{ alignSelf: 'flex-end', padding: '0.75rem 2rem', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> {loading ? 'Escaneando...' : 'Buscar'}
          </button>
        </form>

        {/* Muestra de Resultados */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '4rem' }}>Consultando satélites de la NASA...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#111827', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1F2937', display: 'flex', flexDirection: 'column' }}>
                <img src={item.url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#FFF' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
                    {item.description}
                  </p>
                  
                  <button 
                    onClick={() => openSaveModal(item)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', backgroundColor: '#1F2937', color: '#3B82F6', border: '1px solid #3B82F6', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Guardar en Colección
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LLAMADA AL MODAL */}
        {isModalOpen && selectedMedia && (
          <SaveToCollectionModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)} 
            mediaItem={selectedMedia} 
          />
        )}

      </div>
    </div>
  );
};