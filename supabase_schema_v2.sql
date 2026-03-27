-- SUPABASE SCHEMA V2 (Admin and Supplier)
-- Run this in the Supabase SQL Editor

-- 1. Create Profile Table (for roles and user info)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'CUSTOMER', -- 'ADMIN', 'SUPPLIER', 'CUSTOMER'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add Supplier Ownership and Status to Products Table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING'; -- 'PENDING', 'APPROVED', 'REJECTED'
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Enable RLS (Recommended)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Basic Example)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Approved products are viewable by everyone" ON public.products;
CREATE POLICY "Approved products are viewable by everyone" ON public.products
  FOR SELECT USING (status = 'APPROVED');

DROP POLICY IF EXISTS "Suppliers can manage their own products" ON public.products;
CREATE POLICY "Suppliers can manage their own products" ON public.products
  FOR ALL USING (
    (SELECT (role = 'SUPPLIER' AND supplier_id = auth.uid()) FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    (SELECT (role = 'ADMIN') FROM public.profiles WHERE id = auth.uid())
  );

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
