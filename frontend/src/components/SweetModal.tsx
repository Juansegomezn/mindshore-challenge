import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export interface SweetModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const SweetModal = ({ isOpen, type, title, message, onConfirm, onCancel }: SweetModalProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={40} style={{ color: '#10B981' }} />;
      case 'error': return <AlertTriangle size={40} style={{ color: '#EF4444' }} />;
      case 'confirm': return <HelpCircle size={40} style={{ color: '#F59E0B' }} />;
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 7, 12, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, fontFamily: 'sans-serif', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '400px', color: '#FFF', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          {getIcon()}
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginBottom: '1.5rem', lineHeight: '1.5' }}>{message}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          {type === 'confirm' && (
            <button onClick={onCancel} style={{ padding: '0.5rem 1.25rem', backgroundColor: '#1F2937', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Cancelar
            </button>
          )}
          <button onClick={onConfirm} style={{ padding: '0.5rem 1.75rem', backgroundColor: type === 'error' ? '#EF4444' : type === 'confirm' ? '#F59E0B' : '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {type === 'confirm' ? 'Confirmar' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
};