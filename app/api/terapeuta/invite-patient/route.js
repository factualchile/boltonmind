import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, nombre, telefono, rut, terapeuta_id } = await req.json();

    if (!email || !nombre || !terapeuta_id) {
      return NextResponse.json({ error: 'Email, Nombre y Terapeuta ID son requeridos' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const temporalPassword = Math.random().toString(36).slice(-8) + 'P2!';

    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temporalPassword,
      email_confirm: true,
      user_metadata: { role: 'paciente' }
    });

    if (authError) {
      console.error("Auth creation patient error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Insertar perfil como paciente, asignándolo al terapeuta
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      role: 'paciente',
      nombre: nombre,
      email: email,
      rut: rut || null,
      telefono: telefono || null,
      terapeuta_id: terapeuta_id
    });

    if (profileError) {
       console.error("Profile patient creation error:", profileError);
       await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
       return NextResponse.json({ error: `Profiles Insert Error: ${profileError.message}` }, { status: 500 });
    }

    // 3. Enviar email al paciente
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Bolton Mind <onboarding@resend.dev>', // UPDATE
      to: email,
      subject: 'Tu Evolución Comienza Aquí | Bolton Mind',
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0E; padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); color: #e2e8f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="background: linear-gradient(135deg, #a78bfa, #fbcfe8, #a8edea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">Bolton Mind</h1>
          </div>
          <h2 style="color: #fff; font-size: 22px; font-weight: 400; margin-bottom: 20px;">Hola, ${nombre}</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; font-weight: 300;">
            Tu terapeuta te ha registrado en tu nuevo espacio digital seguro. Hemos creado un entorno diseñado específicamente para acompañarte en tu evolución emocional y recuperar tu paz mental.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; font-weight: 300;">
            Al ingresar, encontrarás a tu <strong>Terapeuta IA</strong>, un asistente comprensivo y privado disponible 24/7, programado directamente por tu terapeuta humano para brindarte apoyo continuo en tu camino hacia la libertad y la felicidad, respetando siempre tus límites y relaciones importantes.
          </p>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08); padding: 25px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Tus Credenciales de Entrada</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> <span style="color: #a8edea;">${email}</span></p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Contraseña:</strong> <span style="color: #fbcfe8; font-family: monospace; font-size: 18px;">${temporalPassword}</span></p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Entrar a la plataforma:</strong> <a href="http://localhost:3002/login" style="color: #a78bfa; text-decoration: none;">http://localhost:3002/login</a></p>
          </div>
          <p style="font-size: 14px; color: #64748b; font-weight: 300;">
            Este es un espacio confidencial. Te recomendamos cambiar tu contraseña temporal al ingresar por primera vez.
          </p>
          <hr style="border: 0; height: 1px; background: rgba(255,255,255,0.1); margin: 30px 0;" />
          <p style="font-size: 12px; color: #475569; text-align: center;">
            Comienza tu viaje a la tranquilidad.<br>Bolton Mind
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error) {
    console.error("Critical error in /api/terapeuta/invite-patient:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
