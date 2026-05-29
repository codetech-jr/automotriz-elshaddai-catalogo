"use client"

// ─── FloatingQuoteBar — Cotizador FAB / Bottom App Bar ────────────────────────
// CRO Rationale (onboarding-cro + marketing-psychology):
//   • Zeigarnik Effect: La barra visible pero vacía crea un "open loop" cognitivo
//     que motiva al usuario a completarla. La incompletitud es incómoda.
//   • Goal-Gradient Effect: A medida que aumentan los items, el CTA verde
//     "Enviar lista" se vuelve más prominente — el objetivo se siente más cercano.
//   • Endowment Effect: Los artículos YA en la lista generan apego — el usuario
//     no quiere "perder" lo que ya tiene en su cotización.
//   • Visual Anxiety Prevention: Estado vacío = barra sutil zinc. Estado activo =
//     CTA verde dominante. Evitamos mostrar el verde urgente cuando no hay nada.
//   • Commitment & Consistency (Foot-in-the-Door): El primer artículo agregado
//     activa el micro-compromiso. La barra lo hace visible y persistente.
// ─────────────────────────────────────────────────────────────────────────────

import { ShoppingCart, MessageCircle, ChevronUp } from "lucide-react"
import { QuoteItem, buildWhatsAppURL, buildQuoteMessage } from "@/lib/config"

interface FloatingQuoteBarProps {
  quoteItems: QuoteItem[]
  onOpenPanel: () => void
  isHidden: boolean
}

export default function FloatingQuoteBar({
  quoteItems,
  onOpenPanel,
  isHidden,
}: FloatingQuoteBarProps) {
  const totalItems = quoteItems.reduce((sum, item) => sum + item.quantity, 0)
  const hasItems = totalItems > 0

  const message = buildQuoteMessage(quoteItems)
  const whatsappUrl = buildWhatsAppURL(message)

  return (
    <div
      aria-live="polite"
      aria-label={hasItems ? `Lista de cotización con ${totalItems} producto(s)` : "Lista de cotización vacía"}
      className={`
        fixed bottom-0 inset-x-0 z-40
        transition-all duration-300 ease-in-out
        ${isHidden
          ? "translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
        }
      `}
    >
      {/* Frosted bottom bar */}
      <div
        className={`
          border-t
          px-4 py-3 md:px-6 md:py-4
          transition-all duration-500 ease-in-out
          ${hasItems
            ? "bg-[#0d1a0d]/95 backdrop-blur-xl border-[#25D366]/30"
            : "bg-[#0d0d0d]/90 backdrop-blur-md border-zinc-800/60"
          }
        `}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">

          {/* ── Cart icon + count badge ── */}
          <button
            onClick={onOpenPanel}
            aria-label={`Ver lista de cotización — ${totalItems} artículo(s)`}
            className={`
              relative flex-shrink-0 flex items-center justify-center
              w-11 h-11 rounded-full border transition-all duration-300
              ${hasItems
                ? "bg-[#25D366]/15 border-[#25D366]/40 hover:bg-[#25D366]/25"
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }
            `}
          >
            <ShoppingCart
              className={`w-5 h-5 transition-colors duration-300 ${hasItems ? "text-[#25D366]" : "text-zinc-500"}`}
              aria-hidden="true"
            />
            {hasItems && (
              <span
                aria-hidden="true"
                className="
                  absolute -top-1 -right-1
                  min-w-[20px] h-5 px-1
                  bg-[#25D366] text-[#0d0d0d]
                  text-[11px] font-black rounded-full
                  flex items-center justify-center
                  animate-in zoom-in-50 duration-200
                "
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* ── Middle: label / item names ── */}
          <button
            onClick={onOpenPanel}
            aria-label="Ver lista de cotización"
            className="flex-1 text-left min-w-0"
          >
            {hasItems ? (
              <div>
                <p className="text-white text-sm font-semibold leading-tight flex items-center gap-1.5">
                  {totalItems} {totalItems === 1 ? "repuesto" : "repuestos"} en tu lista
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                </p>
                <p className="text-zinc-500 text-xs truncate mt-0.5">
                  {quoteItems.map(i => i.name).join(" · ")}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-zinc-500 text-sm font-medium">Tu lista de cotización</p>
                <p className="text-zinc-700 text-xs mt-0.5">Agrega repuestos para cotizar</p>
              </div>
            )}
          </button>

          {/* ── Primary CTA — only prominent when items exist ── */}
          {hasItems ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enviar lista de ${totalItems} repuesto(s) por WhatsApp`}
              className="
                flex-shrink-0
                flex items-center justify-center gap-2
                bg-[#25D366] hover:bg-[#1da851] active:scale-[0.96]
                text-white font-bold text-sm
                px-4 py-3 rounded-xl
                min-h-[48px]
                transition-all duration-150
                shadow-[0_2px_16px_rgba(37,211,102,0.35)]
                hover:shadow-[0_4px_24px_rgba(37,211,102,0.5)]
                whitespace-nowrap
              "
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Enviar por WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          ) : (
            // Ghost state — no anxiety, just a subtle hint
            <div
              aria-hidden="true"
              className="flex-shrink-0 flex items-center justify-center gap-2
                bg-zinc-900 border border-zinc-800
                text-zinc-600 text-sm font-medium
                px-4 py-3 rounded-xl min-h-[48px] whitespace-nowrap
                select-none"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Enviar lista</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
