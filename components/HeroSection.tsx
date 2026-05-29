"use client"

// ─── HeroSection — YMM Filter + Smart Search ──────────────────────────────────
// Design rationale:
//   • YMM (Year/Make/Model) es el estándar de la industria automotriz.
//     Reduce la carga cognitiva guiando al usuario en 3 micro-pasos secuenciales
//     antes de llegar al search bar libre.
//   • Paradox of Choice: los dropdowns encuadran la decisión — el usuario no tiene
//     que "inventar" qué escribir, solo reconocer sus datos de vehículo.
//   • Commitment & Consistency (Foot-in-the-Door): al seleccionar Marca → Modelo
//     → Año, el usuario va haciendo micro-compromisos que lo llevan al CTA final.
//   • Brand Pills debajo son shortcuts para usuarios que ya saben su marca,
//     sin interrumpir el flujo YMM para quien lo necesita.
//
// Security: Toda entrada de usuario pasa por encodeURIComponent() antes de
// ser inyectada en la URL de WhatsApp (CWE-601 mitigation).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useId } from "react"
import { Search, MessageCircle, MapPin, X, ChevronDown } from "lucide-react"
import { BRANDS, BUSINESS, CATEGORIES, SAMPLE_PRODUCTS, Product } from "@/lib/config"

// ─── Constants ────────────────────────────────────────────────────────────────
const WHATSAPP_HOST = "https://wa.me/" as const

function openWhatsApp(message: string): void {
  const safeText = encodeURIComponent(message)
  const url = `${WHATSAPP_HOST}${BUSINESS.phone}?text=${safeText}`
  window.open(url, "_blank", "noopener,noreferrer")
}

// ─── YMM Data ─────────────────────────────────────────────────────────────────
const YMM_DATA: Record<string, Record<string, string[]>> = {
  Chery: {
    Arauco:      ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"],
    Tiggo3:     ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"],
    "Tiggo 7":  ["2018", "2019", "2020", "2021", "2022", "2023"],
    "Orinoco":  ["2013", "2014", "2015", "2016", "2017"],
  },
  Toyota: {
    Corolla:    ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"],
    Fortuner:   ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    "Hilux":    ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],
    "Land Cruiser": ["2010", "2012", "2014", "2016", "2018", "2020"],
  },
  Ford: {
    Explorer:   ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    Escape:     ["2013", "2014", "2015", "2016", "2017", "2018", "2019"],
    "F-150":    ["2015", "2016", "2017", "2018", "2019", "2020"],
    Fiesta:     ["2011", "2012", "2013", "2014", "2015", "2016"],
  },
  Chevrolet: {
    Aveo:       ["2009", "2010", "2011", "2012", "2013", "2014", "2015"],
    Optra:      ["2005", "2006", "2007", "2008", "2009", "2010"],
    Spark:      ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"],
    Captiva:    ["2012", "2013", "2014", "2015", "2016", "2017"],
  },
  Volkswagen: {
    Gol:        ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
    Jetta:      ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],
    Tiguan:     ["2016", "2017", "2018", "2019", "2020", "2021"],
    Polo:       ["2014", "2015", "2016", "2017", "2018"],
  },
  Hyundai: {
    Tucson:     ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"],
    "Santa Fe": ["2013", "2014", "2015", "2016", "2017", "2018"],
    Accent:     ["2012", "2013", "2014", "2015", "2016", "2017"],
    Elantra:    ["2011", "2012", "2013", "2014", "2015", "2016", "2017"],
  },
}

