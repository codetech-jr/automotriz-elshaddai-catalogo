"use client"

// ─── FAQ Page (Client Component) ─────────────────────────────────────────────
// Frequently Asked Questions Section
// Rationale:
//   • ANXIETY REDUCTION: Prominently addresses shipping, payment, and refund policies.
//   • INTERACTIVE ACCORDIONS: Keeps cognitive load low by allowing users to toggle
//     individual answers smoothly.
//   • CART SYNCHRONIZATION: Integrates global useQuoteStore, FloatingQuoteBar,
//     and QuoteDrawer to maintain checkout continuity.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { HelpCircle, Truck, CreditCard, RefreshCw, ChevronDown, MessageCircle } from "lucide-react"

import { useQuoteStore } from "@/lib/quote-store"
import { buildWhatsAppURL } from "@/lib/config"
import FloatingQuoteBar from "@/components/FloatingQuoteBar"
import QuoteDrawer from "@/components/QuoteDrawer"
import { cn } from "@/lib/utils"

interface FAQItem {
  id: string
  question: string
  answer: React.ReactNode
  icon: React.ReactNode
}

export default function FAQPage() {
  const {
    quoteItems,
    isQuotePanelOpen,
    setIsQuotePanelOpen,
    removeFromQuote,
    updateQuantity,
  } = useQuoteStore()

  // State to track open accordion items
  const [openItem, setOpenItem] = useState<string | null>("shipping")

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id))
  }

  const faqs: FAQItem[] = [
    {
      id: "shipping",
      question: "¿Hacen envíos nacionales?",
      icon: <Truck className="w-5 h-5 text-red-500" />,
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Sí, realizamos envíos a nivel nacional</strong> a través de las empresas de encomienda más reconocidas de Venezuela:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-400">
            <li>MRW</li>
            <li>Zoom</li>
            <li>Tealca</li>
            <li>Domesa</li>
          </ul>
          <p className="pt-1">
            Los envíos se realizan bajo la modalidad de <strong>cobro en destino (COD)</strong>. Despachamos todos los días laborables en horario de la mañana una vez confirmado el pago. Adicionalmente, contamos con delivery gratuito o coordinado en toda la zona de Charallave y los Valles del Tuy.
          </p>
        </div>
      ),
    },
    {
      id: "payments",
      question: "¿Cuáles son los métodos de pago aceptados?",
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
      answer: (
        <div className="space-y-2">
          <p>
            Ofrecemos múltiples alternativas de pago para adaptarnos a tu comodidad y agilizar tu proceso de compra:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850">
              <span className="block font-bold text-white text-xs uppercase tracking-wider mb-1">🏦 Bolívares (Bs.F)</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Pago Móvil y transferencias directas a cuentas nacionales (Banesco y Banco de Venezuela).</p>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850">
              <span className="block font-bold text-white text-xs uppercase tracking-wider mb-1">💵 Divisas (USD)</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Transferencias electrónicas Zelle y pagos en efectivo (dólares o euros) para entregas en persona.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "returns",
      question: "¿Qué pasa si el repuesto no es el correcto (devoluciones)?",
      icon: <RefreshCw className="w-5 h-5 text-sky-500" />,
      answer: (
        <div className="space-y-2">
          <p>
            Entendemos que el temor a equivocarse de repuesto es alto en autopartes. Para tu tranquilidad, cuentas con nuestra <strong>Garantía de Ajuste Perfecto de 72 horas</strong>:
          </p>
          <p>
            Si la pieza no aplica a tu vehículo, puedes solicitar un cambio de repuesto o devolución bajo las siguientes condiciones:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-400">
            <li>La solicitud debe realizarse dentro de las 72 horas de recibida la compra.</li>
            <li>El artículo debe estar intacto en su empaque original, sin roturas, manchas o grasa.</li>
            <li>El repuesto <strong>no debe haber sido instalado</strong> ni presentar marcas de herramientas.</li>
          </ul>
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-amber-500/20 text-amber-400 text-xs mt-3 leading-relaxed">
            💡 <strong>¡Evita errores!</strong> Antes de mandar tu cotización a WhatsApp, completa el campo opcional de <em>Verificación de Vehículo</em> indicando el modelo y año de tu carro para que nuestros asesores validen la compatibilidad en sistemas OEM.
          </div>
        </div>
      ),
    },
  ]

  const contactWaUrl = buildWhatsAppURL("Hola, tengo una pregunta sobre envíos y métodos de pago.")

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-24 text-zinc-300">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111622] to-[#0a0a0a] pt-16 pb-12 px-4 md:px-8 border-b border-[#252b3b]/30">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 bg-[#e60000]/10 border border-[#e60000]/25 rounded-full px-3.5 py-1">
            <HelpCircle className="w-4.5 h-4.5 text-[#E60000]" />
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
              Centro de Ayuda
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Frecuentes</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Resuelve tus dudas sobre métodos de despacho, opciones de pago en bolívares/divisas y nuestra política de garantía de compatibilidad.
          </p>
        </div>
      </section>

      {/* Accordion List Container */}
      <section className="py-12 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openItem === faq.id
            return (
              <div
                key={faq.id}
                className="bg-[#121620]/30 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-800"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-center justify-between p-5 text-left text-white font-bold text-sm md:text-base min-h-[48px] select-none hover:bg-[#1a2030]/20 transition-all duration-150"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      {faq.icon}
                    </div>
                    <span className="truncate">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-zinc-500 transition-transform duration-300 flex-shrink-0",
                      isOpen && "transform rotate-180 text-amber-500"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {/* Accordion Content Panel */}
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  className={cn(
                    "grid transition-all duration-300 ease-in-out text-zinc-300 text-xs md:text-sm leading-relaxed",
                    isOpen ? "grid-rows-[1fr] border-t border-zinc-900/60 p-5 bg-zinc-950/20" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    {faq.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dynamic WhatsApp Support Trigger */}
        <div className="mt-12 text-center p-6 sm:p-8 bg-zinc-900/40 border border-zinc-900 rounded-3xl max-w-xl mx-auto space-y-4 shadow-xl">
          <p className="text-zinc-400 text-xs md:text-sm">
            ¿Tienes otra consulta o no encuentras tu duda resuelta? Conversa directamente con nuestro equipo técnico.
          </p>
          <a
            href={contactWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-[0.98] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-150 shadow-[0_4px_16px_rgba(37,211,102,0.15)] min-h-[48px]"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            Preguntar por WhatsApp
          </a>
        </div>
      </section>

      {/* Sticky Bottom Quote FAB Bar */}
      <FloatingQuoteBar
        quoteItems={quoteItems}
        onOpenPanel={() => setIsQuotePanelOpen(true)}
        isHidden={isQuotePanelOpen}
      />

      {/* Off-canvas Central Cart Drawer */}
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
