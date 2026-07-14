import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  MessageCircle, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Wrench, 
  ArrowRight, 
  HelpCircle, 
  AlertTriangle 
} from "lucide-react";

// ─── DEFINICIONES Y TIPOS ESTRICTOS ──────────────────────────────────────────
export type MarcaSlug = "toyota" | "chery" | "ford" | "chevrolet" | "hyundai" | "volkswagen" | "daewoo";

interface RepuestoResumen {
  id: string;
  nombre: string;
  pieza_slug: string;
  marca_slug: MarcaSlug;
  sku: string;
  urgency_vial: boolean;
  stock: string;
  modelos_compatibles: string[];
}

export function isValidMarcaSlug(slug: string): slug is MarcaSlug {
  const marcasValidas: MarcaSlug[] = ["toyota", "chery", "ford", "chevrolet", "hyundai", "volkswagen", "daewoo"];
  return marcasValidas.includes(slug as MarcaSlug);
}

// ─── CONSULTA SIMULADA DE DB POR MARCA (getRepuestosPorMarca) ────────────────
async function getRepuestosPorMarca(marcaSlug: string): Promise<RepuestoResumen[] | null> {
  if (!isValidMarcaSlug(marcaSlug)) {
    return null;
  }

  // Catálogo simulado de piezas asociadas a su marca madre
  const catalogoCompleto: Record<MarcaSlug, RepuestoResumen[]> = {
    toyota: [
      {
        id: "toy_1",
        nombre: "Tripoides de Corolla (30x23 Estriados)",
        pieza_slug: "tripoides-corolla-irani",
        marca_slug: "toyota",
        sku: "SHADDAI-TOY-TRIPO",
        urgency_vial: true, // Crítico
        stock: "Disponible",
        modelos_compatibles: ["Corolla 12-16 (Iraní)", "Sensation", "Baby Corolla"]
      },
      {
        id: "toy_2",
        nombre: "Pastillas de Freno Toyota Ceramic",
        pieza_slug: "pastillas-freno-corolla",
        marca_slug: "toyota",
        sku: "SHADDAI-TOY-PASTI",
        urgency_vial: true, // Crítico
        stock: "Disponible",
        modelos_compatibles: ["Corolla 1.8 Sensation", "Explosion 09-11", "Yaris"]
      },
      {
        id: "toy_3",
        nombre: "Correa de Única Hilux / Merú",
        pieza_slug: "correa-unica-hilux",
        marca_slug: "toyota",
        sku: "SHADDAI-TOY-CORRE",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Hilux 2.7 (2RZ / 3RZ)", "Merú 3.4", "Prado"]
      }
    ],
    chevrolet: [
      {
        id: "chv_1",
        nombre: "Tripoides Chevrolet Aveo Completos",
        pieza_slug: "tripoides-aveo",
        marca_slug: "chevrolet",
        sku: "SHADDAI-CHV-TRIPO",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Aveo (Speed, LT)", "Corsa 1.6"]
      },
      {
        id: "chv_2",
        nombre: "Pastillas de Freno Delanteras Aveo/Corsa",
        pieza_slug: "pastillas-freno-corsa",
        marca_slug: "chevrolet",
        sku: "SHADDAI-CHV-PASTI",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Corsa 1.4 / 1.6", "Aveo Speed", "Spark 1.0"]
      },
      {
        id: "chv_3",
        nombre: "Estopera de Cigüeñal Trasera Chevrolet",
        pieza_slug: "estopera-cigueñal-optra",
        marca_slug: "chevrolet",
        sku: "SHADDAI-CHV-ESTOP",
        urgency_vial: false,
        stock: "Bajo Pedido",
        modelos_compatibles: ["Optra Design", "Optra Limited", "Meriva 1.8"]
      }
    ],
    ford: [
      {
        id: "frd_1",
        nombre: "Bomba de Agua Ford Fiesta Power/Move",
        pieza_slug: "bomba-agua-fiesta",
        marca_slug: "ford",
        sku: "SHADDAI-FRD-BOMBA",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Fiesta Power 1.6", "Fiesta Max", "Fiesta Move"]
      },
      {
        id: "frd_2",
        nombre: "Amortiguadores Delanteros Motorcraft",
        pieza_slug: "amortiguador-explorer",
        marca_slug: "ford",
        sku: "SHADDAI-FRD-AMORT",
        urgency_vial: false,
        stock: "Disponible",
        modelos_compatibles: ["Explorer (Eddie Bauer / XLT)", "F-150 Fortaleza"]
      }
    ],
    chery: [
      {
        id: "chy_1",
        nombre: "Correa de Tiempo Chery (116 Dientes)",
        pieza_slug: "correa-tiempo-orinoco",
        marca_slug: "chery",
        sku: "SHADDAI-CHY-TIEMP",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Orinoco 1.8", "Tiggo 3 2.0"]
      },
      {
        id: "chy_2",
        nombre: "Bujías de Ignición Original Chery",
        pieza_slug: "bujias-tiggo",
        marca_slug: "chery",
        sku: "SHADDAI-CHY-BUJIA",
        urgency_vial: false,
        stock: "Disponible",
        modelos_compatibles: ["Tiggo 3", "Tiggo 7", "Arauca 1.3"]
      }
    ],
    hyundai: [
      {
        id: "hyu_1",
        nombre: "Correa de Tiempo Hyundai Getz",
        pieza_slug: "correa-tiempo-getz",
        marca_slug: "hyundai",
        sku: "SHADDAI-HYU-TIEMP",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Getz 1.3 / 1.6", "Accent 1.5"]
      },
      {
        id: "hyu_2",
        nombre: "Pastillas de Freno Delanteras Accent",
        pieza_slug: "pastillas-freno-accent",
        marca_slug: "hyundai",
        sku: "SHADDAI-HYU-PASTI",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Accent 1.5", "Excel 1.5"]
      }
    ],
    volkswagen: [
      {
        id: "vw_1",
        nombre: "Junta Homocinética / Tripoide Gol",
        pieza_slug: "tripoide-gol",
        marca_slug: "volkswagen",
        sku: "SHADDAI-VW-TRIPO",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Gol 1.8 (G3, G4)", "Saveiro 1.8"]
      },
      {
        id: "vw_2",
        nombre: "Filtro de Aceite Volkswagen",
        pieza_slug: "filtro-aceite-gol",
        marca_slug: "volkswagen",
        sku: "SHADDAI-VW-FILTR",
        urgency_vial: false,
        stock: "Disponible",
        modelos_compatibles: ["Gol 1.8", "Golf 2.0", "CrossFox 1.6"]
      }
    ],
    daewoo: [
      {
        id: "dae_1",
        nombre: "Pastillas de Freno Daewoo Cielo/Lanos",
        pieza_slug: "pastillas-freno-cielo",
        marca_slug: "daewoo",
        sku: "SHADDAI-DAE-PASTI",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Cielo 1.5", "Lanos 1.5", "Nubira 1.6"]
      },
      {
        id: "dae_2",
        nombre: "Tripoides Daewoo Lanos",
        pieza_slug: "tripoides-lanos",
        marca_slug: "daewoo",
        sku: "SHADDAI-DAE-TRIPO",
        urgency_vial: true,
        stock: "Disponible",
        modelos_compatibles: ["Lanos 1.5 (GTI)", "Cielo 1.5"]
      }
    ]
  };

  return catalogoCompleto[marcaSlug] || [];
}

