import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 *
 * USO: Llama a esta función DENTRO de Server Components o Server Actions.
 * NO es un singleton — cada llamada crea un nuevo cliente con las cookies actuales.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
          } catch {
            // Si estamos en un Server Component (read-only), ignorar el error.
            // El Middleware ya gestiona el refresh del token.
          }
        },
      },
    }
  )
}
