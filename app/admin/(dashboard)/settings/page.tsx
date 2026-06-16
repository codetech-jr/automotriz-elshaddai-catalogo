import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BUSINESS } from '@/lib/config'
import SettingsForm from '@/components/admin/SettingsForm'
import SecuritySettingsCard from '@/components/admin/SecuritySettingsCard'
import CategoryManagerForm from '@/components/admin/CategoryManagerForm'
import type { DbStoreSettings } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Configuración General',
}

// Ensure the page is always rendered dynamically on requests
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Load the settings row (Singular table pattern id = 1)
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .single()

  // Graceful fallback if the SQL query fails or the row has not been inserted yet
  let settings: DbStoreSettings = data || {
    id: 1,
    whatsapp_number: BUSINESS.phone,
    whatsapp_greeting: 'Hola, necesito ayuda con repuestos para mi vehículo.',
    store_address: BUSINESS.address,
    is_emergency_banner_active: true,
  }

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "no rows returned", which we handle gracefully above.
    // For other connection or database errors, log them.
    console.error('[SettingsPage] Error loading settings from database:', error.message)
  }

  // Load categories from database
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('product_categories')
    .select('id, name')
    .order('name', { ascending: true })

  if (categoriesError) {
    console.error('[SettingsPage] Error loading categories from database:', categoriesError.message)
  }

  const categories = categoriesData || []

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Cabecera ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Configuraciones Generales de la Tienda
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Modifica el comportamiento y datos globales del e-commerce sin realizar despliegues de código
        </p>
      </div>

      {/* ── Formulario de Configuración ─────────────────────────────────── */}
      <SettingsForm initialSettings={settings} />

      {/* ── Administrador de Categorías ─────────────────────────────────── */}
      <CategoryManagerForm initialCategories={categories} />

      {/* ── Seguridad de la Cuenta ──────────────────────────────────────── */}
      <SecuritySettingsCard />
    </div>
  )
}

