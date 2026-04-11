'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/utils/supabase/admin';

export async function executePasswordUpdate(newPassword) {
  if (!newPassword || newPassword.length < 6) return { error: 'Contraseña inválida' };

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {}
          },
        },
      }
    );

    // 1. Conseguir el User de la sesión actual
    const { data: { user }, error: authUserError } = await supabase.auth.getUser();

    if (authUserError || !user) {
      return { error: 'Tu sesión ha expirado o el link inválido. Solicita uno nuevo.' };
    }

    // 2. Actualizar contraseña
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      console.error('Password Update Error:', updateError);
      return { error: 'No se pudo actualizar la clave. Intenta otra diferente.' };
    }

    // 3. (Opcional) Si existe requires_password_change en profiles, la apagamos
    // Lo hacemos usando adminClient para saltar RLS temporalmente
    const supabaseAdmin = createAdminClient();
    try {
       await supabaseAdmin.from('profiles').update({ requires_password_change: false }).eq('id', user.id);
    } catch(err) {
       // Si la columna no existe, ignoramos el fallo. El update en auth funcionó
    }

    return { success: true };

  } catch (err) {
    console.error('Critical update-password logic:', err);
    return { error: 'Error interno de validación.' };
  }
}
