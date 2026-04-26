-- Migration 003: Add design_views column to custom_orders
-- This stores all edited views (front, back, sides) as a JSONB array.
-- Each element: { viewId, viewName, design, mockup_url, print_file }

ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS design_views JSONB DEFAULT '[]'::jsonb;

-- Also add supplier_product_id if it doesn't already exist
ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS supplier_product_id UUID REFERENCES public.supplier_products(id) ON DELETE SET NULL;
