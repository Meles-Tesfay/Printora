const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrders() {
  const { data, error } = await supabase
    .from('custom_orders')
    .select('id, product_type, supplier_product_id')
    .limit(5);
    
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

checkOrders();
