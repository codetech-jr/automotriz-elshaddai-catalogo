"use client"

// ─── CatalogGrid.tsx — Featured Products Grid (Homepage) ─────────────────────
//
// PURPOSE: Renders the featured product listing section on the home page.
// Data flows entirely from lib/data.ts (no prop drilling for product data).
//
// GRID LAYOUT (Mobile-First per responsive-design skill):
//   • base (mobile):   grid-cols-1          → Single column, full-width cards
//   • sm  (≥640px):    grid-cols-2          → 2-up landscape phone / small tablet
//   • md  (≥768px):    grid-cols-2          → same — cards breathe more
//   • lg  (≥1024px):   grid-cols-3          → Laptop / larger tablet
//   • xl  (≥1280px):   grid-cols-4          → Desktop
//   • 2xl (≥1536px+):  grid-cols-4          → 4K – grid stays at 4, max-w-7xl
//                                             prevents runaway stretch
//
// The grid wrapper has max-w-7xl + mx-auto so on ultra-wide displays cards
// don't scale past a readable width. No card will ever be "too wide" for the
// content it holds.
//
// UI ENGINEERING notes:
//   • Each <ProductCard> receives w-full from its grid cell — no static widths.
//   • gap-4 on mobile / md:gap-5 on tablet+ for breathing room.
//   • Section background alternates from the categories section above (#121212)
//     to #0d0d0d so sections are visually distinguishable without a divider.
// ─────────────────────────────────────────────────────────────────────────────

import { SAMPLE_PRODUCTS, type Product, type QuoteItem } from "@/lib/data"
import ProductCard from "@/components/ProductCard"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

// ── Props ──────────────────────────────────────────────────────────────────────

