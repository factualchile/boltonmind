import './globals.css';

export const metadata = {
  title: 'Bolton Mind | Portal de Desarrollo Personal',
  description: 'Un portal para la libertad, felicidad y autenticidad personal. Herramientas de IA para el desarrollo emocional y mental.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ position: 'relative' }}>
        <div className="aurora-bg">
          <div className="aurora-blob" style={{ background: 'var(--accent-primary)', top: '-10%', left: '-10%' }}></div>
          <div className="aurora-blob" style={{ background: 'var(--accent-secondary)', bottom: '-10%', right: '-10%', animationDelay: '-5s' }}></div>
          <div className="aurora-blob" style={{ background: 'var(--accent-ethereal)', top: '40%', left: '30%', animationDelay: '-10s' }}></div>
        </div>
        {children}
      </body>
    </html>
  );
}
