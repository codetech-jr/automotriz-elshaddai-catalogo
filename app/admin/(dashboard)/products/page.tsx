import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, AlertCircle, Package2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { DbProduct } from '@/lib/supabase/types'
import ProductsTable from '@/components/admin/ProductsTable'

export const metadata: Metadata = {
  title: 'Inventario',
}

// Forzar página dinámica (no cachear datos del admin)
export const dynamic = 'force-dynamic'

// ── Condición → badge ─────────────────────────────────────────────────────────
const CONDITION_STYLES: Record<DbProduct['condition'], string> = {
  OEM:              'bg-sky-400/10 text-sky-400 border-sky-400/20',
  ALTERNATIVO:      'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  REMANUFACTURADO:  'bg-amber-400/10 text-amber-400 border-amber-400/20',
}

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      part_number,
      name,
      category,
      brand,
      condition,
      stock_available,
      stock_qty,
      image_url,
      created_at
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // ── Estadísticas rápidas ───────────────────────────────────────────────────
  const totalProducts = products?.length ?? 0
  const disponibles   = products?.filter(p => p.stock_available).length ?? 0
  const agotados      = totalProducts - disponibles

  return (
    <div className="space-y-6">
      {/* ── Cabecera ────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Inventario de Repuestos
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Gestiona el catálogo completo de productos
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="
            flex items-center gap-2 rounded-lg px-4 py-2.5
            bg-amber-500 text-[#0a0a0f]
            text-sm font-semibold
            transition-all duration-150
            hover:bg-amber-400 active:scale-95
            shadow-lg shadow-amber-500/20
          "
        >
          <Plus className="h-4 w-4" />
          Nuevo Repuesto
        </Link>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Repuestos" value={totalProducts} />
        <StatCard label="Disponibles"     value={disponibles}   accent="emerald" />
        <StatCard label="Sin Stock"       value={agotados}      accent="red" />
      </div>

      {/* ── Error de BD ─────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p className="text-sm text-red-300">
            Error al cargar los productos: {error.message}
          </p>
        </div>
      )}

      {/* ── Tabla o estado vacío ─────────────────────────────────────────── */}
      {!error && products && products.length === 0 ? (
        <EmptyState />
      ) : (
        <ProductsTable
          products={products ?? []}
          conditionStyles={CONDITION_STYLES}
        />
      )}
    </div>
  )
}

// ── Subcomponentes ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent = 'default',
}: {
  label: string
  value: number
  accent?: 'default' | 'emerald' | 'red'
}) {
  const accentClasses = {
    default: 'text-white',
    emerald: 'text-emerald-400',
    red:     'text-red-400',
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${accentClasses[accent]}`}>
        {value.toLocaleString()}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.06]">
        <Package2 className="h-7 w-7 text-white/20" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-white/60">Sin productos</h3>
      <p className="mt-1 text-sm text-white/30">
        Empieza agregando el primer repuesto al catálogo.
      </p>
      <Link
        href="/admin/products/new"
        className="mt-6 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0a0a0f] hover:bg-amber-400 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Agregar Repuesto
      </Link>
    </div>
  )
}
