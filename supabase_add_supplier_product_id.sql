-- ============================================================
-- Migration: Add supplier_product_id to custom_orders
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Add the column (safe — does nothing if it already exists)
ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS supplier_product_id UUID REFERENCES public.supplier_products(id) ON DELETE SET NULL;

-- 2. Index for fast lookups in the reviews query
CREATE INDEX IF NOT EXISTS idx_custom_orders_supplier_product_id
  ON public.custom_orders(supplier_product_id);

-- 3. Allow customers to read their own orders (needed for review queries)
--    Drop old policy if it exists, then recreate cleanly
DROP POLICY IF EXISTS "Customers view own orders" ON public.custom_orders;

CREATE POLICY "Customers view own orders" ON public.custom_orders
  FOR SELECT USING (customer_id = auth.uid());

-- 4. Allow public read of DELIVERED+rated rows (so product detail page can show reviews)
DROP POLICY IF EXISTS "Public can read delivered reviews" ON public.custom_orders;

CREATE POLICY "Public can read delivered reviews" ON public.custom_orders
  FOR SELECT USING (
    status = 'DELIVERED'
    AND (variants->>'customer_rating') IS NOT NULL
    AND (variants->>'customer_rating')::numeric > 0
  );
