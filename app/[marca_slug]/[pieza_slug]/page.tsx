import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  MessageCircle, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CreditCard, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2 
} from "lucide-react";

// ─── 1. INTERFACES DE TYPESCRIPT CON TIPADO ESTRICTO DE MARCAS ───────────────

export type MarcaSlug = "toyota" | "chery" | "ford" | "chevrolet" | "hyundai" | "volkswagen" | "daewoo";

export interface Repuesto {
  id: string;
  nombre: string;
  marca_slug: MarcaSlug;
  pieza_slug: string;
  descripcion: string;
  urgency_vial: boolean;
  stock: string;
  sku: string;
  modelos_compatibles: string[];
  imagen_url: string;
}

export function isValidMarcaSlug(slug: string): slug is MarcaSlug {
  const marcasValidas: MarcaSlug[] = ["toyota", "chery", "ford", "chevrolet", "hyundai", "volkswagen", "daewoo"];
  return marcasValidas.includes(slug as MarcaSlug);
}

// ─── 2. FUNCIÓN DE LECTURA DE BASE DE DATOS (MOCK SIMULADO DE SUPABASE) ────────
export async function getRepuesto(marcaSlug: string, piezaSlug: string): Promise<Repuesto | null> {
  try {
    if (!isValidMarcaSlug(marcaSlug)) {
      return null;
    }

    const esUrgente = 
      piezaSlug.includes("tripoide") || 
      piezaSlug.includes("correa") || 
      piezaSlug.includes("bateria") || 
      piezaSlug.includes("bomba-agua") ||
      piezaSlug.includes("pastillas");

    let modelos: string[] = [];
    let nombrePiezaBase = "Repuesto Automotriz";

    switch (marcaSlug) {
      case "toyota":
        modelos = [
          "Corolla 1.6 (Baby, Araya, Sky)",
          "Corolla 1.8 (Sensation, Explosion)",
          "Corolla 12-16 (Iraní/Nacional/Importado)",
          "Hilux (Kavak/2.7)",
          "4Runner (SR5/Limited)",
          "Merú",
          "Prado",
          "Terios 1.3 / 1.5 (Daihatsu)",
          "Yaris (Sol, Belta)"
        ];
        nombrePiezaBase = piezaSlug.includes("tripoide") 
          ? "Tripoides de Corolla (30x23 Estriados)" 
          : piezaSlug.includes("pastillas") 
          ? "Pastillas de Freno Toyota Ceramic" 
          : "Correa de Distribución / Tiempos Toyota";
        break;

      case "chevrolet":
        modelos = [
          "Corsa 1.4 / 1.6",
          "Aveo (Speed, LT, 3 Puertas)",
          "Optra (Design, Limited, Advance)",
          "Spark 1.0",
          "Montana 1.8",
          "Meriva",
          "Luv Dmax"
        ];
        nombrePiezaBase = piezaSlug.includes("tripoide") 
          ? "Tripoides Chevrolet Completos" 
          : piezaSlug.includes("pastillas") 
          ? "Pastillas de Freno Delanteras Aveo/Corsa" 
          : "Estopera de Cigüeñal Chevrolet";
        break;

      case "ford":
        modelos = [
          "Fiesta (Power, Max, Move)",
          "Explorer (Eddie Bauer, XLT)",
          "EcoSport",
          "Ka 1.6",
          "F-150 (Fortaleza, FX4)",
          "F-350 (Tritón)",
          "Fusion",
          "Laser"
        ];
        nombrePiezaBase = piezaSlug.includes("bomba-agua")
          ? "Bomba de Agua Ford Fiesta Power/Move"
          : "Amortiguadores Delanteros Motorcraft";
        break;

      case "chery":
        modelos = [
          "Orinoco 1.8 (Sedán)",
          "Arauca 1.3",
          "Tiggo 3",
          "Tiggo 7"
        ];
        nombrePiezaBase = piezaSlug.includes("correa") 
          ? "Correa de Tiempo Chery (116 Dientes)" 
          : "Bujías de Ignición Original Chery";
        break;

      case "hyundai":
        modelos = [
          "Accent 1.5",
          "Getz 1.3 / 1.6",
          "Tucson 2.0 (Dual)",
          "Excel 1.5"
        ];
        nombrePiezaBase = piezaSlug.includes("pastillas") 
          ? "Pastillas de Freno Delanteras Getz" 
          : "Kit de Embrague Hyundai Getz";
        break;

      case "volkswagen":
        modelos = [
          "Gol 1.8 (G3, G4)",
          "Golf 2.0",
          "CrossFox 1.6"
        ];
        nombrePiezaBase = piezaSlug.includes("tripoide") 
          ? "Junta Homocinética / Tripoide Gol" 
          : "Filtro de Aceite Volkswagen";
        break;

      case "daewoo":
        modelos = [
          "Cielo 1.5 (GTI/GLX)",
          "Lanos 1.5",
          "Nubira 1.6 / 2.0"
        ];
        nombrePiezaBase = piezaSlug.includes("pastillas")
          ? "Pastillas de Freno Daewoo Cielo/Lanos"
          : piezaSlug.includes("tripoide")
          ? "Tripoides Daewoo Lanos"
          : "Estopera de Árbol de Levas Daewoo";
        break;

      default:
        return null;
    }

    return {
      id: `rep_${marcaSlug}_${Date.now().toString().slice(-6)}`,
      nombre: nombrePiezaBase,
      marca_slug: marcaSlug,
      pieza_slug: piezaSlug,
      descripcion: `Repuesto nuevo de alta gama para ${marcaSlug.toUpperCase()}. Diseñado para las condiciones de las vías locales de los Valles del Tuy (Charallave, Cúa, Ocumare).`,
      urgency_vial: esUrgente,
      stock: "Disponible",
      sku: `SHADDAI-${marcaSlug.toUpperCase()}-${piezaSlug.substring(0, 5).toUpperCase()}`,
      modelos_compatibles: modelos,
      imagen_url: `/product-placeholder.jpg`
    };
  } catch (e) {
    return null;
  }
}

