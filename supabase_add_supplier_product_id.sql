-- ============================================================
-- FULL Migration: Run ALL of this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. Add supplier_product_id column (safe to re-run)
ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS supplier_product_id UUID REFERENCES public.supplier_products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_custom_orders_supplier_product_id
  ON public.custom_orders(supplier_product_id);

-- 2. Allow customers to READ their own orders (needed for My Orders page)
DROP POLICY IF EXISTS "Customers view own orders" ON public.custom_orders;
CREATE POLICY "Customers view own orders" ON public.custom_orders
  FOR SELECT USING (customer_id = auth.uid());

-- 3. *** CRITICAL *** Allow customers to UPDATE their own orders
--    (needed for feedback/rating submission — without this, updates silently fail)
DROP POLICY IF EXISTS "Customers update own orders" ON public.custom_orders;
CREATE POLICY "Customers update own orders" ON public.custom_orders
  FOR UPDATE USING (customer_id = auth.uid());

-- 4. Allow public (unauthenticated) to READ delivered+rated rows
--    (needed for product detail page reviews section)
DROP POLICY IF EXISTS "Public can read delivered reviews" ON public.custom_orders;
CREATE POLICY "Public can read delivered reviews" ON public.custom_orders
  FOR SELECT USING (
    status = 'DELIVERED'
    AND (variants->>'customer_rating') IS NOT NULL
    AND (variants->>'customer_rating')::numeric > 0
  );
