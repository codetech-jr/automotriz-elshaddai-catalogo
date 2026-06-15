/**
 * Tipos TypeScript que espejo el esquema de Supabase (generados manualmente).
 * Cuando tengas el proyecto conectado, puedes reemplazar con:
 *   pnpm supabase gen types typescript --project-id tu-proyecto > lib/supabase/types.ts
 */

export type ProductCondition = 'OEM' | 'ALTERNATIVO' | 'REMANUFACTURADO'

export type ProductCategory =
  | 'Motor'
  | 'Frenos'
  | 'Suspensión'
  | 'Filtros'
  | 'Eléctrico'
  | 'Carrocería'
  | 'Accesorios'

export type ProductBrand =
  | 'Chery'
  | 'Toyota'
  | 'Ford'
  | 'Chevrolet'
  | 'Volkswagen'
  | 'Hyundai'
  | 'Daewoo'
  | 'Universal'

export interface DbProduct {
  id: string
  part_number: string
  name: string
  category: ProductCategory
  brand: ProductBrand
  condition: ProductCondition
  stock_available: boolean
  stock_qty: number | null
  compatibility_text: string | null
  compatible_models: string[] | null
  image_url: string | null
  image_urls: string[]
  price_usd: number | null
  price_bs: number | null
  notes: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  is_active: boolean
}

/** Tipo para insertar un producto nuevo (sin campos auto-generados) */
export type InsertProduct = Omit<DbProduct,
  'id' | 'created_at' | 'updated_at' | 'is_active'
> & {
  is_active?: boolean
}

/** Tipo para actualizar parcialmente un producto */
export type UpdateProduct = Partial<InsertProduct>

/** Tipo seguro para mostrar en la UI pública (sin campos internos) */
export type PublicProduct = Pick<DbProduct,
  | 'id'
  | 'part_number'
  | 'name'
  | 'category'
  | 'brand'
  | 'condition'
  | 'stock_available'
  | 'compatibility_text'
  | 'compatible_models'
  | 'image_url'
>