// ─── 3. PARÁMETROS DE LA RUTA Y GENERATEMETADATA (SEO SSR) ────────────────────
interface PageProps {
  params: {
    marca_slug: string;
    pieza_slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marca_slug, pieza_slug } = params;
  const repuesto = await getRepuesto(marca_slug, pieza_slug);

  if (!repuesto) {
    return {
      title: "Repuesto no encontrado | Automotriz El Shaddai",
      robots: { index: false }
    };
  }

  const marcaCapitalizada = repuesto.marca_slug.charAt(0).toUpperCase() + repuesto.marca_slug.slice(1);
  const modelosStr = repuesto.modelos_compatibles.slice(0, 3).join(", ");
  const siteUrl = `https://automotriz-elshaddai-catalogo.vercel.app/${repuesto.marca_slug}/${repuesto.pieza_slug}`;

  let title = "";
  let metaDescription = "";

  if (repuesto.urgency_vial) {
    title = `🚨 URGENTE: ${repuesto.nombre} ${marcaCapitalizada} | Varado en Charallave`;
    metaDescription = `⚠️ ¿Varado en los Valles del Tuy? Conseguimos tus ${repuesto.nombre} ${marcaCapitalizada} (${modelosStr}) con Delivery Inmediato en Charallave/Cúa. Cotiza vía WhatsApp ⚡`;
  } else {
    title = `${repuesto.nombre} ${marcaCapitalizada} Charallave · Tuy | El Shaddai`;
    metaDescription = `Comprar ${repuesto.nombre} para ${marcaCapitalizada} (${modelosStr}) en Charallave. Repuestos garantizados con delivery rápido a todo el Tuy. Sin chiveras, cotiza por WhatsApp ✓`;
  }

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: siteUrl,
      type: "article",
    },
  };
}

