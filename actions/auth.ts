'use server'

import { createClient } from '@/lib/supabase/server'

type ActionResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Server Action to update the current admin user's password.
 * Validates session, confirms matching passwords, and triggers Supabase Auth update.
 */
export async function updateAdminPassword(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  // 1. Session check
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Sesión no válida o expirada.' }
  }

  // 2. Extract inputs
  const newPassword = formData.get('newPassword') as string | null
  const confirmPassword = formData.get('confirmPassword') as string | null

  // 3. Validation
  if (!newPassword || !confirmPassword) {
    return { success: false, error: 'Ambos campos de contraseña son requeridos.' }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Las contraseñas no coinciden.' }
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  // 4. Trigger Supabase Auth update
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    console.error('[updateAdminPassword] Auth update error:', error)
    return { success: false, error: error.message || 'No se pudo actualizar la contraseña.' }
  }

  return { success: true }
}
