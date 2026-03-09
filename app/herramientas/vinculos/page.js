'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Mic, Send, ArrowRight, MessageSquare, BarChart3, Heart, AlertCircle, Users } from 'lucide-react';

export default function VinculosApp() {
    const [step, setStep] = useState('input'); // input, question, analyzing, report
    const [inputType, setInputType] = useState('text'); // text, file, audio
    const [reportData, setReportData] = useState(null);

    const handleAnalizar = () => {
        setStep('question');
    };

    const selectIntention = (intention) => {
        setStep('analyzing');
        // Simulamos análisis de IA
        setTimeout(() => {
            setReportData({
                resumen: "Se detecta una interacción con alta carga emocional. Existe un patrón de búsqueda de validación por una de las partes y una respuesta defensiva por la otra. El contexto sugiere una conversación pendiente sobre responsabilidades compartidas.",
                emociones: {
                    tension: 65,
                    empatia: 30,
                    reciprocidad: 45
                },
                tono: "Defensivo con destellos de vulnerabilidad no correspondida.",
                compatibilidad: "Media. Existe una base de afecto pero los canales de comunicación están obstruidos por ruidos cognitivos.",
                sugerencias: [
                    "Expresar sentimientos usando el 'Yo' en lugar de culpar al 'Tú'.",
                    "Escucha activa: Parafrasear lo que la otra persona dijo antes de responder.",
                    "Establecer un tiempo 'fuera' si la tensión sobrepasa los niveles manejables."
                ],
                terapiaPareja: true // En este caso simulado decidimos que sí
            });
            setStep('report');
        }, 3000);
    };

    return (
        <main style={{ padding: '8rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <AnimatePresence mode="wait">

                {/* STEP 1: INPUT MODAL */}
                {step === 'input' && (
                    <motion.section
                        key="input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card"
                        style={{ padding: '4rem' }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div className="breathing-glow" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
                                <Users size={60} className="gradient-text" />
                            </div>
                            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Vínculos</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                                Sube una captura, pega un texto o graba un audio para analizar la salud de tu relación.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                            <button
                                onClick={() => setInputType('text')}
                                className="btn-premium"
                                style={{ opacity: inputType === 'text' ? 1 : 0.6, background: inputType === 'text' ? 'white' : 'transparent', color: inputType === 'text' ? 'black' : 'white' }}
                            >
                                <FileText size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Texto
                            </button>
                            <button
                                onClick={() => setInputType('file')}
                                className="btn-premium"
                                style={{ opacity: inputType === 'file' ? 1 : 0.6, background: inputType === 'file' ? 'white' : 'transparent', color: inputType === 'file' ? 'black' : 'white' }}
                            >
                                <Upload size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Imagen
                            </button>
                            <button
                                onClick={() => setInputType('audio')}
                                className="btn-premium"
                                style={{ opacity: inputType === 'audio' ? 1 : 0.6, background: inputType === 'audio' ? 'white' : 'transparent', color: inputType === 'audio' ? 'black' : 'white' }}
                            >
                                <Mic size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Audio
                            </button>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            {inputType === 'text' && (
                                <textarea
                                    placeholder="Pega aquí la conversación (WhatsApp, Email, etc...)"
                                    style={{ width: '100%', height: '200px', padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', fontFamily: 'inherit', fontSize: '1rem', resize: 'none' }}
                                />
                            )}
                            {inputType === 'file' && (
                                <div style={{ width: '100%', height: '200px', border: '2px dashed var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    <Upload size={40} style={{ marginBottom: '1rem' }} />
                                    <p>Suelta tu imagen aquí o haz click para subir</p>
                                </div>
                            )}
                            {inputType === 'audio' && (
                                <div style={{ width: '100%', height: '200px', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)' }}>
                                    <Mic size={40} style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }} className="breathing-glow" />
                                    <p>Haz clic para comenzar a grabar</p>
                                </div>
                            )}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button className="btn-premium" style={{ width: '100%', padding: '18px' }} onClick={handleAnalizar}>
                                Analizar con IA <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                            </button>
                        </div>
                    </motion.section>
                )}

                {/* STEP 2: QUESTION */}
                {step === 'question' && (
                    <motion.section
                        key="question"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card"
                        style={{ padding: '4rem', textAlign: 'center' }}
                    >
                        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 700 }}>
                            ¿Qué te gustaría comprender realmente sobre esta interacción?
                        </h2>
                        <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                            <button className="btn-premium" onClick={() => selectIntention('tono')}>Entender el tono emocional</button>
                            <button className="btn-premium" onClick={() => selectIntention('conflicto')}>Detectar posibles conflictos</button>
                            <button className="btn-premium" onClick={() => selectIntention('compatibilidad')}>Evaluar la compatibilidad</button>
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>O escribe tu duda específica:</p>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Escribe aquí..."
                                        style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                    <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* STEP 3: ANALYZING */}
                {step === 'analyzing' && (
                    <motion.section
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '4rem' }}
                    >
                        <div className="breathing-glow" style={{ marginBottom: '2rem' }}>
                            <BarChart3 size={80} className="gradient-text" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem' }}>Analizando dinámica emocional...</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Nuestra IA está midiendo la reciprocidad, el tono y las intenciones subyacentes.</p>
                        <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '2rem auto', overflow: 'hidden' }}>
                            <motion.div
                                style={{ height: '100%', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))' }}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 3 }}
                            />
                        </div>
                    </motion.section>
                )}

                {/* STEP 4: REPORT */}
                {step === 'report' && reportData && (
                    <motion.section
                        key="report"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{ padding: '3rem' }}
                    >
                        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Informe de Vínculos</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Análisis profundo de la interacción</p>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                <h3 style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <MessageSquare size={20} style={{ marginRight: '10px' }} /> Resumen de IA
                                </h3>
                                <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{reportData.resumen}</p>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                <h3 style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <Heart size={20} style={{ marginRight: '10px' }} /> Dinámica y Tono
                                </h3>
                                <p style={{ marginBottom: '1rem' }}><strong>Tono:</strong> {reportData.tono}</p>
                                <p><strong>Compatibilidad detectada:</strong> {reportData.compatibilidad}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ color: 'white', marginBottom: '2rem', textAlign: 'center' }}>Métricas de Salud Relacional</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {[
                                    { label: 'Tensión Emocional', val: reportData.emociones.tension, color: '#f87171' },
                                    { label: 'Empatía y Calidez', val: reportData.emociones.empatia, color: 'var(--accent-secondary)' },
                                    { label: 'Reciprocidad', val: reportData.emociones.reciprocidad, color: 'var(--accent-primary)' }
                                ].map(m => (
                                    <div key={m.label}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <span>{m.label}</span>
                                            <span>{m.val}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${m.val}%`, height: '100%', background: m.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(167, 139, 250, 0.05)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)', marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>Sugerencias del Agente</h3>
                            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                                {reportData.sugerencias.map((s, i) => <li key={i} style={{ marginBottom: '10px' }}>{s}</li>)}
                            </ul>
                        </div>

                        {reportData.terapiaPareja && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ background: 'linear-gradient(135deg, rgba(110, 231, 183, 0.1) 0%, rgba(5, 5, 8, 0) 100%)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(110, 231, 183, 0.2)', textAlign: 'center' }}
                            >
                                <AlertCircle size={32} style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }} />
                                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Considera Terapia de Pareja</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                    Debido a la alta tensión y baja reciprocidad detectada, este vínculo podría beneficiarse enormemente de un espacio de mediación profesional.
                                </p>
                                <button className="btn-premium">Solicitar más información</button>
                            </motion.div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button className="secondaryBtn" onClick={() => setStep('input')}>Realizar otro análisis</button>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </main>
    );
}
