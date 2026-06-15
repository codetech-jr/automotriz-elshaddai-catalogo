'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createProduct } from '@/actions/product'
import type { ProductCategory, ProductBrand, ProductCondition } from '@/lib/supabase/types'

const CATEGORIES: ProductCategory[] = [
  'Motor', 'Frenos', 'Suspensión', 'Filtros', 'Eléctrico', 'Carrocería', 'Accesorios',
]

const BRANDS: ProductBrand[] = [
  'Chery', 'Toyota', 'Ford', 'Chevrolet', 'Volkswagen', 'Hyundai', 'Daewoo', 'Universal',
]

const CONDITIONS: { value: ProductCondition; label: string; desc: string }[] = [
  { value: 'OEM',            label: 'OEM',            desc: 'Pieza original del fabricante' },
  { value: 'ALTERNATIVO',    label: 'Alternativo',    desc: 'Compatible de tercero' },
  { value: 'REMANUFACTURADO',label: 'Remanufacturado',desc: 'Reconstruido / reacondicionado' },
]

// ── Estilos compartidos ────────────────────────────────────────────────────────
const INPUT_BASE = `
  w-full rounded-lg border border-white/[0.08] bg-white/[0.03]
  px-3 py-2.5 text-sm text-white/90
  placeholder:text-white/20
  transition-colors duration-150
  focus:border-amber-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-0
  disabled:opacity-50
`

const LABEL_BASE = 'mb-1.5 block text-xs font-medium text-white/50 uppercase tracking-wide'

export default function NewProductForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createProduct(formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)
      // Redirigir al listado tras un breve momento
      setTimeout(() => router.push('/admin/products'), 1000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* ── Error global ──────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* ── Success ────────────────────────────────────────────────────── */}
      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <p className="text-sm text-emerald-300">¡Repuesto creado exitosamente! Redirigiendo…</p>
        </div>
      )}

      {/* ── Card del formulario ────────────────────────────────────────── */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">

        {/* Identificación */}
        <Section title="Identificación">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Número de Parte (SKU) *" htmlFor="part_number">
              <input
                id="part_number"
                name="part_number"
                type="text"
                required
                placeholder="CHY-FLT-001"
                className={INPUT_BASE}
                disabled={isPending || success}
              />
            </Field>
            <Field label="Nombre del Producto *" htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Filtro de Aceite"
                className={INPUT_BASE}
                disabled={isPending || success}
              />
            </Field>
          </div>
        </Section>

        {/* Clasificación */}
        <Section title="Clasificación">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Categoría *" htmlFor="category">
              <select
                id="category"
                name="category"
                required
                className={INPUT_BASE}
                defaultValue=""
                disabled={isPending || success}
              >
                <option value="" disabled className="bg-[#111] text-white/40">
                  Seleccionar…
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#111] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Marca *" htmlFor="brand">
              <select
                id="brand"
                name="brand"
                required
                className={INPUT_BASE}
                defaultValue=""
                disabled={isPending || success}
              >
                <option value="" disabled className="bg-[#111] text-white/40">
                  Seleccionar…
                </option>
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-[#111] text-white">
                    {b}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Condición */}
          <Field label="Condición *" htmlFor="condition-oem">
            <div className="grid grid-cols-3 gap-2 mt-1">
              {CONDITIONS.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className="
                    group relative flex cursor-pointer flex-col gap-0.5
                    rounded-lg border border-white/[0.06] bg-white/[0.02]
                    p-3 transition-all duration-150
                    has-[:checked]:border-amber-500/40 has-[:checked]:bg-amber-500/5
                    hover:border-white/[0.12] hover:bg-white/[0.04]
                  "
                >
                  <input
                    type="radio"
                    name="condition"
                    id={`condition-${value.toLowerCase()}`}
                    value={value}
                    defaultChecked={value === 'ALTERNATIVO'}
                    className="sr-only"
                    disabled={isPending || success}
                  />
                  <span className="text-xs font-semibold text-white/80 group-has-[:checked]:text-amber-400">
                    {label}
                  </span>
                  <span className="text-[10px] text-white/30 leading-tight">{desc}</span>
                </label>
              ))}
            </div>
          </Field>
        </Section>

        {/* Stock */}
        <Section title="Disponibilidad">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Disponible para cotizar</p>
              <p className="text-xs text-white/30 mt-0.5">Marca si el repuesto está en stock</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="stock_available"
                value="true"
                defaultChecked
                className="peer sr-only"
                disabled={isPending || success}
              />
              <div className="
                peer h-6 w-11 rounded-full bg-white/10
                after:absolute after:left-[2px] after:top-[2px]
                after:h-5 after:w-5 after:rounded-full
                after:bg-white/60 after:transition-all after:content-['']
                peer-checked:bg-amber-500/30 peer-checked:border-amber-500/40
                peer-checked:after:translate-x-full peer-checked:after:bg-amber-400
                border border-white/10
              " />
            </label>
          </div>
        </Section>

        {/* Detalles adicionales */}
        <Section title="Detalles (opcional)">
          <Field label="Compatibilidad" htmlFor="compatibility_text">
            <input
              id="compatibility_text"
              name="compatibility_text"
              type="text"
              placeholder="Corolla 2014–2020, Yaris 2018+"
              className={INPUT_BASE}
              disabled={isPending || success}
            />
          </Field>
          <Field label="URL de Imagen" htmlFor="image_url">
            <input
              id="image_url"
              name="image_url"
              type="url"
              placeholder="https://..."
              className={INPUT_BASE}
              disabled={isPending || success}
            />
          </Field>
          <Field label="Notas internas" htmlFor="notes">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Observaciones del administrador..."
              className={`${INPUT_BASE} resize-none`}
              disabled={isPending || success}
            />
          </Field>
        </Section>
      </div>

      {/* ── Acciones ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={isPending || success}
          className="
            flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5
            text-sm font-semibold text-[#0a0a0f]
            transition-all duration-150
            hover:bg-amber-400 active:scale-95
            disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
            shadow-lg shadow-amber-500/20
          "
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Guardando…' : 'Guardar Repuesto'}
        </button>
      </div>
    </form>
  )
}

// ── Helpers de layout ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/25">{title}</h2>
      {children}
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={LABEL_BASE}>
        {label}
      </label>
      {children}
    </div>
  )
}
