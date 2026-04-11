const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
  console.log("Creando administrador en Auth...");
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'boltonmind@gmail.com',
    password: '123456787',
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });

  if (error) {
    console.error("Error al crear el usuario Auth:", error.message);
    return;
  }

  const userId = data.user.id;
  console.log("✅ Usuario Auth creado con ID:", userId);
  
  console.log("Insertando en tabla profiles como 'admin'...");
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role: 'admin',
    nombre: 'Admin Bolton',
  });

  if (profileError) {
    console.error("❌ Error al insertar en public.profiles:", profileError.message);
    return;
  }

  console.log("✅ Administrador creado con éxito en Auth y en Profiles.");
}

createAdmin();
