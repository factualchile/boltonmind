'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordReset(email) {
  if (!email) return { error: 'El email es requerido' };

  try {
    const supabaseAdmin = createAdminClient();

    // 1. Verificamos silenciosamente si existe y generamos el Custom Recovery Link
    // Supabase genera el link con redirectTo que usaremos.
    // Usamos el cliente Admin para no pasar por Rate Limits de servidor publico si hay demasiados intentos,
    // pero idealmente se usa supabaseClient.auth.resetPasswordForEmail si usamos SMTP interno.
    // Como usamos Resend externo manualmente, generateLink es perfecto.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/update-password` : 'http://localhost:3000/update-password'
      }
    });

    if (linkError) {
      console.error('Error generando recovery link:', linkError);
      // Por motivos de seguridad (Evitar enumeración de emails), no le decimos al cliente si falló por no existir.
      return { success: true }; 
    }

    const { action_link } = linkData.properties;

    // 2. Despachar hermoso email con nuestro diseño en Resend (Saltándose Supabase SMTP local)
    const { error: emailError } = await resend.emails.send({
      from: 'Bolton Mind <bienvenida@boltonmind.cl>',
      to: email,
      subject: 'Recupera tu Acceso | Bolton Mind',
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0E; padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); color: #e2e8f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="background: linear-gradient(135deg, #a78bfa, #fbcfe8, #a8edea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">Bolton Mind</h1>
          </div>
          <h2 style="color: #fff; font-size: 22px; font-weight: 400; margin-bottom: 20px;">Seguridad de Acceso</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; font-weight: 300;">
            Hemos detectado una solicitud temporal para recuperar las credenciales de tu perfil clínico en Bolton Mind. Tu paz mental es lo primero, así que hemos asegurado esta acción.
          </p>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08); padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Ingreso Directo</p>
            <a href="${action_link}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
              Recuperar mi cuenta
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #64748b; font-weight: 300;">
            Si tú no solicitaste este cambio, simplemente puedes ignorar este correo. Por seguridad, este enlace altamente protegido caducará en 1 hora.
          </p>
          <hr style="border: 0; height: 1px; background: rgba(255,255,255,0.1); margin: 30px 0;" />
          <p style="font-size: 12px; color: #475569; text-align: center;">
            Plataforma Segura e Inteligente.<br>Bolton Mind
          </p>
        </div>
      `
    });

    if (emailError) {
      console.error('Resend delivery failed:', emailError);
      return { error: 'Hubo un error despachando nuestro servidor de correos.' };
    }

    return { success: true };

  } catch (err) {
    console.error('Critical forgot-password logic:', err);
    return { error: 'Error interno de validación.' };
  }
}
