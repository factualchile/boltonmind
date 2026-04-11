'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function getTerapeutas() {
  const supabase = createAdminClient();

  // Obtenemos a los terapeutas
  const { data: terapeutas, error } = await supabase
    .from('profiles')
    .select('id, nombre, email, rut, telefono, is_blocked')
    .eq('role', 'terapeuta');

  if (error || !terapeutas) return [];

  // Para obtener la cantidad de pacientes por cada terapeuta:
  const { data: counts, error: errorCounts } = await supabase
    .from('profiles')
    .select('terapeuta_id')
    .eq('role', 'paciente');
  
  // Mapeamos los contadores
  const patientsCountByTherapist = {};
  if (!errorCounts && counts) {
    counts.forEach((c) => {
      if (c.terapeuta_id) {
         patientsCountByTherapist[c.terapeuta_id] = (patientsCountByTherapist[c.terapeuta_id] || 0) + 1;
      }
    });
  }

  // Juntamos todo
  return terapeutas.map(t => ({
    id: t.id,
    nombre: t.nombre || 'Sin nombre',
    contacto: t.email || t.telefono || t.rut || 'No proporcionado',
    pacientes_count: patientsCountByTherapist[t.id] || 0,
    is_blocked: !!t.is_blocked,
    emailRaw: t.email
  }));
}

// 1. Eliminar Terapeuta
export async function deleteTherapist(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return { error: error.message };
  return { success: true };
}

// 2. Bloquear/Desbloquear
export async function toggleBlockStatus(id, currentStatus) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('profiles').update({ is_blocked: !currentStatus }).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// 3. Forzar Rotación de Clave
export async function forcePasswordResetFlag(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('profiles').update({ requires_password_change: true }).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// 5. Alerta de Urgencia
export async function sendUrgentDashboardPing(email, name) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'Bolton Mind <bienvenida@boltonmind.cl>',
      to: email,
      subject: 'URGENTE: Atención Requerida en tu Panel Clínico',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0E; padding: 40px; border: 1px solid #ef4444; color: #e2e8f0; border-radius: 8px;">
          <h2 style="color: #f87171;">Aviso Prioritario de Administración</h2>
          <p>Estimado/a ${name},</p>
          <p>El Administrador de la plataforma Bolton Mind ha emitido una alerta urgente que requiere tu revisión inmediata.</p>
          <p>Por favor, accede a tu Panel Clínico a la brevedad para regularizar esta situación y garantizar el correcto funcionamiento de tus expedientes de pacientes.</p>
          <a href="http://boltonmind.cl/login" style="display:inline-block; margin-top:20px; padding: 12px 24px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 6px;">Ir a mi Dashboard</a>
        </div>
      `
    });
    if (error) return { error: error.message };
    return { success: true };
  } catch (err) {
    return { error: 'No se pudo conectar al servidor de correos.' };
  }
}
