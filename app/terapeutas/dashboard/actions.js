'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// 1. Obtener Pacientes del Terapeuta Logueado
export async function getMyPatients() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Obtenemos a los pacientes
  const { data: pacientes, error } = await supabase
    .from('profiles')
    .select('id, nombre, email, rut, telefono, is_blocked, requires_password_change, created_at')
    .eq('role', 'paciente')
    .eq('terapeuta_id', user.id);

  if (error || !pacientes) return [];

  return pacientes.map(p => ({
    id: p.id,
    nombre: p.nombre || 'Sin nombre',
    contacto: p.email || p.telefono || p.rut || 'No proporcionado',
    emailRaw: p.email,
    is_blocked: !!p.is_blocked,
    requires_password_change: !!p.requires_password_change,
    created_at: p.created_at
  }));
}

// ==========================================
// SEGURIDAD AISLADA: Verificar pertenencia
// ==========================================
async function verifyOwnership(patientId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('profiles')
    .select('terapeuta_id')
    .eq('id', patientId)
    .single();

  return data?.terapeuta_id === user.id;
}

// 2. Eliminar Paciente
export async function therapistDeletePatient(id) {
  const isOwner = await verifyOwnership(id);
  if (!isOwner) return { error: 'No tienes permisos sobre este paciente.' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };
  return { success: true };
}

// 3. Bloquear / Desbloquear Paciente
export async function therapistToggleBlock(id, currentStatus) {
  const isOwner = await verifyOwnership(id);
  if (!isOwner) return { error: 'No tienes permisos sobre este paciente.' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('profiles').update({ is_blocked: !currentStatus }).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// 4. Forzar Regeneración de Contraseña
export async function therapistForcePasswordReset(id) {
  const isOwner = await verifyOwnership(id);
  if (!isOwner) return { error: 'No tienes permisos sobre este paciente.' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('profiles').update({ requires_password_change: true }).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// 5. Alerta de Urgencia al Paciente
export async function therapistSendUrgentPing(email, name) {
  if (!email || !email.includes('@')) {
    return { error: 'El paciente no tiene un correo electrónico válido registrado.' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'Bolton Mind <bienvenida@boltonmind.cl>',
      to: email,
      subject: 'URGENTE: Atención Requerida de tu Terapeuta',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0E; padding: 40px; border: 1px solid #ef4444; color: #e2e8f0; border-radius: 8px;">
          <h2 style="color: #f87171;">Aviso de Prioridad Clínica</h2>
          <p>Hola ${name},</p>
          <p>Tu terapeuta ha solicitado que ingreses a la brevedad a la plataforma para revisar tus últimos registros y herramientas de tu evolución.</p>
          <p>Te pedimos reanudar tus tareas pendientes accediendo desde aquí:</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://boltonmind.cl'}/login" style="display:inline-block; margin-top:20px; padding: 12px 24px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 6px;">Ir a mi Plataforma Segura</a>
        </div>
      `
    });
    if (error) return { error: error.message };
    return { success: true };
  } catch (err) {
    return { error: 'No se pudo conectar al servidor de correos.' };
  }
}
