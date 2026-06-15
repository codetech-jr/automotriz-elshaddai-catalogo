import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import {
  Package,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, condition, stock_available, category')
    .eq('is_active', true)

  const total       = products?.length ?? 0
  const disponibles = products?.filter((p) => p.stock_available).length ?? 0
  const oem         = products?.filter((p) => p.condition === 'OEM').length ?? 0

  // Conteo por categoría
  const byCategory = (products ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">
          Vista general del inventario de Automotriz El Shaddai
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={Package}       label="Total Repuestos" value={total}       />
        <KpiCard icon={CheckCircle2}  label="Disponibles"     value={disponibles}  accent="emerald" />
        <KpiCard icon={XCircle}       label="Sin Stock"        value={total - disponibles} accent="red" />
        <KpiCard icon={TrendingUp}    label="Piezas OEM"       value={oem}          accent="sky" />
      </div>

      {/* Inventario por categoría */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/70">Inventario por Categoría</h2>
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            Ver todo <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {topCategories.map(([category, count]) => (
            <CategoryBar key={category} category={category} count={count} total={total} />
          ))}
          {topCategories.length === 0 && (
            <p className="text-sm text-white/30 text-center py-4">Sin datos</p>
          )}
        </div>
      </div>

      {/* Acceso rápido */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h2 className="mb-3 text-sm font-semibold text-white/70">Acciones rápidas</h2>
        <Link
          href="/admin/products/new"
          className="
            inline-flex items-center gap-2 rounded-lg
            bg-amber-500 px-4 py-2.5 text-sm font-semibold text-[#0a0a0f]
            hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20
          "
        >
          + Agregar Repuesto
        </Link>
      </div>
    </div>
  )
}

// ── Subcomponentes ─────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  accent = 'default',
}: {
  icon: React.ElementType
  label: string
  value: number
  accent?: 'default' | 'emerald' | 'red' | 'sky'
}) {
  const accents = {
    default: { icon: 'text-white/30 bg-white/[0.04]', value: 'text-white' },
    emerald: { icon: 'text-emerald-400 bg-emerald-400/10', value: 'text-emerald-400' },
    red:     { icon: 'text-red-400 bg-red-400/10',         value: 'text-red-400' },
    sky:     { icon: 'text-sky-400 bg-sky-400/10',         value: 'text-sky-400' },
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accents[accent].icon}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className={`text-2xl font-bold tabular-nums ${accents[accent].value}`}>
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-white/30 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function CategoryBar({
  category,
  count,
  total,
}: {
  category: string
  count: number
  total: number
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">{category}</span>
        <span className="tabular-nums text-white/40">
          {count} <span className="text-white/20">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.05]">
        <div
          className="h-1.5 rounded-full bg-amber-500/60"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
