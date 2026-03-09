'use client';

import styles from './page.module.css';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Heart, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <main className={styles.main}>
      <motion.header
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants}>
          Bienvenido a <span className="gradient-text">Bolton Mind</span>
        </motion.h1>
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Tu portal para una vida más libre, feliz y auténtica. Potenciado por tecnología de vanguardia para tu bienestar emocional.
        </motion.p>
        <motion.div className={styles.ctaContainer} variants={itemVariants}>
          <button className="btn-premium">Comenzar Viaje</button>
          <a href="/ia-tools" className={styles.secondaryBtn}>
            Explorar Herramientas <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </a>
        </motion.div>
      </motion.header>

      <motion.section
        className={styles.bentoGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div
          className={`${styles.bentoItem} ${styles.large} glass-card`}
          variants={itemVariants}
        >
          <div className={styles.iaIconContainer}>
            <Sparkles size={48} className="gradient-text" />
          </div>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Inteligencia Artificial
          </h2>
          <p>
            Accede a herramientas personalizadas diseñadas para tu crecimiento personal,
            análisis profundo y soporte emocional instantáneo.
          </p>
          <br />
          <a href="/ia-tools" className="btn-premium" style={{ alignSelf: 'center' }}>
            Ver Herramientas de IA
          </a>
        </motion.div>

        <motion.div className={`${styles.bentoItem} glass-card`} variants={itemVariants}>
          <Brain size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h3>Mentalidad</h3>
          <p>Transforma tus patrones de pensamiento para alcanzar tu máximo potencial.</p>
        </motion.div>

        <motion.div className={`${styles.bentoItem} glass-card`} variants={itemVariants}>
          <Heart size={32} style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }} />
          <h3>Emociones</h3>
          <p>Aprende a navegar y comprender tu mundo interior con claridad.</p>
        </motion.div>

        <motion.div className={`${styles.bentoItem} ${styles.medium} glass-card`} variants={itemVariants}>
          <Users size={32} style={{ color: 'var(--accent-ethereal)', marginBottom: '1rem' }} />
          <h3>Relaciones</h3>
          <p>Construye vínculos más profundos, honestos y significativos en todos los ámbitos de tu vida.</p>
        </motion.div>
      </motion.section>

      <footer style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
        <p>© {new Date().getFullYear()} Bolton Mind. Elevando la consciencia humana.</p>
      </footer>
    </main>
  );
}
