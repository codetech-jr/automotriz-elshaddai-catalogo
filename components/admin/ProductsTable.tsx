'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import {
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toggleProductStatus, deleteProductPermanently, toggleStockAvailable } from '@/actions/product'
import type { DbProduct } from '@/lib/supabase/types'

interface ProductsTableProps {
  products: Partial<DbProduct>[]
  conditionStyles: Record<string, string>
}

export default function ProductsTable({ products, conditionStyles }: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/30">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/30">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/30">
                Condición
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-wider text-white/30">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                conditionStyles={conditionStyles}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Fila de producto con acciones inline ──────────────────────────────────────
function ProductRow({
  product,
  conditionStyles,
}: {
  product: Partial<DbProduct>
  conditionStyles: Record<string, string>
}) {
  const [isPending, startTransition] = useTransition()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleToggleStock = () => {
    startTransition(async () => {
      await toggleStockAvailable(product.id!, product.stock_available ?? true)
    })
  }

  const handleToggleActive = () => {
    const actionLabel = product.is_active !== false ? 'ocultar del catálogo' : 'publicar nuevamente en el catálogo'
    if (!confirm(`¿Estás seguro de que deseas ${actionLabel} el repuesto "${product.name}"?`)) return
    startTransition(async () => {
      await toggleProductStatus(product.id!, product.is_active ?? true)
    })
  }

  const handleDeletePermanently = () => {
    if (
      !confirm(
        `⚠️ ADVERTENCIA CRÍTICA: ¿Estás seguro de que deseas ELIMINAR DEFINITIVAMENTE el repuesto "${product.name}"?\n\nEsta acción es irreversible y borrará el registro de la base de datos para siempre.`
      )
    )
      return
    startTransition(async () => {
      await deleteProductPermanently(product.id!)
    })
  }

  const conditionLabel = product.condition ?? 'ALTERNATIVO'
  const isHidden = product.is_active === false

  return (
    <tr
      className={`group transition-colors hover:bg-white/[0.02] ${
        isPending ? 'opacity-50 pointer-events-none' : ''
      } ${isHidden ? 'bg-black/20' : ''}`}
    >
      {/* Nombre + SKU + imagen */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/[0.04] border border-white/[0.06]">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name ?? ''}
                fill
                sizes="36px"
                className={`object-cover ${isHidden ? 'opacity-40' : ''}`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xs font-bold text-white/20">
                  {product.brand?.charAt(0) ?? '?'}
                </span>
              </div>
            )}
          </div>
          {/* Texto */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className={`truncate font-medium max-w-[180px] ${
                isHidden ? 'text-white/40 line-through' : 'text-white/90'
              }`}>
                {product.name}
              </p>
              {isHidden && (
                <span className="rounded bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                  Oculto
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/30 font-mono">{product.part_number}</p>
          </div>
        </div>
      </td>

      {/* Categoría */}
      <td className="px-4 py-3">
        <span className={isHidden ? 'text-white/30' : 'text-white/60'}>{product.category}</span>
        {product.brand && (
          <span className="ml-1 text-white/30">· {product.brand}</span>
        )}
      </td>

      {/* Condición */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${
            isHidden
              ? 'bg-white/5 text-white/20 border-white/5'
              : conditionStyles[conditionLabel] ?? 'bg-white/5 text-white/40 border-white/10'
          }`}
        >
          {conditionLabel}
        </span>
      </td>

      {/* Stock toggle */}
      <td className="px-4 py-3 text-center">
        <button
          onClick={handleToggleStock}
          aria-label={product.stock_available ? 'Marcar sin stock' : 'Marcar disponible'}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-white/[0.06] disabled:opacity-40"
          disabled={isHidden}
        >
          {product.stock_available ? (
            <>
              <CheckCircle2 className={`h-4 w-4 ${isHidden ? 'text-emerald-500/40' : 'text-emerald-400'}`} />
              <span className={`text-[11px] font-medium ${isHidden ? 'text-emerald-500/40' : 'text-emerald-400'}`}>Disponible</span>
            </>
          ) : (
            <>
              <XCircle className={`h-4 w-4 ${isHidden ? 'text-red-500/40' : 'text-red-400'}`} />
              <span className={`text-[11px] font-medium ${isHidden ? 'text-red-500/40' : 'text-red-400'}`}>Agotado</span>
            </>
          )}
        </button>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3 text-right">
        <div className="relative inline-flex">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Más opciones"
            className="
              flex h-7 w-7 items-center justify-center rounded-md
              text-white/30 transition-colors
              hover:bg-white/[0.06] hover:text-white/70
            "
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              {/* Overlay para cerrar */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              {/* Menú */}
              <div className="
                absolute right-0 top-8 z-20 min-w-[180px]
                overflow-hidden rounded-lg border border-white/[0.08]
                bg-[#111118] shadow-xl shadow-black/40
              ">
                <a
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar producto
                </a>
                <button
                  disabled={isHidden}
                  onClick={() => { setMenuOpen(false); handleToggleStock() }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  {product.stock_available ? (
                    <><ToggleLeft className="h-3.5 w-3.5" /> Marcar agotado</>
                  ) : (
                    <><ToggleRight className="h-3.5 w-3.5" /> Marcar disponible</>
                  )}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); handleToggleActive() }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  {product.is_active !== false ? (
                    <><EyeOff className="h-3.5 w-3.5 text-white/40" /> Ocultar catálogo</>
                  ) : (
                    <><Eye className="h-3.5 w-3.5 text-amber-500" /> Publicar de nuevo</>
                  )}
                </button>
                <div className="border-t border-white/[0.06]" />
                <button
                  onClick={() => { setMenuOpen(false); handleDeletePermanently() }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar definitivamente
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

