'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function getTerapeutas() {
  const supabase = createAdminClient();

  // Obtenemos a los terapeutas
  const { data: terapeutas, error } = await supabase
    .from('profiles')
    .select('id, nombre, email, rut, telefono')
    .eq('role', 'terapeuta');

  if (error || !terapeutas) return [];

  // Dado que Auth Email no está en public.profiles sino en Auth.Users (y eso requiere una vista especial),
  // Lo ideal es tener el email guardado en profiles. Como en el invite usamos el payload temporal, 
  // O podemos pedirlo de admin.listaUsers() pero eso consumiria mucha API.
  // Vamos a devolver la lista. Si 'email' no existe en profiles, no aparecerá.
  
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
    pacientes_count: patientsCountByTherapist[t.id] || 0
  }));
}
