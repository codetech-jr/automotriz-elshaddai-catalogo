"use client"

// ─── ProductCard.tsx — Modular, Interactable, CLS-Safe Product Card ───────────
//
// UI ENGINEERING (frontend-ui-engineering skill):
//   • w-full — card fills parent grid cell, never has a fixed width.
//     Layout authority delegated 100% to the parent grid.
//   • Image slot uses <div className="aspect-[4/3]"> for CLS prevention:
//     The browser reserves the exact bounding box before the image loads,
//     preventing the infamous mobile "content jump" on slow connections.
//   • Text truncation: title uses line-clamp-2, SKU/compat uses truncate
//     to guarantee the card stays a uniform height regardless of copy length.
//   • Quantity stepper buttons maintain a minimum tap area of 28×28px
//     (inline circle buttons) — the outer action row has min-h-[44px].
//
// INTERACTION DESIGN (interaction-design skill):
//   • Card hover: translateY(-4px) + richer shadow — 200ms ease-out (GPU only).
//   • Add-to-list button: active:scale-[0.97] spring feedback.
//   • In-list state: smooth color transition from neutral to [#25D366] accent.
//   • WhatsApp express icon: separate 44×44px tap target to the right.
//
// RESPONSIVE (responsive-design skill):
//   • This component is VIEWPORT-AGNOSTIC. It adapts to whatever column
//     width the parent grid provides (1col mobile → 4col 4K).
//   • Container queries (@container) could be added in the future for
//     component-level breakpoints — the structure is primed for this.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { Check, Eye, ListPlus, MessageCircle, Minus, Plus, X } from "lucide-react"
import { BUSINESS, buildWhatsAppURL, type Product } from "@/lib/config"
import { cn } from "@/lib/utils"
import { useSettings } from "@/lib/settings-context"

