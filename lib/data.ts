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
  { id: "daewoo",     label: "Daewoo",     initials: "DW", colorClass: "text-orange-400" },
]

// ── Derived helpers ────────────────────────────────────────────────────────────

/** Count products per category */
export function getProductCountByCategory(categoryLabel: string): number {
  return SAMPLE_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === categoryLabel.toLowerCase()
  ).length
}

/** Check if a given year falls within any year ranges in a compatibility string */
export function matchesYearRange(compatibility: string, year: string): boolean {
  if (!compatibility || !year) return false
  const yearNum = parseInt(year, 10)
  if (isNaN(yearNum)) return false

  // Direct year mention: "Corolla 2018" contains "2018"
  if (compatibility.includes(year)) return true

  // Range patterns: "2014–2020", "2014-2020", "2014 - 2020", "14-20"
  const rangeRegex = /(\d{2,4})\s*[–\-]\s*(\d{2,4})/g
  let match: RegExpExecArray | null
  while ((match = rangeRegex.exec(compatibility)) !== null) {
    let startYear = parseInt(match[1], 10)
    let endYear = parseInt(match[2], 10)
    // Handle 2-digit years
    if (startYear < 100) startYear += 1900 + (startYear < 50 ? 100 : 0)
    if (endYear < 100) endYear += 1900 + (endYear < 50 ? 100 : 0)
    if (yearNum >= startYear && yearNum <= endYear) return true
  }

  return false
}

/** Filter products by category, brand, search query terms, and optional vehicle year */
export function filterProducts(
  products: Product[],
  opts: { category?: string | null; brand?: string | null; query?: string; year?: string }
): Product[] {
  return products.filter((p) => {
    if (opts.category && p.category.toLowerCase() !== opts.category.toLowerCase()) return false
    if (opts.brand && p.brand.toLowerCase() !== opts.brand.toLowerCase()) return false
    if (opts.year && !matchesYearRange(p.compatibility, opts.year)) return false
    if (opts.query) {
      const q = opts.query.toLowerCase().trim()
      const terms = q.split(/\s+/).filter(Boolean)
      const searchable = `${p.name} ${p.brand} ${p.category} ${p.compatibility} ${p.sku}`.toLowerCase()
      return terms.every((term) => searchable.includes(term))
    }
    return true
  })
}

// ── Supported Vehicles Database for SEO & UI ───────────────────────────────────
export interface SupportedVehicleMake {
  id: string
  label: string
  models: string[]
}

export const SUPPORTED_VEHICLES: SupportedVehicleMake[] = [
  {
    id: "chery",
    label: "Chery",
    models: [
      "Arauco",
      "Tiggo 3",
      "Tiggo 7",
      "Orinoco"
    ]
  },
  {
    id: "toyota",
    label: "Toyota",
    models: [
      "Corolla 1.6 (Araya / Sky / Baby)",
      "Corolla 1.8 (Araya / Sky / Baby)",
      "Corolla Sensation 03-08",
      "Corolla Explosion 09-11",
      "Corolla 12-16 (Irani)",
      "Corolla 12-16 (Nacional)",
      "Corolla 12-16 (Importado)",
      "Merú",
      "Prado",
      "4Runner (00-02+)",
      "Fortuner",
      "Hilux (2RZ / 3RZ)",
      "Yaris Sol",
      "Yaris Belta",
      "Starlet",
      "Terios 1.3 (Daihatsu)",
      "Terios 1.5 (Daihatsu)"
    ]
  },
  {
    id: "chevrolet",
    label: "Chevrolet",
    models: [
      "Corsa",
      "Aveo",
      "Optra",
      "Spark",
      "Montana",
      "Meriva",
      "Luv Dmax"
    ]
  },
  {
    id: "ford",
    label: "Ford",
    models: [
      "Fiesta (Power / Max / Move)",
      "Explorer (Eddie Bauer / XLT)",
      "EcoSport",
      "Ka",
      "Focus",
      "F-150 (Fortaleza / FX4)",
      "F-350 (Tritón)",
      "Fusion",
      "Laser"
    ]
  },
  {
    id: "hyundai",
    label: "Hyundai",
    models: [
      "Accent",
      "Excel",
      "Getz",
      "Tucson"
    ]
  },
  {
    id: "daewoo",
    label: "Daewoo",
    models: [
      "Cielo",
      "Lanos",
      "Nubira"
    ]
  },
  {
    id: "volkswagen",
    label: "Volkswagen (VW)",
    models: [
      "Gol",
      "Crossfox",
      "Golf"
    ]
  }
]

