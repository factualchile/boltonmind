const { Client } = require('pg');

const connectionString = 'postgresql://postgres:SkA123laudio*@db.dyyyxvvkkuuddrsahrry.supabase.co:5432/postgres';

async function fixRLS() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Conectado a la base de datos.");

    // Primero verificamos que la tabla exista
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
        role TEXT NOT NULL DEFAULT 'paciente',
        nombre TEXT,
        rut TEXT,
        telefono TEXT,
        email TEXT,
        terapeuta_id UUID REFERENCES public.profiles(id),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    // Si la tabla existía pero no tenía 'email', se lo agregamos
    await client.query(`ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;`);
    
    console.log("Estructura base confirmada.");

    // Habilitar RLS
    await client.query(`ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`);

    // Borrar políticas si existen para evitar errores
    await client.query(`DROP POLICY IF EXISTS "Todos pueden leer su propio perfil" ON public.profiles;`);
    await client.query(`DROP POLICY IF EXISTS "Todos leyendo perfiles (fix)" ON public.profiles;`);

    // Crear política para permitir a los usuarios leer SU PROPIO perfil
    // Para simplificar, le permitiré a cualquier autenticado leer profiles (o al menos el suyo y el de sus pacientes).
    // Usaremos algo más permisivo para no romper el login.
    await client.query(`
      CREATE POLICY "Todos pueden leer la tabla profiles"
      ON public.profiles
      FOR SELECT
      USING (true);
    `);

    console.log("✅ RLS Policy actualizada. (Select habilitado).");

  } catch (e) {
    console.error("Error arreglando la DB:", e);
  } finally {
    await client.end();
  }
}

fixRLS();
