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
  title: 'Automotriz El Shaddai | Repuestos para Chery, Toyota, Ford y Chevrolet',
  description: 'Tu especialista en repuestos automotrices en Charallave, Miranda. Repuestos originales y alternativos para Chery, Toyota, Ford y Chevrolet. Delivery a toda la región. Cotiza por WhatsApp.',
  keywords: ['repuestos', 'automotriz', 'Chery', 'Toyota', 'Ford', 'Chevrolet', 'Charallave', 'Miranda', 'Venezuela', 'autopartes'],
  authors: [{ name: 'Automotriz El Shaddai' }],
  openGraph: {
    title: 'Automotriz El Shaddai | Repuestos para Chery, Toyota, Ford y Chevrolet',
    description: 'Tu especialista en repuestos automotrices en Charallave, Miranda. Cotiza por WhatsApp.',
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
          <header className="w-full flex flex-col overflow-hidden">
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

