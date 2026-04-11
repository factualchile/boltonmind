import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumn() {
  const { data, error } = await supabase.rpc('query', { 
    sql_text: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT true;' 
  });
  
  if (error) {
    if (error.message.includes('function "query" does not exist')) {
      console.log('No direct SQL RPC available, run this manually in Supabase SQL editor:');
      console.log('ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT true;');
    } else {
      console.error('Error:', error);
    }
  } else {
    console.log('Successfully added requires_password_change column to profiles');
  }

  // Also remove it from the admin so the admin doesn't get locked out
  const { error: updateError } = await supabase.from('profiles').update({ requires_password_change: false }).eq('role', 'admin');
  if (updateError) {
      console.error('Failed to clear flag for admin:', updateError);
  } else {
      console.log('Successfully cleared requires_password_change for admin user.');
  }
}

addColumn();
