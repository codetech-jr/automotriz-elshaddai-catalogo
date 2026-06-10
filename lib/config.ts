// Business configuration for Automotriz El Shaddai
export const BUSINESS = {
  name: "Automotriz El Shaddai",
  phone: "584123715469", // WhatsApp principal de la empresa
  location: "Charallave, Miranda, Venezuela",
  address: "Diagonal al MRW, Residencias Don Alejandro, Charallave, Miranda",
  hours: {
    weekdays: "Lun–Vie: 8:00 AM – 6:00 PM",
    saturday: "Sáb: 8:00 AM – 2:00 PM",
    sunday: "Cerrado",
  },
} as const

export type BrandId = "chery" | "toyota" | "ford" | "chevrolet" | "volkswagen" | "hyundai" | "daewoo"

export interface Brand {
  id: BrandId
  label: string
}

export const BRANDS: Brand[] = [
  { id: "chery", label: "Chery" },
  { id: "toyota", label: "Toyota" },
  { id: "ford", label: "Ford" },
  { id: "chevrolet", label: "Chevrolet" },
  { id: "volkswagen", label: "Volkswagen" },
  { id: "hyundai", label: "Hyundai" },
  { id: "daewoo", label: "Daewoo" },
]

export interface Category {
  id: string
  label: string
}

export const CATEGORIES: Category[] = [
  { id: "motor", label: "Motor" },
  { id: "frenos", label: "Frenos" },
  { id: "suspension", label: "Suspensión" },
  { id: "filtros", label: "Filtros" },
  { id: "electrico", label: "Eléctrico" },
  { id: "carroceria", label: "Carrocería" },
  { id: "accesorios", label: "Accesorios" },
]

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  compatibility: string
  sku: string
  imageUrl?: string
}

export const SAMPLE_PRODUCTS: Product[] = [
  { id: "1", name: "Filtro de Aceite", brand: "Chery", category: "Filtros", compatibility: "Arauco 2015–2022", sku: "CHY-FLT-001", imageUrl: "/product-prueba-1.jpg" },
  { id: "2", name: "Pastillas de Freno Delanteras", brand: "Toyota", category: "Frenos", compatibility: "Corolla 2014–2020", sku: "TOY-FRN-014", imageUrl: "/producto-prueba-2.jpg" },
  { id: "3", name: "Amortiguador Trasero", brand: "Ford", category: "Suspensión", compatibility: "Explorer 2018–2023", sku: "FRD-SUS-032", imageUrl: "/producto-prueba-3.jpg" },
  { id: "4", name: "Batería 12V 60Ah", brand: "Chevrolet", category: "Eléctrico", compatibility: "Aveo / Optra", sku: "CHV-ELC-008" },
  { id: "5", name: "Kit de Distribución", brand: "Chery", category: "Motor", compatibility: "Tiggo 3 2016–2021", sku: "CHY-MOT-019" },
  { id: "6", name: "Filtro de Aire", brand: "Toyota", category: "Filtros", compatibility: "Fortuner 2016–2023", sku: "TOY-FLT-007" },
  { id: "7", name: "Sensor de Oxígeno", brand: "Ford", category: "Eléctrico", compatibility: "Escape 2013–2019", sku: "FRD-ELC-041" },
  { id: "8", name: "Embrague Completo", brand: "Chevrolet", category: "Motor", compatibility: "Spark 2010–2020", sku: "CHV-MOT-003" },
  { id: "9", name: "Bobina de Encendido", brand: "Chevrolet", category: "Eléctrico", compatibility: "Cruze / Orlando", sku: "CHV-ELC-012" },
  { id: "10", name: "Bomba de Agua", brand: "Chery", category: "Motor", compatibility: "Orinoco 1.8", sku: "CHY-MOT-025" },
  { id: "11", name: "Discos de Freno Delanteros", brand: "Toyota", category: "Frenos", compatibility: "Hilux 2012–2021", sku: "TOY-FRN-028" },
  { id: "12", name: "Filtro de Cabina", brand: "Volkswagen", category: "Filtros", compatibility: "Gol / Saveiro", sku: "VW-FLT-005" },
  { id: "13", name: "Bieleta de Barra Estabilizadora", brand: "Hyundai", category: "Suspensión", compatibility: "Tucson / Elantra", sku: "HYU-SUS-015" },
  { id: "14", name: "Bujía Iridium (Set de 4)", brand: "Toyota", category: "Eléctrico", compatibility: "Yaris / Corolla", sku: "TOY-ELC-052" },
  { id: "15", name: "Kit de Pastillas de Freno Traseras", brand: "Volkswagen", category: "Frenos", compatibility: "Jetta / Bora", sku: "VW-FRN-009" },
  { id: "16", name: "Amortiguador Delantero", brand: "Hyundai", category: "Suspensión", compatibility: "Accent 2012–2018", sku: "HYU-SUS-022" },
  { id: "17", name: "Distribuidor de Encendido", brand: "Daewoo", category: "Eléctrico", compatibility: "Cielo 1.5 1995–2000", sku: "DAE-ELC-001" },
  { id: "18", name: "Pastillas de Freno Delanteras", brand: "Daewoo", category: "Frenos", compatibility: "Lanos / Cielo / Nubira", sku: "DAE-FRN-002" },
]

export interface QuoteItem {
  id: string
  name: string
  brand: string
  category: string
  quantity: number
  imageUrl?: string
}

// Build WhatsApp URL with pre-filled message
export function buildWhatsAppURL(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${BUSINESS.phone}?text=${encoded}`
}

// Build quote message from list of items, optionally including vehicle details
export function buildQuoteMessage(items: QuoteItem[], vehicleInfo?: string): string {
  if (items.length === 0) return ""
  
  const list = items
    .map((item, idx) => `${idx + 1}. ${item.name} (${item.brand})${item.quantity > 1 ? ` x${item.quantity}` : ""}`)
    .join("\n")
  
  let msg = `Hola, les contacto desde su catálogo digital. Me gustaría cotizar:\n\n${list}`
  
  if (vehicleInfo && vehicleInfo.trim()) {
    msg += `\n\n*Vehículo a verificar:* ${vehicleInfo.trim()}`
  }
  
  msg += `\n\n¿Disponibilidad y precio?`
  return msg
}