// ─── YMM Dropdown ─────────────────────────────────────────────────────────────
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
            bg-[#1e1e1e] border rounded-xl
            text-sm px-4 py-3 pr-10 min-h-[48px]
            outline-none transition-all duration-200
            ${disabled
              ? "border-zinc-800 text-zinc-600 cursor-not-allowed opacity-60"
              : value
                ? "border-zinc-600 text-white hover:border-zinc-500 focus:border-[#25D366] focus:shadow-[0_0_0_3px_rgba(37,211,102,0.15)]"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600 focus:border-[#25D366] focus:shadow-[0_0_0_3px_rgba(37,211,102,0.15)]"
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

// ─── YMM Filter Block ──────────────────────────────────────────────────────────
interface YMMFilterProps {
  onSearch: (make: string, model: string, year: string) => void
  onBrandSelect: (brand: string | null) => void
}

function YMMFilter({ onSearch, onBrandSelect }: YMMFilterProps) {
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")

  const makes = Object.keys(YMM_DATA)
  const models = make ? Object.keys(YMM_DATA[make] ?? {}) : []
  const years = make && model ? (YMM_DATA[make]?.[model] ?? []) : []

  const handleMakeChange = (val: string) => {
    setMake(val)
    setModel("")
    setYear("")
    // Also trigger brand filter in catalog
    if (val) onBrandSelect(val)
    else onBrandSelect(null)
  }

  const handleModelChange = (val: string) => {
    setModel(val)
    setYear("")
  }

  const handleSearch = () => {
    if (!make) return
    onSearch(make, model, year)
    openWhatsApp(
      `Hola, necesito repuestos para mi vehículo:\n• Marca: *${make}*${model ? `\n• Modelo: *${model}*` : ""}${year ? `\n• Año: *${year}*` : ""}\n\n¿Qué piezas tienen disponibles para este vehículo? ⚡`
    )
  }

  const isReady = !!make

  return (
    <div className="bg-[#161616] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Label */}
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-bold">
          Busca repuestos para tu vehículo
        </p>
        <span className="text-zinc-600 text-xs hidden sm:block">Paso a paso</span>
      </div>

      {/* Dropdowns — responsive stack */}
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
          value={year}
          options={years}
          onChange={setYear}
          placeholder="Ej: 2019"
          disabled={!model}
        />
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={!isReady}
        className={`
          w-full flex items-center justify-center gap-2.5
          font-bold text-sm rounded-xl py-3.5 min-h-[52px]
          transition-all duration-200
          ${isReady
            ? "bg-[#25D366] hover:bg-[#1da851] active:scale-[0.98] text-white shadow-[0_4px_20px_rgba(37,211,102,0.25)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.4)]"
            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }
        `}
        aria-label="Buscar repuestos para mi vehículo por WhatsApp"
      >
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
        {make
          ? `Ver repuestos para ${make}${model ? ` ${model}` : ""}${year ? ` ${year}` : ""}`
          : "Selecciona tu vehículo para continuar"
        }
      </button>
    </div>
  )
}

// ─── Smart Search Bar ──────────────────────────────────────────────────────────
interface SearchSuggestion {
  type: "product" | "brand" | "category"
  label: string
  subtitle?: string
  value: string
  product?: Product
}

interface SmartSearchBarProps {
  query: string
  setQuery: (q: string) => void
  onSearchSubmit: (q: string, product?: Product) => void
}

function SmartSearchBar({ query, setQuery, onSearchSubmit }: SmartSearchBarProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIdx, setHighlightedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const q = query.toLowerCase().trim()
    if (q.length < 2) { setSuggestions([]); setIsOpen(false); return }

    const matches: SearchSuggestion[] = []

    BRANDS.filter(b => b.label.toLowerCase().includes(q)).forEach(b => {
      matches.push({ type: "brand", label: `Todos los repuestos de ${b.label}`, value: b.label })
    })
    CATEGORIES.filter(c => c.label.toLowerCase().includes(q)).forEach(c => {
      matches.push({ type: "category", label: `Categoría: ${c.label}`, value: c.label })
    })
    SAMPLE_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
      p.compatibility.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    ).forEach(p => {
      matches.push({ type: "product", label: p.name, subtitle: `${p.brand} · ${p.compatibility}`, value: p.name, product: p })
    })

    const limited = matches.slice(0, 5)
    setSuggestions(limited)
    setIsOpen(limited.length > 0)
    setHighlightedIdx(-1)
  }, [query])

  const handleSubmit = (value: string, product?: Product) => {
    setIsOpen(false)
    onSearchSubmit(value, product)
    let msg = ""
    if (product) {
      msg = `¡Hola! Me interesa cotizar: *${product.name}* (${product.brand}), compatible con *${product.compatibility}* — SKU: *${product.sku}*. ¿Disponibilidad y precio? ⚡`
    } else if (value.trim()) {
      msg = `¡Hola! Busco el siguiente repuesto: *${value.trim()}*. ¿Tienen disponibilidad para entrega? ⚡`
    } else {
      msg = `¡Hola! Quisiera consultar disponibilidad de repuestos en su catálogo. 🚗`
    }
    openWhatsApp(msg)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(p => Math.min(p + 1, suggestions.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx(p => Math.max(p - 1, -1)) }
    else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightedIdx >= 0) { const s = suggestions[highlightedIdx]; setQuery(s.value); handleSubmit(s.value, s.product) }
      else handleSubmit(query)
    }
    else if (e.key === "Escape") setIsOpen(false)
  }

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase().trim())
    if (idx === -1) return text
    const len = q.trim().length
    return <>{text.slice(0, idx)}<mark className="bg-transparent text-[#25D366] font-semibold">{text.slice(idx, idx + len)}</mark>{text.slice(idx + len)}</>
  }

  const btnText = () => {
    const q = query.trim()
    if (!q) return "Buscar por WhatsApp"
    return `Buscar "${q.length > 22 ? q.slice(0, 19) + "..." : q}" ⚡`
  }

  return (
    <div className="relative w-full" role="search">
      <div className={`flex items-center gap-3 bg-[#1e1e1e] border-2 rounded-2xl px-4 py-3.5 transition-all duration-200
        ${isOpen
          ? "border-[#25D366] shadow-[0_0_0_4px_rgba(37,211,102,0.10)] rounded-b-none"
          : "border-zinc-700 hover:border-zinc-500 focus-within:border-[#25D366] focus-within:shadow-[0_0_0_4px_rgba(37,211,102,0.10)]"
        }`}>
        <Search className="w-5 h-5 text-zinc-500 flex-shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          id="smart-search-repuestos"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="O escribe directo: filtro de aceite, pastillas Corolla..."
          className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base outline-none min-w-0"
          autoComplete="off"
          aria-label="Buscar repuesto por nombre o SKU"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setSuggestions([]); setIsOpen(false); inputRef.current?.focus() }}
            className="text-zinc-500 hover:text-white transition-colors" aria-label="Limpiar búsqueda">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <ul id="search-suggestions" role="listbox" aria-label="Sugerencias de búsqueda"
          className="absolute top-full inset-x-0 z-30 bg-[#1e1e1e] border-2 border-t-0 border-[#25D366] rounded-b-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {suggestions.map((s, idx) => (
            <li key={`${s.type}-${s.value}-${idx}`} role="option" aria-selected={highlightedIdx === idx}
              onMouseDown={() => { setQuery(s.value); handleSubmit(s.value, s.product) }}
              onMouseEnter={() => setHighlightedIdx(idx)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors duration-100
                ${highlightedIdx === idx ? "bg-[#25D366]/10 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}
                ${idx < suggestions.length - 1 ? "border-b border-zinc-800" : ""}`}>
              {s.type === "product" && <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
              {s.type === "brand" && <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-[#25D366] border border-zinc-700/50 flex-shrink-0">Marca</span>}
              {s.type === "category" && <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-[#F59E0B] border border-zinc-700/50 flex-shrink-0">Cat.</span>}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold truncate text-zinc-100">{highlightMatch(s.label, query)}</span>
                {s.subtitle && <span className="text-xs text-zinc-500 truncate mt-0.5">{s.subtitle}</span>}
              </div>
              {s.type === "product" && s.product && <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline flex-shrink-0">{s.product.sku}</span>}
              <MessageCircle className="w-4 h-4 text-[#25D366] ml-auto flex-shrink-0" aria-hidden="true" />
            </li>
          ))}
          <li className="px-4 py-2.5 bg-[#25D366]/5 text-xs text-zinc-400 flex items-center gap-2 border-t border-zinc-800">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" aria-hidden="true" />
            La búsqueda se enviará por WhatsApp directo
          </li>
        </ul>
      )}

      <button type="button"
        onClick={() => { const exact = SAMPLE_PRODUCTS.find(p => p.name.toLowerCase() === query.toLowerCase().trim()); handleSubmit(query, exact) }}
        className="w-full mt-3 bg-[#25D366] hover:bg-[#1da851] active:scale-[0.98] text-white font-bold text-base py-4 px-6 rounded-2xl min-h-[56px] flex items-center justify-center gap-2.5 transition-all duration-150 shadow-[0_4px_24px_rgba(37,211,102,0.28)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.42)]"
        aria-label="Buscar repuesto por WhatsApp">
        <MessageCircle className="w-5 h-5" aria-hidden="true" />
        {btnText()}
      </button>
    </div>
  )
}

// ─── Brand Pill Links ──────────────────────────────────────────────────────────
function BrandPillLinks({ selectedBrand, onSelect }: { selectedBrand: string | null; onSelect: (b: string | null) => void }) {
  return (
    <div role="group" aria-label="Filtrar por marca de vehículo" className="flex flex-wrap gap-2 mt-5">
      <span className="text-zinc-500 text-xs self-center mr-1 flex-shrink-0">Marca rápida:</span>
      {BRANDS.map(brand => (
        <button key={brand.id} role="checkbox" aria-checked={selectedBrand === brand.label}
          onClick={() => onSelect(selectedBrand === brand.label ? null : brand.label)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
            ${selectedBrand === brand.label
              ? "border-[#25D366] bg-[#25D366]/12 text-[#25D366] shadow-[0_0_0_1px_rgba(37,211,102,0.2)]"
              : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-500 hover:text-white hover:-translate-y-px"
            }`}>
          {brand.label}
        </button>
      ))}
    </div>
  )
}