// ─── 3. METADATA DINÁMICA & OPENGRAPH (generateMetadata) ─────────────────────
interface PageProps {
  params: {
    marca_slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marca_slug } = params;
  
  if (!isValidMarcaSlug(marca_slug)) {
    return {
      title: "Marca no encontrada | Automotriz El Shaddai",
      robots: { index: false }
    };
  }

  const marcaCapitalizada = marca_slug.charAt(0).toUpperCase() + marca_slug.slice(1);
  const title = `Repuestos y Autoperiquitos ${marcaCapitalizada} Charallave | Delivery Tuy`;
  const description = `Comprar repuestos nuevos para vehículos ${marcaCapitalizada} en los Valles del Tuy. Alternadores, tripoides, frenos y más. Delivery a Cúa y Ocumare. Cotiza por WhatsApp.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.automotrizelshaddai.com.ve/marcas/${marca_slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.automotrizelshaddai.com.ve/marcas/${marca_slug}`,
      type: "website",
    }
  };
}

// ─── 4. COMPONENTE PRINCIPAL (SERVER SIDE RENDERING) ──────────────────────────
export default async function BrandLanding({ params }: PageProps) {
  const { marca_slug } = params;

  if (!isValidMarcaSlug(marca_slug)) {
    notFound();
  }

  const repuestos = await getRepuestosPorMarca(marca_slug) || [];
  const marcaCapitalizada = marca_slug.charAt(0).toUpperCase() + marca_slug.slice(1);
  const siteUrl = `https://www.automotrizelshaddai.com.ve/marcas/${marca_slug}`;

  // WhatsApp Config
  const waPhoneNumber = "584123715469";
  const getWaLink = (nombrePiece: string, skuPiece: string) => {
    const mensaje = `Hola El Shaddai, estoy en la landing de ${marcaCapitalizada} y quiero cotizar:\n- Repuesto: ${nombrePiece}\n- SKU: ${skuPiece}\n¿Tienen disponibilidad para entregar en los Valles del Tuy?`;
    return `https://wa.me/${waPhoneNumber}?text=${encodeURIComponent(mensaje)}`;
  };

  // ─── SCHEMAS DUALES (CollectionPage + BreadcrumbList) ──────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://www.automotrizelshaddai.com.ve/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Catálogo",
        "item": "https://www.automotrizelshaddai.com.ve/catalogo"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": marcaCapitalizada,
        "item": siteUrl
      }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}#webpage`,
    "url": siteUrl,
    "name": `Repuestos ${marcaCapitalizada} en Charallave | Automotriz El Shaddai`,
    "description": `Catálogo de autopartes y consumibles nuevos para vehículos ${marcaCapitalizada} en Charallave y Valles del Tuy.`,
    "publisher": {
      "@type": "AutoPartsStore",
      "name": "Automotriz El Shaddai",
      "@id": "https://www.automotrizelshaddai.com.ve/#organization"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": repuestos.length,
      "itemListElement": repuestos.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": item.nombre,
          "sku": item.sku,
          "url": `https://www.automotrizelshaddai.com.ve/${item.marca_slug}/${item.pieza_slug}`,
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] pt-28 pb-16 px-4 md:px-8">
      {/* Inyección de Schemas Duales en el HTML inicial (SSR) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navegación Breadcrumb visual */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-amber-500 transition-colors">Inicio</Link>
          <span className="text-zinc-700">/</span>
          <Link href="/catalogo" className="hover:text-amber-500 transition-colors">Catálogo</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300 font-semibold uppercase">{marca_slug}</span>
        </nav>

        {/* Banner de Categoría / Header */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3">
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Silo de Repuestos
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Repuestos <span className="text-amber-500">{marcaCapitalizada}</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Consigue tripoides, pastillas de freno, correas y bombas de agua nuevas para tu {marcaCapitalizada} en Charallave. Evita las chiveras del Tuy y cotiza con total garantía.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex flex-col justify-center items-center text-center min-w-[140px]">
            <span className="text-3xl font-black text-amber-500">{repuestos.length}</span>
            <span className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Repuestos Listados</span>
          </div>
        </div>

        {/* ─── GRILLA DE PRODUCTOS (Dynamic Catalog) ─── */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <span>Piezas Disponibles en Catálogo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {repuestos.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-zinc-700 transition duration-150 relative"
              >
                {/* Badge de Emergencia Vial */}
                {item.urgency_vial && (
                  <span className="absolute top-3 right-3 bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                    🚨 Urgente
                  </span>
                )}

                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider block">{item.sku}</span>
                  
                  <h3 className="text-base font-extrabold text-white leading-snug">
                    {item.nombre}
                  </h3>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Compatibilidad:</span>
                    <p className="text-xs text-zinc-300 font-medium truncate">
                      {item.modelos_compatibles.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-5 pt-4 border-t border-zinc-800/60">
                  {/* Botón WhatsApp Fricción Cero */}
                  <a
                    href={getWaLink(item.nombre, item.sku)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition duration-150 text-center cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Cotizar WhatsApp</span>
                  </a>

                  {/* Enlace Ficha Técnica */}
                  <Link
                    href={`/${item.marca_slug}/${item.pieza_slug}`}
                    className="w-full flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs py-2 px-4 rounded-lg transition duration-150 text-center border border-zinc-800"
                  >
                    <span>Ver Ficha Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ARQUITECTURA COPY/LOCAL (SEO GEO-ORIENTADO & FAQ) ─── */}
        <section 
          aria-labelledby="faq-title" 
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4">
            <HelpCircle className="w-6 h-6 text-amber-500" />
            <h2 id="faq-title" className="text-xl md:text-2xl font-black text-white">
              Preguntas Frecuentes sobre Repuestos {marcaCapitalizada} en Charallave
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-zinc-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ¿Por qué elegir repuestos nuevos en lugar de chiveras en los Valles del Tuy?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed pl-3">
                Las chiveras en Charallave, Cúa y Ocumare venden piezas de segunda mano sin garantía de fatiga o desgaste. En Automotriz El Shaddai vendemos repuestos **100% nuevos y certificados** que garantizan la vida útil de tu carro, con el soporte de una tienda física establecida.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-zinc-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ¿Tienen delivery inmediato en Charallave y otras zonas del Tuy?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed pl-3">
                Sí. Contamos con despacho motorizado mismo día dentro de la zona urbana de **Charallave** (diagonal al MRW). También cubrimos rutas de entrega rápida con recargo de zona a **Cúa** y **Ocumare del Tuy** para que no tengas que moverte si estás en el taller o varado.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-zinc-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ¿Qué métodos de pago reciben en divisas y bolívares?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed pl-3">
                Para tu comodidad, aceptamos bolívares por **Pago Móvil**, transferencias, efectivo en divisas (USD), transferencias internacionales vía **Zelle** y pagos cripto a través de **Binance Pay**. Todo coordinado de forma directa al cotizar en nuestro WhatsApp.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-zinc-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ¿Cómo aseguro la compatibilidad de mi repuesto {marcaCapitalizada}?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed pl-3">
                Al presionar "Cotizar WhatsApp", se genera un mensaje con la ficha técnica y SKU del repuesto. Al chatear con nuestro equipo técnico, puedes indicarnos el año y modelo exacto (ej. *Corolla Iraní, Aveo LT, Fiesta Power*) y validaremos la compatibilidad antes de despachar.
              </p>
            </div>

          </div>

          {/* Advertencia Local / CTR Footer */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-[11px] text-zinc-400 leading-normal max-w-xl">
                ¿Tu pieza no está listada? No te preocupes. Escríbenos directamente a nuestro WhatsApp de atención y el equipo de compras de <strong>Automotriz El Shaddai</strong> la ubicará por ti en tiempo récord.
              </p>
            </div>
            <a 
              href={`https://wa.me/${waPhoneNumber}?text=Hola%20El%20Shaddai%2C%20necesito%20un%20repuesto%20para%20${marcaCapitalizada}%20que%20no%20veo%20en%20el%20catalogo`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
            >
              <span>Consultar Otra Pieza</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
