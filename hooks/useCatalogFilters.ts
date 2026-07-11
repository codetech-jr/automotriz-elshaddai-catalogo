'use client'

import { useMemo, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { type Product } from '@/lib/config'
import { matchesYearRange } from '@/lib/data'

export interface CatalogFilters {
  brand: string | null
  category: string | null
  search: string
  year: string | null
}

export interface UseCatalogFiltersReturn {
  filters: CatalogFilters
  setBrand: (brand: string | null) => void
  setCategory: (category: string | null) => void
  setSearch: (query: string) => void
  setYear: (year: string | null) => void
  clearAll: () => void
  hasActiveFilters: boolean
  applyFilters: (products: Product[]) => Product[]
}

export function useCatalogFilters(): UseCatalogFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo<CatalogFilters>(() => {
    return {
      brand: searchParams.get('brand'),
      category: searchParams.get('category'),
      search: searchParams.get('q') || '',
      year: searchParams.get('year'),
    }
  }, [searchParams])

  const updateUrl = useCallback(
    (newFilters: Partial<CatalogFilters>) => {
      const params = new URLSearchParams(searchParams.toString())

      const brand = newFilters.brand !== undefined ? newFilters.brand : filters.brand
      const category = newFilters.category !== undefined ? newFilters.category : filters.category
      const search = newFilters.search !== undefined ? newFilters.search : filters.search
      const year = newFilters.year !== undefined ? newFilters.year : filters.year

      if (brand) {
        params.set('brand', brand)
      } else {
        params.delete('brand')
      }

      if (category) {
        params.set('category', category)
      } else {
        params.delete('category')
      }

      if (search.trim()) {
        params.set('q', search.trim())
      } else {
        params.delete('q')
      }

      if (year) {
        params.set('year', year)
      } else {
        params.delete('year')
      }

      const queryString = params.toString()
      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
    },
    [router, pathname, searchParams, filters]
  )

  const setBrand = useCallback(
    (brand: string | null) => {
      updateUrl({ brand })
    },
    [updateUrl]
  )

  const setCategory = useCallback(
    (category: string | null) => {
      updateUrl({ category })
    },
    [updateUrl]
  )

  const setSearch = useCallback(
    (search: string) => {
      updateUrl({ search })
    },
    [updateUrl]
  )

  const setYear = useCallback(
    (year: string | null) => {
      updateUrl({ year })
    },
    [updateUrl]
  )

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [router, pathname])

  const hasActiveFilters = useMemo(() => {
    return !!(filters.brand || filters.category || filters.search.trim() || filters.year)
  }, [filters])

  const applyFilters = useCallback(
    (products: Product[]) => {
      return products.filter((p) => {
        if (filters.brand && p.brand.toLowerCase() !== filters.brand.toLowerCase()) {
          return false
        }
        if (filters.category && p.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false
        }
        if (filters.year && !matchesYearRange(p.compatibility, filters.year)) {
          return false
        }
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim()
          const terms = q.split(/\s+/).filter(Boolean)
          const searchable = `${p.name} ${p.brand} ${p.category} ${p.compatibility} ${p.sku}`.toLowerCase()
          return terms.every((term) => searchable.includes(term))
        }
        return true
      })
    },
    [filters]
  )

  return {
    filters,
    setBrand,
    setCategory,
    setSearch,
    setYear,
    clearAll,
    hasActiveFilters,
    applyFilters,
  }
}
