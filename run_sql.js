const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("No DATABASE_URL found in .env.local!");
    process.exit(1);
}

const client = new Client({
  connectionString,
});

const sql = `
CREATE TABLE IF NOT EXISTS public.custom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id), 
  supplier_id UUID REFERENCES public.profiles(id), 
  product_type TEXT NOT NULL, 
  variants JSONB, 
  design_data JSONB, 
  mockup_image_url TEXT, 
  status TEXT DEFAULT 'PENDING_ADMIN', 
  supplier_proof_image_url TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public users can insert orders' AND tablename = 'custom_orders'
    ) THEN
        CREATE POLICY "Public users can insert orders" ON public.custom_orders FOR INSERT WITH CHECK (true);
    END IF;
END
$$;
`;

(async () => {
  try {
    console.log("Connecting to Supabase Database...");
    await client.connect();
    console.log("Connected successfully. Running migration...");
    await client.query(sql);
    console.log("Successfully created the 'custom_orders' table!");
  } catch (err) {
    console.error("Error executing SQL:");
    console.error(err);
  } finally {
    await client.end();
  }
})();
