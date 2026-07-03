# 📂 DATA MAESTRA: FASE 2 - RUTAS DINÁMICAS Y SEO PROGRAMÁTICO EL SHADDAI

## 1. Estado Actual del Proyecto

- Ya configuramos el `app/layout.tsx` global con la Metadata y el LocalBusiness (AutoPartsStore) Scheme enfocado en los Valles del Tuy, Venezuela (Charallave, Cúa, Ocumare).
- Nuestro próximo objetivo es el SEO Programático de Categorías y Productos Invididuales bajo el Next.js App Router.

## 2. Estructura de la Base de Datos (Referencia en Supabase)

Tenemos una tabla `repuestos` y manejamos URLs limpias basadas en columnas. Datos de ejemplo para armar la lógica:

- `marca_slug`: ej. 'toyota', 'chery', 'chevrolet'.
- `pieza_slug`: ej. 'tripoides-corolla-irani', 'estoperas-aveo', 'pastillas-freno'.
- `nombre`: Nombre amigable.
- `urgencia_vial`: Boolean (True si es pieza crítica que dejaría el auto varado, ej. correa, tripoide, batería).
- `stock`: Status simple ('Disponible'). No hay control de precios fijo debido a variaciones.

## 3. Desafíos Estructurales en Next.js App Router (`/repuestos/[marca]/[pieza]`)

- Al estar los usuarios locales normalmente en conectividad débil (EDGE / H+), dependemos 100% del renderizado en el servidor (SSR / generateMetadata).
- Queremos URLs lógicas estilo silo: `misitio.com/[marca]` (Landing de marca) -> `misitio.com/[marca]/[pieza_slug]` (La ficha cotizadora individual).

## 4. Reto de Schema JSON-LD de Producto (Lead a WhatsApp)

- Al NO TENER E-COMMERCE ACTIVO (checkout / pago en línea), debemos inyectar un **Product Schema**.
- Hay que esquivar penalizaciones y advertencias rojas en **Google Search Console** ("Missing Offer / Price / Cart").
- El usuario solo tiene una acción final posible: presionar el botón de "Cotizar rápido en WhatsApp", el cual le genera un mensaje ya ensamblado desde Next.js enviándolo directo a nuestra atención al cliente.
