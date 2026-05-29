// ─── PaymentTrustBand ──────────────────────────────────────────────────────
// CRO Rationale:
//   • Regret Aversion (marketing-psychology): Mostrar opciones de pago
//     antes de que el usuario salga elimina la duda "¿cómo pago?", que es
//     una de las mayores causas de abandono en e-commerce local.
//   • Authority Bias: Listar métodos reconocidos (Binance, Zelle, Pago Móvil)
//     junto a íconos icónicos eleva la percepción de legitimidad.
//   • Placement: Justo sobre el footer (zona de "cierre cognitivo") refuerza
//     la decisión antes de que el usuario abandone la página.
// ─────────────────────────────────────────────────────────────────────────────
import { Smartphone, Banknote, ShieldCheck } from "lucide-react";
import { buildWhatsAppURL } from "@/lib/config";

const PAYMENT_METHODS = [
  {
    id: "pago-movil",
    label: "Pago Móvil",
    description: "Transferencia instantánea",
    icon: <Smartphone className="w-7 h-7" strokeWidth={1.8} />,
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
  },
  {
    id: "zelle",
    label: "Zelle",
    description: "USD · Transferencia USA",
    icon: (
      <svg viewBox="353 215.5 763 310.5" className="w-14 h-7 fill-current" aria-hidden="true">
        <g fill="currentColor">
          <path d="m423 258.5-65.726-.605v43.605h108.926l-113.2 145.1v36.9h70v42.5h42v-42.5h71.4c.6-1.7.811-6.284-2.989-10.484-6.3-7-11.31-14.316-15.91-23.516-2.1-4.1-3.695-9.011-4.295-9.411-14.06-.644-94.949-.478-94.905-.989l113.3-145.989v-34.611h-66.6v-43h-42v43zm303.3-20.3c-1 .4-1.3 22.5-1.3 106.2 0 113.1-.1 111.2 4.9 120.9 4.5 8.7 15.5 16.5 27.8 19.7 6.8 1.8 26.8 2 34.5.4 9.9-2.1 11.8-5.1 7.9-12.8-2.5-4.8-5.8-15.3-6.6-21.1-1.1-6.9-2.5-8-10.9-7.8-4 .1-7.8-.2-8.5-.6-4.1-2.6-4.1-3.3-4.1-104.6 0-65.1-.3-97.8-1-99.1-1-1.8-2.3-1.9-21.3-1.8-11.1 0-20.8.3-21.4.6zm91.7.3c-1.3.8-1.5 13.6-1.5 105.2 0 98.7.1 104.7 1.9 111.6 3.4 13.6 11.1 21.9 25.7 28 5.6 2.3 8.1 2.7 19.4 3 15.1.4 22.8-.7 30.5-4.6 7.6-3.7 7.8-6.3 1.3-15.8-2.6-3.8-6.6-10.3-8.8-14.4l-4-7.5-7.3-.1c-9.1-.2-10-.6-11.7-4.9-1.3-2.9-1.5-17.8-1.5-100.5 0-65.1-.3-97.8-1-99.1-1-1.8-2.3-1.9-21.3-1.9-11.1 0-20.9.5-21.7 1zm266 21.5c-8.1 3.7-12.3 10.1-12.4 19-.1 7.6 3 13.4 9.3 17.5 7.8 5.3 20.3 3.8 26.8-3.2 8.3-8.9 6.6-24.3-3.6-31.2-5.3-3.6-14.6-4.5-20.1-2.1zm16 3.7c11.3 5.7 13 20.3 3.4 28.8-4.1 3.6-7 4.4-13.3 3.8-17.4-1.7-20.8-26.1-4.6-33.4 4.4-2 9.5-1.7 14.5.8z"/><path d="m1084.7 268.2c-.7 1.2-.8 19.8-.1 21.7.3.9 1.2 1.6 2 1.6 1 0 1.4-1.4 1.4-5 0-4.5.2-5 2.3-5 1.6 0 3 1.4 5.2 5 1.8 3 3.6 5 4.7 5 2.4 0 2.3-.4-1.4-5.8-2.2-3.2-2.8-4.7-1.9-5 2.6-.9 5.1-4.2 5.1-6.7 0-4.5-3.2-6.5-10.4-6.5-3.6 0-6.7.3-6.9.7zm12.1 3.2c.8.4 1.2 1.9 1 3.2-.3 2.1-.9 2.4-5 2.7l-4.8.3v-3.5c0-3.5.1-3.6 3.8-3.6 2 0 4.3.4 5 .9zm-496.3 29.6c-.5.2-4.4 1.1-8.5 2-25.7 5.9-48.4 25.6-58 50.6-5.3 13.8-7.2 24.5-7.3 40.4-.1 22.3 4.4 38.7 14.7 54.3 11.6 17.5 28.6 29.4 50.6 35.4 7.5 2 10.8 2.3 28 2.3 17 0 20.5-.3 27.6-2.2 17.6-4.9 32.6-13 44.7-24.5 7.7-7.2 7.6-9.2-.2-15.2-3.2-2.5-9-7.9-12.8-12.1-4.8-5.1-7.7-7.5-9.2-7.5-1.4 0-4.6 2-7.7 5-10.7 9.7-24.2 14.3-41.9 14.2-16.2-.1-28-4.3-35.5-12.9-3.8-4.3-8.6-14.1-9.6-19.6l-.6-3.7h62.3c34.3 0 63-.4 63.7-.9 3.3-2.1 4.1-16.6 1.7-32.4-5.7-37.8-28.3-63.2-63.8-71.7-6.3-1.5-11.5-2-22.7-1.9-8 0-14.9.2-15.5.4zm26.7 38.6c7.3 1.5 16.3 6.5 20.5 11.3 3.9 4.4 7.9 12.3 8.9 17.4l.7 3.2h-81.5l.7-3.2c3-13.5 14.6-24.8 29-28.4 6.4-1.6 15-1.7 21.7-.3zm336.8-37.7c-35.5 7.9-59.5 32.9-67 69.8-4.5 21.8-2 47.2 6.5 65.4 11.6 25.2 32.7 41.5 61.5 47.4 9.1 1.9 12.7 2.1 27 1.7 12.1-.4 18.6-1.1 24.2-2.6 17.1-4.5 32.1-12.7 43.6-23.7 8.8-8.5 8.8-8.9-.7-16.8-4.4-3.6-10.3-9.3-13.1-12.6-6.5-7.5-8.2-7.6-15.5-1-10.9 9.9-23.9 14.3-42 14.2-25.4-.1-40.2-11-45-33l-.7-2.595h126.7c4.3-3.1 2.7-35.905-2.5-51.105-1-3-3.7-9-5.9-13.2-11.7-22.4-30.4-36.3-56.4-41.8-8.3-1.8-32.8-1.8-40.7-.1zm31.2 37.7c6.8 1.5 13.8 5 18.8 9.5 4.2 3.9 11 16.2 11 20v2.4h-81.2l.7-2.8c5.2-21.4 27.2-34.1 50.7-29.1z"/></g>
      </svg>
    ),
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
  },
  {
    id: "binance",
    label: "Binance Pay",
    description: "Cripto · USDT / BNB",
    icon: (
      <svg viewBox="0 0 126.61 126.61" className="w-7 h-7 fill-current" aria-hidden="true">
        <g fill="currentColor">
          <path d="m38.73 53.2 24.59-24.58 24.6 24.6 14.3-14.31-38.9-38.91-38.9 38.9z"/>
          <path d="m0 63.31 14.3-14.31 14.31 14.31-14.31 14.3z"/>
          <path d="m38.73 73.41 24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88z"/>
          <path d="m98 63.31 14.3-14.31 14.31 14.3-14.31 14.32z"/>
          <path d="m77.83 63.3-14.51-14.52-10.73 10.73-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z"/>
        </g>
      </svg>
    ),
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
  {
    id: "efectivo",
    label: "Efectivo (USD, Bs.) / POS",
    description: "Al recibir el repuesto",
    icon: <Banknote className="w-7 h-7" strokeWidth={1.8} />,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
]

export default function PaymentTrustBand() {
  return (
    <section
      aria-label="Métodos de pago aceptados"
      className="bg-[#0d0d0d] border-y border-zinc-800/60 py-12 px-4 md:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Headline + lock icon ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1">
              Métodos de Pago
            </p>
            <h2 className="text-white text-xl md:text-2xl font-bold leading-tight">
              Compra con seguridad.{" "}
              <span className="text-zinc-400 font-normal">
                Pagos rápidos y a tu medida.
              </span>
            </h2>
          </div>

          {/* Trust seal */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 self-start sm:self-auto whitespace-nowrap">
            <ShieldCheck
              className="w-4 h-4 text-[#25D366]"
              strokeWidth={2}
              aria-hidden="true"
            />
            Transacción segura
          </div>
        </div>

        {/* ── Payment method grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              className={`
                flex flex-col items-center gap-2.5
                rounded-xl p-4 border
                transition-transform duration-150 hover:-translate-y-0.5
                ${method.bg}
              `}
            >
              <span className={method.color} aria-hidden="true">
                {method.icon}
              </span>
              <div className="text-center">
                <p className="text-white text-sm font-semibold leading-tight">
                  {method.label}
                </p>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom micro-copy ── */}
        <p className="text-center text-zinc-600 text-xs mt-6">
          ¿Dudas sobre tu método de pago?{" "}
          <a
            href={buildWhatsAppURL("Hola, quisiera consultar los métodos de pago disponibles.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] hover:underline"
          >
            Consúltanos por WhatsApp
          </a>
        </p>
      </div>
    </section>
  )
}
