import './globals.css';

export const metadata = {
  title: 'Bolton Mind | Portal de Desarrollo Personal',
  description: 'Un portal para la libertad, felicidad y autenticidad personal. Herramientas de IA para el desarrollo emocional y mental.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="glow-circle" style={{ top: '-100px', right: '-100px' }}></div>
        <div className="glow-circle" style={{ bottom: '100px', left: '-100px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0, 0, 0, 0) 70%)' }}></div>
        {children}
      </body>
    </html>
  );
}
