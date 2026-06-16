import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CatalogClient from './CatalogClient'

export const metadata: Metadata = {
  title: 'Catálogo de Repuestos — Automotriz El Shaddai',
  description: 'Explora nuestro catálogo completo de repuestos originales (OEM) y alternativos de alta calidad en los Valles del Tuy. Chery, Toyota, Ford, Chevrolet.',
}

export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
  const supabase = await createClient()

  // Consulta de productos activos ordenados por fecha de creación desc
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Mapear los datos de Supabase al tipo Product de la UI pública
  const products = (dbProducts || []).map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    compatibility: p.compatibility_text || p.model || '',
    sku: p.part_number,
    imageUrl: p.image_url || (p.image_urls && p.image_urls[0]) || undefined,
    image_urls: Array.isArray(p.image_urls) ? p.image_urls : [],
  }))

  return <CatalogClient initialProducts={products} />
}
