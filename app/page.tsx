"use client"

// ─── page.tsx — El Shaddai Ecommerce Homepage ─────────────────────────────────
// Architecture: Client boundary at page level to manage global quote state.
// Sub-components are now modular standalone files for maintainability.
//
// Security: All user-generated text that flows into WhatsApp URLs is passed
// through encodeURIComponent() via buildWhatsAppURL() — never string-interpolated
// raw into href attributes. This mitigates CWE-601 Open Redirect / URL injection.
//
// COMPONENT HIERARCHY:
//   page.tsx (client boundary + state orchestrator)
//   ├── HeroSection           (server-compatible, no "use client")
//   ├── AuxilioBanner         (server-compatible)
//   ├── HowItWorksSection     (inline — no state needed, too simple to extract)
//   ├── CategoriesStrip       ← NEW modular component (components/CategoriesStrip.tsx)
//   ├── DemandBanner          (server-compatible)
//   ├── CatalogGrid           ← NEW modular component (components/CatalogGrid.tsx)
//   │   └── ProductCard       ← NEW modular component (components/ProductCard.tsx)
//   ├── StoreLocation
//   ├── PaymentTrustBand
//   ├── FloatingWhatsApp      (inline — single-use FAB)
//   ├── FloatingQuoteBar
//   └── QuoteDrawer           ← NEW modular component (components/QuoteDrawer.tsx)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle } from "lucide-react"

import { buildWhatsAppURL } from "@/lib/config"
import { useQuoteStore } from "@/lib/quote-store"

// Layout components
import HeroSection from "@/components/HeroSection"
import PaymentTrustBand from "@/components/PaymentTrustBand"
import DemandBanner from "@/components/DemandBanner"
import AuxilioBanner from "@/components/AuxilioBanner"
import FloatingQuoteBar from "@/components/FloatingQuoteBar"
import StoreLocation from "@/components/StoreLocation"

// New modular UI components
import CategoriesStrip from "@/components/CategoriesStrip"
import CatalogGrid from "@/components/CatalogGrid"
import QuoteDrawer from "@/components/QuoteDrawer"

// ============================================================
// HOW IT WORKS (inline — simple static content)
// ============================================================
function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Agrega a tu lista",
      description: "Navega el catálogo y añade los repuestos que necesitas con un clic.",
    },
    {
      number: "2",
      title: "Envía por WhatsApp",
      description: "Tu lista llega directamente a nuestro equipo con un solo toque.",
    },
    {
      number: "3",
      title: "Confirmamos y despachamos",
      description: "Te respondemos con disponibilidad y coordinamos la entrega.",
    },
  ]

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="bg-[#121212] py-14 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="how-it-works-heading"
          className="text-2xl md:text-3xl font-black text-white mb-10"
        >
          En 3 pasos simples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="flex gap-4 md:flex-col md:gap-0 md:text-center md:items-center"
            >
              <div className="flex-shrink-0 md:mb-4">
                <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white font-black text-base flex items-center justify-center mx-auto">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block h-px w-full bg-zinc-800 mt-4"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1.5">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FLOATING WHATSAPP FAB
// ============================================================
function FloatingWhatsApp({ isHidden }: { isHidden: boolean }) {
  const waUrl = buildWhatsAppURL("Hola, necesito ayuda con repuestos para mi vehículo.")
  return (
    <div
      className={`fixed bottom-24 right-4 md:bottom-28 md:right-6 z-30 transition-all duration-200
        ${isHidden ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"}`}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:scale-110 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span
          className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20"
          aria-hidden="true"
        />
      </a>
    </div>
  )
}

// ============================================================
// MAIN HOME PAGE
// ============================================================
export default function Home() {
  const router = useRouter()
  const {
    quoteItems,
    isQuotePanelOpen,
    setIsQuotePanelOpen,
    addToQuote,
    removeFromQuote,
    updateQuantity,
  } = useQuoteStore()

  const [searchQuery, setSearchQuery] = useState("")
  // Category filter state for CategoriesStrip → CatalogGrid connection
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleBrandRedirect = (brand: string | null) => {
    if (brand) router.push(`/catalogo?brand=${encodeURIComponent(brand)}`)
  }

  const handleCategoryFromHero = (cat: string | null) => {
    if (cat) router.push(`/catalogo?category=${encodeURIComponent(cat)}`)
  }

  const handleCategoryFilter = (cat: string | null) => {
    setActiveCategory(cat)
    // Smooth scroll to catalog section
    setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
    }, 120)
  }

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <HeroSection
        selectedBrand={null}
        setSelectedBrand={handleBrandRedirect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={null}
        setActiveCategory={handleCategoryFromHero}
        topBarVisible={false}
      />

      {/* ── Auxilio Vial Banner ──────────────────────────────────────── */}
      <AuxilioBanner />

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── Categories Strip ─────────────────────────────────────────── */}
      {/*
        CategoriesStrip drives activeCategory state which filters CatalogGrid below.
        Mobile: 2×2 grid. md+: single 4-col row.
      */}
      <CategoriesStrip
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryFilter}
      />

      {/* ── Demand Banner (pattern interrupt) ────────────────────────── */}
      <DemandBanner />

      {/* ── Featured Products Grid ───────────────────────────────────── */}
      {/*
        CatalogGrid pulls data directly from lib/data.ts (SAMPLE_PRODUCTS).
        filterCategory connects to CategoriesStrip state.
        Limit=8 for homepage; /catalogo page uses limit=undefined for all.
      */}
      <CatalogGrid
        limit={8}
        filterCategory={activeCategory}
        quoteItems={quoteItems}
        onAddToQuote={addToQuote}
        onRemoveFromQuote={removeFromQuote}
        onUpdateQuantity={updateQuantity}
      />

      {/* ── Store Location ───────────────────────────────────────────── */}
      <StoreLocation />

      {/* ── Payment Trust Band (cognitive closure) ───────────────────── */}
      <PaymentTrustBand />

      {/* ── Floating WhatsApp FAB ────────────────────────────────────── */}
      <FloatingWhatsApp isHidden={isQuotePanelOpen} />

      {/* ── Floating Quote Bar (bottom sticky) ──────────────────────── */}
      <FloatingQuoteBar
        quoteItems={quoteItems}
        onOpenPanel={() => setIsQuotePanelOpen(true)}
        isHidden={isQuotePanelOpen}
      />

      {/* ── Quote Drawer (off-canvas) ────────────────────────────────── */}
      {/*
        QuoteDrawer uses h-[100dvh] internally to prevent Safari Mobile
        from cutting off the WhatsApp CTA behind the browser chrome.
      */}
      <QuoteDrawer
        isOpen={isQuotePanelOpen}
        onClose={() => setIsQuotePanelOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={removeFromQuote}
        onUpdateQuantity={updateQuantity}
      />
    </main>
  )
}
