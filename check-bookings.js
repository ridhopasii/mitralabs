const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBookings() {
  console.log('\n🔍 Checking Booking table...\n');

  const { data, error, count } = await supabase
    .from('Booking')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`📊 Total bookings in database: ${count}`);
  console.log('\n📋 Latest 10 bookings:\n');

  if (data && data.length > 0) {
    data.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.customer_name} (${booking.customer_email})`);
      console.log(`   Service: ${booking.service_type} - ${booking.plan_name}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Created: ${new Date(booking.created_at).toLocaleString()}`);
      console.log('');
    });
  } else {
    console.log('⚠️  No bookings found in database!');
  }
}

checkBookings().catch(console.error);
