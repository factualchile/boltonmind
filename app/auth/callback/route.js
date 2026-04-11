import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // Handle error if called from a Server Component
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (next.startsWith('/')) {
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }
  }

  // Si no hay código o hubo error (fallback recovery para hash si se desactiva PKCE)
  // Normalmente si es recovery, Supabase redirigirá al "redirectTo" especificado
  // con la sesión ya iniciada en el cliente si es implícito, pero SSR requiere redirect.
  return NextResponse.redirect(new URL('/login?error=Invalid_recovery_link', requestUrl.origin))
}
