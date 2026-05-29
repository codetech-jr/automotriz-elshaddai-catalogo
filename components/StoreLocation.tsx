// ─── StoreLocation Component ──────────────────────────────────────────────────
// Local SEO Powerhouse for Automotriz El Shaddai
// Rationale:
//   • Local SEO Pack: Local Schema markup (AutoPartsStore JSON-LD) ensures
//     strong local relevance, boosting ranks on Google's Local Pack.
//   • Semantics & Accessibility: Structured address (<address>) and hours (<time>)
//     ensure perfect semantic indexing and accessibility for screen readers.
//   • CRO / Trust: A direct interactive map + micro-animated WhatsApp button
//     destroys friction, converting browsing traffic into direct local leads.
//   • Dark-Theme Maps Hack: Google Maps iframe is visually converted to dark mode
//     using standard CSS filters, maintaining high-end consistent aesthetics.
// ─────────────────────────────────────────────────────────────────────────────

import { MapPin, Clock, MessageCircle } from "lucide-react"
import { BUSINESS, buildWhatsAppURL } from "@/lib/config"

export default function StoreLocation() {
  const whatsappMessage = "¡Hola! Quisiera recibir asesoría inmediata y confirmar la dirección física de la tienda en Charallave."
  const whatsappUrl = buildWhatsAppURL(whatsappMessage)

  // JSON-LD local schema for AutoPartsStore
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "name": BUSINESS.name,
    "image": "https://automotrizelshaddai.com/images/og-image.jpg", // Replace with absolute og:image when deployed
    "@id": "https://automotrizelshaddai.com/#store-location",
    "url": "https://automotrizelshaddai.com",
    "telephone": `+${BUSINESS.phone}`,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle principal",
      "addressLocality": "Charallave",
      "addressRegion": "Miranda",
      "postalCode": "1210",
      "addressCountry": "VE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.244625",
      "longitude": "-66.860682"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": `+${BUSINESS.phone}`,
      "contactType": "sales",
      "areaServed": "VE",
      "availableLanguage": "Spanish"
    }
  }

  return (
    <section 
      id="store-location" 
      aria-labelledby="location-heading" 
      className="bg-[var(--surface-base,#0d0d0d)] py-16 px-4 md:px-8 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Schema markup inject */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Columna Izquierda (Info de Contacto y SEO) */}
          <div className="bg-[var(--surface-card,#141414)] rounded-2xl border border-[var(--surface-border,#27272a)] p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-zinc-700">
            <div>
              {/* Local SEO badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
                  Tienda Física & Soporte Local
                </span>
              </div>

              {/* Title */}
              <h2 id="location-heading" className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                Visítanos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">{BUSINESS.name}</span>
              </h2>

              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                Encuentra el stock más completo de repuestos para Chery, Toyota, Ford, Chevrolet, Hyundai y Volkswagen en los Valles del Tuy. Garantizamos atención inmediata y asesoría experta directa en tienda o despacho exprés.
              </p>

              {/* Info Cards */}
              <div className="space-y-4 mb-8">
                {/* Location Card */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:bg-zinc-900/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Ubicación Física</h3>
                    <address className="text-white text-sm md:text-base font-semibold not-italic">
                      Diagonal al MRW, Residencias Don Alejandro, Charallave, Miranda
                    </address>
                  </div>
                </div>

                {/* Clock Card */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:bg-zinc-900/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Horario de Atención</h3>
                    <p className="text-white text-sm md:text-base font-semibold">
                      <time dateTime="Mo-Sa 08:00-18:00">Lun-Sáb 8am-6pm</time>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Button */}
            <div className="mt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_4px_25px_rgba(37,211,102,0.3)] active:scale-[0.98] min-h-[56px]"
                aria-label="Contactar a Automotriz El Shaddai por WhatsApp para confirmar dirección o recibir asesoría"
              >
                {/* Pulse Glow Effect */}
                <span className="absolute inset-0 rounded-xl bg-[#25D366] opacity-0 group-hover:opacity-20 group-hover:scale-105 transition-all duration-300 animate-ping" />
                
                <MessageCircle className="w-6 h-6 animate-bounce-gentle" />
                <span className="text-sm md:text-base tracking-wide">
                  Asesoría Inmediata o Confirmar Dirección
                </span>
              </a>
            </div>
          </div>

          {/* Columna Derecha (Mapa Google Maps) */}
          <div className="relative h-[350px] lg:h-auto min-h-[350px] bg-[var(--surface-card,#141414)] rounded-2xl border border-[var(--surface-border,#27272a)] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-zinc-700 group">
            {/* Dark Mode Google Map Iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.210187519597!2d-66.8606823!3d10.244625100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2aef4dcaae143d%3A0x1371618808ce1fba!2sAUTOMOTRIZ%20EL%20SHADDAI!5e0!3m2!1ses!2sve!4v1780070207258!5m2!1ses!2sve"
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                filter: "grayscale(1) invert(0.9) contrast(1.1) brightness(0.9)"
              }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full opacity-80 group-hover:opacity-95 transition-opacity duration-300"
              title="Ubicación de Automotriz El Shaddai en Google Maps"
            />
            
            {/* Glassmorphic Map Control Indicator Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between pointer-events-none transition-all duration-300 group-hover:-translate-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-[11px] text-zinc-300 font-semibold tracking-wide uppercase">
                  Valles del Tuy, Miranda
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">
                Mapa Interactivo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
