'use client';

import { useState, useEffect } from 'react';
import styles from './terapeutas.module.css';
import { Settings, Users, FileText, Search, Plus, Loader2, Trash2, Lock, Unlock, KeyRound, ShieldAlert, MailWarning } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMyPatients, therapistDeletePatient, therapistToggleBlock, therapistForcePasswordReset, therapistSendUrgentPing } from './actions';
import { sendPasswordReset } from '@/app/forgot-password/actions';

export default function TherapistDashboard() {
  const [activeTab, setActiveTab] = useState('crm');
  const [showInvite, setShowInvite] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteForm, setInviteForm] = useState({ nombre: '', email: '', rut: '', telefono: '' });
  const [pacientes, setPacientes] = useState([]);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await getMyPatients();
      setPacientes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const executeAction = async (actionFn, p, actionName, reqConfirm = false) => {
    if (reqConfirm && !window.confirm(`¿Estás seguro que deseas ${actionName} a ${p.nombre}?`)) return;
    setIsLoading(true);
    try {
      const res = await actionFn();
      if (res.error) alert(`Error: ${res.error}`);
      else alert(`Acción "${actionName}" ejecutada exitosamente.`);
    } catch(err) {
      alert('Error de conexión.');
    } finally {
      loadPatients();
    }
  };

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
                    <th>Registro Inicial</th>
                    <th style={{ textAlign: 'right' }}>Gestión</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        <Loader2 className="breathing-glow" style={{ margin: '0 auto' }} />
                      </td>
                    </tr>
                  ) : pacientes.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No tienes pacientes registrados aún.
                      </td>
                    </tr>
                  ) : (
                    pacientes.map(p => {
                       // Lógica Bíológica Semáforo
                       let estado = 'Activo';
                       let statusColor = '#22c55e'; // Verde
                       if (p.is_blocked) {
                         estado = 'Bloqueado';
                         statusColor = '#ef4444'; // Rojo
                       } else if (p.requires_password_change) {
                         estado = 'Invitado';
                         statusColor = '#f97316'; // Naranja
                       }

                       return (
                        <tr key={p.id} style={{ opacity: p.is_blocked ? 0.5 : 1 }}>
                          <td>{p.nombre}</td>
                          <td>
                            <div style={{ fontSize: '0.9rem' }}>{p.contacto}</div>
                          </td>
                          <td>
                            <span 
                              className={styles.statusBadge} 
                              style={{ 
                                background: \`rgba(\${statusColor === '#22c55e' ? '34, 197, 94' : statusColor === '#ef4444' ? '239, 68, 68' : '249, 115, 22'}, 0.1)\`, 
                                color: statusColor, 
                                border: \`1px solid \${statusColor}\`,
                                fontSize: '0.75rem',
                                padding: '2px 8px'
                              }}
                            >
                              {estado}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                             <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => executeAction(() => sendPasswordReset(p.emailRaw || p.contacto), p, "Enviar link de recuperación mágico", false)} 
                                title="Reenviar Acceso Mágico"
                                style={{ background: 'transparent', border: '1px solid rgba(167, 139, 250, 0.3)', color: '#a78bfa', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                <KeyRound size={14} />
                              </button>

                              {!p.requires_password_change && (
                                <>
                                  <button 
                                    onClick={() => executeAction(() => therapistSendUrgentPing(p.emailRaw || p.contacto, p.nombre), p, "Enviar Notificación Prioritaria", true)} 
                                    title="Aviso Urgente Oficial"
                                    style={{ background: 'transparent', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                                  >
                                    <MailWarning size={14} />
                                  </button>

                                  <button 
                                    onClick={() => executeAction(() => therapistForcePasswordReset(p.id), p, "Forzar Nueva Contraseña", true)} 
                                    title="Forzar Rotación de Clave"
                                    style={{ background: 'transparent', border: '1px solid rgba(250, 204, 21, 0.3)', color: '#facc15', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                                  >
                                    <ShieldAlert size={14} />
                                  </button>

                                  <button 
                                    onClick={() => executeAction(() => therapistToggleBlock(p.id, p.is_blocked), p, p.is_blocked ? "Desbloquear" : "Bloquear", true)}
                                    title={p.is_blocked ? "Desbloquear Acceso" : "Bloquear Acceso Temporalmente"}
                                    style={{ background: 'transparent', border: \`1px solid \${p.is_blocked ? 'rgba(34, 197, 94, 0.3)' : 'rgba(249, 115, 22, 0.3)'}\`, color: p.is_blocked ? '#22c55e' : '#f97316', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                                  >
                                    {p.is_blocked ? <Unlock size={14} /> : <Lock size={14} />}
                                  </button>
                                </>
                              )}

                              <button 
                                onClick={() => executeAction(() => therapistDeletePatient(p.id), p, "Eliminar permanentemente", true)} 
                                title="Destruir Perfil"
                                style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
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
