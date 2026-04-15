-- ============================================================
-- MIGRATION 002: Supplier Products & Updated Custom Orders
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create supplier_products table
CREATE TABLE IF NOT EXISTS public.supplier_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  product_type  TEXT NOT NULL,          -- 'T-Shirt', 'Hoodie', 'Mug', 'Hat', 'Phone Case'
  available_colors JSONB DEFAULT '[]',  -- [{name:'Black', hex:'#000000'}, ...]
  price         NUMERIC(10,2) DEFAULT 0,
  image_url     TEXT,                   -- main showcase image URL
  tags          TEXT[],                 -- ['Bestseller', 'Trending', ...]
  status        TEXT DEFAULT 'PENDING', -- 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add supplier_product_id to custom_orders (links order back to which product was chosen)
ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS supplier_product_id UUID REFERENCES public.supplier_products(id) ON DELETE SET NULL;

-- 3. Enable RLS
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for supplier_products
-- Suppliers can see/manage their own products
CREATE POLICY "Suppliers manage own products" ON public.supplier_products
  FOR ALL USING (auth.uid() = supplier_id);

-- Admins can see all products (uses service role or check profile role)
CREATE POLICY "Admins view all products" ON public.supplier_products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "Admins update product status" ON public.supplier_products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Approved products are visible to everyone (for landing page)
CREATE POLICY "Public view approved products" ON public.supplier_products
  FOR SELECT USING (status = 'APPROVED');

-- 5. Auto-fill supplier_id in custom_orders when supplier_product_id is set
-- (Admin approves order → auto-assigns to the product's supplier)
CREATE OR REPLACE FUNCTION public.auto_assign_supplier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.supplier_product_id IS NOT NULL AND NEW.supplier_id IS NULL THEN
    SELECT supplier_id INTO NEW.supplier_id
    FROM public.supplier_products
    WHERE id = NEW.supplier_product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_assign_supplier_trigger ON public.custom_orders;
CREATE TRIGGER auto_assign_supplier_trigger
  BEFORE INSERT OR UPDATE ON public.custom_orders
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_supplier();

-- 6. Grant access
GRANT ALL ON public.supplier_products TO authenticated;
GRANT ALL ON public.supplier_products TO service_role;
