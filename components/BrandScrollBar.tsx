// ─── BrandScrollBar ────────────────────────────────────────────────────────────
// CRO Rationale:
//   • Authority Bias: Ver logos de grandes marcas (Toyota, Ford, Chery…) asociados
//     al negocio activa el "halo effect" de confianza — si las marcas líderes confían,
//     el cliente también puede.
//   • Pattern Interrupt: La banda de logos en movimiento fluido corta la monotonía
//     del scroll y obliga al ojo a detenerse un instante.
//   • Infinite Scroll Loop: La animación CSS pura (sin JS) garantiza 0ms de JS
//     en el critical path. Rendimiento perfecto en 3G y motores de búsqueda.
//   • Grayscale hover lift: Logos en gris sutil que se colorean al hover.
//     Efecto visual premium sin distraer del contenido principal.
// ─────────────────────────────────────────────────────────────────────────────

const BRANDS = [
  { id: "chery",      label: "Chery",      src: "/chery-logo.webp" },
  { id: "toyota",     label: "Toyota",     src: "/toyota-logo.webp" },
  { id: "ford",       label: "Ford",       src: "/ford.webp" },
  { id: "chevrolet",  label: "Chevrolet",  src: "/chevrolet-logo.webp" },
  { id: "hyundai",    label: "Hyundai",    src: "/hyundai-logo.webp" },
  { id: "volkswagen", label: "Volkswagen", src: "/volkswagen-logo.webp" },
]

// Duplicate the list so the CSS animation can loop seamlessly
const BRANDS_LOOP = [...BRANDS, ...BRANDS]

export default function BrandScrollBar() {
  return (
    <section
      aria-label="Marcas de repuestos disponibles"
      className="relative bg-[#0d0d0d] border-y border-zinc-800/50 py-3 md:py-4 overflow-hidden"
    >
      {/* ── Left fade ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10
          bg-gradient-to-r from-[#0d0d0d] to-transparent"
      />
      {/* ── Right fade ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10
          bg-gradient-to-l from-[#0d0d0d] to-transparent"
      />

      {/* ── Scrolling track ── */}
      {/*
        The outer div clips the overflow.
        The inner div is 200% wide (BRANDS × 2) and animated by keyframe
        "brand-scroll" defined in globals.css / tailwind custom.
        We pause the animation on hover via group utilities.
      */}
      <div className="relative overflow-hidden group">
        <div
          className="flex items-center gap-12 md:gap-16 w-max
            animate-[brand-scroll_28s_linear_infinite]
            group-hover:[animation-play-state:paused]"
        >
          {BRANDS_LOOP.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="flex-shrink-0 flex items-center justify-center
                w-24 h-8 md:w-28 md:h-10 select-none"
              title={brand.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.src}
                alt={`Logo ${brand.label}`}
                className="
                  max-h-full max-w-full w-auto h-auto object-contain
                  grayscale opacity-40
                  hover:grayscale-0 hover:opacity-90
                  transition-all duration-300 ease-out
                "
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
