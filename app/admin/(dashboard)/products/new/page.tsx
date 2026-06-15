import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NewProductForm from '@/components/admin/NewProductForm'

export const metadata: Metadata = { title: 'Nuevo Repuesto' }

export default async function NewProductPage() {
  // Double-check auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Nuevo Repuesto
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Completa los datos del repuesto para agregarlo al catálogo.
        </p>
      </div>

      {/* Formulario Client Component */}
      <NewProductForm />
    </div>
  )
}
