import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className="animate-fade-in">
          Bienvenido a <span className="gradient-text">Bolton Mind</span>
        </h1>
        <p className={styles.subtitle + " animate-fade-in"}>
          Tu portal para una vida más libre, feliz y auténtica.
        </p>
        <div className={styles.ctaContainer + " animate-fade-in"}>
          <button className="btn-premium">Comenzar Viaje</button>
          <a href="/ia-tools" className={styles.secondaryBtn}>Explorar IA Herramientas</a>
        </div>
      </header>

      <section className={styles.features}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3>Mentalidad</h3>
          <p>Transforma tus patrones de pensamiento para alcanzar tu máximo potencial.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3>Emociones</h3>
          <p>Aprende a navegar y comprender tu mundo interior con claridad.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3>Relaciones</h3>
          <p>Construye vínculos más profundos, honestos y significativos.</p>
        </div>
      </section>

      <section className={styles.iaHighlight}>
        <div className="glass-card" style={{ padding: '3rem', margin: '2rem 0', textAlign: 'center' }}>
          <h2 className="gradient-text">Potenciado por Inteligencia Artificial</h2>
          <p>Accede a herramientas personalizadas diseñadas para tu crecimiento personal.</p>
          <br />
          <a href="/ia-tools" className="btn-premium">Ver Herramientas de IA</a>
        </div>
      </section>
    </main>
  );
}
