import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import GoogleRatingBadge from '@/components/GoogleRatingBadge'
// import BrandScrollBar from '@/components/BrandScrollBar'

import { createClient } from '@/lib/supabase/server'
import { BUSINESS } from '@/lib/config'
import { SettingsProvider } from '@/lib/settings-context'

export const metadata: Metadata = {
  // SEO Local: Título optimizado con palabras clave principales y secundarias
  title: 'Repuestos en Charallave | Automotriz El Shaddai | Autopartes & Delivery',
  
  // CTR Hook: Orientado a urgencias (Delivery Express, Auxilio Vial) cubriendo los Valles del Tuy (Charallave, Cúa, Santa Teresa)
  description: '¿Buscas repuestos en Charallave, Cúa o Santa Teresa? Automotriz El Shaddai ofrece autopartes de calidad con delivery express y auxilio vial en Valles del Tuy. ¡Cotiza hoy!',
  
  // Palabras clave semánticas y de marca
  keywords: [
    'repuestos',
    'automotriz',
    'autopartes',
    'Charallave',
    'Cúa',
    'Santa Teresa',
    'Valles del Tuy',
    'delivery repuestos',
    'auxilio vial',
    'Chery',
    'Toyota',
    'Ford',
    'Chevrolet'
  ],
  authors: [{ name: 'Automotriz El Shaddai' }],
  
  // Integración de Google Search Console mediante API de Metadatos de Next.js
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  
  // Open Graph optimizado con la misma estrategia local para redes sociales
  openGraph: {
    title: 'Repuestos en Charallave | Automotriz El Shaddai | Autopartes & Delivery',
    description: '¿Buscas repuestos en Charallave, Cúa o Santa Teresa? Automotriz El Shaddai ofrece autopartes de calidad con delivery express y auxilio vial en Valles del Tuy. ¡Cotiza hoy!',
    type: 'website',
    locale: 'es_VE',
  },
}



export const viewport: Viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const settings = data || {
    id: 1,
    whatsapp_number: BUSINESS.phone,
    whatsapp_greeting: 'Hola, necesito ayuda con repuestos para mi vehículo.',
    store_address: BUSINESS.address,
    is_emergency_banner_active: true,
  }

  return (
    <html lang="es" className="bg-[#121212] overflow-x-hidden">
      <body className="font-sans antialiased bg-[#121212] text-white overflow-x-hidden max-w-full">
        <SettingsProvider settings={settings}>
          <header className="w-full flex flex-col">
            {/* <BrandScrollBar /> */}
            {settings.is_emergency_banner_active && <AnnouncementBar whatsappNumber={settings.whatsapp_number} />}
            <Navbar />
          </header>
          {children}
          <SiteFooter settings={settings} />
          <GoogleRatingBadge />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </SettingsProvider>
      </body>
    </html>
  )
}