// ─── 4. COMPONENTE PRINCIPAL DE LA PÁGINA (SSR SERVER COMPONENT) ──────────────
export default async function ProductPage({ params }: PageProps) {
  const { marca_slug, pieza_slug } = params;
  const repuesto = await getRepuesto(marca_slug, pieza_slug);

  if (!repuesto) {
    notFound();
  }

  const marcaCapitalizada = repuesto.marca_slug.charAt(0).toUpperCase() + repuesto.marca_slug.slice(1);
  const siteUrl = `https://automotriz-elshaddai-catalogo.vercel.app/${repuesto.marca_slug}/${repuesto.pieza_slug}`;

  // WhatsApp Config
  const waPhoneNumber = "584123715469"; // Usando BUSINESS.phone global
  const mensajeBase = `Hola Automotriz El Shaddai, quiero cotizar:
- Repuesto: ${repuesto.nombre} (${marcaCapitalizada})
- SKU: ${repuesto.sku}
- Compatibilidad: ${repuesto.modelos_compatibles.slice(0, 4).join(", ")}
- Origen de consulta: Catálogo Web (${pieza_slug})
¿Tienen disponibilidad y precio para entrega en Charallave / Valles del Tuy?`;
  
  const waLink = `https://wa.me/${waPhoneNumber}?text=${encodeURIComponent(mensajeBase)}`;

  // HACK LEGAL SCHEMA MARKUP
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}#product`,
    "name": `${repuesto.nombre} ${marcaCapitalizada} - Repuestos Charallave`,
    "image": [`https://automotriz-elshaddai-catalogo.vercel.app/images/repuestos/${marca_slug}/${pieza_slug}.webp`],
    "description": `Cotización rápida de ${repuesto.nombre} para ${marcaCapitalizada} (${repuesto.modelos_compatibles.join(", ")}) en Charallave y Valles del Tuy. Garantía de tienda física.`,
    "sku": repuesto.sku,
    "mpn": repuesto.sku,
    "brand": {
      "@type": "Brand",
      "name": marcaCapitalizada
    },
    "offers": {
      "@type": "Offer",
      "@id": `${siteUrl}#offer`,
      "price": "0.00",
      "priceCurrency": "USD",
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "url": siteUrl,
      "seller": {
        "@type": "AutoPartsStore",
        "name": "Automotriz El Shaddai",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Charallave",
          "addressRegion": "Miranda",
          "addressCountry": "VE"
        }
      },
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "0.00",
        "priceCurrency": "USD",
        "description": "Precio dinámico y variable según stock diario. Requiere cotización directa vía WhatsApp."
      }
    },
    "potentialAction": {
      "@type": "OrderAction",
      "name": "Cotizar por WhatsApp",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": waLink,
        "actionPlatform": [
          "https://schema.org/MobileWebPlatform",
          "https://schema.org/IOSPlatform",
          "https://schema.org/AndroidPlatform"
        ]
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] pt-28 pb-16 px-4 md:px-8">
      {/* JSON-LD Schema para GSC */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Breadcrumb de navegación */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-amber-500 transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/catalogo" className="hover:text-amber-500 transition-colors">Catálogo</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-400 capitalize">{marca_slug}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-300 font-semibold truncate max-w-[200px]">{repuesto.nombre}</span>
        </nav>

        {/* Ficha Principal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#18181b] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Fondo decorativo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Columna Izquierda: Galería e Imagen */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="aspect-square bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden flex items-center justify-center relative group p-4">
              <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-lg">
                <span className="text-4xl mb-3">📦</span>
                <span className="text-sm font-bold text-zinc-300">{repuesto.nombre}</span>
                <span className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{marcaCapitalizada}</span>
                <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-amber-500 font-mono mt-3">{repuesto.sku}</span>
              </div>
            </div>
            
            {/* Beneficio de Compra Local */}
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantía de Tienda Física</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Olvídate de comprar a ciegas en chiveras. En Automotriz El Shaddai ofrecemos repuestos nuevos de calidad garantizada para que compres con total tranquilidad.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Información del Producto */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Badge de Emergencia Vial */}
              {repuesto.urgency_vial ? (
                <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-1 rounded-full font-extrabold tracking-wide uppercase animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  🚨 Varado / Auxilio Vial Inmediato
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs px-3.5 py-1 rounded-full font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Mantenimiento Programado
                </div>
              )}

              {/* Título Principal */}
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {repuesto.nombre} <span className="text-amber-500">{marcaCapitalizada}</span>
              </h1>

              {/* SKU & Categoría */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span>SKU: <strong className="text-zinc-300 font-mono">{repuesto.sku}</strong></span>
                <span>•</span>
                <span>Disponibilidad: <strong className="text-emerald-400 font-bold">{repuesto.stock}</strong></span>
              </div>

              {/* Modelos Compatibles (H2 SEO friendly) */}
              <div className="space-y-2 pt-2">
                <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                  🚗 Modelos Compatibles en Venezuela:
                </h2>
                <div className="flex flex-wrap gap-2">
                  {repuesto.modelos_compatibles.map((modelo, i) => (
                    <span 
                      key={i} 
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      {modelo}
                    </span>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <p className="text-sm text-zinc-400 leading-relaxed pt-2">
                {repuesto.descripcion}
              </p>
            </div>

            {/* Caja de Métodos de Pago y Despacho */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800/80 pt-6">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-300 uppercase">Delivery & Retiro</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Despacho inmediato en Charallave. Envíos programados a Cúa y Ocumare.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-300 uppercase">Métodos de Pago</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Pago Móvil, divisas en Efectivo, Zelle y Binance Pay.
                  </p>
                </div>
              </div>
            </div>

            {/* Acción de Cotización Dinámica por WhatsApp */}
            <div className="space-y-3 pt-4 border-t border-zinc-800/50">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-base md:text-lg py-4 px-6 rounded-xl transition duration-150 ease-in-out shadow-lg shadow-emerald-950/40 text-center cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span>Consultar Disponibilidad y Precio en WhatsApp</span>
              </a>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Sin pasarelas de pago lentas. Trato directo con expertos.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
