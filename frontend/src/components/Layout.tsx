import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F3F4F6', fontFamily: 'sans-serif' }}>      
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'rgba(17, 24, 39, 0.8)', 
        backdropFilter: 'blur(8px)', 
        borderBottom: '1px solid #1F2937',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/search')}>
            <img 
              src="/icon.svg" 
              alt="Space Explorer Logo" 
              style={{ width: '22px', height: '22px', display: 'block' }} 
            />
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '0.05em' }}>SPACE EXPLORER</span>
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 1rem', 
              backgroundColor: '#EF4444', 
              color: '#FFF', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </header>

      <main style={{ padding: '0rem' }}>
        <Outlet />
      </main>
    </div>
  );
};