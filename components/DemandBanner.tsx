// ─── DemandBanner ("Los que sí saben") ────────────────────────────────────────
// CRO Rationale:
//   • Authority Bias + Jobs-to-be-Done: "Los que sí saben de repuestos" activa
//     el sesgo de autoridad en un mercado donde el cliente duda de quién realmente
//     conoce la pieza exacta. El posicionamiento se ancla en expertise, no precio.
//   • Rhetorical question (copywriting): "¿No lo encuentras?" invoca el pain point
//     del cliente que ha ido a 3 talleres sin éxito — el customer job real.
//   • Loss Aversion: "te lo conseguimos en minutos" activa el contraste con el
//     tiempo perdido buscando en otro lugar. La pérdida de tiempo > el esfuerzo
//     de chatear.
//   • Visual break: El banner interrumpe la grilla con contraste visual,
//     reseteando la atención (Pattern Interrupt) sin bloquear el scroll.
// ─────────────────────────────────────────────────────────────────────────────
"use client"

import { BUSINESS } from "@/lib/config"

interface DemandBannerProps {
  /** URL WhatsApp con mensaje pre-cargado. Por defecto apunta al número del negocio. */
  whatsappUrl?: string
}

const DEFAULT_WA_URL = `https://wa.me/${BUSINESS.phone}?text=${encodeURIComponent(
  "Hola, estoy buscando un repuesto específico y no lo encontré en el catálogo. ¿Pueden conseguírmelo?"
)}`

export default function DemandBanner({
  whatsappUrl = DEFAULT_WA_URL,
}: DemandBannerProps) {
  return (
    <section
      aria-label="Búsqueda de repuestos bajo demanda"
      className="
        relative overflow-hidden
        bg-gradient-to-br from-[#0f1f0f] via-[#0a1a0a] to-[#0d0d0d]
        border-y border-[#25D366]/15
        py-12 px-4 md:px-8
      "
    >
      {/* ── Decorative glow — atmosphere cue ── */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-24 top-0 bottom-0 w-72
          bg-[radial-gradient(ellipse_at_center,_rgba(37,211,102,0.08)_0%,_transparent_70%)]
        "
      />

      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">

        {/* ── Left: positioning claim ── */}
        <div className="flex-1 text-center md:text-left">
          {/* Authority micro-label */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </span>
            <span className="text-[#25D366] text-xs font-bold uppercase tracking-widest">
              Búsqueda bajo demanda
            </span>
          </div>

          {/* ── Main positioning headline ── */}
          {/* Copywriting: Specificity > vagueness. Owned claim, not a generic benefit. */}
          <h2 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight">
            Los que{" "}
            <span className="italic text-[#25D366]">sí saben</span>{" "}
            de repuestos.
          </h2>

          {/* Sub-copy: addresses the #1 pain point */}
          <p className="text-zinc-400 text-sm md:text-base mt-3 max-w-md mx-auto md:mx-0 leading-relaxed">
            ¿Buscas una pieza que nadie tiene?{" "}
            <span className="text-white font-medium">
              Descríbela y la conseguimos.
            </span>{" "}
            Conectamos con proveedores en todo el país.
          </p>
        </div>

        {/* ── Right: CTA card ── */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 md:min-w-[280px]">

            {/* Rhetorical question — pattern interrupt */}
            <p className="text-white font-semibold text-base text-center md:text-left">
              ¿No lo encuentras en el catálogo?
            </p>

            {/* CTA — WhatsApp green, primary action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center gap-2.5
                bg-[#25D366] hover:bg-[#1da851] active:scale-[0.97]
                text-white font-bold text-sm
                py-3.5 px-5 rounded-xl
                min-h-[48px]
                transition-all duration-150
                shadow-[0_4px_20px_rgba(37,211,102,0.25)]
                hover:shadow-[0_6px_28px_rgba(37,211,102,0.4)]
              "
              aria-label="Chatear por WhatsApp para pedir repuesto no listado"
            >
              {/* WhatsApp speech bubble icon */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chatea y te lo conseguimos
            </a>

            {/* Speed promise — hyperbolic discounting: benefit immediato */}
            <p className="text-zinc-500 text-[11px] text-center flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-[#25D366]">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Respuesta en minutos · Sin compromiso
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
