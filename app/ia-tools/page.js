import styles from '../page.module.css';

export default function IATools() {
    return (
        <main className={styles.main}>
            <header className={styles.hero}>
                <h1 className="animate-fade-in gradient-text">
                    Herramientas de IA
                </h1>
                <p className={styles.subtitle + " animate-fade-in"}>
                    Soluciones avanzadas para potenciar tu libertad y bienestar.
                </p>
            </header>

            <section className={styles.features}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3>Analizador de Mentalidad</h3>
                    <p>Descubre patrones limitantes en tu lenguaje y pensamiento con ayuda de IA.</p>
                    <br />
                    <button className="btn-premium" style={{ fontSize: '0.9rem' }}>Proximamente</button>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3>Facilitador de Relaciones</h3>
                    <p>Simula conversaciones y recibe feedback para mejorar tu comunicación empática.</p>
                    <br />
                    <button className="btn-premium" style={{ fontSize: '0.9rem' }}>Proximamente</button>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3>Guía de Bienestar</h3>
                    <p>Apps inteligentes diseñadas para acompañarte en tus procesos de cambio.</p>
                    <br />
                    <button className="btn-premium" style={{ fontSize: '0.9rem' }}>Proximamente</button>
                </div>
            </section>

            <footer style={{ marginTop: '4rem', textAlign: 'center' }}>
                <a href="/" className={styles.secondaryBtn}>← Volver al Inicio</a>
            </footer>
        </main>
    );
}
