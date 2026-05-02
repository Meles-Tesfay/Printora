
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSql() {
  const sql = `
    -- Enable public read access to custom_orders for reviews
    -- We only want to expose variants and supplier_product_id
    CREATE POLICY "Allow public to read reviews" 
    ON public.custom_orders 
    FOR SELECT 
    USING (variants->>'customer_rating' IS NOT NULL);

    -- Also ensure users can update their own orders (for feedback)
    CREATE POLICY "Users can update their own orders" 
    ON public.custom_orders 
    FOR UPDATE 
    USING (auth.uid() = customer_id);
  `;

  console.log('Running SQL migration...');
  const { error } = await supabase.rpc('run_sql', { sql_query: sql });

  if (error) {
    console.error('Error running SQL:', error);
    
    // If rpc fails, we might not have the run_sql function.
    // Try a direct update or similar if possible (no, Supabase client doesn't support raw SQL)
  } else {
    console.log('Migration successful!');
  }
}

runSql();
