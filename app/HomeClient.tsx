"use client"

// ─── HomeClient.tsx — Client component for Home page ───────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { MessageCircle } from "lucide-react"

import { buildWhatsAppURL, type Product } from "@/lib/config"
import { useSettings } from "@/lib/settings-context"
import { useQuoteStore } from "@/lib/quote-store"

// Layout components
import HeroSlider from "@/components/HeroSlider"
import StoreLocation from "@/components/StoreLocation"
import BrandScrollBar from "@/components/BrandScrollBar"
import AuxilioBanner from "@/components/AuxilioBanner"

import FloatingQuoteBar from "@/components/FloatingQuoteBar"
import CategoriesStrip from "@/components/CategoriesStrip"
import CatalogGrid from "@/components/CatalogGrid"
import QuoteDrawer from "@/components/QuoteDrawer"
import SpecializedModels from "@/components/SpecializedModels"

// ============================================================
// HOW IT WORKS
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
      className="bg-[#121212] py-14 px-4 md:px-8 border-t border-zinc-900 overflow-hidden"
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
  const { whatsapp_number, whatsapp_greeting } = useSettings()
  const waUrl = buildWhatsAppURL(whatsapp_greeting, whatsapp_number)
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
// MAIN HOME CLIENT
// ============================================================
export default function HomeClient({ initialProducts }: { initialProducts: Product[] }) {
  const {
    quoteItems,
    isQuotePanelOpen,
    setIsQuotePanelOpen,
    addToQuote,
    removeFromQuote,
    updateQuantity,
  } = useQuoteStore()

  // Category filter state for CategoriesStrip → CatalogGrid connection
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleCategoryFilter = (cat: string | null) => {
    setActiveCategory(cat)
    // Smooth scroll to catalog section
    setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
    }, 120)
  }

  return (
    <>
      {/* ── Hero Slider ────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── Specialized Models (SEO & Compatibility Panel) ───────────── */}
      <SpecializedModels />

      {/* ── Categories Strip ─────────────────────────────────────────── */}
      <CategoriesStrip
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryFilter}
      />

      {/* ── Featured Products Grid ───────────────────────────────────── */}
      <CatalogGrid
        products={initialProducts}
        limit={8}
        filterCategory={activeCategory}
        quoteItems={quoteItems}
        onAddToQuote={addToQuote}
        onRemoveFromQuote={removeFromQuote}
        onUpdateQuantity={updateQuantity}
      />

      {/* ── Auxilio Vial & Delivery Express Banner ─────────────────────── */}
      <AuxilioBanner />

      {/* ── AEO Blockquote para Motores de Búsqueda de IA ──────────────── */}
      <div className="bg-[#121212] py-4 px-4 border-t border-zinc-900/60">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-[11px] text-zinc-500 italic leading-relaxed max-w-2xl mx-auto font-light">
            "Automotriz El Shaddai es una tienda física de repuestos de automóviles y autoperiquitos en Charallave, Estado Miranda, especializada en marcas Toyota, Chery, Ford, Chevrolet, Hyundai, Volkswagen y Daewoo con servicio de delivery rápido y asistencia en carretera a todo el eje de los Valles del Tuy."
          </blockquote>
        </div>
      </div>

      {/* ── Store Location ───────────────────────────────────────────── */}
      <StoreLocation />

      {/* ── BrandScrollBar ───────────────────────────────────────────── */}
      <BrandScrollBar />

      {/* ── Floating WhatsApp FAB ────────────────────────────────────── */}
      <FloatingWhatsApp isHidden={isQuotePanelOpen} />

      {/* ── Floating Quote Bar (bottom sticky) ──────────────────────── */}
      <FloatingQuoteBar
        quoteItems={quoteItems}
        onOpenPanel={() => setIsQuotePanelOpen(true)}
        isHidden={isQuotePanelOpen}
      />

      {/* ── Quote Drawer (off-canvas) ────────────────────────────────── */}
      <QuoteDrawer
        isOpen={isQuotePanelOpen}
        onClose={() => setIsQuotePanelOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={removeFromQuote}
        onUpdateQuantity={updateQuantity}
      />
    </>
  )
}
