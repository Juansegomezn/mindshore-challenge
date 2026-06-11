import { useEffect, useState } from 'react';
import { apiClient } from '../../core/api';
import { Sparkles, ArrowLeftRight, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface Collection {
  id: string;
  name: string;
  items: MediaItem[];
}

interface ComparisonResult {
  analisisSideBySide: string;
  elementosComunes: string;
  diferenciasClave: string;
  conclusionCientifica: string;
}

export const ComparisonPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  const [slot1, setSlot1] = useState<MediaItem | null>(null);
  const [slot2, setSlot2] = useState<MediaItem | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    const fetchAllSavedMedia = async () => {
      try {
        const response = await apiClient.get('/collection');
        setCollections(response.data);
      } catch (err) {
        console.error('Error al cargar banco de imágenes', err);
      }
    };
    fetchAllSavedMedia();
  }, []);

  const handleSelectImage = (item: MediaItem) => {
    if (slot1?.id === item.id) {
      setSlot1(null);
      return;
    }
    if (slot2?.id === item.id) {
      setSlot2(null);
      return;
    }

    if (!slot1) {
      setSlot1(item);
    } else if (!slot2) {
      setSlot2(item);
    }
  };

  const handleRunComparison = async () => {
    if (!slot1 || !slot2) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await apiClient.post('/ai/compare', {
        imageUrl1: slot1.url,
        title1: slot1.title,
        imageUrl2: slot2.url,
        title2: slot2.title
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert('Error al procesar la comparación con el motor de IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSlots = () => {
    setSlot1(null);
    setSlot2(null);
    setResult(null);
  };

  const allAvailableItems = collections.reduce<MediaItem[]>((acc, col) => {
    col.items.forEach(item => {
      if (!acc.some(i => i.id === item.id)) acc.push(item);
    });
    return acc;
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F3F4F6', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <Sparkles size={34} style={{ color: '#3B82F6' }} />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Laboratorio Comparativo de IA</h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Confronta telemetría visual y datos astronómicos mediante redes neuronales</p>
          </div>
          <button onClick={() => navigate('/collections')} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', backgroundColor: '#1F2937', color: '#FFF', border: '1px solid #374151', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Volver a Colecciones
          </button>
        </div>

        {/* MESA DE TRABAJO (SLOTS DE IMÁGENES) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Slot 1 */}
          <div style={{ height: '260px', backgroundColor: '#111827', border: slot1 ? '2px dashed #A855F7' : '2px dashed #374151', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
            {slot1 ? (
              <>
                <img src={slot1.url} alt={slot1.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(17,24,39,0.85)', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{slot1.title}</div>
              </>
            ) : (
              <p style={{ color: '#4B5563' }}>[ Ranura de Análisis Alfa Vacía ]</p>
            )}
          </div>

          {/* Icono de Intercambio Central */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#1F2937', padding: '1rem', borderRadius: '50%', border: '1px solid #374151', color: '#9CA3AF' }}>
              <ArrowLeftRight size={24} />
            </div>
          </div>

          {/* Slot 2 */}
          <div style={{ height: '260px', backgroundColor: '#111827', border: slot2 ? '2px dashed #A855F7' : '2px dashed #374151', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
            {slot2 ? (
              <>
                <img src={slot2.url} alt={slot2.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(17,24,39,0.85)', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{slot2.title}</div>
              </>
            ) : (
              <p style={{ color: '#4B5563' }}>[ Ranura de Análisis Beta Vacía ]</p>
            )}
          </div>
        </div>

        {/* Acciones de Lanzamiento */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <button onClick={handleResetSlots} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1F2937', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <RotateCcw size={16} /> Reajustar Mesa
          </button>
          <button onClick={handleRunComparison} disabled={!slot1 || !slot2 || loading} style={{ padding: '0.75rem 2.5rem', backgroundColor: (!slot1 || !slot2) ? '#374151' : '#A855F7', color: '#FFF', border: 'none', borderRadius: '6px', cursor: (!slot1 || !slot2 || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
            {loading ? 'Calculando Coincidencias...' : 'Computar Análisis por IA'}
          </button>
        </div>

        {/* RESULTADO DE LA INTELIGENCIA ARTIFICIAL */}
        {result && (
          <div style={{ backgroundColor: '#111827', border: '1px solid #A855F744', borderRadius: '12px', padding: '2rem', marginBottom: '4rem', boxShadow: '0 0 20px rgba(168,85,247,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#A855F7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} /> Telemetría Computada Exitosamente
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: '#E5E7EB', fontWeight: 'bold', marginBottom: '0.5rem' }}>🔬 Análisis Comparativo (Side-by-Side):</h4>
                <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6' }}>{result.analisisSideBySide}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: '#3B82F6', fontWeight: 'bold', marginBottom: '0.5rem' }}>🟢 Elementos en Común:</h4>
                  <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6' }}>{result.elementosComunes}</p>
                </div>
                <div>
                  <h4 style={{ color: '#F59E0B', fontWeight: 'bold', marginBottom: '0.5rem' }}>🟡 Diferencias Clave:</h4>
                  <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6' }}>{result.diferenciasClave}</p>
                </div>
              </div>
              <hr style={{ borderColor: '#1F2937', margin: '0.5rem 0' }} />
              <div>
                <h4 style={{ color: '#10B981', fontWeight: 'bold', marginBottom: '0.5rem' }}>🛰️ Conclusión Científica Integrada:</h4>
                <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>{result.conclusionCientifica}</p>
              </div>
            </div>
          </div>
        )}

        {/* BANCO DE IMÁGENES GUARDADAS PARA SELECCIONAR */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>Tu Banco de Muestras Guardadas</h3>
        {allAvailableItems.length === 0 ? (
          <div style={{ backgroundColor: '#111827', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #1F2937', color: '#9CA3AF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={24} />
            <p>Primero debes guardar al menos dos imágenes de la NASA en tus colecciones para activar la mesa de comparación.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {allAvailableItems.map((item) => {
              const isSelected = slot1?.id === item.id || slot2?.id === item.id;
              return (
                <div key={item.id} onClick={() => handleSelectImage(item)} style={{ backgroundColor: '#111827', borderRadius: '8px', overflow: 'hidden', border: isSelected ? '2px solid #A855F7' : '1px solid #1F2937', cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }}>
                  <img src={item.url} alt={item.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#A855F7', borderRadius: '50%', padding: '0.1rem', color: '#FFF', display: 'flex' }}>
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};