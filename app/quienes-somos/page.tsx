"use client"

// ─── Quiénes Somos Page (Client Component) ──────────────────────────────────
// Brand Profile, Values, and Physical Presence
// Rationale:
//   • LOCAL AUTHORTY: A dedicated corporate overview page builds trust,
//     proving El Shaddai is a real local business with local people.
//   • REUSABILITY: Incorporates the StoreLocation component directly, maintaining
//     SEO schemas, semantic hours, address, and interactive dark-themed maps.
//   • UNIFIED EXPERIENCE: Keeps the off-canvas Quote List Panel synced with the store.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { Shield, Sparkles, Award, Heart } from "lucide-react"

import { useQuoteStore } from "@/lib/quote-store"
import FloatingQuoteBar from "@/components/FloatingQuoteBar"

export default function QuienesSomosPage() {
  const { quoteItems, isQuotePanelOpen, setIsQuotePanelOpen } = useQuoteStore()

  const values = [
    {
      icon: <Shield className="w-6 h-6 text-red-500" />,
      title: "Garantía & Confianza",
      description: "Solo distribuimos repuestos verificados que protegen la vida útil de tu vehículo y tu seguridad en la vía.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: "Asesoría Técnica Experta",
      description: "No te vendemos una pieza al azar. Validamos compatibilidades con tu SKU o marca para asegurar cero errores.",
    },
    {
      icon: <Award className="w-6 h-6 text-sky-500" />,
      title: "Stock Líder Regional",
      description: "Mantenemos inventario activo en Charallave para Chery, Toyota, Ford y Chevrolet sin demoras de importación.",
    },
    {
      icon: <Heart className="w-6 h-6 text-emerald-500" />,
      title: "Compromiso Local",
      description: "Somos parte de los Valles del Tuy. Apoyamos a la comunidad con auxilio vial y entrega directa en ruta.",
    },
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-16">
      {/* Hero Banner Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111622] to-[#0a0a0a] pt-16 pb-12 px-4 md:px-8 border-b border-[#252b3b]/30">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 bg-[#e60000]/10 border border-[#e60000]/25 rounded-full px-3.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-pulse" />
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
              Nuestra Historia & Valores
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Quiénes <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Somos</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Conoce el equipo humano y comercial detrás de **Automotriz El Shaddai**, tu especialista en repuestos de confianza en los Valles del Tuy.
          </p>
        </div>
      </section>

      {/* Brand Narrative Section */}
      <section className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#121620]/30 border border-zinc-900 rounded-3xl p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Más de 10 años manteniendo en marcha tu vehículo
            </h2>
            <div className="w-12 h-1 bg-[#E60000] rounded-full" />
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              En **Automotriz El Shaddai** entendemos que tu vehículo no es solo un medio de transporte, sino una herramienta de trabajo, de progreso y el resguardo de tu familia.
            </p>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Nacimos en Charallave con la misión de eliminar las dificultades para conseguir repuestos de calidad en la región. Hoy, nos consolidamos como la red de distribución de autopartes más confiable y veloz de los Valles del Tuy.
            </p>
          </div>
          <div className="space-y-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6">
            <h3 className="text-white font-extrabold text-lg">Nuestro Compromiso</h3>
            <blockquote className="border-l-4 border-amber-500 pl-4 py-1 italic text-zinc-300 text-sm leading-relaxed">
              &ldquo;Ofrecer repuestos de alto rendimiento con asesoría experta a precios justos, eliminando la incertidumbre en cada compra y entregándolos en tiempo récord.&rdquo;
            </blockquote>
            <p className="text-zinc-500 text-xs mt-3">
              — El Equipo de Automotriz El Shaddai
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white">Nuestros Pilares Comerciales</h2>
          <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">
            Principios rectores que definen cada una de nuestras interacciones y despachos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-zinc-850 rounded-2xl p-6 hover:border-zinc-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{v.title}</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Floating Quote Bar (bottom) */}
      <FloatingQuoteBar
        quoteItems={quoteItems}
        onOpenPanel={() => setIsQuotePanelOpen(true)}
        isHidden={isQuotePanelOpen}
      />
    </main>
  )
}
