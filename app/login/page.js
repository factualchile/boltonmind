'use client';

import { useState } from 'react';
import styles from './login.module.css';
import { motion } from 'framer-motion';
import { Fingerprint, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from './actions';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  async function handleLogin(formData) {
    setIsPending(true);
    setErrorMsg(null);
    try {
      const res = await login(formData);
      if (res?.error) {
        setErrorMsg(res.error);
        setIsPending(false);
      } else if (res?.redirect) {
        router.push(res.redirect);
      }
    } catch(err) {
      console.error(err);
      setErrorMsg("Ocurrió un error inesperado al iniciar sesión.");
      setIsPending(false);
    }
  }

  return (
    <main className={styles.loginContainer}>
      <Link href="/" className={styles.backBtn}>
        <ArrowLeft size={18} /> Volver al Inicio
      </Link>

      <motion.div
        className={`${styles.loginCard} glass-card`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className={styles.header}>
          <Fingerprint size={48} className={`${styles.icon} breathing-glow`} />
          <h1 className="gradient-text">Tu Espacio Seguro</h1>
          <p>Accede a tu dashboard de evolución personal para continuar tu camino hacia la libertad y felicidad.</p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form className={styles.form} action={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input name="email" type="email" id="email" className="input-premium" placeholder="tu@esencia.com" required/>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña Consciente</label>
            <input name="password" type="password" id="password" className="input-premium" placeholder="••••••••" required/>
          </div>

          <Link href="#" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</Link>

          <button type="submit" className={`btn-solid ${styles.submitBtn}`} disabled={isPending}>
            {isPending ? <Loader2 className="breathing-glow" size={24} /> : 'Desbloquear mi mente'}
          </button>
        </form>

        <div className={styles.divider}>o</div>

        <div className={styles.footer}>
          ¿Aún no has comenzado tu viaje? 
          <Link href="#">Descubre cómo unirte</Link>
        </div>
      </motion.div>
    </main>
  );
}
