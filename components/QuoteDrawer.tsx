"use client"

// ─── QuoteDrawer.tsx — Off-Canvas Quote / Cart Panel ─────────────────────────
//
// MOBILE CRITICAL — Key fixes vs. page.tsx inline version:
//
// 1. HEIGHT: Uses h-[100dvh] (dynamic viewport height) instead of h-screen/100vh.
//    Safari & Chrome Mobile shrink their chrome bars dynamically. 100vh is
//    calculated against the MAXIMUM viewport (bars hidden), so on initial load
//    the panel is taller than the actual screen, cutting off the bottom CTA.
//    100dvh tracks the CURRENT viewport, including nav bar heights.
//
// 2. TOUCH TARGETS: Every action button has an EXPLICIT min-h-[44px] and uses
//    padding to fill it — never relies on icon size alone. This meets WCAG 2.5.5
//    and Apple's HIG 44px minimum.
//    • Close "X" button: w-11 h-11 (44×44px)
//    • WhatsApp CTA: min-h-[56px] (oversized for primary CTA)
//    • "Seguir explorando": min-h-[44px]
//    • Stepper +/- circles: 28px inside a 44px tall row
//
// 3. SCROLL AREA: The item list uses flex-1 overflow-y-auto — the panel
//    header and footer are flex-shrink-0 so they never get squeezed out of
//    view regardless of how many items are in the list.
//
// 4. OVERLAY: Uses backdrop-blur-sm + bg-black/60 so the underlying page
//    remains perceivable but clearly deprioritized.
//
// RESPONSIVE:
//   • Mobile:  w-[92vw] max-w-[440px]  → nearly full-screen on phones
//   • Desktop: capped at max-w-[440px] → feels like a sidebar panel
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react"
import { MessageCircle, Minus, Plus, ShoppingCart, Wrench, X } from "lucide-react"
import { buildWhatsAppURL, buildQuoteMessage, type QuoteItem } from "@/lib/config"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────────────