export interface ExtendedProduct extends Product {
  image_urls?: string[]
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: ExtendedProduct
  /** Current quantity of this product in the quote list (0 = not in list) */
  quantityInList: number
  /** Called when user clicks "Añadir a lista" */
  onAdd: () => void
  /** Called when user removes last unit (quantity stepper → 0) */
  onRemove: () => void
  /** Called with +1 or -1 to adjust quantity in list */
  onUpdateQuantity: (delta: number) => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  quantityInList,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: ProductCardProps) {
  const { whatsapp_number } = useSettings()
  // OEM heuristic: SKUs without "ALT" marker are treated as original equipment
  const isOEM = !product.sku.toLowerCase().includes("alt")

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [activePhotoIdx, setActiveImageIdx] = useState(0)

  // Fallback gallery array: use image_urls if defined, otherwise fall back to imageUrl
  const image_urls = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : (product.imageUrl ? [product.imageUrl] : [])

  const waExpressUrl = buildWhatsAppURL(
    `Hola, quiero consultar disponibilidad y precio de: *${product.name}* (${product.brand}) — SKU: *${product.sku}*. ¿Tienen stock?`,
    whatsapp_number
  )

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isDetailOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isDetailOpen])

  // Close modal on escape key
  useEffect(() => {
    if (!isDetailOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDetailOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDetailOpen])

  return (
    <>
      {/*
        Container:
          • w-full       — fluid, never fixed
          • @container   — enables future container queries without code changes
          • flex flex-col — footer action area always at bottom
          • group        — enables group-hover utilities on descendants
          • overflow-hidden — clip image zoom effect inside card border-radius
      */}
      <article
        aria-label={`${product.name} — ${product.brand}`}
        className={cn(
          "relative flex flex-col w-full",
          "bg-[#141414] rounded-2xl border overflow-hidden",
          "group",
          // Transition: transform + border + shadow — all GPU composited
          "transition-all duration-200 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
          // Border state: subtle resting / brighter on hover
          quantityInList > 0
            ? "border-emerald-500/30 shadow-[0_2px_12px_rgba(16,185,129,0.08)]"
            : "border-zinc-800/80 hover:border-zinc-700"
        )}
      >
        {/* ── Image Slot ──────────────────────────────────────────────────── */}
        <ProductImageSlot 
          product={product} 
          waExpressUrl={waExpressUrl} 
          onClick={() => {
            setIsDetailOpen(true)
            setActiveImageIdx(0)
          }}
        />

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div 
          onClick={() => {
            setIsDetailOpen(true)
            setActiveImageIdx(0)
          }}
          className="px-4 pt-3 pb-0 flex flex-col gap-1.5 flex-1 cursor-pointer"
        >
          {/* SKU — muted, monospace, secondary hierarchy */}
          <p className="text-zinc-600 text-[10px] font-mono tracking-wide leading-none truncate">
            {product.sku}
          </p>

          {/*
            Title — line-clamp-2 prevents overflow on long Spanish part names
            (e.g., "Kit de Distribución Completo con Tensor Hidráulico")
            while keeping all cards uniformly tall.
          */}
          <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mt-0.5">
            {product.name}
          </h3>

          {/* Badge row: OEM / Alternativo + Category chip */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border leading-none",
                isOEM
                  ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                  : "text-amber-400 bg-amber-400/10 border-amber-400/25"
              )}
            >
              {isOEM ? "OEM" : "Alternativo"}
            </span>
            <span className="text-zinc-600 text-[10px] truncate">{product.category}</span>
          </div>

          {/*
            Compatibility — single line, truncate with title tooltip fallback.
            On very narrow screens (1-col mobile), full text still accessible via
            the WhatsApp express button for details.
          */}
          <p
            className="text-zinc-500 text-xs mt-0.5 leading-snug truncate"
            title={product.compatibility}
          >
            {product.compatibility}
          </p>
        </div>

        {/* ── Action Area ─────────────────────────────────────────────────── */}
        <div className="px-4 pb-4 pt-3 mt-auto">
          {quantityInList === 0 ? (
            // ── Pre-add: Add to list + WhatsApp Express ──
            <PreAddActions
              product={product}
              waExpressUrl={waExpressUrl}
              onAdd={onAdd}
            />
          ) : (
            // ── In-list: Quantity stepper ──
            <QuantityStepper
              quantity={quantityInList}
              onDecrement={() => (quantityInList === 1 ? onRemove() : onUpdateQuantity(-1))}
              onIncrement={() => onUpdateQuantity(1)}
            />
          )}
        </div>
      </article>

      {/* ── Quick View Detail Modal ───────────────────────────────────────── */}
      {isDetailOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0d0f12]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsDetailOpen(false)}
        >
          <div 
            className="max-w-2xl w-full bg-surface-card border border-surface-border rounded-2xl overflow-hidden p-6 relative flex flex-col md:flex-row gap-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800/60 z-10 cursor-pointer"
              aria-label="Cerrar detalles"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column (Photo Gallery) */}
            <div className="flex-1 flex flex-col">
              {/* Main Photo Display */}
              <div className="h-64 w-full bg-surface-raised rounded-xl p-4 flex items-center justify-center overflow-hidden border border-zinc-800/40">
                {image_urls.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image_urls[activePhotoIdx]}
                    alt={`${product.name} — ${product.brand}`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-550 gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-10 h-10 text-zinc-650"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-xs">Sin imagen disponible</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {image_urls.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {image_urls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={cn(
                        "w-14 h-14 rounded-lg overflow-hidden border bg-zinc-950 flex-shrink-0 transition-all p-1 cursor-pointer",
                        activePhotoIdx === idx
                          ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30"
                          : "border-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column (Data & CTA) */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-zinc-550 text-[10px] font-mono uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h2 className="text-white font-bold text-lg md:text-xl leading-snug mt-1">
                    {product.name}
                  </h2>
                </div>

                <div className="space-y-2 border-t border-zinc-900 pt-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-900/40">
                    <span className="text-zinc-550">Marca:</span>
                    <span className="text-zinc-200 font-semibold">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900/40">
                    <span className="text-zinc-550">SKU:</span>
                    <span className="text-zinc-200 font-mono font-semibold">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900/40">
                    <span className="text-zinc-550">Condición:</span>
                    <span className={cn(
                      "font-semibold",
                      isOEM ? "text-sky-400" : "text-amber-400"
                    )}>
                      {isOEM ? "OEM (Original)" : "Alternativo"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-550">Compatibilidad:</span>
                    <span className="text-zinc-200 font-semibold text-right max-w-[180px] break-words">
                      {product.compatibility || "No especificada"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA footer inside modal */}
              <div className="pt-6 border-t border-zinc-900 mt-6 md:mt-0">
                {quantityInList === 0 ? (
                  <button
                    onClick={onAdd}
                    aria-label={`Añadir ${product.name} a la lista de cotización`}
                    className={cn(
                      "w-full flex items-center justify-center gap-1.5",
                      "text-sm font-semibold text-zinc-300",
                      "min-h-[44px] py-2.5 rounded-xl cursor-pointer",
                      "border border-zinc-700",
                      "hover:border-zinc-500 hover:bg-zinc-800/60",
                      "transition-all duration-150 active:scale-[0.97]"
                    )}
                  >
                    <ListPlus className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>Añadir a lista</span>
                  </button>
                ) : (
                  <QuantityStepper
                    quantity={quantityInList}
                    onDecrement={() => (quantityInList === 1 ? onRemove() : onUpdateQuantity(-1))}
                    onIncrement={() => onUpdateQuantity(1)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductImageSlot
// ─────────────────────────────────────────────────────────────────────────────

function ProductImageSlot({
  product,
  waExpressUrl,
  onClick,
}: {
  product: ExtendedProduct
  waExpressUrl: string
  onClick: () => void
}) {
  const image_urls = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : (product.imageUrl ? [product.imageUrl] : [])

  if (product.imageUrl) {
    return (
      <div 
        onClick={onClick}
        className="relative aspect-[4/3] bg-zinc-800 overflow-hidden cursor-pointer group/img"
      >
        <img
          src={product.imageUrl}
          alt={`${product.name} — ${product.brand}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        <span className="absolute top-2.5 left-2.5 bg-[#0f0f0f]/85 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700/60 leading-none">
          {product.brand}
        </span>
        
        {/* Gallery / Details indicator button — visible on mobile */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-[#141414]/90 border border-zinc-800/85 px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-sm text-zinc-300 text-[10px] font-semibold leading-none pointer-events-none group-hover/img:border-zinc-700 transition-colors">
          <Eye className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            {image_urls.length > 1
              ? `Toca para ver detalles (${image_urls.length} fotos)`
              : "Toca para ver detalles"}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative aspect-[4/3] bg-zinc-900 cursor-pointer group/img",
        "flex flex-col items-center justify-center gap-2",
        "border-b border-zinc-800/60",
        "transition-colors duration-150 hover:bg-zinc-800/50"
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover/img:bg-zinc-700 transition-colors flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5 text-zinc-600 group-hover/img:text-[#25D366] transition-colors"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <p className="text-[10px] text-zinc-500 group-hover/img:text-[#25D366] transition-colors font-medium text-center px-3 leading-tight">
        📷 Consultar foto por WhatsApp
      </p>

      <span className="absolute top-2.5 left-2.5 bg-[#0f0f0f]/85 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700/60 leading-none">
        {product.brand}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PreAddActions — "Add to list" + WhatsApp Express
// ─────────────────────────────────────────────────────────────────────────────

function PreAddActions({
  product,
  waExpressUrl,
  onAdd,
}: {
  product: Product
  waExpressUrl: string
  onAdd: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAdd}
        aria-label={`Añadir ${product.name} a la lista de cotización`}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5",
          "text-sm font-semibold text-zinc-300",
          "min-h-[44px] py-2.5 rounded-xl cursor-pointer",
          "border border-zinc-700",
          "hover:border-zinc-500 hover:bg-zinc-800/60",
          "transition-all duration-150 active:scale-[0.97]"
        )}
      >
        <ListPlus className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>Añadir a lista</span>
      </button>

      <a
        href={waExpressUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Consultar ${product.name} directamente por WhatsApp`}
        title="Consultar este repuesto directo por WhatsApp"
        className={cn(
          "flex-shrink-0 w-11 h-11",
          "flex items-center justify-center rounded-xl",
          "border border-[#25D366]/30 bg-[#25D366]/8",
          "hover:bg-[#25D366]/20 hover:border-[#25D366]/60",
          "text-[#25D366]",
          "transition-all duration-150"
        )}
      >
        <MessageCircle className="w-5 h-5" aria-hidden="true" />
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QuantityStepper — shown when product is already in the quote list
// ─────────────────────────────────────────────────────────────────────────────

function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
}: {
  quantity: number
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-3 py-2.5 min-h-[44px]">
      <span className="text-[#25D366] text-xs font-semibold flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        En tu lista
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          aria-label={quantity === 1 ? "Eliminar de la lista" : "Disminuir cantidad"}
          className={cn(
            "bg-zinc-800 hover:bg-zinc-700 text-white",
            "rounded-full w-7 h-7",
            "flex items-center justify-center",
            "transition-colors duration-100",
            "active:scale-90 cursor-pointer"
          )}
        >
          <Minus className="w-3 h-3" />
        </button>

        <span
          className="text-white font-bold text-sm w-5 text-center tabular-nums"
          aria-live="polite"
          aria-label={`${quantity} en tu lista`}
        >
          {quantity}
        </span>

        <button
          onClick={onIncrement}
          aria-label="Aumentar cantidad"
          className={cn(
            "bg-zinc-800 hover:bg-zinc-700 text-white",
            "rounded-full w-7 h-7",
            "flex items-center justify-center",
            "transition-colors duration-100",
            "active:scale-90"
          )}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
