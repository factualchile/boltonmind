const { createClient } = require('@supabase/supabase-js');

// Para evitar problemas de dependencias de node, corremos esto directamente en el contexto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBlockedColumn() {
  const { error } = await supabase.rpc('query', { 
    sql_text: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;' 
  });
  
  if (error && error.message.includes('function "query" does not exist')) {
    console.log('--- ERROR: EJECUTA ESTO MANUALMENTE EN SUPABASE SQL EDITOR ---');
    console.log('ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;');
    console.log('--------------------------------------------------------------');
  } else if (error) {
    console.error('Error:', error);
  } else {
    console.log('Agregado is_blocked correctamente');
  }
}

addBlockedColumn();
