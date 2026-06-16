'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, UploadCloud, X } from 'lucide-react'
import Link from 'next/link'
import { createProduct, updateProduct } from '@/actions/product'
import type { DbProduct, ProductBrand, ProductCondition } from '@/lib/supabase/types'

const BRANDS: ProductBrand[] = [
  'Chery', 'Toyota', 'Ford', 'Chevrolet', 'Volkswagen', 'Hyundai', 'Daewoo', 'Universal',
]

const CONDITIONS: { value: ProductCondition; label: string; desc: string }[] = [
  { value: 'OEM',            label: 'OEM',            desc: 'Pieza original del fabricante' },
  { value: 'ALTERNATIVO',    label: 'Alternativo',    desc: 'Compatible de tercero' },
  { value: 'REMANUFACTURADO',label: 'Remanufacturado',desc: 'Reconstruido / reacondicionado' },
]

// Mapping de marcas a sus modelos compatibles para la cascada de selección
const VEHICLE_MAKES: Record<string, string[]> = {
  Toyota: [
    "Corolla 1.6 (Araya / Sky / Baby)",
    "Corolla 1.8 (Araya / Sky / Baby)",
    "Corolla Sensation 03-08",
    "Corolla Explosion 09-11",
    "Corolla 12-16 (Irani)",
    "Corolla 12-16 (Nacional)",
    "Corolla 12-16 (Importado)",
    "Merú",
    "Prado",
    "4Runner (00-02+)",
    "Fortuner",
    "Hilux (2RZ / 3RZ)",
    "Yaris Sol",
    "Yaris Belta",
    "Starlet",
    "Terios 1.3 (Daihatsu)",
    "Terios 1.5 (Daihatsu)"
  ],
  Chevrolet: [
    "Corsa",
    "Aveo",
    "Optra",
    "Spark",
    "Montana",
    "Meriva",
    "Luv Dmax"
  ],
  Ford: [
    "Fiesta (Power / Max / Move)",
    "Explorer (Eddie Bauer / XLT)",
    "EcoSport",
    "Ka",
    "Focus",
    "F-150 (Fortaleza / FX4)",
    "F-350 (Tritón)",
    "Fusion",
    "Laser"
  ],
  Hyundai: [
    "Accent",
    "Excel",
    "Getz",
    "Tucson"
  ],
  Daewoo: [
    "Cielo",
    "Lanos",
    "Nubira"
  ],
  Volkswagen: [
    "Gol",
    "Crossfox",
    "Golf"
  ],
  Chery: [
    "Arauco 2015–2022",
    "Tiggo 3 2016–2021",
    "Orinoco 1.8",
    "QQ 0.8"
  ],
  Universal: [
    "Genérico / Todos"
  ]
}

const INPUT_BASE = `
  w-full rounded-lg border border-white/[0.08] bg-white/[0.03]
  px-3 py-2.5 text-sm text-white/90
  placeholder:text-white/20
  transition-colors duration-150
  focus:border-amber-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-0
  disabled:opacity-50
`

const LABEL_BASE = 'mb-1.5 block text-xs font-medium text-white/50 uppercase tracking-wide'

