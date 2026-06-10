"use client"

// ─── TestimonialTrustBanner — Google Reviews CRO Social Proof ─────────────────
// Minimalist, zero-leak social proof container.
// Leverages Google's brand authority and local testimonials to lower conversion friction
// immediately before WhatsApp checkout.
// Refactored to support state-controlled transitions with buttons/dots for desktop
// and swipe events for mobile.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  name: string
  initials: string
  text: string
  avatarColor: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Gabriel González",
    initials: "GG",
    text: "Súper especial la atención y recibieron mi reclamo de la mejor manera, solventando rápidamente la avería.",
    avatarColor: "bg-red-500/15 text-red-400 border-red-500/25",
  },
  {
    name: "Richar Goncalves",
    initials: "RG",
    text: "Buen sitio para comprar repuestos, una gran variedad.",
    avatarColor: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  },
  {
    name: "Angy Salgado",
    initials: "AS",
    text: "Excelente atención y ubicación.",
    avatarColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  },
]

export default function TestimonialTrustBanner() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  // Auto-play rotations every 5 seconds, paused on hover
  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <section 
      aria-label="Opiniones de clientes en Google" 
      className="bg-[#0f0f0f]/60 border border-zinc-850 rounded-2xl p-3.5 space-y-2.5 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: Google Authority Branding & Nav Arrows */}
      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 border-b border-zinc-900 pb-2 select-none">
        <div className="flex items-center gap-1.5">
          {/* Google Logo Icon */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-zinc-300 uppercase tracking-widest text-[9px]">Opiniones en Google</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] mr-1">
            <span className="text-[#FABB05]">★</span>
            <span className="text-zinc-200 font-extrabold font-mono">4.9 / 5.0</span>
          </div>
          {/* Arrow Navs */}
          <div className="flex items-center gap-0.5 border-l border-zinc-800/80 pl-2">
            <button
              onClick={handlePrev}
              className="p-1 hover:text-white transition-colors text-zinc-500 hover:bg-zinc-900 rounded-md focus:outline-none"
              aria-label="Opinión anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:text-white transition-colors text-zinc-500 hover:bg-zinc-900 rounded-md focus:outline-none"
              aria-label="Siguiente opinión"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Snap/Translate scrolling testimonials list */}
      <div 
        className="relative overflow-hidden w-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-350 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="w-full flex-shrink-0 flex flex-col gap-2 bg-[#050505]/40 rounded-xl p-3 border border-zinc-900/80"
            >
              {/* User Identifiers */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-black flex-shrink-0 ${t.avatarColor}`}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <span className="text-white text-xs font-bold truncate leading-tight select-none">
                    {t.name}
                  </span>
                </div>

                {/* 5 Google Stars */}
                <div className="flex items-center gap-0.5 flex-shrink-0" aria-label="Puntuación: 5 estrellas">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-[#FABB05] stroke-[#FABB05]" />
                  ))}
                </div>
              </div>

              {/* Opinion Quote Text */}
              <blockquote className="text-zinc-400 text-[11px] leading-relaxed italic pr-1 select-none font-medium min-h-[40px]">
                &ldquo;{t.text}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center items-center gap-1.5 pt-1">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === idx ? "bg-[#FABB05] w-3.5" : "bg-zinc-700 hover:bg-zinc-600"
            }`}
            aria-label={`Ver opinión ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
