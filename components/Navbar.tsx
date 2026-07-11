'use client'

// ─── Navbar — Buscador Central + Links de Navegación ───────────────────────────
// Patrón Amazon / MercadoLibre: el input de búsqueda ocupa el centro del nav,
// siempre visible en desktop. En mobile aparece en una segunda fila dedicada.
//
// SEARCH-FIRST UX: Búsqueda centralizada e hiper-resaltada con foco agresivo.
// Mega-Menú Dropdown en desktop para categorías y marcas.
// Autocomplete inteligente para marcas, categorías y productos.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X as CloseIcon, Search, X, ChevronDown } from 'lucide-react'
import { BRANDS, CATEGORIES, SAMPLE_PRODUCTS, type Product } from '@/lib/config'
import { CATEGORY_META, BRAND_META } from '@/lib/data'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchSuggestion {
  type: 'product' | 'brand' | 'category'
  label: string
  subtitle?: string
  value: string
  product?: Product
}

// ─── NavSearchBar ─────────────────────────────────────────────────────────────
function NavSearchBar({
  onSearch,
}: {
  onSearch: (type: 'brand' | 'category' | 'product' | 'text', value: string) => void
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIdx, setHighlightedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Build suggestion list reactively on query change
  useEffect(() => {
    const q = query.toLowerCase().trim()
    if (q.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const matches: SearchSuggestion[] = []

    BRANDS.filter((b) => b.label.toLowerCase().includes(q)).forEach((b) => {
      matches.push({ type: 'brand', label: `Todos los repuestos de ${b.label}`, value: b.label })
    })
    CATEGORIES.filter((c) => c.label.toLowerCase().includes(q)).forEach((c) => {
      matches.push({ type: 'category', label: `Categoría: ${c.label}`, value: c.label })
    })
    SAMPLE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    ).forEach((p) => {
      matches.push({
        type: 'product',
        label: p.name,
        subtitle: `${p.brand} · ${p.compatibility}`,
        value: p.name,
        product: p,
      })
    })

    const limited = matches.slice(0, 6)
    setSuggestions(limited)
    setIsOpen(limited.length > 0)
    setHighlightedIdx(-1)
  }, [query])

  const commit = useCallback(
    (type: 'brand' | 'category' | 'product' | 'text', value: string) => {
      const trimmed = value.trim()
      if (!trimmed) return
      setIsOpen(false)
      setQuery(trimmed)
      onSearch(type, trimmed)
    },
    [onSearch]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIdx((p) => Math.min(p + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIdx((p) => Math.max(p - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIdx >= 0) {
        const s = suggestions[highlightedIdx]
        setQuery(s.value)
        commit(s.type, s.value)
      } else {
        commit('text', query)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full" role="search">
      {/* ── Input Row ─────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-2 bg-[#252b3b] border rounded-xl px-3 h-11 transition-all duration-200
          ${isOpen
            ? 'border-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.4)] rounded-b-none'
            : 'border-zinc-600/80 hover:border-zinc-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30'
          }`}
      >
        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          id="navbar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Buscar repuesto por nombre, SKU o marca..."
          className="flex-1 bg-transparent text-white placeholder-zinc-400 text-sm outline-none min-w-0"
          autoComplete="off"
          aria-label="Buscar repuesto en el catálogo"
          aria-autocomplete="list"
          aria-controls="navbar-search-suggestions"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setSuggestions([])
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Autocomplete Dropdown ────────────────────────────────────── */}
      {isOpen && (
        <ul
          id="navbar-search-suggestions"
          role="listbox"
          aria-label="Sugerencias de búsqueda"
          className="absolute top-full inset-x-0 z-[60] bg-[#1c212e] border border-t-0 border-amber-500/60 rounded-b-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          {suggestions.map((s, idx) => (
            <li
              key={`${s.type}-${s.value}-${idx}`}
              role="option"
              aria-selected={highlightedIdx === idx}
              onMouseDown={() => {
                setQuery(s.value)
                commit(s.type, s.value)
              }}
              onMouseEnter={() => setHighlightedIdx(idx)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors duration-100
                ${highlightedIdx === idx ? 'bg-amber-500/10 text-white' : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'}
                ${idx < suggestions.length - 1 ? 'border-b border-zinc-800/60' : ''}`}
            >
              {s.type === 'product' && (
                <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" aria-hidden="true" />
              )}
              {s.type === 'brand' && (
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/50 flex-shrink-0">
                  Marca
                </span>
              )}
              {s.type === 'category' && (
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 border border-zinc-700/50 flex-shrink-0">
                  Cat.
                </span>
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate text-zinc-100 text-xs">{s.label}</span>
                {s.subtitle && (
                  <span className="text-[10px] text-zinc-500 truncate mt-0.5">{s.subtitle}</span>
                )}
              </div>
              {s.type === 'product' && s.product && (
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline flex-shrink-0">
                  {s.product.sku}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(false)
  
  // Mega-menu hover logic
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsMegaMenuOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSearch = (type: 'brand' | 'category' | 'product' | 'text', value: string) => {
    if (!value.trim()) return
    const val = encodeURIComponent(value.trim())
    if (type === 'brand') {
      router.push(`/catalogo?brand=${val}`)
    } else if (type === 'category') {
      router.push(`/catalogo?category=${val}`)
    } else {
      router.push(`/catalogo?q=${val}`)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="flex flex-col sticky top-0 z-50 w-full max-w-full bg-[#0d0f12]/90 backdrop-blur-md border-b border-[#252b3b] select-none">
      {/* ── Main Row: [LOGO] <--- [BUSCADOR GIGANTE AL MEDIO] ---> [LINKS NAVEGACIÓN] ── */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 md:px-8 py-3.5 w-full order-1">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-zinc-750 flex items-center justify-center bg-zinc-950 group-hover:border-amber-500 group-hover:scale-105 transition-all duration-200 shadow-lg shadow-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-el-shaddai.jpg"
                alt="Automotriz El Shaddai Logo"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Brand Typography */}
            <div className="flex flex-col select-none text-left">
              <span className="font-black text-white text-base md:text-lg tracking-tight leading-none group-hover:text-amber-500 transition-colors">
                El Shaddai
              </span>
              <span className="text-[9px] md:text-[10px] text-zinc-500 tracking-[0.25em] leading-none mt-1.5 uppercase group-hover:text-zinc-400 transition-colors">
                Automotriz
              </span>
            </div>
          </a>
        </div>

        {/* Center: Gigantic Search Bar (desktop only — mobile has its own row below) */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-w-3xl mx-4 lg:mx-8">
          <NavSearchBar onSearch={handleSearch} />
        </div>

        {/* Right: Links or Hamburger Menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Navigation Links — Desktop Menu (CATÁLOGO | SERVICIOS | QUIÉNES SOMOS | CONTACTO) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Mega-menú Trigger Container */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150 flex items-center gap-1 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isMegaMenuOpen}
              >
                Catálogo
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-white' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {isMegaMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-[520px] bg-[#1c212e] border border-[#252b3b]/80 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] p-5 z-[60] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid grid-cols-2 gap-6 text-left">
                    {/* Column 1: Categorías */}
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-3 block px-3">
                        Categorías
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {CATEGORY_META.map((cat) => {
                          const Icon = cat.icon
                          return (
                            <a
                              key={cat.id}
                              href={`/catalogo?category=${encodeURIComponent(cat.label)}`}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#252b3b] text-zinc-300 hover:text-white transition-colors"
                            >
                              <Icon className={`w-4 h-4 ${cat.accentClass}`} />
                              <span className="text-sm font-medium">{cat.label}</span>
                            </a>
                          )
                        })}
                      </div>
                    </div>

                    {/* Column 2: Marcas */}
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-3 block px-3">
                        Marcas
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {BRAND_META.map((brand) => (
                          <a
                            key={brand.id}
                            href={`/catalogo?brand=${encodeURIComponent(brand.label)}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#252b3b] text-zinc-300 hover:text-white transition-colors"
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${brand.colorClass.replace('text-', 'bg-') || 'bg-zinc-500'}`} />
                            <span className="text-sm font-medium">{brand.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Footer */}
                  <div className="mt-4 pt-3 border-t border-[#252b3b] text-center">
                    <a
                      href="/catalogo"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider transition-colors"
                    >
                      Ver todo el catálogo <span className="text-amber-500 font-black">→</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/servicios"
              className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
            >
              Servicios
            </a>
            <a
              href="/quienes-somos"
              className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
            >
              Quiénes Somos
            </a>
            <a
              href="/faq"
              className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
            >
              FAQ
            </a>
            <a
              href="/contacto"
              className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
            >
              Tienda Física
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[#252b3b] bg-[#121620] hover:bg-[#1a2030] text-zinc-300 transition-all duration-150 active:scale-95 cursor-pointer"
            aria-label="Alternar menú de navegación móvil"
          >
            {isMobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Search Bar — dedicated second row, always visible ───────── */}
      <div className="md:hidden px-4 pb-1 border-t border-[#252b3b]/50 pt-2.5 order-3">
        <NavSearchBar onSearch={handleSearch} />
      </div>

      {/* ── Mobile Brand Pill Strip — horizontal scrollable, visible only on mobile/tablet (md:hidden) ── */}
      <div className="md:hidden px-4 pb-3 pt-1.5 flex items-center gap-2 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden order-4">
        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider flex-shrink-0 mr-1">
          Marcas:
        </span>
        {BRANDS.map((brand) => (
          <button
            key={brand.id}
            onClick={() => router.push(`/catalogo?brand=${encodeURIComponent(brand.label)}`)}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold border border-zinc-800 bg-[#121620]/60 text-zinc-400 hover:border-amber-500/50 hover:text-white active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            {brand.label}
          </button>
        ))}
      </div>

      {/* ── Mobile Navigation Dropdown ───────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#252b3b] px-4 py-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out] order-2">
          {/* Catalog Expandable Section */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsCatalogExpanded(!isCatalogExpanded)}
              className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>🚗</span> Catálogo
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatalogExpanded ? 'rotate-180 text-white' : 'text-zinc-500'}`} />
            </button>

            {isCatalogExpanded && (
              <div className="flex flex-col gap-3 pl-6 mt-2 border-l border-zinc-800 animate-[fadeIn_0.15s_ease-out]">
                <a
                  href="/catalogo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  📦 Todas las piezas
                </a>

                <div className="h-px bg-zinc-800/60 my-1" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Categorías
                </span>
                {CATEGORY_META.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <a
                      key={cat.id}
                      href={`/catalogo?category=${encodeURIComponent(cat.label)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                      <Icon className={`w-3.5 h-3.5 ${cat.accentClass}`} />
                      <span>{cat.label}</span>
                    </a>
                  )
                })}

                <div className="h-px bg-zinc-800/60 my-1" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Marcas
                </span>
                {BRAND_META.map((brand) => (
                  <a
                    key={brand.id}
                    href={`/catalogo?brand=${encodeURIComponent(brand.label)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${brand.colorClass.replace('text-', 'bg-') || 'bg-zinc-500'}`} />
                    <span>{brand.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="/servicios"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>🛠️</span> Servicios
          </a>
          <a
            href="/quienes-somos"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>📍</span> Quiénes Somos
          </a>
          <a
            href="/faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>❓</span> Preguntas Frecuentes
          </a>
          <a
            href="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>📞</span> Contacto y Ubicación
          </a>
        </div>
      )}
    </nav>
  )
}
