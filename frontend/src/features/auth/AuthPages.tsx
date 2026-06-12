import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStart, authSuccess, authFailure } from './authSlice';
import { apiClient } from '../../core/api';
import { useAppDispatch, useAppSelector } from '../../core/store'; 
import { Rocket, LogIn, UserPlus } from 'lucide-react';

export const AuthPage = ({ mode }: { mode: 'login' | 'register' }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const response = await apiClient.post(endpoint, { email, password });
      
      dispatch(authSuccess({ token: response.data.token, email: response.data.email }));
      navigate('/search');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Ocurrió un error en la autenticación.';
      dispatch(authFailure(errMsg));
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F3F4F6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#111827', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid #1F2937' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#3B82F6' }}>
          <Rocket size={48} />
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          {mode === 'login' ? 'Iniciar Misión' : 'Registrar Tripulante'}
        </h2>
        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Plataforma de Exploración Espacial MindShore
        </p>

        {error && (
          <div style={{ backgroundColor: '#EF444422', border: '1px solid #EF4444', color: '#F87171', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#9CA3AF' }}>Correo Electrónico</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF', outline: 'none' }} placeholder="astronauta@mindshore.io" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#9CA3AF' }}>Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF', outline: 'none' }} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            {loading ? 'Procesando...' : mode === 'login' ? <><LogIn size={18}/> Entrar</> : <><UserPlus size={18}/> Registrarse</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya eres miembro? '}
          <span onClick={() => navigate(mode === 'login' ? '/register' : '/login')} style={{ color: '#3B82F6', cursor: 'pointer', textDecoration: 'underline' }}>
            {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  );
};