'use client';

import { useState, useEffect } from 'react';
import styles from '../../terapeutas/dashboard/terapeutas.module.css';
import { ShieldCheck, Users, Activity, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTerapeutas } from './actions';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('crm');
  const [terapeutas, setTerapeutas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ nombre: '', email: '', rut: '', telefono: '' });

  const loadTerapeutas = async () => {
    setIsLoading(true);
    try {
      const data = await getTerapeutas();
      setTerapeutas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTerapeutas();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    
    try {
      const res = await fetch('/api/admin/invite-therapist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm)
      });
      
      const data = await res.json();
      if(res.ok) {
        alert('Terapeuta invitado correctamente y correo enviado.');
        setInviteForm({ nombre: '', email: '', rut: '', telefono: '' });
        loadTerapeutas();
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
          <ShieldCheck size={24} color="#f87171" />
          Admin Central
        </div>
        <nav className={styles.navMenu}>
          <button 
            className={`${styles.navItem} ${activeTab === 'crm' ? styles.active : ''}`}
            onClick={() => setActiveTab('crm')}
          >
            <Users size={20} /> Terapeutas
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'metrics' ? styles.active : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            <Activity size={20} /> Métricas
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'crm' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.header}>
              <h1>Gestión de Terapeutas</h1>
              <p>Invita nuevos especialistas y organiza su acceso a la plataforma.</p>
            </div>

            <div className={styles.sectionGrid} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
              {/* Tabla de Terapeutas Existentes */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Terapeutas Registrados</h2>
                <div className={styles.crmControls}>
                  <div className={styles.searchBox}>
                    <input type="text" placeholder="Buscar terapeuta..." />
                  </div>
                </div>

                <table className={styles.crmTable}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Pacientes Inscritos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                          <Loader2 className="breathing-glow" style={{ margin: '0 auto' }} />
                        </td>
                      </tr>
                    ) : terapeutas.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No hay terapeutas registrados aún.
                        </td>
                      </tr>
                    ) : (
                      terapeutas.map((t) => (
                        <tr key={t.id}>
                          <td>{t.nombre}</td>
                          <td>{t.contacto}</td>
                          <td>
                            <span className={styles.statusBadge} style={{background: 'rgba(255,255,255,0.1)', color: 'white'}}>
                              {t.pacientes_count}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Form de Invitación */}
              <div className={styles.section} style={{ height: 'fit-content' }}>
                <h2 className={styles.sectionTitle} style={{ fontSize: '1.1rem' }}><Plus size={18}/> Invitar Terapeuta</h2>
                <form onSubmit={handleInvite} className={styles.formGrid} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre y Apellidos</label>
                    <input type="text" className={styles.input} required value={inviteForm.nombre} onChange={e => setInviteForm({...inviteForm, nombre: e.target.value})} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Email (Acceso)</label>
                    <input type="email" className={styles.input} required value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Teléfono</label>
                    <input type="text" className={styles.input} value={inviteForm.telefono} onChange={e => setInviteForm({...inviteForm, telefono: e.target.value})} />
                  </div>
                  
                  <button type="submit" className={styles.saveBtn} disabled={isInviting} style={{ display: 'flex', justifyContent: 'center' }}>
                    {isInviting ? <Loader2 className="breathing-glow" /> : 'Enviar Invitación Auth'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.header}>
              <h1>Visión General (Métricas)</h1>
            </div>
            {/* Metricas de negocio globales */}
          </motion.div>
        )}
      </main>
    </div>
  );
}
