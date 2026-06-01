"use client"

// ─── HeroSlider — Carrusel de Beneficios y Autoridad ───────────────────────────
// Patrón de alta conversión en E-Commerce Automotriz (Estilo Premium Dark).
//
// VISUAL SYSTEM:
//   • Full-width responsive container (altura h-[75vh] o min-h-[520px])
//   • Imagen de fondo con zoom orgánico al estar activo
//   • Degradado protector a la izquierda para garantizar legibilidad WCAG
//   • Barra de progreso y pills deslizantes estilo Charatools
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight, MapPin, ShieldCheck, Truck, Search } from "lucide-react"
import { buildWhatsAppURL } from "@/lib/config"
import { cn } from "@/lib/utils"

export default function HeroSlider() {
  const router = useRouter()
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // ── Slides Definition ───────────────────────────────────────────────────────
  const slides = [
    {
      id: 1,
      title: "Repuestos de Confianza para el Tuy",
      subtitle: "Catálogo virtual para Chery, Toyota, Ford y más con disponibilidad real en Charallave.",
      bgImage: "/shaddai-hero-banner.webp",
      badge: "Disponible Ahora",
      badgeIcon: MapPin,
      badgeColor: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20",
      ctas: [
        {
          text: "Catálogo Online",
          type: "primary",
          action: () => {
            document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
          }
        },
      ]
    },
    {
      id: 4,
      title: "Los que sí saben de repuestos.",
      subtitle: "¿Buscas una pieza que nadie tiene? Descríbela y la conseguimos. Conectamos con proveedores en todo el país.",
      bgImage: "/electrico.jpg",
      badge: "Búsqueda Bajo Demanda",
      badgeIcon: Search,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      ctas: [
        {
          text: "Chatea y te lo conseguimos",
          type: "whatsapp",
          action: () => {
            const url = buildWhatsAppURL("Hola, estoy buscando un repuesto difícil de conseguir y me gustaría que me ayudaran a conseguirlo bajo demanda.")
            window.open(url, "_blank", "noopener,noreferrer")
          }
        }
      ]
    },
    {
      id: 2,
      title: "🚨 ¿Varado en la vía? Auxilio Activo",
      subtitle: "Llevamos el repuesto directo a tu ubicación exacta en Charallave, Cúa o Santa Teresa sin que te muevas.",
      bgImage: "/suspension.jpg",
      badge: "Servicio Express",
      badgeIcon: Truck,
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      ctas: [
        {
          text: "Solicitar Delivery Express",
          type: "primary",
          action: () => {
            const url = buildWhatsAppURL("Hola, me encuentro varado en los Valles del Tuy y necesito consultar disponibilidad urgente de un repuesto con Delivery Express.")
            window.open(url, "_blank", "noopener,noreferrer")
          }
        }
      ]
    },
    {
      id: 3,
      title: "Garantía de Tienda Física",
      subtitle: "Más de 10 años de trayectoria. Retira tus repuestos personalmente y paga seguro con Zelle, Pago Móvil o Punto.",
      bgImage: "/motor.jpg",
      badge: "Compra Segura",
      badgeIcon: ShieldCheck,
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      ctas: [
        {
          text: "Ver Ubicación",
          type: "secondary",
          action: () => {
            document.getElementById("store-location")?.scrollIntoView({ behavior: "smooth" })
          }
        }
      ]
    }
  ]

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // ── Auto-Play logic ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  return (
    <section
      aria-label="Carrusel de Beneficios"
      className="relative w-full overflow-hidden bg-[#0d0f12] min-h-[550px] sm:min-h-[600px] md:min-h-[640px] md:h-[80vh] h-auto flex items-center pt-40 pb-16 md:pt-24 md:pb-0 select-none max-w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ── Slide Backgrounds (rendered absolutely and controlled via opacity) ── */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none",
            idx === activeIdx ? "opacity-100 z-0" : "opacity-0 z-0"
          )}
        >
          {/* Background image with zoom transition when active */}
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out",
              idx === activeIdx ? "scale-105" : "scale-100"
            )}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          />
          {/* Double Darkening Overlays for maximum text contrast */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f12] via-[#0d0f12]/85 to-[#0d0f12]/20" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0d0f12] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090b0e] to-transparent" />
        </div>
      ))}

      {/* Grain overlay for visual premium touch */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.015] z-10
        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAlIiBoZWlnaHQ9IjMwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* ── Slide Content Container ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-14 sm:px-10 lg:px-16 flex flex-col justify-center md:h-full text-left">
        {slides.map((slide, idx) => {
          return (
            <div
              key={`content-${slide.id}`}
              className={cn(
                "w-full max-w-2xl z-10 relative flex flex-col items-start gap-4 sm:gap-6 transition-all duration-700 ease-out",
                idx === activeIdx ? "flex opacity-100 translate-y-0" : "hidden opacity-0 translate-y-6"
              )}
            >

              {/* Slide Title — Fluid Typography with clamp for mobile comfort */}
              <h1
                className="text-[clamp(1.75rem,7vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-3xl animate-[fadeInUp_0.5s_ease-out]"
              >
                {slide.title}
              </h1>

              {/* Slide Subtitle */}
              <p
                className="mt-1 text-zinc-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl sm:max-w-2xl leading-relaxed font-medium"
              >
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-3 w-full sm:w-auto">
                {slide.ctas.map((cta, ctaIdx) => (
                  <button
                    key={`${slide.id}-cta-${ctaIdx}`}
                    onClick={cta.action}
                    type="button"
                    className={cn(
                      "group flex items-center justify-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-xl min-h-[48px] transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto",
                      cta.type === "primary" && "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_4px_20px_rgba(217,119,6,0.22)] hover:shadow-[0_6px_28px_rgba(217,119,6,0.35)]",
                      cta.type === "whatsapp" && "bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_4px_20px_rgba(37,211,102,0.22)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.35)]",
                      cta.type === "secondary" && "bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-white hover:border-zinc-500"
                    )}
                  >
                    {cta.type === "whatsapp" && <MessageCircle className="w-4.5 h-4.5" />}
                    <span>{cta.text}</span>
                    {cta.type !== "whatsapp" && (
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Lateral Chevron Controls (Visible on all viewports, responsive sizing) ── */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-6 z-30 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl border border-zinc-800 bg-[#0d0f12]/30 md:bg-[#0d0f12]/40 backdrop-blur-sm text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-[#0d0f12]/80 transition-all duration-200 active:scale-90 cursor-pointer"
        aria-label="Diapositiva anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-6 z-30 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl border border-zinc-800 bg-[#0d0f12]/30 md:bg-[#0d0f12]/40 backdrop-blur-sm text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-[#0d0f12]/80 transition-all duration-200 active:scale-90 cursor-pointer"
        aria-label="Siguiente diapositiva"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* ── Navigation Bottom Indicators (Pill Progress indicators) ── */}
      <div className="absolute bottom-6 md:bottom-10 inset-x-0 mx-auto flex justify-center items-center gap-2 z-30">
        {slides.map((_, idx) => (
          <button
            key={`indicator-${idx}`}
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
              idx === activeIdx
                ? "w-10 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                : "w-6 bg-[#252b3b]/70 hover:bg-zinc-600"
            )}
            aria-label={`Ir al slide ${idx + 1}`}
            aria-pressed={idx === activeIdx}
          />
        ))}
      </div>
    </section>
  )
}
