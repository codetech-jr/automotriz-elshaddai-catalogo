import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: {
    default: 'Panel Admin',
    template: '%s | Admin — El Shaddai',
  },
  robots: { index: false, follow: false }, // No indexar el panel admin
}

/**
 * Layout del Panel Administrativo
 *
 * Verifica la sesión de Supabase como segunda capa de defensa
 * (el Middleware es la primera). Si no hay usuario, redirige al login.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Sidebar fija */}
      <AdminSidebar userEmail={user.email ?? ''} />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
