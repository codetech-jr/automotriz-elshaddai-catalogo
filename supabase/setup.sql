-- =============================================================================
-- Automotriz El Shaddai — Supabase Database Setup
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Versión: 1.0.0 | 2026
-- =============================================================================

-- ── 0. Extensiones necesarias ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para búsqueda full-text por trigrama

-- =============================================================================
-- FASE 1: TIPOS ENUMERADOS
-- =============================================================================

-- Condición del repuesto
CREATE TYPE product_condition AS ENUM (
  'OEM',           -- Pieza original del fabricante
  'ALTERNATIVO',   -- Compatible de tercero
  'REMANUFACTURADO' -- Reconstruido/reacondicionado
);

-- Categorías de repuestos (espejo de lib/config.ts)
CREATE TYPE product_category AS ENUM (
  'Motor',
  'Frenos',
  'Suspensión',
  'Filtros',
  'Eléctrico',
  'Carrocería',
  'Accesorios'
);

-- Marcas soportadas (espejo de lib/config.ts)
CREATE TYPE product_brand AS ENUM (
  'Chery',
  'Toyota',
  'Ford',
  'Chevrolet',
  'Volkswagen',
  'Hyundai',
  'Daewoo',
  'Universal'    -- Para piezas genéricas
);

-- =============================================================================
-- FASE 2: TABLA PRINCIPAL — products
-- Diseño 3NF: no hay dependencias parciales ni transitivas.
-- SKU (part_number) es el identificador de negocio; UUID es la PK técnica.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  -- ── Identidad ─────────────────────────────────────────────────────────────
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_number   VARCHAR(64)   NOT NULL UNIQUE,   -- SKU del negocio, ej: CHY-FLT-001
  name          VARCHAR(255)  NOT NULL,

  -- ── Clasificación ──────────────────────────────────────────────────────────
  category      product_category  NOT NULL,
  brand         product_brand     NOT NULL,
  condition     product_condition NOT NULL DEFAULT 'ALTERNATIVO',

  -- ── Inventario ────────────────────────────────────────────────────────────
  -- stock_qty: null = no gestionado manualmente, se deduce por stock_available
  stock_available BOOLEAN   NOT NULL DEFAULT true,
  stock_qty       INTEGER   CHECK (stock_qty IS NULL OR stock_qty >= 0),

  -- ── Compatibilidad ────────────────────────────────────────────────────────
  -- Texto libre + array para búsquedas indexadas eficientes
  compatibility_text TEXT,                  -- "Corolla 2014–2020, Yaris 2018+"
  compatible_models  TEXT[],               -- ['corolla', 'yaris'] para filtros exactos

  -- ── Media ─────────────────────────────────────────────────────────────────
  image_url     TEXT,                       -- URL pública (Supabase Storage o CDN)
  image_urls    TEXT[]   DEFAULT '{}',      -- Galería adicional

  -- ── Precios (opcional para cotizaciones futuras) ──────────────────────────
  price_usd     NUMERIC(10, 2) CHECK (price_usd IS NULL OR price_usd >= 0),
  price_bs      NUMERIC(14, 2) CHECK (price_bs IS NULL OR price_bs >= 0),

  -- ── Notas internas ────────────────────────────────────────────────────────
  notes         TEXT,                       -- Notas internas del admin

  -- ── Auditoría ─────────────────────────────────────────────────────────────
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by    UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT true      -- Soft delete
);

-- Comentarios de tabla y columnas (buena práctica de documentación)
COMMENT ON TABLE  public.products IS 'Catálogo de repuestos de Automotriz El Shaddai';
COMMENT ON COLUMN public.products.part_number IS 'SKU único del repuesto (identificador de negocio)';
COMMENT ON COLUMN public.products.condition IS 'OEM = Original, ALTERNATIVO = Tercero, REMANUFACTURADO = Reconstruido';
COMMENT ON COLUMN public.products.stock_available IS 'TRUE = disponible para cotizar; FALSE = agotado/no disponible';
COMMENT ON COLUMN public.products.compatible_models IS 'Array de slugs de modelos para filtros exactos en la UI';

-- =============================================================================
-- FASE 3: ÍNDICES DE RENDIMIENTO
-- Strategy: B-tree para lookups exactos, GIN para búsquedas textuales y arrays,
-- trigram para búsqueda tipo ILIKE en name.
-- =============================================================================

-- Índice compuesto para los filtros más comunes del catálogo público
CREATE INDEX idx_products_category_brand
  ON public.products (category, brand)
  WHERE is_active = true;

-- Índice para búsqueda por estado de stock
CREATE INDEX idx_products_stock_available
  ON public.products (stock_available)
  WHERE is_active = true;

-- Búsqueda de texto en nombre del producto (trigrama para ILIKE eficiente)
CREATE INDEX idx_products_name_trgm
  ON public.products USING GIN (name gin_trgm_ops);

-- Búsqueda por part_number (ya cubierto por UNIQUE, pero explicit para claridad)
-- El UNIQUE constraint ya crea un índice B-tree en part_number

-- Búsqueda en array compatible_models con GIN
CREATE INDEX idx_products_compatible_models
  ON public.products USING GIN (compatible_models);

-- Índice de auditoría para el Panel Admin
CREATE INDEX idx_products_created_at
  ON public.products (created_at DESC);

-- =============================================================================
-- FASE 4: TRIGGER — auto-actualización de updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- FASE 5: ROW LEVEL SECURITY (RLS)
-- Principio de mínimo privilegio:
--   • SELECT público: cualquier visitante puede ver el catálogo
--   • INSERT / UPDATE / DELETE: solo usuarios autenticados (admin)
-- =============================================================================

