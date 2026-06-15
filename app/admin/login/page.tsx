import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Acceso Administrativo — El Shaddai',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  // Si ya tiene sesión, ir al admin directamente
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/admin')

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
      {/* Fondo decorativo */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[360px] space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
            <svg
              className="h-6 w-6 text-amber-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 className="mt-4 text-lg font-semibold text-white">Automotriz El Shaddai</h1>
          <p className="mt-1 text-sm text-white/40">Panel de Administración</p>
        </div>

        {/* Formulario */}
        <AdminLoginForm />
      </div>
    </div>
  )
}
