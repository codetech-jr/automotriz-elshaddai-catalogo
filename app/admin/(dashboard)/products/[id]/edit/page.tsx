import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import type { DbProduct } from '@/lib/supabase/types'

export const metadata: Metadata = { title: 'Editar Repuesto' }

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const supabase = await createClient()

  // Double-check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Fetch product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    console.error('[EditProductPage] Product not found or error:', error)
    notFound()
  }

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('product_categories')
    .select('id, name')
    .order('name', { ascending: true })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Editar Repuesto
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Modifica los datos del repuesto para actualizarlo en el catálogo.
        </p>
      </div>

      {/* Formulario Client Component */}
      <ProductForm initialData={product as DbProduct} categories={categoriesData || []} />
    </div>
  )
}

