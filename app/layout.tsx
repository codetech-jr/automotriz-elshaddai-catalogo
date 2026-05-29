import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import BrandScrollBar from '@/components/BrandScrollBar'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-[#121212]">
      <body className="font-sans antialiased bg-[#121212] text-white">
        <header className="w-full flex flex-col">
          <BrandScrollBar />
          <AnnouncementBar />
          <Navbar />
        </header>
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
