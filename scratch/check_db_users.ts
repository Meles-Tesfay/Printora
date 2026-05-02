
import { createClient } from '@supabase/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  console.log('Checking profiles table...');
  const { data, error } = await supabase.from('profiles').select('id, full_name, email, role');
  
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No profiles found in the table.');
    return;
  }
  
  console.log(`Found ${data.length} profiles:`);
  data.forEach(p => {
    console.log(`- ${p.full_name || 'No Name'} (${p.email}): Role = "${p.role}"`);
  });

  const suppliers = data.filter(p => p.role?.toUpperCase() === 'SUPPLIER');
  const customers = data.filter(p => p.role?.toUpperCase() === 'CUSTOMER');
  
  console.log('\nSummary:');
  console.log(`Suppliers: ${suppliers.length}`);
  console.log(`Customers: ${customers.length}`);
}

checkUsers();