// ─── Trust Signals ─────────────────────────────────────────────────────────────
function TrustSignals() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5">
      {[
        { icon: "✅", text: "Originales y alternativos" },
        { icon: "⚡", text: "Respuesta en minutos" },
        { icon: "📍", text: "Valles del Tuy" },
      ].map(s => (
        <span key={s.text} className="flex items-center gap-1.5 text-zinc-500 text-xs">
          <span>{s.icon}</span><span>{s.text}</span>
        </span>
      ))}
    </div>
  )
}

// ─── Main HeroSection ──────────────────────────────────────────────────────────
interface HeroSectionProps {
  selectedBrand: string | null
  setSelectedBrand: (brand: string | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeCategory: string | null
  setActiveCategory: (cat: string | null) => void
  topBarVisible?: boolean
}

export default function HeroSection({
  selectedBrand,
  setSelectedBrand,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  topBarVisible = true,
}: HeroSectionProps) {
  const heroPt = topBarVisible ? "pt-[140px]" : "pt-24"

  const handleBrandSelect = (brand: string | null) => {
    setSelectedBrand(brand)
    setSearchQuery("")
    setActiveCategory(null)
    if (brand) setTimeout(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleSearchSubmit = (value: string, product?: Product) => {
    setSearchQuery(value)
    if (product) {
      setSelectedBrand(product.brand)
    } else {
      const matchedBrand = BRANDS.find(b => b.label.toLowerCase() === value.toLowerCase().trim())
      if (matchedBrand) { setSelectedBrand(matchedBrand.label); setSearchQuery("") }
      else {
        const matchedCat = CATEGORIES.find(c => c.label.toLowerCase() === value.toLowerCase().trim())
        if (matchedCat) { setActiveCategory(matchedCat.label); setSearchQuery(""); setSelectedBrand(null) }
      }
    }
    setTimeout(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleYMMSearch = (make: string, _model: string, _year: string) => {
    setSelectedBrand(make)
    setSearchQuery("")
    setActiveCategory(null)
    setTimeout(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className={`
        relative min-h-[100dvh] flex flex-col justify-center
        px-4 sm:px-6 md:px-10 lg:px-16
        ${heroPt} pb-16
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
          className="w-full h-full object-cover object-center opacity-35 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Darkening overlay for overall readability */}
        <div className="absolute inset-0 bg-[#0f0f0f]/65" />
        {/* Top fade (blends with Navbar) */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0f12] to-transparent" />
        {/* Bottom fade (blends with page background) */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
        {/* Left-to-right gradient to keep text area very dark and readable */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[70%] bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
      </div>

      {/* Grain texture overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.012] z-10
        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAlIiBoZWlnaHQ9IjMwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 max-w-3xl w-full mx-auto lg:mx-0">
        {/* Live availability pill */}
        <div className="flex items-center gap-2 mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
          <span className="text-xs sm:text-sm text-zinc-400 font-medium">
            Disponible ahora ·{" "}
            <span className="text-white">
              <MapPin className="inline w-3 h-3 mr-0.5 -mt-0.5 text-[#E60000]" />
              Charallave · Cúa · Ocumare
            </span>
          </span>
        </div>

        {/* H1 */}
        <h1 id="hero-heading"
          className="text-[clamp(2.25rem,6vw,3.75rem)] font-black text-white leading-[1.08] tracking-tight">
          Repuestos rápidos y seguros:{" "}
Búscalo online, confirma por WhatsApp y recíbelo{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1da851]">
            donde estés.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
          Explora repuestos para Chery, Ford, Chevrolet, Toyota, Hyundai y VW. Arma tu lista y valida con nuestros asesores y paga al recibir.{" "}
          <span className="text-white font-semibold">Entrega inmediata</span>{" "}
          y{" "}
          <span className="text-[#FBBF24] font-semibold">auxilio vial</span>{" "}
          en los Valles del Tuy.
        </p>

        {/* ── YMM Filter — primary search path ── */}
        <div className="mt-8 sm:mt-10">
          <YMMFilter onSearch={handleYMMSearch} onBrandSelect={handleBrandSelect} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-600 text-xs font-medium px-2">o busca por pieza</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* ── Smart Search Bar — secondary path ── */}
        <div className="mt-5">
          <SmartSearchBar query={searchQuery} setQuery={setSearchQuery} onSearchSubmit={handleSearchSubmit} />
        </div>

        {/* Brand pill shortcuts */}
        <BrandPillLinks selectedBrand={selectedBrand} onSelect={handleBrandSelect} />

        {/* Trust signals */}
        <TrustSignals />
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
    </section>
  )
}
