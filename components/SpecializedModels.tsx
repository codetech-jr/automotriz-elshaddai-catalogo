"use client"

import { useState } from "react"
import { SUPPORTED_VEHICLES } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Cpu, ShieldCheck, Database, Wrench } from "lucide-react"

export default function SpecializedModels() {
  const [activeMake, setActiveMake] = useState<string>("toyota")

  const currentMake = SUPPORTED_VEHICLES.find((v) => v.id === activeMake)

  // Technical formatting function to style displacement, years, and versions in small monospace tags
  const renderFormattedModel = (model: string) => {
    // Regex matches years (03-08), engine displacement (1.6, 1.8), engine codes (2RZ), and versions in parenthesis
    const regex = /(\d{2}-\d{2}\+?|\d\.\d|\b\d[R|Z]Z\b|\(.*?\)|\[.*?\])/g
    const parts = model.split(regex)

    return (
      <span className="flex items-center flex-wrap gap-1">
        {parts.map((part, i) => {
          if (!part) return null
          const isTechDetail = /(\d{2}-\d{2}\+?|\d\.\d|\b\d[R|Z]Z\b|\(.*?\)|\[.*?\])/.test(part)
          if (isTechDetail) {
            return (
              <span
                key={i}
                className="font-mono text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/40 tracking-wider"
              >
                {part}
              </span>
            )
          }
          return (
            <span key={i} className="font-sans font-medium text-zinc-200">
              {part}
            </span>
          )
        })}
      </span>
    )
  }

  return (
    <section
      aria-labelledby="specialized-models-heading"
      className="bg-[#090b0e] py-16 px-4 md:px-8 border-t border-zinc-900 relative overflow-hidden"
    >
      {/* Visual background details */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Tech Panel Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-900 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-mono tracking-widest text-amber-500 uppercase mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Base de Datos Automotriz Activa
            </div>
            
            <h2
              id="specialized-models-heading"
              className="text-xl md:text-2xl lg:text-3xl font-mono font-black text-white tracking-tight uppercase flex items-center gap-2.5"
            >
              <Cpu className="w-6 h-6 text-zinc-500" />
              Vehículos que dominamos
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm mt-2 leading-relaxed max-w-2xl">
              Especialistas certificados en el parque automotor venezolano. Repuesto exacto para:
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-zinc-950 border border-zinc-800/80 px-4 py-2 rounded-xl font-mono text-[11px] text-zinc-500 select-none">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Índice de Compatibilidad: 100% Garantizado</span>
          </div>
        </div>

        {/* Responsive Maker Tabs */}
        <div className="mb-6 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:flex-wrap gap-2.5 min-w-max md:min-w-0 pb-1">
            {SUPPORTED_VEHICLES.map((make) => {
              const isActive = activeMake === make.id
              return (
                <button
                  key={make.id}
                  onClick={() => setActiveMake(make.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer select-none border flex items-center gap-2",
                    isActive
                      ? "border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "border-zinc-800 text-zinc-400 bg-zinc-950 hover:text-white hover:border-zinc-700 hover:bg-zinc-900/50"
                  )}
                >
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    isActive ? "bg-emerald-400 scale-100" : "bg-zinc-600 scale-75"
                  )} />
                  {make.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bento Tag Grid Panel */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 md:p-8 min-h-[200px] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle panel texture overlay */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.004)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none" 
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5 select-none">
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-zinc-600" />
                Modelos Registrados en Inventario ({currentMake?.models.length || 0})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentMake?.models.map((model, idx) => (
                <div
                  key={idx}
                  className="bg-surface-raised border border-zinc-800/80 hover:border-zinc-700/80 text-zinc-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5 hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-default select-none"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500/80 flex-shrink-0" />
                  {renderFormattedModel(model)}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Info Footnote */}
          <div className="relative z-10 mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-500 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Soporte Técnico de Motores, Frenos, Suspensión y Electricidad</span>
            </div>
            <span>Servidor Centralizado: Charallave, Miranda</span>
          </div>
        </div>

      </div>
    </section>
  )
}
