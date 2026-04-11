'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './dashboard.module.css';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageCircle, User, Settings, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola. Soy tu terapeuta virtual. Estoy aquí para acompañarte en un espacio seguro, brindándote paz mental e intentando fomentar tu felicidad y libertad. ¿Cómo te sientes hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages })
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, en este momento siento un poco de interferencia y no pude procesar tu mensaje. Por favor, intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <BrainCircuit size={24} className="gradient-accent" />
          Bolton Mind
        </div>
        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
            <MessageCircle size={20} />
            <span>Mi terapeuta IA</span>
          </Link>
          <Link href="/dashboard/perfil" className={styles.navItem}>
            <User size={20} />
            <span>Mi Evolución</span>
          </Link>
          <Link href="/dashboard/configuracion" className={styles.navItem}>
            <Settings size={20} />
            <span>Configuración</span>
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Tu espacio de paz mental</h1>
            <p>Conecta con tu guía para recuperar tu centro.</p>
          </div>
        </div>

        <motion.div 
          className={styles.chatWorkspace}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.chatMessages}>
            {messages.map((msg, index) => (
              <motion.div 
                key={index} 
                className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.user : styles.ai}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className={`${styles.avatar} ${msg.role === 'user' ? styles.user : styles.ai}`}>
                  {msg.role === 'user' ? <User size={20} /> : <BrainCircuit size={20} />}
                </div>
                <div className={styles.bubble}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                className={`${styles.messageWrapper} ${styles.ai}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className={`${styles.avatar} ${styles.ai}`}>
                  <BrainCircuit size={20} />
                </div>
                <div className={styles.bubble}>
                  <Loader2 className="breathing-glow" size={20} style={{ animationDuration: '2s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInputContainer}>
            <form onSubmit={handleSubmit} className={styles.chatForm}>
              <textarea
                className={styles.chatInput}
                placeholder="Escribe lo que sientes en este momento..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={1}
                style={{ minHeight: '56px', maxHeight: '150px' }}
              />
              <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
