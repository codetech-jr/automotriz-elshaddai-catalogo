"use client"

// ─── Dedicated Catalog Page (Client Component) ───────────────────────────────
// Automotriz El Shaddai — Dedicated Inventory Gallery
// Rationale:
//   • LOW FRICTION SEARCH: A dedicated search & filter dashboard allows car owners
//     to immediately drill down by brand, category, or exact SKU.
//   • SYNCHRONIZED CART EXPERIENCE: Fully powered by useQuoteStore, ensuring
//     real-time count badge feedback on the Navbar and smooth off-canvas checking.
//   • LOCALIZED CRO: Quick-inquire WhatsApp express CTAs on each card enable immediate
//     lead generation for users who only want to consult about a single part.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
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
} from "lucide-react"
import {
  BUSINESS,
  BRANDS,
  CATEGORIES,
  SAMPLE_PRODUCTS,
  buildWhatsAppURL,
  buildQuoteMessage,
  type QuoteItem,
  type Product,
} from "@/lib/config"
import { useQuoteStore } from "@/lib/quote-store"
import FloatingQuoteBar from "@/components/FloatingQuoteBar"

// ============================================================
// PRODUCT IMAGE AREA
// ============================================================
function ProductImageArea({ product, imageUrl }: { product: Product; imageUrl?: string }) {
  const waMsg = `Hola, quisiera ver una foto real del repuesto: ${product.name} (${product.brand}) — SKU ${product.sku}`
  const waUrl = buildWhatsAppURL(waMsg)

  if (imageUrl) {
    return (
      <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`${product.name} — ${product.brand}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-2.5 left-2.5 bg-[#0f0f0f]/85 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700/60">
          {product.brand}
        </span>
      </div>
    )
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Solicitar foto real de ${product.name} por WhatsApp`}
      className="relative aspect-[4/3] bg-zinc-900 flex flex-col items-center justify-center gap-2 group/img cursor-pointer border-b border-zinc-800/60 transition-colors hover:bg-zinc-800/50"
    >
      <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover/img:bg-zinc-700 transition-colors flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5 text-zinc-600 group-hover/img:text-[#25D366] transition-colors"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <p className="text-[10px] text-zinc-500 group-hover/img:text-[#25D366] transition-colors font-medium text-center px-3 leading-tight">
        📷 Consultar foto por WhatsApp
      </p>
      <span className="absolute top-2.5 left-2.5 bg-[#0f0f0f]/85 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700/60">
        {product.brand}
      </span>
    </a>
  )
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({
  product,
  quantityInList,
  onAdd,
  onRemove,
  onUpdateQuantity,
  imageUrl,
}: {
  product: Product
  quantityInList: number
  onAdd: () => void
  onRemove: () => void
  onUpdateQuantity: (delta: number) => void
  imageUrl?: string
}) {
  const isOEM = !product.sku.toLowerCase().includes("alt")
  const waExpressUrl = buildWhatsAppURL(
    `Hola, quiero consultar disponibilidad y precio de: *${product.name}* (${product.brand}) — SKU: *${product.sku}*. ¿Tienen stock?`
  )

  return (
    <article
      aria-label={product.name}
      className="bg-[#141414] rounded-2xl border border-zinc-800/80 overflow-hidden flex flex-col group transition-all duration-200 hover:border-zinc-700 hover:shadow-[0_6px_28px_rgba(0,0,0,0.4)]"
    >
      {/* Image */}
      <ProductImageArea product={product} imageUrl={imageUrl} />

      {/* Body */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {/* SKU */}
        <p className="text-zinc-600 text-[10px] font-mono tracking-wide leading-none">{product.sku}</p>

        {/* Title */}
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mt-0.5">
          {product.name}
        </h3>

        {/* Badge row: OEM/Alt + Category */}
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isOEM
                ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                : "text-amber-400 bg-amber-400/10 border-amber-400/25"
            }`}
          >
            {isOEM ? "OEM" : "Alternativo"}
          </span>
          <span className="text-zinc-600 text-[10px]">{product.category}</span>
        </div>

        {/* Compatibility */}
        <p className="text-zinc-500 text-xs mt-0.5 leading-snug">{product.compatibility}</p>
      </div>

      {/* Action area */}
      <div className="px-4 pb-4 pt-0 mt-auto">
        {quantityInList === 0 ? (
          <div className="flex items-center gap-2">
            {/* Primary Add to List */}
            <button
              onClick={onAdd}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/60 rounded-xl py-2.5 min-h-[44px] transition-all duration-150 active:scale-[0.97]"
              aria-label={`Añadir ${product.name} a la lista de cotización`}
            >
              <ListPlus className="w-4 h-4 flex-shrink-0" />
              Añadir a lista
            </button>

            {/* Secondary WhatsApp direct */}
            <a
              href={waExpressUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar ${product.name} directamente por WhatsApp`}
              title="Consultar este repuesto por WhatsApp"
              className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border border-[#25D366]/30 bg-[#25D366]/8 hover:bg-[#25D366]/20 hover:border-[#25D366]/60 text-[#25D366] transition-all duration-150"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        ) : (
          /* Stepper when added */
          <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-3 py-2.5">
            <span className="text-[#25D366] text-xs font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              En tu lista
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-white font-bold text-sm w-5 text-center">{quantityInList}</span>
              <button
                onClick={() => onUpdateQuantity(1)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

// ============================================================
// QUOTE LIST PANEL (Off-Canvas)
// ============================================================
function QuoteListPanel({
  isOpen,
  onClose,
  quoteItems,
  onRemoveFromQuote,
  onUpdateQuantity,
}: {
  isOpen: boolean
  onClose: () => void
  quoteItems: QuoteItem[]
  onRemoveFromQuote: (productId: string) => void
  onUpdateQuantity: (productId: string, delta: number) => void
}) {
  const message = buildQuoteMessage(quoteItems)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-panel-title"
        className={`fixed top-0 right-0 bottom-0 z-50 w-[90vw] max-w-[420px] bg-[#141414] flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h2 id="quote-panel-title" className="text-white font-bold">Mi Lista de Cotización</h2>
            <p className="text-zinc-400 text-xs">{quoteItems.length} producto(s)</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-2"
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-label="Lista de repuestos a cotizar">
          {quoteItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="w-16 h-16 text-zinc-800 mb-4" />
              <p className="text-white font-medium">Tu lista está vacía</p>
              <p className="text-zinc-400 text-sm mt-1">Busca repuestos en el catálogo y agrégalos</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 border border-zinc-800 text-zinc-400 rounded-lg hover:border-zinc-600 hover:text-white transition-colors"
              >
                Explorar repuestos
              </button>
            </div>
          ) : (
            quoteItems.map(item => (
              <div key={item.id} className="bg-zinc-900 rounded-xl p-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-5 h-5 text-zinc-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-zinc-400 text-xs">{item.brand} · {item.category}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => (item.quantity === 1 ? onRemoveFromQuote(item.id) : onUpdateQuantity(item.id, -1))}
                      className="bg-zinc-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-zinc-700 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="bg-zinc-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-zinc-700 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFromQuote(item.id)}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                  aria-label={`Eliminar ${item.name} de la lista`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {quoteItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-zinc-800 p-4 space-y-3">
            <div className="bg-[#0f0f0f] rounded-xl p-3 max-h-24 overflow-y-auto">
              <p className="text-zinc-600 text-[10px] uppercase tracking-wider mb-1">Mensaje a enviar:</p>
              <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-line">{message}</p>
            </div>
            <a
              href={buildWhatsAppURL(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-bold py-4 rounded-xl w-full min-h-[56px] flex items-center justify-center gap-2 text-base hover:bg-[#1da851] transition-colors"
              aria-label="Enviar lista de cotización por WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar lista por WhatsApp
            </a>
            <button
              onClick={onClose}
              className="text-zinc-400 text-sm py-2 w-full text-center hover:text-white transition-colors"
            >
              Seguir explorando
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ============================================================
// FLOATING WHATSAPP FAB
// ============================================================
function FloatingWhatsApp({ isHidden }: { isHidden: boolean }) {
  const whatsappUrl = buildWhatsAppURL("Hola, necesito ayuda con repuestos para mi vehículo.")
  
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

// ============================================================
// MAIN CATALOG PAGE COMPONENT
// ============================================================
export default function CatalogPage() {
  const {
    quoteItems,
    isQuotePanelOpen,
    setIsQuotePanelOpen,
    addToQuote,
    removeFromQuote,
    updateQuantity,
  } = useQuoteStore()

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products based on state
  let filtered = SAMPLE_PRODUCTS
  if (activeCategory) {
    filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase())
  }
  if (selectedBrand) {
    filtered = filtered.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase())
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    )
  }

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
            <span>Mostrando: <b>{filtered.length}</b> de {SAMPLE_PRODUCTS.length} piezas</span>
          </div>
        </div>
      </section>

      {/* Catalog Filters & Grid Area */}
      <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Search Input Card */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, SKU, marca o compatibilidad (ej. Arauca, TOY-FRN...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#121620]/95 border border-[#252b3b]/80 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-500 text-sm transition-all shadow-[0_4px_25px_rgba(0,0,0,0.3)] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
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
                onClick={() => setSelectedBrand(null)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border ${
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
                  onClick={() => setSelectedBrand(brand.label)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border ${
                    selectedBrand?.toLowerCase() === brand.label.toLowerCase()
                      ? "bg-red-600 text-white border-red-600 shadow-[0_2px_10px_rgba(230,0,0,0.25)]"
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
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border ${
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
                  onClick={() => setActiveCategory(cat.label)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all border ${
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
        {(activeCategory || selectedBrand || searchQuery.trim()) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mr-1">
              Filtros Activos:
            </span>
            {selectedBrand && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full">
                Marca: {selectedBrand}
                <button onClick={() => setSelectedBrand(null)} className="hover:text-white p-0.5" aria-label="Remover filtro de marca">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full">
                Cat: {activeCategory}
                <button onClick={() => setActiveCategory(null)} className="hover:text-white p-0.5" aria-label="Remover filtro de categoría">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full">
                &ldquo;{searchQuery.trim()}&rdquo;
                <button onClick={() => setSearchQuery("")} className="hover:text-white p-0.5" aria-label="Remover búsqueda">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setActiveCategory(null)
                setSelectedBrand(null)
                setSearchQuery("")
              }}
              className="text-xs text-zinc-500 hover:text-white underline ml-auto transition-colors px-2 py-1"
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
                  imageUrl={product.imageUrl}
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
                `¡Hola! Busqué en el catálogo completo: *${searchQuery.trim() || (selectedBrand ? `Repuestos ${selectedBrand}` : "Repuestos varios")}* y no lo encontré. ¿Me ayudan a conseguirlo? ⚡`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-[0.98] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-150 shadow-[0_4px_20px_rgba(37,211,102,0.25)] min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              Preguntar por WhatsApp ⚡
            </a>
            <button
              onClick={() => {
                setActiveCategory(null)
                setSelectedBrand(null)
                setSearchQuery("")
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
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
      <QuoteListPanel
        isOpen={isQuotePanelOpen}
        onClose={() => setIsQuotePanelOpen(false)}
        quoteItems={quoteItems}
        onRemoveFromQuote={removeFromQuote}
        onUpdateQuantity={updateQuantity}
      />
    </main>
  )
}
