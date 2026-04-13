'use client';

import { useState } from 'react';
import styles from './terapeutas.module.css';
import { Settings, Users, FileText, Search, Plus, MoreVertical, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TherapistDashboard() {
  const [activeTab, setActiveTab] = useState('crm');
  const [showInvite, setShowInvite] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ nombre: '', email: '', rut: '', telefono: '' });

  // Pacientes mockeados para el CRM (en el futuro se cargan vía supabase .from('profiles').eq('terapeuta_id', miId))
  const [pacientes, setPacientes] = useState([
    { id: 1, nombre: 'Ana Martínez', email: 'ana@ejemplo.com', tel: '+56 9 1234 5678', estado: 'activo', ultimaSesion: '10 Abril 2026' },
  ]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const bodyPayload = { ...inviteForm };
      const res = await fetch('/api/terapeuta/invite-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      
      const data = await res.json();
      if(res.ok) {
        alert('Paciente invitado correctamente. Revisa su email para las credenciales.');
        setShowInvite(false);
        setInviteForm({ nombre: '', email: '', rut: '', telefono: '' });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error crítico de conexión');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <ShieldCheck size={24} className="gradient-accent" />
          Portal Clínico
        </div>
        <nav className={styles.navMenu}>
          <button 
            className={`${styles.navItem} ${activeTab === 'crm' ? styles.active : ''}`}
            onClick={() => setActiveTab('crm')}
          >
            <Users size={20} /> Pacientes (CRM)
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'config' ? styles.active : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Settings size={20} /> Configuración IA
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'crm' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.header}>
              <h1>Gestión de Pacientes</h1>
              <p>Visualiza y administra tus "leads" y pacientes actuales.</p>
            </div>

            <div className={styles.section}>
              <div className={styles.crmControls}>
                <div className={styles.searchBox}>
                  <Search size={18} color="var(--text-muted)" />
                  <input type="text" placeholder="Buscar paciente por nombre o email..." />
                </div>
                <button 
                  className={styles.saveBtn} 
                  style={{ marginTop: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                  onClick={() => setShowInvite(!showInvite)}
                >
                  <Plus size={18} /> {showInvite ? 'Cancelar' : 'Nuevo Paciente'}
                </button>
              </div>

              {showInvite && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Invitar Nuevo Paciente</h3>
                  <form onSubmit={handleInvite} className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Nombre Completo</label>
                      <input type="text" className={styles.input} required value={inviteForm.nombre} onChange={e => setInviteForm({...inviteForm, nombre: e.target.value})} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Email (Acceso Dashboard)</label>
                      <input type="email" className={styles.input} required value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>RUT</label>
                      <input type="text" className={styles.input} value={inviteForm.rut} onChange={e => setInviteForm({...inviteForm, rut: e.target.value})} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Teléfono</label>
                      <input type="text" className={styles.input} value={inviteForm.telefono} onChange={e => setInviteForm({...inviteForm, telefono: e.target.value})} />
                    </div>
                    <div className={styles.fullWidth} style={{ textAlign: 'right', marginTop: '1rem' }}>
                      <button type="submit" className={styles.saveBtn} disabled={isInviting}>
                        {isInviting ? 'Invitando...' : 'Crear Paciente y Enviar Acceso'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <table className={styles.crmTable}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Estado</th>
                    <th>Última Sesión</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map(p => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>
                        <div style={{ fontSize: '0.9rem' }}>{p.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.tel}</div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles['status-' + p.estado]}`}>
                          {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                        </span>
                      </td>
                      <td>{p.ultimaSesion}</td>
                      <td>
                        <button className={styles.actionBtn}>
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.header}>
              <h1>Configuración Profesional e IA</h1>
              <p>Actualiza tus datos y personaliza el comportamiento del terapeuta virtual.</p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}><FileText size={20} /> Datos Profesionales</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nombre Público</label>
                  <input type="text" className={styles.input} defaultValue="Dr. Roberto Vargas" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Tarifa de Consulta</label>
                  <input type="text" className={styles.input} defaultValue="$50.000 CLP" />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Enlace de Reserva (Calendly / Google)</label>
                  <input type="url" className={styles.input} defaultValue="https://calendly.com/drvargas/60min" />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}><ShieldCheck size={20} /> Instrucciones para Terapeuta IA</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Este prompt se inyectará al agente base de Paz Mental. Úsalo para definir el enfoque terapéutico temporal, lineamientos específicos corporales o pautas que la IA debe tomar en cuenta antes de derivar.
              </p>
              
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Prompt del Terapeuta</label>
                <textarea 
                  className={`${styles.input} ${styles.textarea}`} 
                  defaultValue="Prioriza la exploración somática, haciendo preguntas sutiles sobre cómo se siente su cuerpo cuando experimentan ciertas emociones conectadas con la ansiedad."
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <button className={styles.saveBtn}>Guardar Configuración</button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
