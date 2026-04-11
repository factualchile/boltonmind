import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This should ONLY be used in restricted Server Routes, 
// never in client components or non-protected server components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Admin key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
