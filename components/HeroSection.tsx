"use client"

// ─── HeroSection — Propuesta de Valor + CTA Centralizado ──────────────────────
// Patrón Amazon/MercadoLibre: el Hero se enfoca en comunicar la propuesta de
// valor de forma limpia e inmediata, derivando al usuario al catálogo o a
// shortcuts de marcas sin sobrecargar la pantalla con inputs y dropdowns complejos.
//
// VISUAL TRUST: Señales de confianza y píldora de disponibilidad local siempre visibles.
// CRO: CTA principal ámbar de alto contraste ("Explorar Todo el Catálogo") y
//   shortcuts (BrandPills) que llevan directamente al catálogo con filtros pre-cargados.
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation"
import { MapPin, ArrowRight } from "lucide-react"

// ─── Trust Signals ─────────────────────────────────────────────────────────────
function TrustSignals() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6">
      {[
        { icon: "✅", text: "Originales y alternativos" },
        { icon: "⚡", text: "Respuesta en minutos" },
        { icon: "📍", text: "Valles del Tuy" },
      ].map(s => (
        <span key={s.text} className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
          <span aria-hidden="true">{s.icon}</span>
          <span>{s.text}</span>
        </span>
      ))}
    </div>
  )
}

// ─── Main HeroSection ──────────────────────────────────────────────────────────
interface HeroSectionProps {
  topBarVisible?: boolean
}

export default function HeroSection({ topBarVisible = true }: HeroSectionProps) {
  const router = useRouter()
  const heroPt = topBarVisible ? "pt-[120px]" : "pt-20"

  return (
    <section
      aria-labelledby="hero-heading"
      className={`
        relative min-h-[85vh] flex flex-col justify-center
        px-4 sm:px-6 md:px-10 lg:px-16
        ${heroPt} pb-20
        bg-[#0f0f0f]
        overflow-hidden
        transition-[padding] duration-300 ease-in-out
      `}
    >
      {/* Background Image with dimming overlay and gradient fades */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/shaddai-hero-banner.webp"
          alt="Instalaciones de Automotriz El Shaddai"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Darkening overlay for overall readability */}
        <div className="absolute inset-0 bg-[#0f0f0f]/60" />
        {/* Top fade (blends with Navbar) */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0f12] to-transparent" />
        {/* Bottom fade (blends with page background) */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
        {/* Left-to-right gradient to keep text area very dark and readable */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[70%] bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Grain texture overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.012] z-10
        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAlIiBoZWlnaHQ9IjMwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 max-w-3xl w-full mx-auto lg:mx-0">
        {/* Live availability pill */}
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
          <span className="text-xs sm:text-sm text-zinc-400 font-medium">
            Disponible ahora ·{" "}
            <span className="text-white">
              <MapPin className="inline w-3.5 h-3.5 mr-0.5 -mt-0.5 text-red-500" />
              Charallave · Cúa · Ocumare
            </span>
          </span>
        </div>

        {/* H1 */}
        <h1
          id="hero-heading"
          className="text-[clamp(2.25rem,5.5vw,3.5rem)] font-black text-white leading-[1.1] tracking-tight"
        >
          Repuestos rápidos y seguros:{" "}
          <span className="block mt-2">
            Búscalo online, confirma por WhatsApp y recíbelo{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              donde estés.
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
          Explora repuestos para Chery, Ford, Chevrolet, Toyota, Hyundai y VW. Arma tu lista, valida con nuestros asesores y paga al recibir.{" "}
          <span className="text-white font-semibold">Entrega inmediata</span>{" "}
          y{" "}
          <span className="text-amber-400 font-semibold">auxilio vial</span>{" "}
          en los Valles del Tuy.
        </p>

        {/* ── CTA Principal ── */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push("/catalogo")}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-base px-8 py-4 rounded-2xl min-h-[56px] transition-all duration-200 shadow-[0_4px_24px_rgba(217,119,6,0.28)] hover:shadow-[0_6px_32px_rgba(217,119,6,0.42)] select-none cursor-pointer"
            aria-label="Explorar todo el catálogo de repuestos"
          >
            <span>Explorar Todo el Catálogo</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>



        {/* Trust signals */}
        <TrustSignals />
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
    </section>
  )
}
