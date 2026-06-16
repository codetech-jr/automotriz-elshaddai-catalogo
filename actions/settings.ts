'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Server Action for updating store settings.
 * Enforces admin authorization, validates fields, updates the settings row (id = 1),
 * and triggers global layout revalidation.
 */
export async function updateSettings(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  // 1. Authorization Check (first defense is middleware, this is second layer)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // 2. Extract and sanitize fields
  const whatsappNumber = formData.get('whatsapp_number') as string | null
  const whatsappGreeting = formData.get('whatsapp_greeting') as string | null
  const storeAddress = formData.get('store_address') as string | null
  const isEmergencyBannerActive = formData.get('is_emergency_banner_active') === 'true'

  // 3. Validation
  if (!whatsappNumber || !whatsappNumber.trim()) {
    return { success: false, error: 'El número de WhatsApp es requerido.' }
  }
  if (!whatsappGreeting || !whatsappGreeting.trim()) {
    return { success: false, error: 'El saludo predeterminado de WhatsApp es requerido.' }
  }
  if (!storeAddress || !storeAddress.trim()) {
    return { success: false, error: 'La dirección física de la tienda es requerida.' }
  }

  // 4. Update the settings row (Singular table pattern id = 1)
  const { error } = await supabase
    .from('store_settings')
    .update({
      whatsapp_number: whatsappNumber.trim(),
      whatsapp_greeting: whatsappGreeting.trim(),
      store_address: storeAddress.trim(),
      is_emergency_banner_active: isEmergencyBannerActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)

  if (error) {
    console.error('[updateSettings] Supabase error:', error)
    return { success: false, error: 'No se pudieron guardar las configuraciones en la base de datos.' }
  }

  // 5. Instantly invalidate layout cache for active clients
  revalidatePath('/', 'layout')

  return { success: true }
}
