'use client';
import { useState } from 'react';
import styles from '../login/login.module.css';
import { Loader2 } from 'lucide-react';
import { executePasswordUpdate } from './actions';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Inténtalo de nuevo.');
      return;
    }
    
    if (password.length < 6) {
      setError('Por mayor protección, usa una clave de 6 o más caracteres.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await executePasswordUpdate(password);
      if (res.error) {
        setError(res.error);
      } else {
        setMessage('Contraseña actualizada de forma segura. Redirigiendo a tu espacio de paz mental...');
        // Redirigir dinamicamente a la raiz y que middleware separe
        setTimeout(() => {
          window.location.href = '/dashboard'; 
        }, 2000);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.ambientGlow1}></div>
      <div className={styles.ambientGlow2}></div>

      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <h1 className={styles.logo}>Bolton Mind</h1>
          <p className={styles.subtitle}>Resguarda tu espacio</p>
        </div>

        {message ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#a8edea', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '16px' }}>
              {message}
            </p>
            <Loader2 className={styles.spinner} style={{ margin: '0 auto', color: '#a78bfa' }} />
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5', textAlign: 'center' }}>
              Para garantizar tu tranquilidad, por favor elige una nueva contraseña secreta para tu perfil.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Nueva Contraseña Secreta</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? <Loader2 className={styles.spinner} /> : 'Proteger y Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
