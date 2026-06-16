'use client'

import { useState, useTransition } from 'react'
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { updateAdminPassword } from '@/actions/auth'

const INPUT_BASE = `
  w-full rounded-lg border border-white/[0.08] bg-white/[0.03]
  px-3 py-2.5 text-sm text-white/90
  placeholder:text-white/20
  transition-colors duration-150
  focus:border-amber-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-0
  disabled:opacity-50
`

const LABEL_BASE = 'mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider'

export default function SecuritySettingsCard() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Local values for clear-on-success functionality
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!newPassword || !confirmPassword) {
      setError('Ambos campos de contraseña son requeridos.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateAdminPassword(formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      
      // Auto-clear success message after 4 seconds
      setTimeout(() => setSuccess(false), 4000)
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Feedback Messages ─────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 shadow-lg">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">Error de Seguridad</p>
            <p className="text-xs text-red-400/95 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Contraseña actualizada exitosamente
            </p>
            <p className="text-xs text-emerald-400/90 mt-0.5">
              Tu clave de acceso administrativo ha sido cambiada de forma segura.
            </p>
          </div>
        </div>
      )}

      {/* ── Security Card Panel ───────────────────────────────────────── */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
        
        {/* Header and Inputs */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Lock className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Seguridad de la Cuenta
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className={LABEL_BASE}>
                  Nueva Contraseña *
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  disabled={isPending}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={INPUT_BASE}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className={LABEL_BASE}>
                  Confirmar Contraseña *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={isPending}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={INPUT_BASE}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
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
                {isPending ? 'Guardando contraseña…' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  )
}