export interface CatalogGridProps {
  /** Optional products list fetched from server */
  products?: Product[]
  /** How many products to show (defaults to 8 for homepage featured section) */
  limit?: number
  /** Optional category label to filter (null = all) */
  filterCategory?: string | null
  /** Optional brand label to filter (null = all) */
  filterBrand?: string | null
  /** Current state of the quote/cart */
  quoteItems: QuoteItem[]
  onAddToQuote: (product: Product) => void
  onRemoveFromQuote: (productId: string) => void
  onUpdateQuantity: (productId: string, delta: number) => void
  /** Override section heading (optional) */
  heading?: string
  /** Override heading subtext (optional) */
  subheading?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function CatalogGrid({
  products,
  limit = 8,
  filterCategory = null,
  filterBrand = null,
  quoteItems,
  onAddToQuote,
  onRemoveFromQuote,
  onUpdateQuantity,
  heading = "Repuestos Destacados",
  subheading = "Una cuidada selección de nuestras mejores piezas originales y alternativas de alta calidad para Chery, Toyota, Ford y Chevrolet.",
  className,
}: CatalogGridProps) {
  // ── Data filtering (use prop if provided, else fallback to static SAMPLE_PRODUCTS) ──
  const allProducts = products || SAMPLE_PRODUCTS

  const filteredProducts = allProducts.filter((p) => {
    if (filterCategory && p.category.toLowerCase() !== filterCategory.toLowerCase()) return false
    if (filterBrand && p.brand.toLowerCase() !== filterBrand.toLowerCase()) return false
    return true
  })

  const displayProducts = filteredProducts.slice(0, limit)

  return (
    <section
      id="catalog"
      aria-labelledby="catalog-heading"
      className={cn("bg-[#0d0d0d] py-14 md:py-16 px-4 md:px-8 border-t border-zinc-900 overflow-hidden", className)}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Section Header ──────────────────────────────────────────── */}
        <div className="text-center mb-8 md:mb-10">
          {/* "Selección Destacada" pill — visual anchor */}
          <div className="inline-flex items-center gap-2 mb-4 bg-red-600/10 border border-red-500/20 rounded-full px-3.5 py-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
              Selección Destacada
            </span>
          </div>

          <h2
            id="catalog-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight"
          >
            {heading}
          </h2>

          {subheading && (
            <p className="text-zinc-400 mt-2 max-w-xl mx-auto text-sm md:text-base leading-relaxed px-2">
              {subheading}
            </p>
          )}

          {/* Visual indicator arrow for mobile horizontal scroll */}
          <div className="md:hidden flex justify-center items-center gap-2 mt-4 text-amber-500/95 text-[11px] font-bold uppercase tracking-wider bg-zinc-900/60 border border-zinc-800/60 rounded-full px-4 py-1.5 w-fit mx-auto select-none">
            <span>Desliza para ver más</span>
            <ArrowRight className="w-3.5 h-3.5 animate-bounce-x" />
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes bounce-x {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(5px); }
            }
            .animate-bounce-x {
              animation: bounce-x 1.2s infinite;
            }
          `}} />

          {/* Active filter indicator */}
          {(filterCategory || filterBrand) && (
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              {filterCategory && (
                <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-300 font-medium">
                  Categoría: {filterCategory}
                </span>
              )}
              {filterBrand && (
                <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-300 font-medium">
                  Marca: {filterBrand}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Product Grid ────────────────────────────────────────────── */}
        {/*
          Mobile-first responsive grid:
            grid-cols-1      → 320px+ phones in portrait
            sm:grid-cols-2   → 640px+ landscape phones / small tablets
            lg:grid-cols-3   → 1024px+ laptops
            xl:grid-cols-4   → 1280px+ desktops and wide screens

          gap-4 / md:gap-5 — consistent with the design token spacing scale.
          No ad-hoc pixel values.

          Each child ProductCard is w-full and fills its grid cell width.
          The grid is the layout authority — not the card.
        */}
        {displayProducts.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0 md:gap-5">
            {displayProducts.map((product) => {
              const quoteItem = quoteItems.find((i) => i.id === product.id)
              return (
                <div
                  key={product.id}
                  className="w-[85vw] sm:w-[45vw] flex-shrink-0 snap-center md:w-auto md:shrink"
                >
                  <ProductCard
                    product={product}
                    quantityInList={quoteItem?.quantity ?? 0}
                    onAdd={() => onAddToQuote(product)}
                    onRemove={() => onRemoveFromQuote(product.id)}
                    onUpdateQuantity={(delta) => onUpdateQuantity(product.id, delta)}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          // ── Empty state ──
          <EmptyProductState
            category={filterCategory}
            brand={filterBrand}
          />
        )}

        {/* ── CTA to full catalog ─────────────────────────────────────── */}
        {/* Only shown when displaying the homepage limited set (limit < total) */}
        {filteredProducts.length > limit && (
          <div className="mt-12 md:mt-14 text-center">
            <a
              href="/catalogo"
              className={cn(
                "inline-flex items-center justify-center gap-2.5",
                "bg-zinc-900 hover:bg-zinc-800",
                "border border-zinc-800 hover:border-zinc-600",
                "text-white font-bold text-sm md:text-base",
                "px-7 py-3.5 md:px-8 md:py-4 min-h-[52px] rounded-xl",
                "transition-all duration-150 active:scale-[0.97]",
                "shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
              )}
              aria-label="Explorar todo el catálogo digital de repuestos"
            >
              <span>Ver Catálogo Completo</span>
              <span className="text-[#E60000] font-black" aria-hidden="true">→</span>
            </a>
          </div>
        )}

        {/* Always show if limit reached, regardless of filter state */}
        {filteredProducts.length <= limit && filteredProducts.length > 0 && displayProducts.length === limit && (
          <div className="mt-12 md:mt-14 text-center">
            <a
              href="/catalogo"
              className={cn(
                "inline-flex items-center justify-center gap-2.5",
                "bg-zinc-900 hover:bg-zinc-800",
                "border border-zinc-800 hover:border-zinc-600",
                "text-white font-bold text-sm md:text-base",
                "px-7 py-3.5 md:px-8 md:py-4 min-h-[52px] rounded-xl",
                "transition-all duration-150 active:scale-[0.97]",
                "shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
              )}
              aria-label="Explorar todo el catálogo digital de repuestos"
            >
              <span>Ver Catálogo Completo</span>
              <span className="text-[#E60000] font-black" aria-hidden="true">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptyProductState
// ─────────────────────────────────────────────────────────────────────────────

function EmptyProductState({
  category,
  brand,
}: {
  category?: string | null
  brand?: string | null
}) {
  const filterDesc =
    category && brand
      ? `${category} de ${brand}`
      : category
      ? `la categoría ${category}`
      : brand
      ? `la marca ${brand}`
      : "estos filtros"

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-20 text-center gap-4"
    >
      <div className="w-16 h-16 rounded-full bg-zinc-800/60 border border-zinc-700 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-8 h-8 text-zinc-600"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <div>
        <h3 className="text-white font-semibold text-base">Sin resultados</h3>
        <p className="text-zinc-400 text-sm mt-1 max-w-[280px]">
          No encontramos repuestos para {filterDesc}. Consulta por WhatsApp — podemos conseguirlo.
        </p>
      </div>
      <a
        href="/catalogo"
        className="px-5 py-2.5 min-h-[44px] border border-zinc-700 rounded-xl text-zinc-300 text-sm font-medium hover:border-zinc-500 hover:text-white transition-all duration-150 flex items-center"
      >
        Ver catálogo completo
      </a>
    </div>
  )
}
