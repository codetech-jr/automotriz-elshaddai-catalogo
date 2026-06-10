"use client"

// ─── GoogleRatingBadge — Global Floating Google Review Trust Badge ────────────
// CRO Rationale:
//   • Persistent Trust Anchor: Reminds the user of high customer satisfaction
//     throughout the catalog navigation and product viewing.
//   • Sub-200ms entry delay to catch attention without disrupting layout mount.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"

export default function GoogleRatingBadge() {
  const [isVisible, setIsVisible] = useState(false)

  // Delay mount slightly so it enters with a smooth fade animation
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className="fixed bottom-24 left-4 md:bottom-28 md:left-6 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-zinc-800 bg-[#0d0d0d]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-zinc-700 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-500"
      role="status"
      aria-label="Puntuación Google de 4.9 estrellas basada en decenas de clientes"
    >
      {/* Google G SVG */}
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      
      {/* Badge Text */}
      <span className="text-[10px] md:text-xs font-bold text-white leading-none whitespace-nowrap flex items-center gap-1 select-none">
        Puntuación Google de <span className="text-zinc-200 font-extrabold font-mono">4.9</span>
        <span className="text-[#FABB05]">★</span>
        <span className="text-zinc-500 font-medium hidden sm:inline">| basada en decenas de clientes</span>
      </span>
    </div>
  )
}
