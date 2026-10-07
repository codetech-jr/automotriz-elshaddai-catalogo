import { MetadataRoute } from "next";

// ─── DEFINICIÓN DE TIPOS ESTRICTOS ───────────────────────────────────────────
type MarcaSlug = "toyota" | "chery" | "ford" | "chevrolet" | "hyundai" | "volkswagen" | "daewoo" | "renault" | "jeep";

interface RepuestoSitemap {
  marca_slug: MarcaSlug;
  pieza_slug: string;
  urgency_vial: boolean;
  updated_at: Date;
}

// ─── CONSTANTE URL BASE ──────────────────────────────────────────────────────
const BASE_URL = "https://www.automotrizelshaddai.com.ve";

// ─── CONSULTA DE PRODUCTOS DEL CATÁLOGO ──────────────────────────────────────
async function getAllRepuestos(): Promise<RepuestoSitemap[]> {
  return [
    // Toyota
    {
      marca_slug: "toyota",
      pieza_slug: "tripoides-corolla-irani",
      urgency_vial: true,
      updated_at: new Date("2026-06-25"),
    },
    {
      marca_slug: "toyota",
      pieza_slug: "pastillas-freno-corolla",
      urgency_vial: true,
      updated_at: new Date("2026-06-25"),
    },
    {
      marca_slug: "toyota",
      pieza_slug: "correa-unica-hilux",
      urgency_vial: true,
      updated_at: new Date("2026-06-25"),
    },
    // Chevrolet
    {
      marca_slug: "chevrolet",
      pieza_slug: "tripoides-aveo",
      urgency_vial: true,
      updated_at: new Date("2026-06-22"),
    },
    {
      marca_slug: "chevrolet",
      pieza_slug: "pastillas-freno-corsa",
      urgency_vial: true,
      updated_at: new Date("2026-06-22"),
    },
    {
      marca_slug: "chevrolet",
      pieza_slug: "estopera-cigueñal-optra",
      urgency_vial: false,
      updated_at: new Date("2026-06-22"),
    },
    {
      marca_slug: "chevrolet",
      pieza_slug: "bomba-agua-silverado",
      urgency_vial: true,
      updated_at: new Date("2026-06-22"),
    },
    // Ford
    {
      marca_slug: "ford",
      pieza_slug: "bomba-agua-fiesta",
      urgency_vial: true,
      updated_at: new Date("2026-06-20"),
    },
    {
      marca_slug: "ford",
      pieza_slug: "amortiguador-explorer",
      urgency_vial: false,
      updated_at: new Date("2026-06-20"),
    },
    // Chery
    {
      marca_slug: "chery",
      pieza_slug: "correa-tiempo-orinoco",
      urgency_vial: true,
      updated_at: new Date("2026-06-30"),
    },
    {
      marca_slug: "chery",
      pieza_slug: "bujias-tiggo",
      urgency_vial: false,
      updated_at: new Date("2026-06-30"),
    },
    // Hyundai
    {
      marca_slug: "hyundai",
      pieza_slug: "correa-tiempo-getz",
      urgency_vial: true,
      updated_at: new Date("2026-07-01"),
    },
    {
      marca_slug: "hyundai",
      pieza_slug: "pastillas-freno-accent",
      urgency_vial: true,
      updated_at: new Date("2026-07-01"),
    },
    // Volkswagen
    {
      marca_slug: "volkswagen",
      pieza_slug: "tripoide-gol",
      urgency_vial: true,
      updated_at: new Date("2026-07-02"),
    },
    {
      marca_slug: "volkswagen",
      pieza_slug: "filtro-aceite-gol",
      urgency_vial: false,
      updated_at: new Date("2026-07-02"),
    },
    // Daewoo
    {
      marca_slug: "daewoo",
      pieza_slug: "pastillas-freno-cielo",
      urgency_vial: true,
      updated_at: new Date("2026-06-28"),
    },
    {
      marca_slug: "daewoo",
      pieza_slug: "tripoides-lanos",
      urgency_vial: true,
      updated_at: new Date("2026-06-28"),
    },
    // Renault
    {
      marca_slug: "renault",
      pieza_slug: "kit-tiempo-logan",
      urgency_vial: true,
      updated_at: new Date("2026-08-01"),
    },
    {
      marca_slug: "renault",
      pieza_slug: "pastillas-freno-logan",
      urgency_vial: true,
      updated_at: new Date("2026-08-01"),
    },
    // Jeep
    {
      marca_slug: "jeep",
      pieza_slug: "pastillas-freno-grand-cherokee",
      urgency_vial: true,
      updated_at: new Date("2026-08-02"),
    },
    {
      marca_slug: "jeep",
      pieza_slug: "amortiguadores-jeep-liberty",
      urgency_vial: false,
      updated_at: new Date("2026-08-02"),
    },
  ];
}

// ─── CONSTRUCTOR MAESTRO DEL XML SITEMAP ─────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModifiedGlobal = new Date();

  // GRUPO 1: Rutas Estáticas Reales de Fuerte Jerarquía (Core)
  const coreRoutes = [
    {
      url: BASE_URL,
      lastModified: lastModifiedGlobal,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/catalogo`,
      lastModified: lastModifiedGlobal,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios`,
      lastModified: lastModifiedGlobal,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: lastModifiedGlobal,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/quienes-somos`,
      lastModified: lastModifiedGlobal,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: lastModifiedGlobal,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // GRUPO 2: Categorías Madre de Marcas Clave
  const marcas: MarcaSlug[] = [
    "toyota",
    "chery",
    "ford",
    "chevrolet",
    "hyundai",
    "volkswagen",
    "daewoo",
    "renault",
    "jeep",
  ];
  const categoryRoutes = marcas.map((marca) => ({
    url: `${BASE_URL}/marcas/${marca}`,
    lastModified: lastModifiedGlobal,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // GRUPO 3: La Araña Dinámica (Productos del Catálogo)
  const repuestos = await getAllRepuestos();
  const productRoutes = repuestos.map((repuesto) => {
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