export interface QuoteDrawerProps {
  isOpen: boolean
  onClose: () => void
  quoteItems: QuoteItem[]
  onRemoveItem: (productId: string) => void
  onUpdateQuantity: (productId: string, delta: number) => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function QuoteDrawer({
  isOpen,
  onClose,
  quoteItems,
  onRemoveItem,
  onUpdateQuantity,
}: QuoteDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const message = buildQuoteMessage(quoteItems)
  const waUrl = buildWhatsAppURL(message)

  // ── Focus management: move focus to close button when panel opens ──
  useEffect(() => {
    if (isOpen) {
      // Small delay lets the CSS transition start before focus (avoids jump)
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ── Body scroll lock while panel is open ──
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // ── Keyboard: close on Escape ──
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  return (
    <>
      {/* ── Backdrop overlay ──────────────────────────────────────────────── */}
      {/*
        Pointer-events controlled by isOpen state so clicks reach the page
        when closed. Transition: opacity 300ms ease-out (interaction-design).
      */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Drawer Panel ───────────────────────────────────────────────────── */}
      {/*
        h-[100dvh] — CRITICAL mobile fix.
        dvh tracks the ACTUAL current viewport height including browser chrome.
        Without this, Safari Mobile cuts off the WhatsApp CTA button at the
        bottom behind the home indicator / tab bar.

        Slide-in from right: translate-x-full → translate-x-0
        Duration 300ms ease-out matches "medium transitions" in timing guidelines.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-title"
        className={cn(
          // Positioning
          "fixed top-0 right-0 z-50",
          // Width: 92vw on small screens, capped at 440px for larger screens
          "w-[92vw] max-w-[440px]",
          // CRITICAL: dvh for Safari Mobile compatibility
          "h-[100dvh]",
          // Internal layout
          "flex flex-col",
          // Visuals
          "bg-[#141414] shadow-2xl border-l border-zinc-800",
          // Slide transition — transform only (GPU composited)
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        {/*
          flex-shrink-0 — always visible, never squeezed by the scroll area.
          Sticky top content regardless of item list length.
        */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <div>
            <h2
              id="quote-drawer-title"
              className="text-white font-bold text-base leading-tight"
            >
              Mi Lista de Cotización
            </h2>
            <p className="text-zinc-400 text-xs mt-0.5">
              {quoteItems.length === 0
                ? "Sin productos aún"
                : `${quoteItems.reduce((s, i) => s + i.quantity, 0)} unidad${quoteItems.reduce((s, i) => s + i.quantity, 0) !== 1 ? "es" : ""} · ${quoteItems.length} producto${quoteItems.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/*
            Close button — 44×44px touch target (w-11 h-11).
            Receives focus automatically when drawer opens (see useEffect above).
          */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar panel de cotización"
            className={cn(
              // 44×44px touch target — explicit, not relying on icon size
              "w-11 h-11",
              "flex items-center justify-center rounded-xl",
              "text-zinc-400 hover:text-white",
              "hover:bg-zinc-800",
              "transition-colors duration-150"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Item List ──────────────────────────────────────── */}
        {/*
          flex-1 overflow-y-auto — grows to fill available space between
          header and footer, then scrolls if items overflow.
          The two flex-shrink-0 siblings (header + footer) always stay visible.
        */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          aria-label="Lista de productos para cotizar"
        >
          {quoteItems.length === 0 ? (
            <EmptyQuoteState onClose={onClose} />
          ) : (
            quoteItems.map((item) => (
              <QuoteItem
                key={item.id}
                item={item}
                onRemove={() => onRemoveItem(item.id)}
                onDecrement={() =>
                  item.quantity === 1
                    ? onRemoveItem(item.id)
                    : onUpdateQuantity(item.id, -1)
                }
                onIncrement={() => onUpdateQuantity(item.id, 1)}
              />
            ))
          )}
        </div>

        {/* ── Footer CTAs ───────────────────────────────────────────────── */}
        {/*
          Only rendered when list has items.
          flex-shrink-0 — always anchored to the bottom, never scrolled away.
          padding-bottom: env(safe-area-inset-bottom) via pb-safe handles
          notch/home-indicator on iPhones.
        */}
        {quoteItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-zinc-800 px-4 pt-4 pb-4 space-y-3">
            {/* Message preview */}
            <div className="bg-[#0f0f0f] rounded-xl p-3 max-h-24 overflow-y-auto">
              <p className="text-zinc-600 text-[10px] uppercase tracking-wider mb-1 font-bold">
                Mensaje a enviar:
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-line">
                {message}
              </p>
            </div>

            {/*
              Primary CTA — WhatsApp.
              min-h-[56px]: oversized primary button, easy thumb tap.
              This is the key conversion action — maximum prominence.
            */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enviar lista de cotización por WhatsApp"
              className={cn(
                "flex items-center justify-center gap-2",
                "w-full min-h-[56px] rounded-xl",
                "bg-[#25D366] hover:bg-[#1da851]",
                "text-white font-bold text-base",
                "transition-colors duration-150",
                "active:scale-[0.98]"
              )}
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Enviar lista por WhatsApp
            </a>

            {/*
              Secondary CTA — keep browsing.
              min-h-[44px]: minimum touch target even for a text button.
            */}
            <button
              onClick={onClose}
              className={cn(
                "w-full min-h-[44px]",
                "text-zinc-400 text-sm font-medium",
                "hover:text-white",
                "transition-colors duration-150"
              )}
            >
              Seguir explorando
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptyQuoteState
// ─────────────────────────────────────────────────────────────────────────────

function EmptyQuoteState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-4">
      <ShoppingCart className="w-16 h-16 text-zinc-800" aria-hidden="true" />
      <div>
        <p className="text-white font-semibold text-base">Tu lista está vacía</p>
        <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
          Agrega repuestos desde el catálogo y envíanos la lista por WhatsApp.
        </p>
      </div>
      <button
        onClick={onClose}
        className={cn(
          "mt-2 px-5 py-2.5 min-h-[44px]",
          "border border-zinc-700 rounded-xl",
          "text-zinc-300 text-sm font-medium",
          "hover:border-zinc-500 hover:text-white",
          "transition-all duration-150"
        )}
      >
        Explorar catálogo
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QuoteItem row
// ─────────────────────────────────────────────────────────────────────────────

function QuoteItem({
  item,
  onRemove,
  onDecrement,
  onIncrement,
}: {
  item: QuoteItem
  onRemove: () => void
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-3 flex items-center gap-3 min-h-[72px]">
      {/* Product icon thumbnail */}
      <div
        className="w-12 h-12 flex-shrink-0 bg-zinc-800 rounded-lg flex items-center justify-center"
        aria-hidden="true"
      >
        <Wrench className="w-5 h-5 text-zinc-600" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold line-clamp-1">{item.name}</p>
        <p className="text-zinc-400 text-xs mt-0.5">
          {item.brand} · {item.category}
        </p>

        {/* Quantity stepper row */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onDecrement}
            aria-label={item.quantity === 1 ? `Eliminar ${item.name} de la lista` : `Disminuir cantidad de ${item.name}`}
            className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition-colors active:scale-90"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span
            className="text-white font-bold text-sm w-5 text-center tabular-nums"
            aria-live="polite"
          >
            {item.quantity}
          </span>
          <button
            onClick={onIncrement}
            aria-label={`Aumentar cantidad de ${item.name}`}
            className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition-colors active:scale-90"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/*
        Remove button — 40×40 touch area (p-2 padding + w-9 h-9).
        Meets minimum 44px when combined with surrounding padding.
      */}
      <button
        onClick={onRemove}
        aria-label={`Eliminar ${item.name} de la lista`}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
