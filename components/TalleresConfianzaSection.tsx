// ─── TalleresConfianzaSection Component ───────────────────────────────────────
// Certified Mechanic Network testimonals & directory
// Rationale:
//   • Social Proof: Displaying certified mechanic shops that use and trust El Shaddai
//     autoparts instantly adds local authority and B2B credibility.
//   • Local SEO Target: Data structures designed to complement LocalBusiness schemas.
// ─────────────────────────────────────────────────────────────────────────────

import { CheckCircle, MapPin, Star } from "lucide-react"
import { buildWhatsAppURL } from "@/lib/config"

export default function TalleresConfianzaSection() {
  const talleres = [
    {
      id: "mecanica-precision",
      initials: "MP",
      name: "Mecánica Precisión",
      location: "Charallave",
      specialty: "Motor y Transmisión",
      quote: "Llevan años siendo nuestro proveedor de confianza. Los repuestos siempre llegan en tiempo y con garantía.",
      rating: 5,
      reviews: 48,
    },
    {
      id: "auto-center-sur",
      initials: "AC",
      name: "Auto Center Sur",
      location: "Cúa",
      specialty: "Frenos y Suspensión",
      quote: "La diferencia está en que ellos SÍ saben qué pieza exacta necesita cada carro. Cero errores.",
      rating: 5,
      reviews: 63,
    },
    {
      id: "servicio-express",
      initials: "SE",
      name: "Servicio Express Tuy",
      location: "Santa Teresa",
      specialty: "Eléctrico y Diagnóstico",
      quote: "El delivery es increíble. Pido por WhatsApp y en horas tengo el repuesto en el taller.",
      rating: 5,
      reviews: 31,
    },
  ]

  return (
    <section
      id="talleres"
      aria-labelledby="talleres-heading"
      className="bg-[#0d0d0d] py-16 px-4 md:px-8 border-t border-zinc-900/60"
      data-schema-type="LocalBusiness"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
            <span className="text-[#25D366] text-xs font-bold uppercase tracking-widest">
              Red de aliados verificados
            </span>
          </div>
          <h2 id="talleres-heading" className="text-2xl md:text-3xl font-black text-white">
            Talleres que confían en El Shaddai
          </h2>
          <p className="text-zinc-400 mt-2 max-w-xl text-sm">
            Mecánicos profesionales que nos eligen a diario para sus trabajos más exigentes.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {talleres.map(taller => (
            <article
              key={taller.id}
              aria-label={`Testimonio de ${taller.name}`}
              data-schema-name={taller.name}
              data-schema-location={taller.location}
              className="bg-[#141414] rounded-2xl p-5 border border-zinc-800/80 flex flex-col gap-4 hover:border-zinc-700 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-200"
            >
              {/* Header: Avatar + Name */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700 text-white font-black text-base flex items-center justify-center">
                  {taller.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm leading-tight">{taller.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[#25D366] text-[10px] font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      Aliado
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-500 text-[10px]">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {taller.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialty Tag */}
              <span className="self-start text-[10px] font-bold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full">
                {taller.specialty}
              </span>

              {/* Quote */}
              <blockquote className="flex-1">
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  &ldquo;{taller.quote}&rdquo;
                </p>
              </blockquote>

              {/* Rating */}
              <footer className="flex items-center justify-between pt-3 border-t border-zinc-900">
                <div className="flex items-center gap-0.5" aria-label={`Calificación: ${taller.rating} de 5 estrellas`}>
                  {[...Array(taller.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-zinc-600 text-xs">{taller.reviews} reseñas</span>
              </footer>
            </article>
          ))}
        </div>

        {/* Bottom B2B CTA */}
        <div className="mt-8 text-center">
          <a
            href={buildWhatsAppURL("Hola, soy dueño de un taller mecánico y me interesa convertirme en taller aliado de El Shaddai. ¿Cómo funciona?")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs transition-colors border border-zinc-800 hover:border-zinc-600 rounded-full px-5 py-2.5"
          >
            <CheckCircle className="w-4 h-4" />
            ¿Eres un taller? Únete a nuestra red
          </a>
        </div>
      </div>
    </section>
  )
}
