'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Phone, MessageSquare, MapPin, AlertTriangle } from 'lucide-react'
import { updateSettings } from '@/actions/settings'
import type { DbStoreSettings } from '@/lib/supabase/types'

const INPUT_BASE = `
  w-full rounded-lg border border-white/[0.08] bg-white/[0.03]
  px-3 py-2.5 text-sm text-white/90
  placeholder:text-white/20
  transition-colors duration-150
  focus:border-amber-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-0
  disabled:opacity-50
`

const LABEL_BASE = 'mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider'

interface SettingsFormProps {
  initialSettings: DbStoreSettings
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form states for custom components like the custom toggle
  const [isEmergencyActive, setIsEmergencyActive] = useState(
    initialSettings.is_emergency_banner_active
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    // Make sure the toggle state is passed correctly
    formData.set('is_emergency_banner_active', String(isEmergencyActive))

    startTransition(async () => {
      const result = await updateSettings(formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)
      // Clear success indicator after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* ── Feedback Messages ─────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 shadow-lg">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">Error al guardar configuraciones</p>
            <p className="text-xs text-red-400/95 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              ¡Configuraciones guardadas exitosamente!
            </p>
            <p className="text-xs text-emerald-400/90 mt-0.5">
              Los cambios han sido aplicados y se reflejan en tiempo real para todos los usuarios.
            </p>
          </div>
        </div>
      )}

      {/* ── settings card panel ───────────────────────────────────────── */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
        
        {/* SECTION 1: Ventas / WhatsApp */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Phone className="h-4 w-4 text-emerald-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Configuración de Ventas
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="whatsapp_number" className={LABEL_BASE}>
                Número de WhatsApp *
              </label>
              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="text"
                required
                disabled={isPending}
                defaultValue={initialSettings.whatsapp_number}
                placeholder="584123715469"
                className={INPUT_BASE}
              />
              <p className="mt-1 text-[11px] text-white/30">
                Formato internacional sin caracteres especiales (ej: Código de país + celular).
              </p>
            </div>

            <div>
              <label htmlFor="whatsapp_greeting" className={LABEL_BASE}>
                Saludo Predeterminado *
              </label>
              <input
                id="whatsapp_greeting"
                name="whatsapp_greeting"
                type="text"
                required
                disabled={isPending}
                defaultValue={initialSettings.whatsapp_greeting}
                placeholder="Hola, necesito ayuda con repuestos para mi vehículo."
                className={INPUT_BASE}
              />
              <p className="mt-1 text-[11px] text-white/30">
                Mensaje inicial cuando el cliente inicia contacto sin repuestos específicos en lista.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Alertas en vivo / Emergency Banner */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Alertas en Tiempo Real
            </h2>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-white/[0.01] border border-white/[0.04]">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/80">
                Cinta de Auxilio Vial y Delivery Express
              </p>
              <p className="text-xs text-white/35 max-w-xl leading-relaxed">
                Activa la cinta superior amarilla de urgencia vial en toda la web. Úsala para notificar disponibilidad de entregas express inmediatas o soporte activo.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                isEmergencyActive ? 'text-amber-400' : 'text-white/20'
              }`}>
                {isEmergencyActive ? 'Activo' : 'Inactivo'}
              </span>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsEmergencyActive(!isEmergencyActive)}
                className={`
                  relative inline-flex h-6.5 w-12.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 disabled:opacity-50
                  ${isEmergencyActive ? 'bg-amber-500' : 'bg-white/10'}
                `}
                aria-label="Alternar alerta de auxilio vial y delivery"
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-[#0a0a0f] shadow-lg
                    transition duration-200 ease-in-out
                    ${isEmergencyActive ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Dirección / Localización */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20">
              <MapPin className="h-4 w-4 text-sky-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Localización Física
            </h2>
          </div>

          <div>
            <label htmlFor="store_address" className={LABEL_BASE}>
              Dirección Principal de la Tienda *
            </label>
            <textarea
              id="store_address"
              name="store_address"
              rows={3}
              required
              disabled={isPending}
              defaultValue={initialSettings.store_address}
              placeholder="Diagonal al MRW, Residencias Don Alejandro, Charallave, Miranda"
              className={`${INPUT_BASE} resize-none`}
            />
            <p className="mt-1 text-[11px] text-white/30">
              Ubicación del establecimiento físico. Se reflejará en el pie de página (footer) y la información SEO estructurada.
            </p>
          </div>
        </div>

      </div>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="
            flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3
            text-sm font-semibold text-[#0a0a0f]
            transition-all duration-150
            hover:bg-amber-400 active:scale-97
            disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
            shadow-lg shadow-amber-500/20
          "
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Guardando cambios…' : 'Guardar Configuraciones'}
        </button>
      </div>
    </form>
  )
}
