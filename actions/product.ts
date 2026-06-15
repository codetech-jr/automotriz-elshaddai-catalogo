'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { InsertProduct, UpdateProduct } from '@/lib/supabase/types'

// ── Tipos de respuesta tipados ─────────────────────────────────────────────────
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// ── Validación mínima del servidor ─────────────────────────────────────────────
function validateProductInput(data: Partial<InsertProduct>): string | null {
  if (!data.part_number?.trim()) return 'El número de parte es requerido'
  if (!data.name?.trim()) return 'El nombre del producto es requerido'
  if (!data.category) return 'La categoría es requerida'
  if (!data.brand) return 'La marca es requerida'
  if (!data.condition) return 'La condición es requerida'
  return null
}

// =============================================================================
// ACTION: Crear producto
// =============================================================================
export async function createProduct(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  // Verificar sesión activa (seguridad adicional sobre el middleware)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Subida de imagen al storage de Supabase (bucket: product-images)
  const imageFile = formData.get('image') as File | null
  let imageUrl: string | null = null

  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `${fileName}`

    const arrayBuffer = await imageFile.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, fileBuffer, {
        contentType: imageFile.type,
        upsert: true
      })

    if (uploadError) {
      console.error('[createProduct] Storage upload error:', uploadError)
      return { success: false, error: 'No se pudo subir la imagen del producto.' }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    imageUrl = publicUrl
  }

  const payload: Partial<InsertProduct> = {
    part_number:        (formData.get('part_number') as string)?.trim().toUpperCase(),
    name:               (formData.get('name') as string)?.trim(),
    category:           formData.get('category') as InsertProduct['category'],
    brand:              formData.get('brand') as InsertProduct['brand'],
    model:              (formData.get('model') as string)?.trim() || null,
    condition:          formData.get('condition') as InsertProduct['condition'],
    stock_available:    formData.get('stock_available') === 'true',
    compatibility_text: (formData.get('compatibility_text') as string)?.trim() || null,
    image_url:          imageUrl,
    notes:              (formData.get('notes') as string)?.trim() || null,
    created_by:         user.id,
  }

  // Parsear stock_qty si se proporcionó
  const stockQtyRaw = formData.get('stock_qty')
  if (stockQtyRaw && !isNaN(Number(stockQtyRaw))) {
    payload.stock_qty = Number(stockQtyRaw)
  }

  // Validación server-side
  const validationError = validateProductInput(payload)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const { data, error } = await supabase
    .from('products')
    .insert(payload as InsertProduct)
    .select('id')
    .single()

  if (error) {
    // Manejar error de duplicado en part_number
    if (error.code === '23505') {
      return { success: false, error: `El número de parte "${payload.part_number}" ya existe.` }
    }
    console.error('[createProduct] Supabase error:', error)
    return { success: false, error: 'No se pudo crear el producto. Intente nuevamente.' }
  }

  // Revalidar la caché de las páginas afectadas
  revalidatePath('/admin/products')
  revalidatePath('/catalogo')

  return { success: true, data: { id: data.id } }
}

// =============================================================================
// ACTION: Actualizar producto
// =============================================================================
export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Subida de imagen al storage de Supabase (bucket: product-images)
  const imageFile = formData.get('image') as File | null
  let imageUrl: string | null = (formData.get('image_url') as string)?.trim() || null

  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `${fileName}`

    const arrayBuffer = await imageFile.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, fileBuffer, {
        contentType: imageFile.type,
        upsert: true
      })

    if (uploadError) {
      console.error('[updateProduct] Storage upload error:', uploadError)
      return { success: false, error: 'No se pudo subir la imagen del producto.' }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    imageUrl = publicUrl
  }

  const payload: UpdateProduct = {
    name:               (formData.get('name') as string)?.trim(),
    category:           formData.get('category') as InsertProduct['category'],
    brand:              formData.get('brand') as InsertProduct['brand'],
    model:              (formData.get('model') as string)?.trim() || null,
    condition:          formData.get('condition') as InsertProduct['condition'],
    stock_available:    formData.get('stock_available') === 'true',
    compatibility_text: (formData.get('compatibility_text') as string)?.trim() || null,
    image_url:          imageUrl,
    notes:              (formData.get('notes') as string)?.trim() || null,
  }

  const stockQtyRaw = formData.get('stock_qty')
  if (stockQtyRaw !== null && !isNaN(Number(stockQtyRaw))) {
    payload.stock_qty = Number(stockQtyRaw)
  }

  const { error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .eq('is_active', true) // Solo actualizar productos activos

  if (error) {
    console.error('[updateProduct] Supabase error:', error)
    return { success: false, error: 'No se pudo actualizar el producto.' }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/catalogo')

  return { success: true, data: undefined }
}

// =============================================================================
// ACTION: Soft-delete (desactivar producto)
// =============================================================================
export async function deactivateProduct(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('[deactivateProduct] Supabase error:', error)
    return { success: false, error: 'No se pudo desactivar el producto.' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/catalogo')

  return { success: true, data: undefined }
}

// =============================================================================
// ACTION: Toggle stock_available
// =============================================================================
export async function toggleStockAvailable(
  id: string,
  currentValue: boolean
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase
    .from('products')
    .update({ stock_available: !currentValue })
    .eq('id', id)

  if (error) {
    return { success: false, error: 'No se pudo actualizar el stock.' }
  }

  revalidatePath('/admin/products')

  return { success: true, data: undefined }
}

// =============================================================================
// ACTION: Logout
// =============================================================================
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
