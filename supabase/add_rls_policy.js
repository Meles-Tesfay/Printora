const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPolicy() {
  const sql = `
    CREATE POLICY "Users view products they ordered" ON public.supplier_products
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.custom_orders
        WHERE supplier_product_id = public.supplier_products.id
        AND customer_id = auth.uid()
      )
    );
  `;
  
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Error adding policy:', error);
    // If rpc exec_sql doesn't exist, we might have to use another way.
    // Usually, you can't run arbitrary SQL via the client unless there's a helper function.
  } else {
    console.log('Policy added successfully');
  }
}

addPolicy();
