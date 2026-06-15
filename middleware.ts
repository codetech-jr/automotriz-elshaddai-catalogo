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
  const { pathname } = request.nextUrl

  const isAdminLoginPage = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')

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

  // ── Protección del Panel Admin ────────────────────────────────────────────

  // CASO 1: Ruta es /admin/login y NO hay sesión → dejar pasar (nunca redirigir)
  if (isAdminLoginPage && !user) {
    return supabaseResponse
  }

  // CASO 2: Ruta es /admin/login y SÍ hay sesión → redirigir al dashboard
  if (isAdminLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/admin/products'
    dashboardUrl.searchParams.delete('redirect')
    return NextResponse.redirect(dashboardUrl)
  }

  // CASO 3: Ruta /admin/** (excepto /admin/login) y NO hay sesión → redirigir al login
  if (isAdminRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    // Guardar la URL original para redirigir después del login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
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
