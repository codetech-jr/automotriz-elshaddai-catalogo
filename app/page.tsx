import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

// ─── 1. METADATA SSR OPTIMIZADA GEOLOCALIZADAMENTE (SEO LOCAL) ────────────────
export const metadata: Metadata = {
  title: 'Repuestos y Autoperiquitos Charallave · El Shaddai Valles del Tuy',
  description: 'Tu tienda física de repuestos nuevos en Charallave. Toyota, Chevrolet, Ford, Chery, Hyundai, Volkswagen y Daewoo. Delivery a Cúa y Ocumare. Cotiza por WhatsApp.',
  keywords: [
    'repuestos charallave', 
    'autoperiquitos charallave', 
    'repuestos valles del tuy', 
    'repuestos toyota charallave',
    'chiveras valles del tuy',
    'autopartes miranda'
  ],
  alternates: {
    canonical: 'https://automotriz-elshaddai-catalogo.vercel.app',
  },
  openGraph: {
    title: 'Repuestos y Autoperiquitos Charallave · El Shaddai Valles del Tuy',
    description: 'Tu tienda física de repuestos nuevos en Charallave. Toyota, Chevrolet, Ford, Chery, Hyundai, Volkswagen y Daewoo. Delivery a Cúa y Ocumare. Cotiza por WhatsApp.',
    url: 'https://automotriz-elshaddai-catalogo.vercel.app',
    type: 'website',
  },
}

export default async function Home() {
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

  return (
    <>
      {/* ─── 2. H1 INVISIBLE PARA CRAWLERS (SEO SEMÁNTICO) ───────────────────── */}
      <h1 className="sr-only">
        Repuestos y Autoperiquitos Charallave - Automotriz El Shaddai Valles del Tuy
      </h1>
      
      {/* Retorno de tu interfaz original intacta */}
      <HomeClient initialProducts={products} />
    </>
  )
}
