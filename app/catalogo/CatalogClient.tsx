"use client"

// ─── CatalogClient.tsx — Client logic for Catalog page ──────────────────────────
// Automotriz El Shaddai — Dedicated Inventory Gallery
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Wrench,
  MessageCircle,
  ShoppingCart,
  Check,
  MapPin,
  X,
  Plus,
  Minus,
  Star,
  CheckCircle,
  Search,
  ListPlus,
  ChevronDown,
} from "lucide-react"
import {
  BUSINESS,
  BRANDS,
  CATEGORIES,
  buildWhatsAppURL,
  buildQuoteMessage,
  type QuoteItem,
  type Product,
} from "@/lib/config"
import { useSettings } from "@/lib/settings-context"
import { useQuoteStore } from "@/lib/quote-store"
import FloatingQuoteBar from "@/components/FloatingQuoteBar"
import QuoteDrawer from "@/components/QuoteDrawer"
import ProductCard from "@/components/ProductCard"

// ─── YMM Data ─────────────────────────────────────────────────────────────────
const YMM_DATA: Record<string, Record<string, string[]>> = {
  Chery: {
    Arauco:      ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"],
    Tiggo3:     ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"],
    "Tiggo 7":  ["2018", "2019", "2020", "2021", "2022", "2023"],
    "Orinoco":  ["2013", "2014", "2015", "2016", "2017"],
  },
  Toyota: {
    "Corolla 1.6 (Araya / Sky / Baby)": ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002"],
    "Corolla 1.8 (Araya / Sky / Baby)": ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002"],
    "Corolla Sensation 03-08":          ["2003", "2004", "2005", "2006", "2007", "2008"],
    "Corolla Explosion 09-11":          ["2009", "2010", "2011"],
    "Corolla 12-16 (Irani)":            ["2012", "2013", "2014", "2015", "2016"],
    "Corolla 12-16 (Nacional)":         ["2012", "2013", "2014", "2015", "2016"],
    "Corolla 12-16 (Importado)":        ["2012", "2013", "2014", "2015", "2016"],
    "Merú":                            ["2005", "2006", "2007", "2008", "2009"],
    "Prado":                           ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009"],
    "4Runner (00-02+)":                 ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"],
    "Fortuner":                         ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    "Hilux (2RZ / 3RZ)":                ["1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    "Yaris Sol":                        ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009"],
    "Yaris Belta":                      ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
    "Starlet":                          ["1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"],
    "Terios 1.3 (Daihatsu)":            ["2002", "2003", "2004", "2005", "2006", "2007"],
    "Terios 1.5 (Daihatsu)":            ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
  },
  Ford: {
    "Fiesta (Power / Max / Move)":      ["2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"],
    "Explorer (Eddie Bauer / XLT)":     ["1998", "2000", "2002", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    EcoSport:                           ["2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],
    Ka:                                 ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012"],
    Focus:                              ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
    "F-150 (Fortaleza / FX4)":          ["1998", "2000", "2002", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"],
    "F-350 (Tritón)":                   ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
    Fusion:                             ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
    Laser:                              ["1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005"],
  },
  Chevrolet: {
    Corsa:      ["1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011"],
    Aveo:       ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],
    Optra:      ["2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"],
    Spark:      ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],
    Montana:    ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"],
    Meriva:     ["2005", "2006", "2007", "2008", "2009"],
    "Luv Dmax": ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
  },
  Volkswagen: {
    Gol:        ["1998", "2000", "2002", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
    Crossfox:   ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
    Golf:       ["1995", "1997", "1999", "2001", "2003", "2005", "2007", "2009", "2011", "2013", "2015", "2017", "2018", "2019", "2020"],
  },
  Hyundai: {
    Accent:     ["1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],
    Excel:      ["1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"],
    Getz:       ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012"],
    Tucson:     ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
  },
  Daewoo: {
    Cielo:      ["1995", "1996", "1997", "1998", "1999", "2000"],
    Lanos:      ["1997", "1998", "1999", "2000", "2001", "2002"],
    Nubira:     ["1997", "1998", "1999", "2000", "2001", "2002"],
  },
}

// ─── SelectDropdown Component ──────────────────────────────────────────────────
interface SelectDropdownProps {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
  placeholder: string
  disabled?: boolean
}

function SelectDropdown({ id, label, value, options, onChange, placeholder, disabled = false }: SelectDropdownProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-zinc-500 select-none">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full appearance-none
            bg-[#121620] border rounded-xl
            text-sm px-4 py-3 pr-10 min-h-[48px]
            outline-none transition-all duration-200
            ${disabled
              ? "border-zinc-800 text-zinc-600 cursor-not-allowed opacity-60"
              : value
                ? "border-zinc-750 text-white hover:border-zinc-605 focus:border-amber-500/70 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.12)]"
                : "border-zinc-800/80 text-zinc-400 hover:border-zinc-700 focus:border-amber-500/70 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.12)]"
            }
          `}
          aria-label={label}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            disabled ? "text-zinc-700" : "text-zinc-500"
          }`}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

import { useCatalogFilters, type CatalogFilters } from "@/hooks/useCatalogFilters"

// ─── YMMFilter Component ───────────────────────────────────────────────────────
function YMMFilter({
  filters,
  setBrand,
  setSearch,
  setYear,
}: {
  filters: CatalogFilters
  setBrand: (brand: string | null) => void
  setSearch: (query: string) => void
  setYear: (year: string | null) => void
}) {
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const selectedBrand = filters.brand
  const currentSearch = filters.search
  const currentYear = filters.year

  useEffect(() => {
    if (selectedBrand && YMM_DATA[selectedBrand]) {
      setMake(selectedBrand)
      
      // Sync model if it exists in YMM_DATA
      const modelsForMake = Object.keys(YMM_DATA[selectedBrand] || {})
      const matchedModel = modelsForMake.find(m => m.toLowerCase() === currentSearch.toLowerCase())
      if (matchedModel) {
        setModel(matchedModel)
        if (currentYear && YMM_DATA[selectedBrand][matchedModel]?.includes(currentYear)) {
          setSelectedYear(currentYear)
        } else {
          setSelectedYear("")
        }
      } else {
        setModel("")
        setSelectedYear("")
      }
    } else {
      setMake("")
      setModel("")
      setSelectedYear("")
    }
  }, [selectedBrand, currentSearch, currentYear])

  const makes = Object.keys(YMM_DATA)
  const models = make ? Object.keys(YMM_DATA[make] ?? {}) : []
  const years = make && model ? (YMM_DATA[make]?.[model] ?? []) : []

  const handleMakeChange = (val: string) => {
    setMake(val)
    setModel("")
    setSelectedYear("")
    setBrand(val || null)
    setSearch("")
    setYear(null)
  }

  const handleModelChange = (val: string) => {
    setModel(val)
    setSelectedYear("")
  }

  const handleSearch = () => {
    if (!make) return
    setBrand(make)
    setSearch(model)
    setYear(selectedYear || null)
  }

  const isReady = !!make

  return (
    <div className="bg-[#121620]/40 border border-zinc-900 rounded-2xl p-4 sm:p-5 space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-bold flex items-center gap-2">
          <span>🚗</span> Filtra por tu vehículo
        </p>
        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
          Paso a paso
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SelectDropdown
          id="ymm-make"
          label="Marca"
          value={make}
          options={makes}
          onChange={handleMakeChange}
          placeholder="Ej: Toyota"
        />
        <SelectDropdown
          id="ymm-model"
          label="Modelo"
          value={model}
          options={models}
          onChange={handleModelChange}
          placeholder="Ej: Corolla"
          disabled={!make}
        />
        <SelectDropdown
          id="ymm-year"
          label="Año"
          value={selectedYear}
          options={years}
          onChange={setSelectedYear}
          placeholder="Ej: 2018"
          disabled={!model}
        />
      </div>

      <button
        type="button"
        onClick={handleSearch}
        disabled={!isReady}
        className={`
          w-full flex items-center justify-center gap-2.5
          font-bold text-sm rounded-xl py-3.5 min-h-[50px]
          transition-all duration-200 active:scale-[0.98] cursor-pointer
          ${isReady
            ? "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_4px_20px_rgba(217,119,6,0.20)] hover:shadow-[0_6px_28px_rgba(217,119,6,0.30)]"
            : "bg-zinc-850 text-zinc-650 cursor-not-allowed border border-zinc-800/60"
          }
        `}
        aria-label="Ver repuestos filtrados"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
        {make
          ? `Ver repuestos para ${make}${model ? ` ${model}` : ""}${selectedYear ? ` ${selectedYear}` : ""} →`
          : "Selecciona tu marca para continuar"
        }
      </button>
    </div>
  )
}

// ─── Floating WhatsApp FAB ─────────────────────────────────────────────────────
function FloatingWhatsApp({ isHidden }: { isHidden: boolean }) {
  const { whatsapp_number, whatsapp_greeting } = useSettings()
  const whatsappUrl = buildWhatsAppURL(whatsapp_greeting, whatsapp_number)
  
  return (
    <div
      className={`fixed bottom-24 right-4 md:bottom-28 md:right-6 z-30 transition-all duration-200 ${
        isHidden ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:scale-110 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20" aria-hidden="true" />
      </a>
    </div>
  )
}

// ─── CatalogClient Inner Content ───────────────────────────────────────────────
export default function CatalogClient({ initialProducts }: { initialProducts: Product[] }) {
  const { whatsapp_number } = useSettings()
  const {
    quoteItems,
    isQuotePanelOpen,
    setIsQuotePanelOpen,
    addToQuote,
    removeFromQuote,
    updateQuantity,
  } = useQuoteStore()

  const {
    filters,
    setBrand,
    setCategory,
    setSearch,
    setYear,
    clearAll,
    hasActiveFilters,
    applyFilters,
  } = useCatalogFilters()

  const selectedBrand = filters.brand
  const activeCategory = filters.category
  const searchQuery = filters.search

  // Filtrado de productos basado en el estado cliente y URL
  const filtered = applyFilters(initialProducts)

  return (
    <main className="pb-16 min-h-screen bg-[#0a0a0a]">
      {/* Intro Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111622] to-[#0a0a0a] pt-12 pb-8 px-4 md:px-8 border-b border-[#252b3b]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 bg-[#1e293b]/50 border border-slate-700/40 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
                Catálogo Digital Unificado
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Todos los <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Repuestos</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Filtra por marca, categoría o escribe el nombre de la pieza. Cotiza el total directamente por WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 self-start md:self-auto">
            <span>Mostrando: <b>{filtered.length}</b> de {initialProducts.length} piezas</span>
          </div>
        </div>
      </section>

      {/* Catalog Filters & Grid Area */}
      <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* YMM CASCADE FILTER BLOCK */}
        <YMMFilter
          filters={filters}
          setBrand={setBrand}
          setSearch={setSearch}
          setYear={setYear}
        />

        {/* Search Input Card */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, SKU, marca o compatibilidad (ej. Arauca, TOY-FRN...)"
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#121620]/95 border border-[#252b3b]/80 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-500 text-sm transition-all shadow-[0_4px_25px_rgba(0,0,0,0.3)] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toolbar (Categories & Brands) */}
        <div className="flex flex-col gap-4 mb-8 bg-[#121620]/40 border border-zinc-900 rounded-2xl p-4">
          {/* Brand Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Filtrar por Marca
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBrand(null)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                  selectedBrand === null
                    ? "bg-white text-zinc-950 border-white"
                    : "border-zinc-800 text-zinc-400 bg-zinc-950 hover:border-zinc-700 hover:text-white"
                }`}
              >
                Todas las marcas
              </button>
              {BRANDS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setBrand(brand.label)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                    selectedBrand?.toLowerCase() === brand.label.toLowerCase()
                      ? "bg-amber-600 text-white border-amber-600 shadow-[0_2px_10px_rgba(217,119,6,0.25)]"
                      : "border-zinc-800 text-zinc-400 bg-zinc-950 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {brand.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-col gap-2 border-t border-zinc-900/80 pt-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Filtrar por Categoría
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory(null)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                  activeCategory === null
                    ? "bg-white text-zinc-950 border-white"
                    : "border-zinc-800 text-zinc-400 bg-zinc-950 hover:border-zinc-700 hover:text-white"
                }`}
              >
                Todas las piezas
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.label)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                    activeCategory?.toLowerCase() === cat.label.toLowerCase()
                      ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-[0_2px_10px_rgba(245,158,11,0.25)]"
                      : "border-zinc-800 text-zinc-400 bg-zinc-950 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary Banner */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mr-1">
              Filtros Activos:
            </span>
            {selectedBrand && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full">
                Marca: {selectedBrand}
                <button onClick={() => setBrand(null)} className="hover:text-white p-0.5 cursor-pointer" aria-label="Remover filtro de marca">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full">
                Cat: {activeCategory}
                <button onClick={() => setCategory(null)} className="hover:text-white p-0.5 cursor-pointer" aria-label="Remover filtro de categoría">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.year && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full">
                Año: {filters.year}
                <button onClick={() => setYear(null)} className="hover:text-white p-0.5 cursor-pointer" aria-label="Remover filtro de año">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full">
                &ldquo;{searchQuery.trim()}&rdquo;
                <button onClick={() => setSearch("")} className="hover:text-white p-0.5 cursor-pointer" aria-label="Remover búsqueda">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAll}
              className="text-xs text-zinc-500 hover:text-white underline ml-auto transition-colors px-2 py-1 cursor-pointer"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filtered.map(product => {
              const quoteItem = quoteItems.find(i => i.id === product.id)
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInList={quoteItem?.quantity || 0}
                  onAdd={() => addToQuote(product)}
                  onRemove={() => removeFromQuote(product.id)}
                  onUpdateQuantity={delta => updateQuantity(product.id, delta)}
                />
              )
            })}
          </div>
        ) : (
          <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-white text-xl font-bold">¿No encuentras el repuesto?</h3>
            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              ¡Dinos qué pieza necesitas! Conseguimos cualquier repuesto original o alternativo en tiempo récord y con delivery en los Valles del Tuy.
            </p>
            <a
              href={buildWhatsAppURL(
                `¡Hola! Busqué en el catálogo completo: *${searchQuery.trim() || (selectedBrand ? `Repuestos ${selectedBrand}` : "Repuestos varios")}* y no lo encontré. ¿Me ayudan a conseguirlo? ⚡`,
                whatsapp_number
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-[0.98] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-150 shadow-[0_4px_20px_rgba(37,211,102,0.25)] min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              Preguntar por WhatsApp ⚡
            </a>
            <button
              onClick={clearAll}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-1 cursor-pointer"
            >
              Ver todos los repuestos
            </button>
          </div>
        )}
      </section>

      {/* Floating WhatsApp FAB */}
      <FloatingWhatsApp isHidden={isQuotePanelOpen} />

      {/* Floating Quote Bar (bottom) */}
      <FloatingQuoteBar
        quoteItems={quoteItems}
        onOpenPanel={() => setIsQuotePanelOpen(true)}
        isHidden={isQuotePanelOpen}
      />

      {/* Off-canvas Quote Panel Drawer */}
      <QuoteDrawer
        isOpen={isQuotePanelOpen}
        onClose={() => setIsQuotePanelOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={removeFromQuote}
        onUpdateQuantity={updateQuantity}
      />
    </main>
  )
}
