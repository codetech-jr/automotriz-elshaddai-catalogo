import { MetadataRoute } from "next";

// ─── DEFINICIÓN DE TIPOS ESTRICTOS ───────────────────────────────────────────
type MarcaSlug = "toyota" | "chery" | "ford" | "chevrolet" | "hyundai" | "volkswagen" | "daewoo";

interface RepuestoSitemap {
  marca_slug: MarcaSlug;
  pieza_slug: string;
  urgency_vial: boolean;
  updated_at: Date;
}

// ─── CONSTANTE URL BASE ──────────────────────────────────────────────────────
const BASE_URL = "https://automotriz-elshaddai-catalogo.vercel.app";

// ─── SIMULACIÓN DE CONSULTA COMPLETA A SUPABASE (ALL REPUESTOS) ──────────────
// En el futuro, aquí realizarás una consulta real a Supabase:
// const { data } = await supabase.from('repuestos').select('marca_slug, pieza_slug, urgency_vial, updated_at')
async function getAllRepuestos(): Promise<RepuestoSitemap[]> {
  return [
    {
      marca_slug: "toyota",
      pieza_slug: "tripoides-corolla-irani",
      urgency_vial: true, // 🚨 Pieza crítica de auxilio/emergencia
      updated_at: new Date("2026-06-25"),
    },
    {
      marca_slug: "daewoo",
      pieza_slug: "pastillas-freno-cielo",
      urgency_vial: true, // 🚨 Pieza crítica de seguridad vial
      updated_at: new Date("2026-06-28"),
    },
    {
      marca_slug: "chery",
      pieza_slug: "bomba-agua-orinoco",
      urgency_vial: true, // 🚨 Recalentamiento/Varado
      updated_at: new Date("2026-06-30"),
    },
    {
      marca_slug: "hyundai",
      pieza_slug: "correa-tiempo-getz",
      urgency_vial: true, // 🚨 Motor inoperable
      updated_at: new Date("2026-07-01"),
    },
    {
      marca_slug: "volkswagen",
      pieza_slug: "filtro-aceite-gol",
      urgency_vial: false,
      updated_at: new Date("2026-07-02"),
    },
    {
      marca_slug: "ford",
      pieza_slug: "amortiguador-explorer",
      urgency_vial: false,
      updated_at: new Date("2026-06-20"),
    },
    {
      marca_slug: "chevrolet",
      pieza_slug: "estopera-cigueñal-aveo",
      urgency_vial: false,
      updated_at: new Date("2026-06-22"),
    },
  ];
}

// ─── CONSTRUCTOR MAESTRO DEL XML SITEMAP ─────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModifiedGlobal = new Date();

  // GRUPO 1: Rutas Estáticas de Fuerte Jerarquía (Core)
  const coreRoutes = [
    {
      url: BASE_URL,
      lastModified: lastModifiedGlobal,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/auxilio-vial-tuy`,
      lastModified: lastModifiedGlobal,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/delivery-charallave`,
      lastModified: lastModifiedGlobal,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // GRUPO 2: Categorías Madre de Marcas Clave
  const marcas: MarcaSlug[] = ["toyota", "chery", "ford", "chevrolet", "hyundai", "volkswagen", "daewoo"];
  const categoryRoutes = marcas.map((marca) => ({
    url: `${BASE_URL}/marcas/${marca}`,
    lastModified: lastModifiedGlobal,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // GRUPO 3: La Araña Dinámica (Productos del Catálogo)
  const repuestos = await getAllRepuestos();
  const productRoutes = repuestos.map((repuesto) => {
    // ✅ HACK CRÍTICO SEO: Otorgamos 0.9 a piezas urgentes (varado) para indexación y crawling prioritario
    const priority = repuesto.urgency_vial ? 0.9 : 0.6;
    
    return {
      url: `${BASE_URL}/${repuesto.marca_slug}/${repuesto.pieza_slug}`,
      lastModified: repuesto.updated_at,
      changeFrequency: "weekly" as const,
      priority: priority,
    };
  });

  // Retornamos la unión completa de los 3 grupos ordenados jerárquicamente
  return [...coreRoutes, ...categoryRoutes, ...productRoutes];
}