interface ProductFormProps {
  initialData?: DbProduct
  categories?: { id: string; name: string }[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Estados para cascada de Marca -> Modelo
  const [selectedBrand, setSelectedBrand] = useState<string>(initialData?.brand || '')
  const [selectedModel, setSelectedModel] = useState<string>(initialData?.model || '')

  // Estados para Drag-and-Drop Image Preview (Múltiple)
  const [existingImages, setExistingImages] = useState<string[]>(() => {
    if (initialData?.image_urls && initialData.image_urls.length > 0) {
      return initialData.image_urls
    }
    return initialData?.image_url ? [initialData.image_url] : []
  })
  const [previewImages, setPreviewImages] = useState<{ file: File; url: string }[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const updateFileInput = (filesList: File[]) => {
    const input = document.getElementById('images') as HTMLInputElement
    if (input) {
      const dataTransfer = new DataTransfer()
      filesList.forEach(file => dataTransfer.items.add(file))
      input.files = dataTransfer.files
    }
  }

  const handleFilesAdded = (files: File[]) => {
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }))
    const updated = [...previewImages, ...newPreviews]
    setPreviewImages(updated)
    updateFileInput(updated.map(p => p.file))
  }

  const handleRemovePreview = (index: number) => {
    URL.revokeObjectURL(previewImages[index].url)
    const updated = previewImages.filter((_, i) => i !== index)
    setPreviewImages(updated)
    updateFileInput(updated.map(p => p.file))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    // Enviar el listado actual de imágenes existentes como string JSON
    formData.set('existing_images', JSON.stringify(existingImages))

    startTransition(async () => {
      const result = initialData
        ? await updateProduct(initialData.id, formData)
        : await createProduct(formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      // Limpiar URLs creadas en memoria para evitar memory leaks
      previewImages.forEach(p => URL.revokeObjectURL(p.url))

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
          <p className="text-sm text-emerald-300">
            {initialData 
              ? '¡Repuesto actualizado exitosamente! Redirigiendo…' 
              : '¡Repuesto creado exitosamente! Redirigiendo…'}
          </p>
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
                defaultValue={initialData?.part_number || ''}
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
                defaultValue={initialData?.name || ''}
              />
            </Field>
          </div>
        </Section>

        {/* Clasificación */}
        <Section title="Clasificación">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Categoría *" htmlFor="category">
              <select
                id="category"
                name="category"
                required
                className={INPUT_BASE}
                defaultValue={initialData?.category || ''}
                disabled={isPending || success}
              >
                <option value="" disabled className="bg-[#111] text-white/40">
                  Seleccionar…
                </option>
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.name} className="bg-[#111] text-white">
                      {c.name}
                    </option>
                  ))
                ) : (
                  ['Motor', 'Frenos', 'Suspensión', 'Filtros', 'Eléctrico', 'Carrocería', 'Accesorios'].map((c) => (
                    <option key={c} value={c} className="bg-[#111] text-white">
                      {c}
                    </option>
                  ))
                )}
              </select>
            </Field>

            <Field label="Marca *" htmlFor="brand">
              <select
                id="brand"
                name="brand"
                required
                className={INPUT_BASE}
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value)
                  setSelectedModel('') // Reset del modelo al cambiar la marca
                }}
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

            <Field label="Modelo *" htmlFor="model">
              <select
                id="model"
                name="model"
                required
                className={INPUT_BASE}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isPending || success || !selectedBrand}
              >
                <option value="" disabled className="bg-[#111] text-white/40">
                  {selectedBrand ? 'Seleccionar…' : 'Primero elige marca'}
                </option>
                {(VEHICLE_MAKES[selectedBrand] || []).map((m) => (
                  <option key={m} value={m} className="bg-[#111] text-white">
                    {m}
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
                    defaultChecked={initialData ? initialData.condition === value : value === 'ALTERNATIVO'}
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
                defaultChecked={initialData ? initialData.stock_available : true}
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
              defaultValue={initialData?.compatibility_text || ''}
            />
          </Field>

          {/* Subida de Imagen Drag & Drop Múltiple */}
          <Field label="Imágenes del Repuesto (Múltiple)" htmlFor="images">
            <div
              className={`
                relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                p-6 transition-all duration-150 text-center cursor-pointer min-h-[140px]
                ${isDragging 
                  ? 'border-amber-500 bg-amber-500/5' 
                  : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15] hover:bg-white/[0.03]'}
              `}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
                if (files.length > 0) {
                  handleFilesAdded(files)
                }
              }}
              onClick={() => {
                document.getElementById('images')?.click()
              }}
            >
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                disabled={isPending || success}
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  handleFilesAdded(files)
                }}
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="rounded-full bg-white/[0.04] p-3 border border-white/[0.04]">
                  <UploadCloud className="h-6 w-6 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/70">
                    Arrastra imágenes o haz clic para adjuntar (Múltiple)
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    Soporta formatos PNG, JPG, JPEG o WEBP
                  </p>
                </div>
              </div>
            </div>

            {/* Previsualización múltiple en formato de cuadrícula/lista de miniaturas */}
            {(existingImages.length > 0 || previewImages.length > 0) && (
              <div className="mt-4 border-t border-white/[0.04] pt-4">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-2.5">
                  Previsualización de imágenes ({existingImages.length + previewImages.length})
                </p>
                <div className="flex flex-wrap gap-3">
                  {/* Existentes (almacenadas en BD) */}
                  {existingImages.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative group w-20 h-20 rounded-lg border border-white/10 bg-[#0d0d12] flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Existente ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setExistingImages(existingImages.filter((_, i) => i !== idx))
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer shadow-md"
                        title="Eliminar imagen existente"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white/60 text-center py-0.5 select-none">
                        Guardada
                      </span>
                    </div>
                  ))}

                  {/* Nuevas (por subir) */}
                  {previewImages.map((item, idx) => (
                    <div key={`preview-${idx}`} className="relative group w-20 h-20 rounded-lg border border-white/10 bg-[#0d0d12] flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={`Nueva ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemovePreview(idx)
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer shadow-md"
                        title="Eliminar imagen nueva"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <span className="absolute bottom-0 inset-x-0 bg-amber-500/80 text-[9px] text-[#0a0a0f] font-bold text-center py-0.5 select-none">
                        Por subir
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Field>

          <Field label="Notas internas" htmlFor="notes">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Observaciones del administrador..."
              className={`${INPUT_BASE} resize-none`}
              disabled={isPending || success}
              defaultValue={initialData?.notes || ''}
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
          {isPending ? 'Guardando…' : (initialData ? 'Actualizar Producto' : 'Crear Nuevo Repuesto')}
        </button>
      </div>
    </form>
  )
}

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
