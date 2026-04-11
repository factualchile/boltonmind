'use client';

import styles from './page.module.css';
import { motion } from 'framer-motion';
import { Sparkles, Wind, Sun, Activity, ArrowRight, BrainCircuit, Heart, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <main className={styles.main}>
      {/* Navbar Minimalista */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <BrainCircuit size={24} className="gradient-accent" />
          Bolton Mind
        </div>
        <div className={styles.navLinks}>
          <Link href="/herramientas" className={styles.navLink}>Herramientas</Link>
          <Link href="/nosotros" className={styles.navLink}>Filosofía</Link>
          <Link href="/login" className={`${styles.navLink} btn-premium ${styles.loginBtn}`} style={{ padding: '8px 24px' }}>
            Acceder
          </Link>
        </div>
      </nav>

      <motion.section
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className={styles.badge} variants={itemVariants}>
          <Sparkles size={16} /> Evolución Consciente
        </motion.div>
        
        <motion.h1 variants={itemVariants}>
          Encuentra tu centro. <br />
          <span className="gradient-text">Expande tu potencial.</span>
        </motion.h1>
        
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Una plataforma tecnológica diseñada para cultivar la paz mental, la autenticidad y la libertad emocional en el mundo moderno.
        </motion.p>
        
        <motion.div className={styles.ctaContainer} variants={itemVariants}>
          <Link href="/login" className="btn-solid">
            Comenzar mi viaje
          </Link>
          <Link href="/herramientas" className={styles.secondaryBtn}>
            Explorar capacidades <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </Link>
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.featuresSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className={styles.sectionHeader}>
          <motion.h2 variants={itemVariants}>Tecnología al servicio de tu bienestar</motion.h2>
          <motion.p variants={itemVariants} style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Integramos inteligencia artificial empática con prácticas basadas en evidencia clínica para transformar tu día a día.
          </motion.p>
        </div>

        <motion.div className={styles.bentoGrid} variants={containerVariants}>
          <motion.div className={`${styles.bentoItem} ${styles.large} glass-card`} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <Heart size={28} className="gradient-accent" />
            </div>
            <h3 className="gradient-text">Felicidad Auténtica</h3>
            <p>
              Desarrolla herramientas emocionales sólidas. Nuestro motor de IA analiza tus patrones para proporcionarte 
              perspectivas claras y ejercicios personalizados que fomentan un estado de bienestar profundo y sostenido, 
              alejado de placebos temporales.
            </p>
          </motion.div>

          <motion.div className={`${styles.bentoItem} ${styles.regular} glass-card`} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <Wind size={28} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h3>Paz Mental</h3>
            <p>Sistemas sin fricción que organizan tu caos interno, proporcionando quietud en un mundo hiperconectado.</p>
          </motion.div>

          <motion.div className={`${styles.bentoItem} ${styles.regular} glass-card`} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <Fingerprint size={28} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <h3>Libertad & Verdad</h3>
            <p>Reconecta con quien realmente eres. Desaprende condicionamientos y toma decisiones alineadas a tu esencia vital.</p>
          </motion.div>
        </motion.div>
      </motion.section>

      <footer style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
        <p>© {new Date().getFullYear()} Bolton Mind. Elevando la consciencia humana con tecnología.</p>
      </footer>
    </main>
  );
}
