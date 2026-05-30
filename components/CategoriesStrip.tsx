"use client"

// ─── CategoriesStrip.tsx ───────────────────────────────────────────────────────
// Responsive grid of the 4 main part categories with high-end card designs.
// Uses real photographic backgrounds left in the public/ folder.
//
// RESPONSIVE STRATEGY (Mobile-First per responsive-design skill):
//   • Base (mobile):  grid-cols-2  → 2×2 compact grid, touch-friendly cards
//   • md+  (tablet):  grid-cols-4  → single horizontal row, full images visible
//
// INTERACTION DESIGN:
//   • Active category gets a bright amber border and ambient glow shadow
//   • Hover: parallax image scale(1.10) + card scale(1.03) + sutil "Explorar" prompt fade-in
//   • Active tap: scale(0.98) via active:scale-[0.98]
// ─────────────────────────────────────────────────────────────────────────────

import { MAIN_CATEGORY_META, type CategoryMeta } from "@/lib/data"
import { cn } from "@/lib/utils"

interface CategoriesStripProps {
  /** Currently active category label, or null for "all" */
  activeCategory: string | null
  /** Called when user selects a category; null resets to "all" */
  onSelectCategory: (categoryLabel: string | null) => void
  className?: string
}

export default function CategoriesStrip({
  activeCategory,
  onSelectCategory,
  className,
}: CategoriesStripProps) {
  return (
    <section
      aria-labelledby="categories-strip-heading"
      className={cn("bg-[#090b0e] py-16 px-4 md:px-8 border-t border-[#121620]", className)}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex flex-col gap-1">
            <h2
              id="categories-strip-heading"
              className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase"
            >
              Categorías Principales
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm font-medium tracking-wide">
              Selecciona una categoría para filtrar los repuestos disponibles
            </p>
          </div>

          {activeCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-zinc-400 text-sm font-semibold hover:text-white transition-colors duration-150 flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-800/80 active:scale-95"
              aria-label="Limpiar filtro de categoría y ver todos los repuestos"
            >
              Ver todo
              <span aria-hidden="true"> →</span>
            </button>
          )}
          {!activeCategory && (
            <a
              href="/catalogo"
              className="text-zinc-400 text-sm font-semibold hover:text-white transition-colors duration-150 flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl hover:bg-zinc-800/80 active:scale-95"
              aria-label="Ir al catálogo completo"
            >
              Ver todo →
            </a>
          )}
        </div>

        {/*
          GRID LAYOUT — Mobile-First:
          • mobile:  grid-cols-2          → 2 × 2
          • md+:     grid-cols-4          → 1 × 4 row
        */}
        <div
          role="group"
          aria-label="Filtrar por categoría"
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
        >
          {MAIN_CATEGORY_META.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.label}
              onSelect={onSelectCategory}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CategoryCard — individual button cell with premium photo-background hover zooms
// ─────────────────────────────────────────────────────────────────────────────

function CategoryCard({
  category,
  isActive,
  onSelect,
}: {
  category: CategoryMeta
  isActive: boolean
  onSelect: (label: string | null) => void
}) {
  const Icon = category.icon

  // Map category IDs to their specific image paths inside the public folder
  const imageMap: Record<string, string> = {
    motor: "/motor.jpg",
    frenos: "/frenos.jpg",
    suspension: "/suspension.jpg",
    electrico: "/electrico.jpg",
  }

  const bgImage = imageMap[category.id] || "/placeholder.jpg"

  const handleClick = () => {
    onSelect(isActive ? null : category.label)
    // Smooth-scroll to catalog anchor after brief tick (avoids flash)
    setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
    }, 120)
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={isActive}
      aria-label={`Filtrar por ${category.label}${isActive ? " — activo" : ""}`}
      className={cn(
        // Base layout
        "group relative flex flex-col items-center justify-center p-6 text-center overflow-hidden w-full",
        // Taller height targets for high-end photographic layout
        "min-h-[130px] sm:min-h-[145px] md:min-h-[160px] lg:min-h-[185px]",
        // Structural
        "rounded-2xl border",
        // GPU-friendly transitions
        "transition-all duration-300 ease-out",
        // Hover effects - scale and elevate
        "hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5",
        // Active tap feedback
        "active:scale-[0.98] active:translate-y-0",
        // Cursor
        "cursor-pointer select-none",
        // Active/Inactive state styles
        !isActive 
          ? "border-zinc-800 bg-zinc-950" 
          : "border-amber-500 shadow-[0_4px_30px_rgba(245,158,11,0.18)]"
      )}
    >
      {/* ── Background Image with group-hover parallax zoom ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100 group-hover:scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* ── Dark gradient overlay for text readability & premium styling ── */}
      <div
        className={cn(
          "absolute inset-0 z-10 transition-colors duration-300",
          !isActive
            ? "bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-900/30 group-hover:from-zinc-950 group-hover:via-zinc-950/60"
            : "bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-amber-950/20"
        )}
      />

      {/* ── Active top-right corner indicator dot ── */}
      {isActive && (
        <span className="absolute top-3 right-3 z-30 flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
      )}

      {/* ── Content container (lifted above background) ── */}
      <div className="relative z-20 flex flex-col items-center gap-3">
        {/* Lucide Icon with glassmorphic backing */}
        <div
          aria-hidden="true"
          className={cn(
            "w-11 h-11 md:w-13 md:h-13",
            "flex items-center justify-center",
            "rounded-xl border backdrop-blur-md transition-all duration-300",
            !isActive
              ? "bg-zinc-950/60 border-zinc-700/50 group-hover:border-zinc-500 group-hover:bg-zinc-900/70 text-zinc-300 group-hover:text-white"
              : "bg-amber-500/20 border-amber-400/50 text-amber-400"
          )}
        >
          <Icon
            className="w-5 md:w-6 h-5 md:h-6 transition-transform duration-300 group-hover:rotate-6"
            strokeWidth={2}
          />
        </div>

        {/* Category Label and prompt */}
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "font-bold text-sm md:text-base tracking-wider uppercase transition-colors duration-300",
              isActive ? "text-amber-400" : "text-zinc-100 group-hover:text-white"
            )}
          >
            {category.label}
          </span>
          <span className="text-[9px] text-amber-400/90 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
            Explorar →
          </span>
        </div>
      </div>
    </button>
  )
}
