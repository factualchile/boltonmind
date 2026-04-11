'use client';
import { useState } from 'react';
import styles from '../login/login.module.css';
import { Link, Loader2 } from 'lucide-react';
import { sendPasswordReset } from './actions';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await sendPasswordReset(email);
      if (res.error) {
        setError(res.error);
      } else {
        setMessage('Si el correo está registrado, hemos enviado un enlace mágico para recuperar tu acceso de forma segura. Revisa tu bandeja de entrada.');
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
          <p className={styles.subtitle}>Recuperación de Acceso</p>
        </div>

        {message ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#a8edea', marginBottom: '2rem', lineHeight: '1.6' }}>
              {message}
            </p>
            <a href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '500' }}>
              Volver al inicio de sesión
            </a>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Correo Electrónico Contratado</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? <Loader2 className={styles.spinner} /> : 'Enviar Enlace Mágico'}
            </button>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a href="/login" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#a78bfa'} onMouseOut={e=>e.target.style.color='#64748b'}>
                Cancelar y regresar
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
