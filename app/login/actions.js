'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  
  if (!email || !password) {
    return { error: 'Por favor, completa todos los campos' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Credenciales inválidas o cuenta no registrada.' };
  }

  // Ahora redireccionamos según el rol usando el Admin Client para saltar RLS
  const { createAdminClient } = await import('@/utils/supabase/admin');
  const adminSupabase = createAdminClient();

  const { data: profile, error: profileErr } = await adminSupabase
    .from('profiles')
    .select('role, requires_password_change')
    .eq('id', data.user.id)
    .single();

  const role = profile?.role || 'paciente';

  // Si tiene que cambiar contraseña, lo forzamos.
  if (profile?.requires_password_change) {
    return { redirect: '/update-password' };
  }

  if (role === 'admin') {
    return { redirect: '/admin/dashboard' };
  } else if (role === 'terapeuta') {
    return { redirect: '/terapeutas/dashboard' };
  } else {
    return { redirect: '/dashboard' };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { redirect: '/login' };
}
