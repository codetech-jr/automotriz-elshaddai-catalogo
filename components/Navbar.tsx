"use client"

// ─── Navbar (Client Component) ────────────────────────────────────────────────
// The Visual Anchor of El Shaddai E-commerce
// Rationale:
//   • VISUAL TRUST: The pulsing availability status pill immediately assures the local Tuy
//     user that the shop is online, active, and capable of dispatching repuestos now.
//   • FRICTION REDUCTION: Top-right CTAs place WhatsApp and Cotización within thumb/cursor
//     reach at all times, drastically increasing inbound leads.
//   • REAL-TIME CART SYNCHRONIZATION: Seamlessly reads count from useQuoteStore; if items
//     are present, renders a vibrant red notification dot with active pulse animation.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { Wrench, MessageCircle, ShoppingCart, Menu, X as CloseIcon } from "lucide-react"
import { BUSINESS, buildWhatsAppURL } from "@/lib/config"
import { useQuoteStore } from "@/lib/quote-store"

export default function Navbar() {
  const { isQuotePanelOpen, setIsQuotePanelOpen, getTotalItems } = useQuoteStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const totalItems = getTotalItems()

  const whatsappUrl = buildWhatsAppURL(
    "Hola, estoy navegando en su catálogo digital y quisiera realizar una consulta directa."
  )

  const togglePanel = () => {
    setIsQuotePanelOpen(!isQuotePanelOpen)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0d0f12]/90 backdrop-blur-md border-b border-[#252b3b] px-4 md:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Logo & Status Pill */}
        <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center bg-zinc-950 group-hover:scale-105 transition-all duration-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-el-shaddai.jpg"
                alt="Automotriz El Shaddai Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-base md:text-lg tracking-tight leading-none">
                El Shaddai
              </span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest leading-none mt-0.5 uppercase">
                Automotriz
              </span>
            </div>
          </a>

          {/* Dynamic Status Pill */}
          <div className="inline-flex items-center gap-2 bg-[#121620] border border-[#252b3b] rounded-full px-2.5 py-1 text-[10px] md:text-xs">
            {/* Blinking Pulse Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-400 font-medium hidden sm:inline">
              Disponible ahora <span className="text-zinc-600 mx-1">•</span>{" "}
              <span className="text-emerald-400 font-bold">Charallave, Cúa, Ocumare</span>
            </span>
            <span className="text-emerald-400 font-bold sm:hidden">
              Disponible
            </span>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/catalogo"
            className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
          >
            Catálogo
          </a>
          <a
            href="/servicios"
            className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
          >
            Servicios
          </a>
          <a
            href="/quienes-somos"
            className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
          >
            Quiénes Somos
          </a>
          <a
            href="/contacto"
            className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
          >
            Contacto
          </a>
        </div>

        {/* Right Side: CTAs & Cotizador Button */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* WhatsApp Direct Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-[#25D366]/35 bg-[#25D366]/5 hover:bg-[#25D366]/15 text-[#25D366] text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 whitespace-nowrap h-10"
            aria-label="Contactar directamente por WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden lg:inline">WhatsApp Directo</span>
          </a>

          {/* Cotizador / Cart Button */}
          <button
            onClick={togglePanel}
            className={`relative flex items-center justify-center gap-2 border px-4 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95 h-10 select-none cursor-pointer
              ${totalItems > 0
                ? "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 shadow-[0_2px_15px_rgba(16,185,129,0.15)]"
                : "border-[#252b3b] bg-[#121620] hover:bg-[#1a2030] text-zinc-300"
              }`}
            aria-label={`Abrir panel de cotización, ${totalItems} repuestos en lista`}
          >
            <div className="relative">
              <ShoppingCart className="w-4.5 h-4.5" />
              
              {/* Dynamic Notification Badge with pulse effect */}
              {totalItems > 0 && (
                <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-[#0d0f12] text-white font-black text-[9px] items-center justify-center">
                    {totalItems}
                  </span>
                </span>
              )}
            </div>
            
            <span className="hidden sm:inline">Cotizador</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-[#252b3b] bg-[#121620] hover:bg-[#1a2030] text-zinc-300 transition-all duration-150 active:scale-95 cursor-pointer"
            aria-label="Alternar menú de navegación móvil"
          >
            {isMobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#252b3b] flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
          <a
            href="/catalogo"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>🚗</span> Catálogo
          </a>
          <a
            href="/servicios"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>🛠️</span> Servicios
          </a>
          <a
            href="/quienes-somos"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>📍</span> Quiénes Somos
          </a>
          <a
            href="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-2"
          >
            <span>📞</span> Contacto
          </a>
        </div>
      )}
    </nav>
  )
}
