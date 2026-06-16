// ─── AnnouncementBar (Server Component) ────────────────────────────────────────
// Local Delivery Trust builder
// Rationale:
//   • URGENCY & CONVIENCE: Proactively reminding local users of emergency "Auxilio Vial"
//     (delivery services) immediately builds convenience value.
//   • DESIGN INTEGRATION: Ultra-thin dark-amber gradient panel that cleanly anchors
//     the layout top, providing semantic context without stealing visual focus.
//   • MOBILE ADAPTIVITY: Standard flex containers break on narrow viewports;
//     we swap to a shorter, highly-optimized tagline on mobile.
// ─────────────────────────────────────────────────────────────────────────────

import { Zap, Truck } from "lucide-react"
import { buildWhatsAppURL } from "@/lib/config"

interface AnnouncementBarProps {
  whatsappNumber?: string
}

export default function AnnouncementBar({ whatsappNumber }: AnnouncementBarProps) {
  const whatsappUrl = buildWhatsAppURL(
    "Hola, necesito Auxilio Vial. ¿Me pueden llevar un repuesto a donde estoy?",
    whatsappNumber
  )


  return (
    <div className="w-full bg-gradient-to-r from-[#120e06] via-[#1c140a] to-[#120e06] border-b border-amber-500/10 text-center py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] md:text-xs text-amber-400 font-semibold tracking-wide">
        {/* Animated Emergency Radar Pulse */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>

        {/* Desktop Version */}
        <span className="hidden sm:inline flex-wrap items-center justify-center gap-1">
          <span className="text-zinc-400">🚨 Auxilio Vial:</span>
          <span>Te llevamos el repuesto a donde estés —</span>
          <span className="text-white font-extrabold ml-1">
            Cúa · Charallave · Ocumare del Tuy
          </span>
        </span>

        {/* Mobile Version (Shorter) */}
        <span className="inline sm:hidden">
          <span className="text-zinc-400">🚨 Auxilio Vial Tuy: </span>
          <span className="text-white font-extrabold">Cúa · Charallave · Ocumare</span>
        </span>

        {/* Interactive CTA link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center gap-1 text-[10px] md:text-[11px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full transition-all duration-200 active:scale-95 whitespace-nowrap"
          aria-label="Solicitar entrega por Auxilio Vial"
        >
          <Truck className="w-3 h-3 flex-shrink-0" />
          <span>Pedir Delivery</span>
        </a>
      </div>
    </div>
  )
}
