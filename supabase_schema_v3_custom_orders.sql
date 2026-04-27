-- Supabase Schema V3 (Custom Orders)
-- Run this in your Supabase SQL Editor to create the custom_orders table.

CREATE TABLE IF NOT EXISTS public.custom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id), -- The user who designed it
  supplier_id UUID REFERENCES public.profiles(id), -- Assigned by admin
  
  product_type TEXT NOT NULL, -- e.g., "T-Shirt", "Mug"
  variants JSONB, -- e.g., {"color": "black", "size": "L"}
  design_data JSONB, -- The actual canvas state/config
  mockup_image_url TEXT, -- Screenshot of what the user designed
  
  status TEXT DEFAULT 'PENDING_ADMIN', 
  -- Status flow: PENDING_ADMIN -> ASSIGNED_TO_SUPPLIER -> COMPLETED_BY_SUPPLIER
  
  supplier_proof_image_url TEXT, -- Uploaded by supplier when done
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommended: Enable Row Level Security (RLS) on the newly created table
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert orders (so customers can send their designs)
CREATE POLICY "Public users can insert orders" ON public.custom_orders
  FOR INSERT WITH CHECK (true);

-- Allow admins full access, and suppliers to view their assigned orders
CREATE POLICY "Admins full access to orders" ON public.custom_orders
  FOR ALL USING (
    (SELECT (role = 'ADMIN') FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Suppliers view assigned orders" ON public.custom_orders
  FOR SELECT USING (
    supplier_id = auth.uid() OR status = 'PENDING_ADMIN'
  );
