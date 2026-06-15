import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware de Next.js — Automotriz El Shaddai
 *
 * Responsabilidades:
 * 1. Refrescar la sesión de Supabase en cada request (SSR cookie rotation)
 * 2. Proteger todas las rutas bajo /admin/** contra visitantes no autenticados
 * 3. Redirigir usuarios ya logueados que intenten ir a /admin/login
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Actualiza las cookies en el request para Server Components
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Actualiza las cookies en la respuesta para el navegador
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: No escribir lógica entre createServerClient y getUser()
  // Esto es crítico para que el refresh del token funcione correctamente.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Protección del Panel Admin ────────────────────────────────────────────
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLoginPage = pathname === '/admin/login'

  if (isAdminRoute && !isAdminLoginPage && !user) {
    // Usuario no autenticado intentando acceder al admin → redirigir al login
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    // Guardar la URL original para redirigir después del login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminLoginPage && user) {
    // Usuario ya autenticado intentando ir al login → redirigir al dashboard
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/admin'
    return NextResponse.redirect(dashboardUrl)
  }

  // IMPORTANTE: Retornar supabaseResponse (no NextResponse.next() directamente)
  // para preservar las cookies actualizadas
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas EXCEPTO:
     * - _next/static (archivos estáticos de Next.js)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, imágenes públicas
     * - API routes que no necesitan auth (webhooks, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
