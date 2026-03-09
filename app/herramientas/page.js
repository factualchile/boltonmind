'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export default function HerramientasPage() {
    const tools = [
        {
            title: 'Vínculos',
            description: 'Analiza tus conversaciones de WhatsApp, correos o audios para comprender la dinámica emocional y compatibilidad.',
            icon: <MessageSquare size={32} style={{ color: 'var(--accent-primary)' }} />,
            href: '/herramientas/vinculos',
            badge: 'Nuevo'
        },
        {
            title: 'Asistente de Crecimiento',
            description: 'IA personalizada que te acompaña en tu proceso de desarrollo personal diario.',
            icon: <Sparkles size={32} style={{ color: 'var(--accent-secondary)' }} />,
            href: '#',
            badge: 'Pronto'
        }
    ];

    return (
        <main style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <motion.h1
                    className="gradient-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 'var(--h2)', marginBottom: '1.5rem', fontWeight: 800 }}
                >
                    Herramientas de IA
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}
                >
                    Explora aplicaciones diseñadas con tecnología de vanguardia para ayudarte en tu camino de autoconocimiento y bienestar emocional.
                </motion.p>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {tools.map((tool, index) => (
                    <motion.a
                        key={tool.title}
                        href={tool.href}
                        className="glass-card"
                        style={{ padding: '2.5rem', textDecoration: 'none', color: 'inherit', display: 'block' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            {tool.icon}
                            {tool.badge && (
                                <span style={{
                                    background: tool.badge === 'Nuevo' ? 'rgba(110, 231, 183, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                    color: tool.badge === 'Nuevo' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    border: `1px solid ${tool.badge === 'Nuevo' ? 'rgba(110, 231, 183, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`
                                }}>
                                    {tool.badge}
                                </span>
                            )}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>{tool.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>{tool.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', color: tool.href === '#' ? 'var(--text-muted)' : 'var(--accent-primary)', fontWeight: 600 }}>
                            {tool.href === '#' ? 'Próximamente' : 'Explorar Herramienta'}
                            {tool.href !== '#' && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
                        </div>
                    </motion.a>
                ))}
            </section>

            <footer style={{ marginTop: '8rem', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
                    <ShieldCheck size={40} style={{ color: 'var(--accent-secondary)', marginBottom: '1.5rem' }} />
                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>Tu privacidad es prioridad</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Toda la información analizada en nuestras herramientas es procesada de forma segura y no es almacenada permanentemente. Tu confianza es la base de Bolton Mind.
                    </p>
                </div>
            </footer>
        </main>
    );
}
