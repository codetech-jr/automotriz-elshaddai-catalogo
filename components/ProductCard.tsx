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

import { Check, ListPlus, MessageCircle, Minus, Plus } from "lucide-react"
import { BUSINESS, buildWhatsAppURL, type Product } from "@/lib/config"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: Product
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
  // OEM heuristic: SKUs without "ALT" marker are treated as original equipment
  const isOEM = !product.sku.toLowerCase().includes("alt")

  const waExpressUrl = buildWhatsAppURL(
    `Hola, quiero consultar disponibilidad y precio de: *${product.name}* (${product.brand}) — SKU: *${product.sku}*. ¿Tienen stock?`
  )

  return (
    /*
      Container:
        • w-full       — fluid, never fixed
        • @container   — enables future container queries without code changes
        • flex flex-col — footer action area always at bottom
        • group        — enables group-hover utilities on descendants
        • overflow-hidden — clip image zoom effect inside card border-radius
    */
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
      {/*
        aspect-[4/3] reserves exact proportional space before image loads.
        This is the primary CLS guard: browser lays out the box immediately.
        On slow mobile connections, no reflow happens when the image arrives.
        bg-zinc-800 is the skeleton placeholder color.
      */}
      <ProductImageSlot product={product} waExpressUrl={waExpressUrl} />

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-0 flex flex-col gap-1.5 flex-1">
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
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductImageSlot
// ─────────────────────────────────────────────────────────────────────────────

function ProductImageSlot({
  product,
  waExpressUrl,
}: {
  product: Product
  waExpressUrl: string
}) {
  if (product.imageUrl) {
    return (
      /*
        aspect-[4/3] — CLS guard: box size reserved before image bytes arrive.
        bg-zinc-800 — loading skeleton (no visible flash for loaded images).
        overflow-hidden — clip the group-hover:scale-105 zoom inside the border-radius.
      */
      <div className="relative aspect-[4/3] bg-zinc-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={`${product.name} — ${product.brand}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Brand tag — absolute top-left */}
        <span className="absolute top-2.5 left-2.5 bg-[#0f0f0f]/85 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700/60 leading-none">
          {product.brand}
        </span>
      </div>
    )
  }

  // ── No image: "Request photo via WhatsApp" placeholder ──
  // Still uses aspect-[4/3] to reserve the same box size → zero CLS delta.
  return (
    <a
      href={waExpressUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Solicitar foto real de ${product.name} por WhatsApp`}
      className={cn(
        "relative aspect-[4/3] bg-zinc-900",
        "flex flex-col items-center justify-center gap-2",
        "border-b border-zinc-800/60",
        "cursor-pointer group/img",
        "transition-colors duration-150 hover:bg-zinc-800/50"
      )}
    >
      {/* Placeholder icon */}
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

      {/* Brand tag */}
      <span className="absolute top-2.5 left-2.5 bg-[#0f0f0f]/85 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700/60 leading-none">
        {product.brand}
      </span>
    </a>
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
    /*
      Row: min-h-[44px] on the overall row satisfies WCAG 2.5.5 touch target.
      Individual buttons also meet 44px via py-2.5 + min-h-[44px] declaration.
    */
    <div className="flex items-center gap-2">
      {/* Primary CTA — "Añadir a lista" */}
      <button
        onClick={onAdd}
        aria-label={`Añadir ${product.name} a la lista de cotización`}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5",
          "text-sm font-semibold text-zinc-300",
          // Touch target: min 44px height enforced explicitly
          "min-h-[44px] py-2.5 rounded-xl",
          "border border-zinc-700",
          "hover:border-zinc-500 hover:bg-zinc-800/60",
          // Scale feedback on tap
          "transition-all duration-150 active:scale-[0.97]"
        )}
      >
        <ListPlus className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>Añadir a lista</span>
      </button>

      {/*
        WhatsApp Express — secondary icon button.
        44×44px touch target: w-11 (44px) + h-11 (44px) explicit sizing.
        No text label needed (aria-label describes it).
      */}
      <a
        href={waExpressUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Consultar ${product.name} directamente por WhatsApp`}
        title="Consultar este repuesto directo por WhatsApp"
        className={cn(
          // 44×44px tap target
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
      {/* In-list confirmation indicator */}
      <span className="text-[#25D366] text-xs font-semibold flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        En tu lista
      </span>

      {/* Stepper buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          aria-label={quantity === 1 ? "Eliminar de la lista" : "Disminuir cantidad"}
          className={cn(
            // 28px circle — visually tight but inside a 44px-tall row
            "bg-zinc-800 hover:bg-zinc-700 text-white",
            "rounded-full w-7 h-7",
            "flex items-center justify-center",
            "transition-colors duration-100",
            "active:scale-90"
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
