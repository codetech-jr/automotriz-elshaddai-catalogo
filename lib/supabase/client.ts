'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente de Supabase para Client Components.
 *
 * USO: Llama a esta función dentro de Client Components ('use client').
 * Usa el anon key que es seguro de exponer al navegador.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