-- Habilitar RLS en la tabla
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ── POLÍTICA 1: Lectura pública ───────────────────────────────────────────────
-- Permite que el frontend (catálogo público) lea productos activos sin auth.
CREATE POLICY "products_select_public"
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- ── POLÍTICA 2: Insert solo admin autenticado ─────────────────────────────────
CREATE POLICY "products_insert_authenticated"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── POLÍTICA 3: Update solo admin autenticado ─────────────────────────────────
CREATE POLICY "products_update_authenticated"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING  (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── POLÍTICA 4: Delete solo admin autenticado ─────────────────────────────────
-- NOTA: Preferimos soft-delete (is_active = false) sobre DELETE físico,
-- pero la política existe para flexibilidad futura.
CREATE POLICY "products_delete_authenticated"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- =============================================================================
-- FASE 6: DATOS INICIALES (Seed desde lib/data.ts)
-- Migración del mock existente a la base de datos real.
-- =============================================================================

INSERT INTO public.products
  (part_number, name, category, brand, condition, stock_available, compatibility_text, compatible_models, image_url)
VALUES
  ('CHY-FLT-001', 'Filtro de Aceite',                     'Filtros',    'Chery',     'ALTERNATIVO',    true, 'Arauco 2015–2022',          ARRAY['arauco'],                '/product-prueba-1.jpg'),
  ('TOY-FRN-014', 'Pastillas de Freno Delanteras',         'Frenos',     'Toyota',    'ALTERNATIVO',    true, 'Corolla 2014–2020',         ARRAY['corolla'],               '/producto-prueba-2.jpg'),
  ('FRD-SUS-032', 'Amortiguador Trasero',                  'Suspensión', 'Ford',      'ALTERNATIVO',    true, 'Explorer 2018–2023',        ARRAY['explorer'],              '/producto-prueba-3.jpg'),
  ('CHV-ELC-008', 'Batería 12V 60Ah',                      'Eléctrico',  'Chevrolet', 'ALTERNATIVO',    true, 'Aveo / Optra',              ARRAY['aveo','optra'],          NULL),
  ('CHY-MOT-019', 'Kit de Distribución',                   'Motor',      'Chery',     'OEM',            true, 'Tiggo 3 2016–2021',         ARRAY['tiggo'],                 NULL),
  ('TOY-FLT-007', 'Filtro de Aire',                        'Filtros',    'Toyota',    'ALTERNATIVO',    true, 'Fortuner 2016–2023',        ARRAY['fortuner'],              NULL),
  ('FRD-ELC-041', 'Sensor de Oxígeno',                     'Eléctrico',  'Ford',      'ALTERNATIVO',    true, 'Escape 2013–2019',          ARRAY['escape'],                NULL),
  ('CHV-MOT-003', 'Embrague Completo',                     'Motor',      'Chevrolet', 'REMANUFACTURADO',true, 'Spark 2010–2020',           ARRAY['spark'],                 NULL),
  ('CHV-ELC-012', 'Bobina de Encendido',                   'Eléctrico',  'Chevrolet', 'ALTERNATIVO',    true, 'Cruze / Orlando',           ARRAY['cruze','orlando'],       NULL),
  ('CHY-MOT-025', 'Bomba de Agua',                         'Motor',      'Chery',     'ALTERNATIVO',    true, 'Orinoco 1.8',               ARRAY['orinoco'],               NULL),
  ('TOY-FRN-028', 'Discos de Freno Delanteros',            'Frenos',     'Toyota',    'OEM',            true, 'Hilux 2012–2021',           ARRAY['hilux'],                 NULL),
  ('VW-FLT-005',  'Filtro de Cabina',                      'Filtros',    'Volkswagen','ALTERNATIVO',    true, 'Gol / Saveiro',             ARRAY['gol','saveiro'],         NULL),
  ('HYU-SUS-015', 'Bieleta de Barra Estabilizadora',       'Suspensión', 'Hyundai',   'ALTERNATIVO',    true, 'Tucson / Elantra',          ARRAY['tucson','elantra'],      NULL),
  ('TOY-ELC-052', 'Bujía Iridium (Set de 4)',              'Eléctrico',  'Toyota',    'OEM',            true, 'Yaris / Corolla',           ARRAY['yaris','corolla'],       NULL),
  ('VW-FRN-009',  'Kit de Pastillas de Freno Traseras',    'Frenos',     'Volkswagen','ALTERNATIVO',    true, 'Jetta / Bora',              ARRAY['jetta','bora'],          NULL),
  ('HYU-SUS-022', 'Amortiguador Delantero',                'Suspensión', 'Hyundai',   'ALTERNATIVO',    true, 'Accent 2012–2018',          ARRAY['accent'],                NULL),
  ('DAE-ELC-001', 'Distribuidor de Encendido',             'Eléctrico',  'Daewoo',    'REMANUFACTURADO',true, 'Cielo 1.5 1995–2000',      ARRAY['cielo'],                 NULL),
  ('DAE-FRN-002', 'Pastillas de Freno Delanteras',         'Frenos',     'Daewoo',    'ALTERNATIVO',    true, 'Lanos / Cielo / Nubira',    ARRAY['lanos','cielo','nubira'],NULL)
ON CONFLICT (part_number) DO NOTHING;

-- =============================================================================
-- VERIFICACIÓN FINAL
-- =============================================================================
SELECT
  COUNT(*)          AS total_products,
  COUNT(*) FILTER (WHERE stock_available) AS disponibles,
  COUNT(*) FILTER (WHERE condition = 'OEM') AS oem,
  COUNT(*) FILTER (WHERE condition = 'ALTERNATIVO') AS alternativos,
  COUNT(*) FILTER (WHERE condition = 'REMANUFACTURADO') AS remanufacturados
FROM public.products;
