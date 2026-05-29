// ─── SiteFooter Component ─────────────────────────────────────────────────────
// The Global Footer for Automotriz El Shaddai
// Rationale:
//   • CONSISTENCY: Rendering this globally at layout level ensures contact
//     details and trust signals are persistent across all E-commerce paths.
//   • LOCAL SCHEMA INTEGRITY: Complements the Local SEO schema signals with
//     a corresponding semantic footer containing exact location and hours.
// ─────────────────────────────────────────────────────────────────────────────

import { Wrench, Instagram, Facebook, MapPin, Phone, Clock, ChevronRight, ShieldCheck, CreditCard } from "lucide-react"
import { BUSINESS, buildWhatsAppURL } from "@/lib/config"

export default function SiteFooter() {
  const whatsappUrl = buildWhatsAppURL("Hola, quisiera hacer una consulta desde la web.")

  return (
    <footer className="relative bg-[#0a0a0a] border-t border-[#252b3b]/60 pt-16 pb-8 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-[300px] bg-[#E60000]/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer w-max">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-850 flex items-center justify-center bg-zinc-950 group-hover:scale-105 transition-all duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-el-shaddai.jpg"
                  alt="Automotriz El Shaddai Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-xl tracking-tight leading-none">
                  El Shaddai
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest leading-none mt-1 uppercase">
                  Automotriz
                </span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Tu aliado estratégico en repuestos para Chery, Toyota, Ford y Chevrolet en los Valles del Tuy. Garantizamos calidad y rapidez.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Síguenos en Instagram" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Síguenos en Facebook" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all">
                <Facebook className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "Catálogo de Repuestos", path: "/catalogo" },
                { name: "Nuestros Servicios", path: "/servicios" },
                { name: "Quiénes Somos", path: "/quienes-somos" },
                { name: "Contacto y Ubicación", path: "/contacto" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="group flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-zinc-700 group-hover:text-[#E60000] transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hours & Service */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Horario de Atención
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm border-b border-zinc-800/60 pb-3">
                <span className="text-zinc-400">Lunes - Viernes</span>
                <span className="text-white font-medium">{BUSINESS.hours.weekdays.replace("Lun-Vie: ", "")}</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-zinc-800/60 pb-3">
                <span className="text-zinc-400">Sábados</span>
                <span className="text-white font-medium">{BUSINESS.hours.saturday.replace("Sábados: ", "")}</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Domingos</span>
                <span className="text-zinc-600 italic">Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-500" />
              Contacto Directo
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-400 leading-relaxed">
                  {BUSINESS.location}
                </span>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm group">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-zinc-400 group-hover:text-white transition-colors">
                    {BUSINESS.phone}
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <CreditCard className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                  <span className="text-zinc-400">
                    Pago Móvil, Zelle, Efectivo, Punto
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Automotriz El Shaddai. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
              Repuestos de Confianza en los Valles del Tuy
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
