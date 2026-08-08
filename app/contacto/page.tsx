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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: WhatsApp Charallave */}
          <a href={buildWhatsAppURL("Hola, quisiera cotizar o consultar en la Sede Charallave.", BUSINESS.branches.charallave.phone)} target="_blank" rel="noopener noreferrer" className="bg-[#141414] border border-zinc-850 rounded-3xl p-6 hover:border-[#25D366]/50 hover:bg-[#25D366]/5 transition-all group flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">Sede Charallave</span>
            <h3 className="text-white font-bold text-base mb-1.5">WhatsApp Charallave</h3>
            <p className="text-zinc-400 text-xs mb-3 font-mono">{BUSINESS.branches.charallave.formattedPhone}</p>
            <span className="text-[#25D366] font-semibold text-xs mt-auto">Chatear ahora →</span>
          </a>

          {/* Card 2: WhatsApp Caracas */}
          <a href={buildWhatsAppURL("Hola, quisiera cotizar o consultar en la Sede Caracas.", BUSINESS.branches.caracas.phone)} target="_blank" rel="noopener noreferrer" className="bg-[#141414] border border-zinc-850 rounded-3xl p-6 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Sede Caracas</span>
            <h3 className="text-white font-bold text-base mb-1.5">WhatsApp Caracas</h3>
            <p className="text-zinc-400 text-xs mb-3 font-mono">{BUSINESS.branches.caracas.formattedPhone}</p>
            <span className="text-emerald-400 font-semibold text-xs mt-auto">Chatear ahora →</span>
          </a>

          {/* Card 3: Tienda Física */}
          <div className="bg-[#141414] border border-zinc-850 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-[#E60000] flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Ubicación Principal</span>
            <h3 className="text-white font-bold text-base mb-1.5">Tienda Física</h3>
            <p className="text-zinc-400 text-xs mb-3">Visítanos y retira tus compras de forma segura y cómoda.</p>
            <span className="text-zinc-300 font-semibold text-xs mt-auto">{BUSINESS.location}</span>
          </div>

          {/* Card 4: Llamadas */}
          <a href={`tel:${BUSINESS.phone}`} className="bg-[#141414] border border-zinc-850 rounded-3xl p-6 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">Atención Telefónica</span>
            <h3 className="text-white font-bold text-base mb-1.5">Llamada Directa</h3>
            <p className="text-zinc-400 text-xs mb-3">¿Prefieres hablar directamente con un asesor?</p>
            <span className="text-sky-500 font-semibold text-xs mt-auto">Llamar ahora →</span>
          </a>
        </div>
      </section>

      {/* Map Integration */}
      <StoreLocation />

    </main>
  )
}
