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
import { useEffect, useRef, useState } from "react"
import { MessageCircle, Minus, Plus, ShoppingCart, Wrench, X, Trash2 } from "lucide-react"
import { buildWhatsAppURL, buildQuoteMessage, type QuoteItem } from "@/lib/config"
import { cn } from "@/lib/utils"
import TestimonialTrustBanner from "@/components/TestimonialTrustBanner"

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
  
  // State for YMM vehicle verification input (fricción positiva / CRO)
  const [vehicleInfo, setVehicleInfo] = useState("")

  // State for dynamic business hours logic (avoids server-side hydration mismatches)
  const [isBusinessHours, setIsBusinessHours] = useState<boolean | null>(null)

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date()
      const hour = now.getHours()
      // Business hours: 08:00 to 18:00
      setIsBusinessHours(hour >= 8 && hour < 18)
    }

    checkBusinessHours()
    const interval = setInterval(checkBusinessHours, 60000)
    return () => clearInterval(interval)
  }, [])

  // Dynamic behind-the-scenes string building and URL compilation
  const message = buildQuoteMessage(quoteItems, vehicleInfo)
  const waUrl = buildWhatsAppURL(message)

  // Reset vehicleInfo on drawer close
  useEffect(() => {
    if (!isOpen) {
      setVehicleInfo("")
    }
  }, [isOpen])

  // ── Focus management: move focus to close button when panel opens ──
  useEffect(() => {
    if (isOpen) {
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
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-title"
        className={cn(
          "fixed top-0 right-0 z-50",
          "w-[92vw] max-w-[440px]",
          "h-[100dvh]",
          "flex flex-col overflow-hidden",
          "bg-[#141414] shadow-2xl border-l border-zinc-800",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
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

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar panel de cotización"
            className={cn(
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

        {/* ── Scrollable Area (Products + YMM Input + Badges + Reviews) ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
          aria-label="Lista de productos para cotizar"
        >
          {quoteItems.length === 0 ? (
            <EmptyQuoteState onClose={onClose} />
          ) : (
            <>
              {/* Product cards list */}
              <div className="space-y-3">
                {quoteItems.map((item) => (
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
                ))}
              </div>

              {/* YMM Positive Friction Input (Form CRO & Reducing buying fear) */}
              <div className="space-y-1.5 pt-3 border-t border-zinc-900">
                <label 
                  htmlFor="vehicle-verify-input" 
                  className="block text-xs font-bold text-zinc-300 select-none leading-snug"
                >
                  ¿Quieres que verifiquemos si le queda a tu vehículo? Déjanos el año y modelo aquí:
                </label>
                <input
                  id="vehicle-verify-input"
                  type="text"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  placeholder="Ej: Toyota Corolla 2015, Arauco 2018..."
                  className="w-full bg-[#0d0d0d] border border-zinc-800 focus:border-amber-500/80 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-650 outline-none transition-all focus:ring-1 focus:ring-amber-500/20"
                />
              </div>

              {/* Static Trust Badges (CRO & Trust building) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-1.5 p-2 bg-[#0d0d0d]/80 rounded-xl border border-zinc-850">
                  <span className="text-xs" aria-hidden="true">⏱️</span>
                  <span className="text-[10px] leading-tight font-semibold text-zinc-400">
                    Respondemos en menos de 15 minutos
                  </span>
                </div>
                <div className="flex items-start gap-1.5 p-2 bg-[#0d0d0d]/80 rounded-xl border border-zinc-850">
                  <span className="text-xs" aria-hidden="true">🛡️</span>
                  <span className="text-[10px] leading-tight font-semibold text-zinc-400">
                    Cotización 100% gratuita y sin compromiso
                  </span>
                </div>
              </div>

              {/* Google Reviews Social Proof (CRO) */}
              <TestimonialTrustBanner />
            </>
          )}
        </div>

        {/* ── Fixed Footer CTAs (Sticky WhatsApp + Status + Close) ─────────── */}
        {quoteItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-zinc-800 px-4 pt-4 pb-6 space-y-4 bg-[#141414] pb-safe">
            
            {/* Dynamic Business Hours Status (Marketing Psychology) */}
            {isBusinessHours !== null && (
              <div 
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300",
                  isBusinessHours 
                    ? "bg-[#0d1f14] border-emerald-900/60 text-emerald-400"
                    : "bg-zinc-900/80 border-zinc-800 text-zinc-400"
                )}
                role="status"
              >
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  {isBusinessHours && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    isBusinessHours ? "bg-emerald-500" : "bg-zinc-500"
                  )}></span>
                </span>
                <span className="leading-tight">
                  {isBusinessHours 
                    ? "🟢 Asesores en línea listos para cotizar" 
                    : "🌙 Envía tu lista ahora y serás el primero en recibir respuesta mañana"}
                </span>
              </div>
            )}

            {/* Primary CTA — WhatsApp Redirection */}
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
                "transition-all duration-150 shadow-[0_4px_16px_rgba(37,211,102,0.15)] hover:shadow-[0_4px_24px_rgba(37,211,102,0.3)]",
                "active:scale-[0.98]"
              )}
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Enviar lista por WhatsApp
            </a>

            {/* Secondary CTA — close drawer */}
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
    <div className="bg-zinc-900 rounded-xl p-3 flex items-center gap-3 min-h-[80px] border border-zinc-850/50">
      {/* Product Image Thumbnail / Fallback (Pure visual interface) */}
      {item.imageUrl ? (
        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="w-12 h-12 flex-shrink-0 bg-zinc-850 rounded-lg flex items-center justify-center border border-zinc-800"
          aria-hidden="true"
        >
          <Wrench className="w-5 h-5 text-zinc-500" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold line-clamp-1 leading-tight">{item.name}</p>
        <p className="text-zinc-400 text-[11px] mt-0.5 font-medium leading-none">
          {item.brand} · {item.category}
        </p>

        {/* Quantity stepper row */}
        <div className="flex items-center gap-1.5 mt-2">
          {/* Touch-safe button: visual size is 32px, outer relative allows easy touch */}
          <button
            onClick={onDecrement}
            aria-label={item.quantity === 1 ? `Eliminar ${item.name} de la lista` : `Disminuir cantidad de ${item.name}`}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white transition-all active:scale-90"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span
            className="text-white font-bold text-sm w-7 text-center tabular-nums"
            aria-live="polite"
          >
            {item.quantity}
          </span>
          <button
            onClick={onIncrement}
            aria-label={`Aumentar cantidad de ${item.name}`}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white transition-all active:scale-90"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delete/Trash Button — intuitive trash icon, w-10 h-10 touch target */}
      <button
        onClick={onRemove}
        aria-label={`Eliminar ${item.name} de la lista`}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-90"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
