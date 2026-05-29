"use client"

// ─── CategoriesStrip.tsx ───────────────────────────────────────────────────────
// Responsive grid of the 4 main part categories.
//
// RESPONSIVE STRATEGY (Mobile-First per responsive-design skill):
//   • Base (mobile):  grid-cols-2  → 2×2 compact grid, touch-friendly cards
//   • md+  (tablet):  grid-cols-4  → single horizontal row, full icons visible
//
// INTERACTION DESIGN:
//   • Active category gets a colored accent ring (300ms ease-out transition)
//   • Hover: subtle scale(1.02) + border brighten (200ms)
//   • Active tap: scale(0.98) via active:scale-[0.98]
//
// UI ENGINEERING:
//   • Touch targets: entire card is the button (min-h-[88px] on mobile)
//   • No fixed widths — w-full via grid cell
//   • Icon container: aspect-square prevents layout shift
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
      className={cn("bg-[#121212] py-12 px-4 md:px-8", className)}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2
            id="categories-strip-heading"
            className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight"
          >
            Categorías Principales
          </h2>

          {activeCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-zinc-400 text-sm font-medium hover:text-white transition-colors duration-150 flex items-center gap-1"
              aria-label="Limpiar filtro de categoría"
            >
              Ver todo
              <span aria-hidden="true"> →</span>
            </button>
          )}
          {!activeCategory && (
            <a
              href="/catalogo"
              className="text-zinc-400 text-sm font-medium hover:text-white transition-colors duration-150"
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
          Gap scales up slightly on larger screens for breathing room.
        */}
        <div
          role="group"
          aria-label="Filtrar por categoría"
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
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
// CategoryCard — individual button cell
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
      /*
        Touch target: min-h-[88px] on mobile ensures thumb comfort far above the
        44px WCAG minimum. On md+ screens the card grows naturally with padding.

        Transition: 200ms ease-out for micro-feedback (per interaction-design skill).
        No width/height animation — only transform + border + shadow (GPU-friendly).
      */
      className={cn(
        // Base layout — flex-col so icon sits above text
        "relative flex flex-col items-center justify-center gap-3 p-5",
        // Minimum height ensures thumb target ≥ 44px, gives visual weight on mobile
        "min-h-[88px] md:min-h-[100px]",
        // Structural
        "rounded-2xl border w-full",
        // GPU-friendly transitions — no width/height/top/left
        "transition-all duration-200 ease-out",
        // Hover (desktop) - only when NOT active
        "hover:scale-[1.02] hover:-translate-y-0.5",
        // Active tap feedback
        "active:scale-[0.98] active:translate-y-0",
        // Cursor
        "cursor-pointer select-none",
        // State: inactive
        !isActive && "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80",
        // State: active — elevated card with colored border glow
        isActive && "bg-zinc-800/60 border-zinc-600 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
      )}
    >
      {/*
        Active indicator dot — top-right corner
        16px dot with animate-ping pulse; only renders when category is active.
        Absolutely positioned so it doesn't affect card flex layout.
      */}
      {isActive && (
        <span className="absolute top-2.5 right-2.5 flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
      )}

      {/*
        Icon container — aspect-square prevents CLS if icon lazy-loads.
        The colored accent ring comes from category.accentClass.
        Size: w-12 h-12 on mobile / w-14 h-14 on md+ (via responsive classes).
      */}
      <div
        aria-hidden="true"
        className={cn(
          "w-12 h-12 md:w-14 md:h-14",
          "flex items-center justify-center",
          "rounded-xl border",
          // Transition icon container background too
          "transition-colors duration-200",
          // Inactive hover
          !isActive && "bg-zinc-800 group-hover:bg-zinc-700/80",
          // Active state — use category accent color
          isActive && category.accentClass,
          // When inactive, still show a neutral icon
          !isActive && "border-zinc-700/60"
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6 md:w-7 md:h-7",
            "transition-colors duration-200",
            isActive ? "text-white" : "text-zinc-300"
          )}
          strokeWidth={1.75}
        />
      </div>

      {/* Label */}
      <span
        className={cn(
          "font-semibold text-sm md:text-base leading-tight",
          "transition-colors duration-200",
          isActive ? "text-white" : "text-zinc-300"
        )}
      >
        {category.label}
      </span>
    </button>
  )
}
