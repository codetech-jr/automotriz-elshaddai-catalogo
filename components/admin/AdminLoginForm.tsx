'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const INPUT_BASE = `
  w-full rounded-lg border border-white/[0.08] bg-white/[0.03]
  px-3 py-2.5 text-sm text-white/90
  placeholder:text-white/20
  transition-colors duration-150
  focus:border-amber-500/40 focus:bg-white/[0.05] focus:outline-none
  disabled:opacity-50
`

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/admin'

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email    = formData.get('email')    as string
    const password = formData.get('password') as string

    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.')
        return
      }

      router.push(redirectTo)
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
      noValidate
    >
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/50 uppercase tracking-wide">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@elshaddai.com"
          className={INPUT_BASE}
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white/50 uppercase tracking-wide">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={`${INPUT_BASE} pr-10`}
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="
          mt-2 flex w-full items-center justify-center gap-2
          rounded-lg bg-amber-500 px-4 py-2.5
          text-sm font-semibold text-[#0a0a0f]
          transition-all duration-150
          hover:bg-amber-400 active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
          shadow-lg shadow-amber-500/20
        "
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? 'Verificando…' : 'Ingresar al Panel'}
      </button>
    </form>
  )
}
