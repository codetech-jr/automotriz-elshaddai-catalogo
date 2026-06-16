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

// Helper para subir múltiples imágenes a Supabase Storage
async function uploadProductImages(
  images: File[],
  supabase: any
): Promise<string[]> {
  const uploadedUrls: string[] = []

  for (const file of images) {
    if (file && file instanceof File && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `${fileName}`

      const arrayBuffer = await file.arrayBuffer()
      const fileBuffer = new Uint8Array(arrayBuffer)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true
        })

      if (uploadError) {
        console.error('[uploadProductImages] Storage upload error:', uploadError)
        throw new Error('No se pudo subir una de las imágenes del producto.')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }
  }

  return uploadedUrls
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

  // Subida de múltiples imágenes al storage de Supabase (bucket: product-images)
  const images = formData.getAll('images') as File[]
  let uploadedUrls: string[] = []

  try {
    uploadedUrls = await uploadProductImages(images, supabase)
  } catch (err: any) {
    return { success: false, error: err.message }
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
    image_url:          uploadedUrls[0] || null,
    image_urls:         uploadedUrls,
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
  formData: FormData,
  imagePath?: string // Kept for backward compatibility
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // 1. Obtener el producto actual para robustez y fallback de imágenes
  const { data: currentProduct, error: fetchError } = await supabase
    .from('products')
    .select('image_url, image_urls, category, brand, condition, stock_qty, model')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('[updateProduct] Error fetching current product:', fetchError)
  }

  // Obtener imágenes existentes restantes de la edición
  const existingImagesRaw = formData.get('existing_images') as string | null
  let existingUrls: string[] = []
  if (existingImagesRaw) {
    try {
      const parsed = JSON.parse(existingImagesRaw)
      if (Array.isArray(parsed)) {
        existingUrls = parsed.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
      }
    } catch (e) {
      console.error('[updateProduct] Error parsing existing_images:', e)
    }
  }

  // Subida de nuevas imágenes al storage
  const newImages = formData.getAll('images') as File[]
  let uploadedUrls: string[] = []

  try {
    uploadedUrls = await uploadProductImages(newImages, supabase)
  } catch (err: any) {
    return { success: false, error: err.message }
  }

  // Combinar imágenes existentes y nuevas
  let finalUrls = [...existingUrls, ...uploadedUrls]

  // Si el producto ya tenía imágenes en Supabase y el usuario no subió fotos nuevas en esta edición,
  // y el resultado final de imágenes es vacío, conservamos las imágenes previas de la base de datos
  if (uploadedUrls.length === 0 && finalUrls.length === 0 && currentProduct) {
    if (Array.isArray(currentProduct.image_urls) && currentProduct.image_urls.length > 0) {
      finalUrls = currentProduct.image_urls
    } else if (currentProduct.image_url) {
      finalUrls = [currentProduct.image_url]
    }
  }

  const payload: UpdateProduct = {
    part_number:        (formData.get('part_number') as string)?.trim().toUpperCase(),
    name:               (formData.get('name') as string)?.trim(),
    category:           (formData.get('category') as string)?.trim() || '',
    brand:              formData.get('brand') as InsertProduct['brand'],
    model:              (formData.get('model') as string)?.trim() || null,
    condition:          formData.get('condition') as InsertProduct['condition'],
    stock_available:    formData.get('stock_available') === 'true',
    compatibility_text: (formData.get('compatibility_text') as string)?.trim() || null,
    image_url:          finalUrls[0] || null,
    image_urls:         finalUrls, // Enviado estrictamente como un Array de JavaScript (string[])
    notes:              (formData.get('notes') as string)?.trim() || null,
  }

  const stockQtyRaw = formData.get('stock_qty')
  if (stockQtyRaw !== null && !isNaN(Number(stockQtyRaw))) {
    payload.stock_qty = Number(stockQtyRaw)
  }

  // Validación server-side
  const validationError = validateProductInput(payload)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const { error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: `El número de parte "${payload.part_number}" ya existe.` }
    }
    console.error('[updateProduct] Supabase error:', error)
    return { success: false, error: 'No se pudo actualizar el producto.' }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/catalogo')
  revalidatePath('/', 'layout')

  return { success: true, data: undefined }
}

// =============================================================================
// ACTION: Cambiar estado activo/oculto (Soft-delete / Reactivar)
// =============================================================================
export async function toggleProductStatus(
  id: string,
  currentStatus: boolean
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase
    .from('products')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('[toggleProductStatus] Supabase error:', error)
    return { success: false, error: 'No se pudo cambiar el estado del producto.' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/catalogo')
  revalidatePath('/')
  revalidatePath('/', 'layout')

  return { success: true, data: undefined }
}

// =============================================================================
// ACTION: Eliminar producto definitivamente (Hard-delete)
// =============================================================================
export async function deleteProductPermanently(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteProductPermanently] Supabase error:', error)
    return { success: false, error: 'No se pudo eliminar el producto definitivamente.' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/catalogo')
  revalidatePath('/')
  revalidatePath('/', 'layout')

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

// =============================================================================
// ACTION: Crear categoría
// =============================================================================
export async function createCategory(name: string): Promise<ActionResult> {
  const supabase = await createClient()

  // Verificar sesión activa
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  const trimmedName = name?.trim()
  if (!trimmedName) {
    return { success: false, error: 'El nombre de la categoría es requerido.' }
  }

  const { error } = await supabase
    .from('product_categories')
    .insert({ name: trimmedName })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: `La categoría "${trimmedName}" ya existe.` }
    }
    console.error('[createCategory] Supabase error:', error)
    return { success: false, error: 'No se pudo crear la categoría. Intente nuevamente.' }
  }

  revalidatePath('/admin/settings')
  revalidatePath('/admin/products')
  revalidatePath('/admin/products/new')
  revalidatePath('/catalogo')

  return { success: true, data: undefined }
}

