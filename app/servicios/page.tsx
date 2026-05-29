"use client"

// ─── Servicios Page (Client Component) ───────────────────────────────────────
// Full Value-Added Services Portfolio
// Rationale:
//   • VALUE EXTENSION: Clearly explaining and grouping delivery, diagnostics,
//     and workshops shows El Shaddai is a comprehensive auto partner, not just a store.
//   • SOCIAL PROOF: Porting the TalleresConfianzaSection (workshops) here anchors the
//     authority of the mechanics network locally.
//   • RETAIL CLOSE: Rendering PaymentTrustBand answers payment questions before they arise.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { Truck, Search, CheckCircle, Wrench, Shield, ArrowRight, MessageCircle } from "lucide-react"
import { BUSINESS, buildWhatsAppURL } from "@/lib/config"
import { useQuoteStore } from "@/lib/quote-store"
import FloatingQuoteBar from "@/components/FloatingQuoteBar"
import PaymentTrustBand from "@/components/PaymentTrustBand"
import TalleresConfianzaSection from "@/components/TalleresConfianzaSection"

export default function ServiciosPage() {
  const { quoteItems, isQuotePanelOpen, setIsQuotePanelOpen } = useQuoteStore()

  const services = [
    {
      icon: <Truck className="w-8 h-8 text-amber-500" />,
      title: "Auxilio Vial & Delivery Exprés",
      description: "¡Te llevamos el repuesto a donde te quedaste accidentado! Cobertura veloz en Cúa, Charallave y Ocumare del Tuy.",
      cta: "Pedir Delivery en Ruta →",
      msg: "Hola, necesito Auxilio Vial. ¿Me pueden llevar un repuesto a donde estoy?",
    },
    {
      icon: <Wrench className="w-8 h-8 text-red-500" />,
      title: "Diagnóstico Mecánico & Escáner",
      description: "Nuestros técnicos escanean tu vehículo para identificar la falla exacta y decirte qué repuesto necesitas comprar.",
      cta: "Agendar Escáner Mecánico →",
      msg: "Hola, quisiera agendar un diagnóstico mecánico para mi vehículo. ¿Disponibilidad?",
    },
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-16">
      {/* Hero Banner Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111622] to-[#0a0a0a] pt-16 pb-12 px-4 md:px-8 border-b border-[#252b3b]/30">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 bg-red-600/10 border border-red-500/25 rounded-full px-3.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-pulse" />
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
              Soporte Integral en Vía y Taller
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Servicios</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Más que una tienda de repuestos, somos tu aliado técnico para que tu vehículo nunca se detenga en los Valles del Tuy.
          </p>
        </div>
      </section>

      {/* Featured Delivery Banner (Social Media Style) */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row shadow-2xl">
          {/* Image Side */}
          <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[400px]">
            <img 
              src="/images/delivery_banner.png" 
              alt="Delivery Express El Shaddai" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay for seamless blend */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-900 via-zinc-900/40 to-transparent"></div>
          </div>
          
          {/* Content Side */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center w-full md:w-1/2 bg-zinc-900">
            <div className="inline-flex self-start items-center gap-2 mb-4 bg-red-600 border border-[#E60000] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 -skew-x-12">
              <span className="skew-x-12">¿Sabías que tenemos delivery?</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] uppercase tracking-tight mb-4">
              Llegamos a <br/><span className="text-[#E60000]">Charallave</span> y <span className="text-[#E60000]">Caracas</span>
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-8">
              ¿Te quedaste accidentado y necesitas un repuesto urgente? Cuidamos tu mercancía y te la entregamos en <strong className="text-white">tiempo récord</strong> directo al lugar en el que te encuentras. Calidad garantizada al mejor precio del mercado.
            </p>
            
            <a
              href={buildWhatsAppURL("Hola, necesito un repuesto con servicio de Delivery Express hacia Charallave/Caracas.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#E60000] hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(230,0,0,0.3)] hover:shadow-[0_4px_25px_rgba(230,0,0,0.4)] hover:-translate-y-1 active:translate-y-0 w-max"
            >
              <Truck className="w-5 h-5" />
              <span>Solicitar Delivery Ahora</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Portfolio Grid */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-zinc-850 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-zinc-700 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-200"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                  {s.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white mb-3">
                  {s.title}
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
                  {s.description}
                </p>
              </div>

              <a
                href={buildWhatsAppURL(s.msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_4px_15px_rgba(37,211,102,0.2)] active:scale-[0.98] mt-4 self-start text-sm"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>{s.cta}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Red de Talleres Aliados (Social Proof testimony) */}
      <TalleresConfianzaSection />

      {/* Trust Seal payment band */}
      <div className="mt-8">
        <PaymentTrustBand />
      </div>

      {/* Floating Quote Bar (bottom) */}
      <FloatingQuoteBar
        quoteItems={quoteItems}
        onOpenPanel={() => setIsQuotePanelOpen(true)}
        isHidden={isQuotePanelOpen}
      />
    </main>
  )
}
