import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, nombre, telefono, rut } = await req.json();

    if (!email || !nombre) {
      return NextResponse.json({ error: 'Email and Name are required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Crear contraseña aleatoria sencilla o una fuerte para que cambien luego
    const temporalPassword = Math.random().toString(36).slice(-8) + 'A1!';

    // 2. Crear usuario saltando confirmación de email (auto_confirm=true de forma implícita o explícita)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temporalPassword,
      email_confirm: true,
      user_metadata: { role: 'terapeuta' }
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 3. Insertar perfil
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      role: 'terapeuta',
      nombre: nombre,
      email: email,
      rut: rut || null,
      telefono: telefono || null
    });

    if (profileError) {
       console.error("Profile creation error:", profileError);
       // Delete the auth user to rollback
       await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
       return NextResponse.json({ error: \`Profiles Insert Error: \${profileError.message}. Details: \${profileError.details}\` }, { status: 500 });
    }

    // 4. Enviar email de bienvenida vía Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Bolton Mind <onboarding@resend.dev>', // UPDATE IF DOMAIN IS VERIFIED
      to: email,
      subject: 'Acceso Clínico Autorizado | Bolton Mind',
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0E; padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); color: #e2e8f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="background: linear-gradient(135deg, #a78bfa, #fbcfe8, #a8edea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">Bolton Mind</h1>
          </div>
          <h2 style="color: #fff; font-size: 22px; font-weight: 400; margin-bottom: 20px;">Bienvenido/a, ${nombre}</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; font-weight: 300;">
            Tu perfil profesional ha sido habilitado en nuestra plataforma clínica. Bolton Mind está diseñado para potenciar tu trabajo a través de acompañamiento con inteligencia artificial, manteniendo el enfoque en la ética y la profunda paz mental de tus pacientes.
          </p>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08); padding: 25px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Credenciales de Acceso</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> <span style="color: #a8edea;">${email}</span></p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Contraseña:</strong> <span style="color: #fbcfe8; font-family: monospace; font-size: 18px;">${temporalPassword}</span></p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Panel CRM:</strong> <a href="http://localhost:3002/login" style="color: #a78bfa; text-decoration: none;">Acceder a la plataforma</a></p>
          </div>
          <p style="font-size: 14px; color: #64748b; font-weight: 300;">
            Le recomendamos cambiar esta contraseña temporal en su primera visita para maximizar la seguridad de los datos de sus pacientes.
          </p>
          <hr style="border: 0; height: 1px; background: rgba(255,255,255,0.1); margin: 30px 0;" />
          <p style="font-size: 12px; color: #475569; text-align: center;">
            Evolución humana potenciada por IA.<br>Bolton Mind
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true, user: authData.user, emailTracking: emailData });
  } catch (error) {
    console.error("Critical error in /api/admin/invite-therapist:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
