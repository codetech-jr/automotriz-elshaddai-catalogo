// ─── lib/data.ts — El Shaddai Central Data Layer ──────────────────────────────
// Single source of truth for all UI-consumable data.
// Components import from here, never directly from config.ts for UI concerns.
// ─────────────────────────────────────────────────────────────────────────────

// Re-export everything from config so components only need one import
export * from "./config"

import { Zap, Settings, Activity, Car, Wrench, Filter, Bolt, Circle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SAMPLE_PRODUCTS, CATEGORIES, BRANDS, type Category, type Brand, type Product } from "./config"

// ── Category Metadata ──────────────────────────────────────────────────────────
export interface CategoryMeta extends Category {
  icon: LucideIcon
  /** Accent color ring for icon container (Tailwind arbitrary or CSS var) */
  accentClass: string
  /** Product count hint for display */
  count?: number
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    id: "motor",
    label: "Motor",
    icon: Settings,
    accentClass: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  {
    id: "frenos",
    label: "Frenos",
    icon: Activity,
    accentClass: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  {
    id: "suspension",
    label: "Suspensión",
    icon: Car,
    accentClass: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  },
  {
    id: "filtros",
    label: "Filtros",
    icon: Filter,
    accentClass: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    id: "electrico",
    label: "Eléctrico",
    icon: Zap,
    accentClass: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  {
    id: "carroceria",
    label: "Carrocería",
    icon: Wrench,
    accentClass: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  },
  {
    id: "accesorios",
    label: "Accesorios",
    icon: Bolt,
    accentClass: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  },
]

/** Returns the 4 main display categories for the CategoriesStrip hero */
export const MAIN_CATEGORY_META: CategoryMeta[] = CATEGORY_META.filter(
  (c) => ["motor", "frenos", "suspension", "electrico"].includes(c.id)
)

// ── Brand Metadata ─────────────────────────────────────────────────────────────
export interface BrandMeta extends Brand {
  /** Brand initials to render when no logo asset is available */
  initials: string
  /** Tailwind classes for brand color accent */
  colorClass: string
}

export const BRAND_META: BrandMeta[] = [
  { id: "chery",      label: "Chery",      initials: "CH", colorClass: "text-red-400" },
  { id: "toyota",     label: "Toyota",     initials: "TY", colorClass: "text-red-500" },
  { id: "ford",       label: "Ford",       initials: "FD", colorClass: "text-blue-400" },
  { id: "chevrolet",  label: "Chevrolet",  initials: "CV", colorClass: "text-yellow-400" },
  { id: "volkswagen", label: "Volkswagen", initials: "VW", colorClass: "text-sky-400" },
  { id: "hyundai",    label: "Hyundai",    initials: "HY", colorClass: "text-blue-500" },
]

// ── Derived helpers ────────────────────────────────────────────────────────────

/** Count products per category */
export function getProductCountByCategory(categoryLabel: string): number {
  return SAMPLE_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === categoryLabel.toLowerCase()
  ).length
}

/** Filter products by both category label and brand label */
export function filterProducts(
  products: Product[],
  opts: { category?: string | null; brand?: string | null; query?: string }
): Product[] {
  return products.filter((p) => {
    if (opts.category && p.category.toLowerCase() !== opts.category.toLowerCase()) return false
    if (opts.brand && p.brand.toLowerCase() !== opts.brand.toLowerCase()) return false
    if (opts.query) {
      const q = opts.query.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q)
      )
    }
    return true
  })
}
