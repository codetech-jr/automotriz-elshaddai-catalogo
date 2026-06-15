'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Zap,
} from 'lucide-react'
import { signOut } from '@/actions/product'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin',          label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/products', label: 'Inventario',  icon: Package },
  { href: '/admin/settings', label: 'Configuración', icon: Settings },
]

interface AdminSidebarProps {
  userEmail: string
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={`
        relative flex flex-col border-r border-white/[0.06] bg-[#0d0d14]
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[68px]' : 'w-[220px]'}
      `}
    >
      {/* ── Logo / Marca ───────────────────────────────────────────────── */}
      <div className={`
        flex items-center gap-3 border-b border-white/[0.06] px-4 py-5
        ${collapsed ? 'justify-center px-2' : ''}
      `}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Zap className="h-4 w-4 text-amber-400" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white leading-tight">
              El Shaddai
            </p>
            <p className="truncate text-[10px] text-white/40 leading-tight">
              Panel Admin
            </p>
          </div>
        )}
      </div>

      {/* ── Navegación ─────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-1 p-2 pt-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          // Activo: exact match para /admin, startsWith para sub-rutas
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition-all duration-150
                ${collapsed ? 'justify-center px-2' : ''}
                ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/90'
                }
              `}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-amber-400' : 'text-white/40 group-hover:text-white/70'
                }`}
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* ── Footer: usuario + logout ────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] p-2">
        {!collapsed && (
          <div className="mb-1 px-3 py-2">
            <p className="truncate text-[11px] text-white/30" title={userEmail}>
              {userEmail}
            </p>
          </div>
        )}
        <form action={signOut}>
          <button
            type="submit"
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={`
              group flex w-full items-center gap-3 rounded-lg px-3 py-2.5
              text-sm font-medium text-white/50
              transition-all duration-150
              hover:bg-red-500/10 hover:text-red-400
              ${collapsed ? 'justify-center px-2' : ''}
            `}
          >
            <LogOut className="h-4 w-4 shrink-0 text-white/40 group-hover:text-red-400 transition-colors" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </form>
      </div>

      {/* ── Botón colapsar ─────────────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        className="
          absolute -right-3 top-[72px]
          flex h-6 w-6 items-center justify-center
          rounded-full border border-white/[0.08] bg-[#0d0d14]
          text-white/40 shadow-md
          transition-all duration-150
          hover:border-amber-500/40 hover:text-amber-400
          z-10
        "
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  )
}
