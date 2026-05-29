import { useState, useEffect } from "react"
import { type QuoteItem, type Product } from "./config"

// Types for store
export interface QuoteStoreState {
  quoteItems: QuoteItem[]
  isPanelOpen: boolean
}

// Internal global state
let state: QuoteStoreState = {
  quoteItems: [],
  isPanelOpen: false,
}

// Active listeners
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach(listener => listener())
}

// Save to localStorage safely (client-only)
function saveToLocalStorage() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("shaddai_quote_items", JSON.stringify(state.quoteItems))
    } catch (e) {
      console.error("Error saving quote items to localStorage", e)
    }
  }
}

// Load from localStorage safely (client-only)
function loadFromLocalStorage() {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("shaddai_quote_items")
      if (stored) {
        state.quoteItems = JSON.parse(stored)
        emitChange()
      }
    } catch (e) {
      console.error("Error loading quote items from localStorage", e)
    }
  }
}

// Run initial load once on client
if (typeof window !== "undefined") {
  // Defer slightly to avoid interfering with initial React mount
  setTimeout(loadFromLocalStorage, 0)
}

export const quoteStore = {
  getState(): QuoteStoreState {
    return state
  },

  setPanelOpen(open: boolean) {
    state = { ...state, isPanelOpen: open }
    emitChange()
  },

  addItem(product: Product) {
    const existing = state.quoteItems.find(item => item.id === product.id)
    let newItems: QuoteItem[] = []

    if (existing) {
      newItems = state.quoteItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      newItems = [
        ...state.quoteItems,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ]
    }

    state = { ...state, quoteItems: newItems }
    saveToLocalStorage()
    emitChange()
  },

  removeItem(productId: string) {
    const newItems = state.quoteItems.filter(item => item.id !== productId)
    state = { ...state, quoteItems: newItems }
    saveToLocalStorage()
    emitChange()
  },

  updateQuantity(productId: string, delta: number) {
    const newItems = state.quoteItems.map(item => {
      if (item.id !== productId) return item
      const newQty = item.quantity + delta
      return newQty <= 0 ? item : { ...item, quantity: newQty }
    })
    
    state = { ...state, quoteItems: newItems }
    saveToLocalStorage()
    emitChange()
  },

  getTotalItems(): number {
    return state.quoteItems.reduce((sum, item) => sum + item.quantity, 0)
  },

  clearStore() {
    state = { ...state, quoteItems: [] }
    saveToLocalStorage()
    emitChange()
  },

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
}

// Custom React Hook
export function useQuoteStore() {
  const [storeState, setStoreState] = useState<QuoteStoreState>(quoteStore.getState())

  useEffect(() => {
    const handleStoreChange = () => {
      setStoreState(quoteStore.getState())
    }

    // Subscribe to store updates
    const unsubscribe = quoteStore.subscribe(handleStoreChange)

    // Sync on mount
    handleStoreChange()

    return unsubscribe
  }, [])

  return {
    quoteItems: storeState.quoteItems,
    isQuotePanelOpen: storeState.isPanelOpen,
    setIsQuotePanelOpen: quoteStore.setPanelOpen,
    addToQuote: quoteStore.addItem,
    removeFromQuote: quoteStore.removeItem,
    updateQuantity: quoteStore.updateQuantity,
    getTotalItems: quoteStore.getTotalItems,
    clearQuote: quoteStore.clearStore,
  }
}
