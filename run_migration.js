const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    const sql = fs.readFileSync('supabase/migrations/005_product_images_bucket.sql', 'utf8');
    await client.query(sql);
    console.log('Migration executed successfully');
  } catch (err) {
    console.error('Error executing migration', err);
  } finally {
    await client.end();
  }
}

run();
