import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 1. Si no hay usuario y tratamos de acceder a áreas privadas
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/terapeutas') || pathname.startsWith('/admin') || pathname.startsWith('/update-password'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si hay usuario, vamos a extraer su rol y estado de seguridad de la tabla profiles
  // Para ser eficientes y como solicitamos la DB profiles en la planificación
  if (user && (pathname.startsWith('/admin') || pathname.startsWith('/terapeutas') || pathname.startsWith('/dashboard'))) {
    // Usamos cliente Admin temporal para saltar RLS en middleware
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role, requires_password_change')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'paciente';

    // 1.5. Bloqueo duro: Si requiere actualizar la clave y NO está en la página de update, forzamos
    if (profile?.requires_password_change && !pathname.startsWith('/update-password')) {
      const url = request.nextUrl.clone()
      url.pathname = '/update-password'
      return NextResponse.redirect(url)
    }

    // 2. Proteger área de Admin
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // 3. Proteger área de Terapeuta
    if (pathname.startsWith('/terapeutas') && role !== 'terapeuta' && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = role === 'paciente' ? '/dashboard' : '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
