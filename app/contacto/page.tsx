"use client"

import StoreLocation from "@/components/StoreLocation"
import { MessageCircle, MapPin, Mail, Phone } from "lucide-react"
import { BUSINESS, buildWhatsAppURL } from "@/lib/config"

export default function ContactoPage() {
  const whatsappSoporte = buildWhatsAppURL("Hola, necesito asesoría general o consultar una duda.")
  const whatsappCotizacion = buildWhatsAppURL("Hola, quisiera enviar una lista de repuestos para cotizar.")

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111622] to-[#0a0a0a] pt-16 pb-12 px-4 md:px-8 border-b border-[#252b3b]/30">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 bg-sky-600/10 border border-sky-500/25 rounded-full px-3.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
              Asistencia Inmediata
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Contacto y <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Ubicación</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            ¿Tienes alguna duda o necesitas cotizar rápidamente? Estamos a tu disposición en todos nuestros canales digitales y en nuestra tienda física.
          </p>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Soporte WhatsApp */}
          <a href={whatsappSoporte} target="_blank" rel="noopener noreferrer" className="bg-[#141414] border border-zinc-850 rounded-3xl p-8 hover:border-[#25D366]/50 hover:bg-[#25D366]/5 transition-all group flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">WhatsApp Directo</h3>
            <p className="text-zinc-400 text-sm mb-4">La forma más rápida de cotizar y resolver dudas. Respuesta en minutos.</p>
            <span className="text-[#25D366] font-semibold text-sm mt-auto">Chatear ahora →</span>
          </a>

          {/* Card 2: Tienda Física */}
          <div className="bg-[#141414] border border-zinc-850 rounded-3xl p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-[#E60000] flex items-center justify-center mb-5">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Tienda Física</h3>
            <p className="text-zinc-400 text-sm mb-4">Visítanos y retira tus compras de forma segura y cómoda.</p>
            <span className="text-zinc-300 font-semibold text-sm mt-auto">{BUSINESS.location}</span>
          </div>

          {/* Card 3: Llamadas */}
          <a href={`tel:${BUSINESS.phone}`} className="bg-[#141414] border border-zinc-850 rounded-3xl p-8 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Llamada Telefónica</h3>
            <p className="text-zinc-400 text-sm mb-4">¿Prefieres hablar directamente con un asesor? Llámanos dentro de nuestro horario.</p>
            <span className="text-sky-500 font-semibold text-sm mt-auto">Llamar ahora →</span>
          </a>
        </div>
      </section>

      {/* Map Integration */}
      <StoreLocation />

    </main>
  )
}
