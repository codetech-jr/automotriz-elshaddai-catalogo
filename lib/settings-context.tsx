'use client'

import React, { createContext, useContext } from 'react'
import { BUSINESS } from './config'

export interface StoreSettings {
  whatsapp_number: string
  whatsapp_greeting: string
  store_address: string
  is_emergency_banner_active: boolean
}

const SettingsContext = createContext<StoreSettings | null>(null)

export function SettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: StoreSettings
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): StoreSettings {
  const context = useContext(SettingsContext)
  
  if (!context) {
    // Return robust fallback values matching static business configuration
    return {
      whatsapp_number: BUSINESS.phone,
      whatsapp_greeting: 'Hola, necesito ayuda con repuestos para mi vehículo.',
      store_address: BUSINESS.address,
      is_emergency_banner_active: true,
    }
  }
  
  return context
}
