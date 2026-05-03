const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificProduct() {
  const { data, error } = await supabase
    .from('supplier_products')
    .select('id, name, price, status')
    .eq('id', '5238133e-87b4-4886-992d-76176222d6b5');
    
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

checkSpecificProduct();
