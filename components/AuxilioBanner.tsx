// ─── AuxilioBanner — Auxilio Vial & Delivery Express ──────────────────────────
// CRO Rationale (marketing-psychology.md):
//   • Loss Aversion: "¿Estás varado?" activa el dolor de pérdida de tiempo/dinero
//     que la persona YA está sufriendo — no es hipotético.
//   • Present Bias (Hyperbolic Discounting): "En minutos" sobre-pesa el alivio
//     inmediato. El usuario accidentado en señal 3G toma decisiones con Present Bias.
//   • Scarcity / Urgency: Zones explícitas + "Servicio activo" con dot pulsante
//     crea urgencia geográfica real, no artificial.
//   • Authority: "Repuesto en tu ubicación" — somos los únicos que cubren esta zona.
//   • Pattern Interrupt: Fondo amarillo-ámbar + iconografía de emergencia rompe
//     el esquema oscuro corporativo y obliga al ojo a detenerse.
//
// Server Component: sin "use client" — puro HTML+CSS, cero hidratación JS.
// ─────────────────────────────────────────────────────────────────────────────

import { Truck, AlertTriangle, Zap, MapPin, Phone } from "lucide-react"
import { BUSINESS } from "@/lib/config"

const COVERAGE_ZONES = ["Charallave", "Cúa", "Ocumare del Tuy", "Santa Teresa"]

const WA_AUXILIO_MSG = encodeURIComponent(
  "🚨 Necesito auxilio vial urgente. Estoy varado en la vía y necesito un repuesto. ¿Pueden ayudarme? Indíqueme cobertura y tiempo de llegada."
)
const WA_DELIVERY_MSG = encodeURIComponent(
  "Hola, quisiera solicitar delivery express de un repuesto. ¿Cuál es el tiempo de entrega a mi zona?"
)

// Dynamic phone number centralized from BUSINESS config
const PHONE = BUSINESS.phone

export default function AuxilioBanner() {
  return (
    <section
      aria-label="Servicio de Auxilio Vial y Delivery Express"
      className="
        relative overflow-hidden
        bg-gradient-to-br from-[#1a1000] via-[#231500] to-[#1a0e00]
        border-y border-[#F59E0B]/25
        py-10 px-4 md:px-8
      "
    >
      {/* ── Atmospheric glows ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 bottom-0 w-96
          bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.10)_0%,_transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-0 bottom-0 w-64
          bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.06)_0%,_transparent_70%)]"
      />

      <div className="relative max-w-6xl mx-auto">
        {/* ── Live indicator pill ── */}
        <div className="flex items-center gap-2 mb-5">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B]" />
          </span>
          <span className="text-[#FBBF24] text-xs font-bold uppercase tracking-widest">
            Servicio Activo Ahora
          </span>
        </div>

        {/* ── Main grid: Copy / Zones / CTA ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-6 md:gap-10 items-start md:items-center">

          {/* ── LEFT: Pain Point Copy ── */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-black leading-tight tracking-tight">
                  ¿Varado en la vía?{" "}
                  <span className="text-[#FBBF24]">Te llevamos el repuesto.</span>
                </h2>
                <p className="text-zinc-400 text-sm mt-1.5 max-w-md leading-relaxed">
                  Mecánico sin pieza, carro sin arrancar. Nuestro equipo lleva el repuesto a{" "}
                  <span className="text-white font-semibold">tu ubicación exacta</span>{" "}
                  en los Valles del Tuy.{" "}
                  <span className="text-[#FBBF24] font-medium">Sin moverte.</span>
                </p>
              </div>
            </div>

            {/* Service highlights */}
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 ml-13">
              {[
                { icon: Zap, text: "Respuesta en minutos" },
                { icon: Truck, text: "Delivery en zona Tuy" },
                { icon: MapPin, text: "Rastreo en tiempo real" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <Icon className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* ── CENTER: Coverage Zones ── */}
          <div className="hidden md:block">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2.5">
              Zonas de cobertura
            </p>
            <ul className="flex flex-col gap-1.5" aria-label="Zonas de cobertura del servicio">
              {COVERAGE_ZONES.map((zone) => (
                <li
                  key={zone}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/70 border border-zinc-800 rounded-full px-3 py-1"
                >
                  <MapPin className="w-3 h-3 text-[#F59E0B]" aria-hidden="true" />
                  {zone}
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT: CTA Stack ── */}
          <div className="flex flex-col gap-2.5 w-full md:w-auto min-w-[200px]">
            {/* Primary CTA — urgent WhatsApp */}
            <a
              href={`https://wa.me/${PHONE}?text=${WA_AUXILIO_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Solicitar auxilio vial urgente por WhatsApp"
              className="
                flex items-center justify-center gap-2.5
                bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.97]
                text-[#0d0d0d] font-black text-sm
                py-3.5 px-5 rounded-xl
                min-h-[52px] w-full
                transition-all duration-150
                shadow-[0_4px_20px_rgba(245,158,11,0.35)]
                hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)]
              "
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              Auxilio Vial Urgente
            </a>

            {/* Secondary CTA — Delivery Express */}
            <a
              href={`https://wa.me/${PHONE}?text=${WA_DELIVERY_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Solicitar delivery express de repuesto"
              className="
                flex items-center justify-center gap-2.5
                bg-transparent hover:bg-[#F59E0B]/10
                border border-[#F59E0B]/40 hover:border-[#F59E0B]/70
                text-[#FBBF24] font-semibold text-sm
                py-3 px-5 rounded-xl
                min-h-[48px] w-full
                transition-all duration-150
              "
            >
              <Truck className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              Delivery Express
            </a>

            {/* Tertiary: Direct call */}
            <a
              href={`tel:+${PHONE}`}
              aria-label="Llamar directamente a Automotriz El Shaddai"
              className="flex items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors py-1"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              O llama directamente
            </a>
          </div>
        </div>

        {/* ── Mobile-only: Coverage zones (horizontal scroll) ── */}
        <div className="md:hidden mt-5 -mx-4 px-4">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2">
            Cobertura
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Zonas de cobertura">
            {COVERAGE_ZONES.map((zone) => (
              <span
                key={zone}
                className="inline-flex items-center gap-1 text-xs text-zinc-300 bg-zinc-900/70 border border-zinc-800 rounded-full px-3 py-1 flex-shrink-0"
              >
                <MapPin className="w-3 h-3 text-[#F59E0B]" aria-hidden="true" />
                {zone}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
