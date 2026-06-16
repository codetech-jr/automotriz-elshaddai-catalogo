'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Layers, Plus } from 'lucide-react'
import { createCategory } from '@/actions/product'

const INPUT_BASE = `
  rounded-lg border border-white/[0.08] bg-white/[0.03]
  px-3 py-2 text-sm text-white/90
  placeholder:text-white/20
  transition-colors duration-150
  focus:border-amber-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-0
  disabled:opacity-50
`

interface CategoryManagerFormProps {
  initialCategories: { id: string; name: string }[]
}

export default function CategoryManagerForm({ initialCategories }: CategoryManagerFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!name.trim()) {
      setError('El nombre de la categoría es requerido.')
      return
    }

    startTransition(async () => {
      const result = await createCategory(name)

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)
      setName('')
      setTimeout(() => setSuccess(false), 3000)
    })
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Layers className="h-4 w-4 text-amber-400" />
        </div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Categorías de Productos
        </h2>
      </div>

      <p className="text-xs text-white/40 leading-relaxed">
        Gestiona las categorías de productos independientes. Estas se cargarán de forma dinámica en los selectores del inventario y del catálogo público.
      </p>

      {/* ── Feedback Messages ─────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 shadow-lg">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <p className="text-xs text-emerald-300">¡Categoría añadida exitosamente!</p>
        </div>
      )}

      {/* Formulario diminuto */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md" noValidate>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Transmisión"
          disabled={isPending}
          className={`${INPUT_BASE} flex-1`}
        />
        <button
          type="submit"
          disabled={isPending}
          className="
            flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2
            text-xs font-semibold text-[#0a0a0f]
            transition-all duration-150
            hover:bg-amber-400 active:scale-95
            disabled:opacity-60 disabled:cursor-not-allowed
            shadow-lg shadow-amber-500/20
          "
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Añadir +
        </button>
      </form>

      {/* Tabla listando categorías */}
      <div className="overflow-hidden rounded-lg border border-white/[0.04] bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-white/30">
              <th className="px-4 py-2">Nombre de Categoría</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {initialCategories.length === 0 ? (
              <tr>
                <td className="px-4 py-3 text-xs text-white/20 italic text-center">
                  No hay categorías registradas. Se usarán las categorías por defecto.
                </td>
              </tr>
            ) : (
              initialCategories.map((category) => (
                <tr key={category.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-4 py-2.5 text-xs text-white/80 font-medium">
                    {category.name}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
