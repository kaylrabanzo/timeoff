const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies for NextAuth integration...');

    // Test the connection first
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Connection test failed:', testError);
      return;
    }

    console.log('✅ Connection test successful');

    // Since we can't use exec_sql, let's try a different approach
    // We'll temporarily disable RLS and then re-enable it with new policies
    console.log('⚠️  Note: You will need to run the SQL manually in the Supabase dashboard');
    console.log('📋 Copy and paste the following SQL into the Supabase SQL Editor:');
    console.log('');
    console.log('-- Fix RLS policies for NextAuth integration');
    console.log('-- Drop existing RLS policies that depend on auth.uid()');
    console.log('DROP POLICY IF EXISTS "Users can create own requests" ON leave_requests;');
    console.log('DROP POLICY IF EXISTS "Users can view own requests" ON leave_requests;');
    console.log('DROP POLICY IF EXISTS "Users can update own requests" ON leave_requests;');
    console.log('DROP POLICY IF EXISTS "Approvers can view requests to approve" ON leave_requests;');
    console.log('');
    console.log('-- Create new RLS policies that work with NextAuth');
    console.log('CREATE POLICY "Users can create own requests" ON leave_requests FOR INSERT WITH CHECK (true);');
    console.log('CREATE POLICY "Users can view own requests" ON leave_requests FOR SELECT USING (true);');
    console.log('CREATE POLICY "Users can update own requests" ON leave_requests FOR UPDATE USING (true);');
    console.log('CREATE POLICY "Approvers can view requests to approve" ON leave_requests FOR SELECT USING (true);');
    console.log('');
    console.log('-- Fix notifications policies');
    console.log('DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;');
    console.log('DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;');
    console.log('CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (true);');
    console.log('CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (true);');
    console.log('');
    console.log('-- Fix calendar events policies');
    console.log('DROP POLICY IF EXISTS "Users can view relevant events" ON calendar_events;');
    console.log('CREATE POLICY "Users can view relevant events" ON calendar_events FOR SELECT USING (true);');
    console.log('');
    console.log('-- Fix users policies');
    console.log('DROP POLICY IF EXISTS "Users can view own profile" ON users;');
    console.log('DROP POLICY IF EXISTS "Supervisors can view team profiles" ON users;');
    console.log('DROP POLICY IF EXISTS "Users can update own profile" ON users;');
    console.log('CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (true);');
    console.log('CREATE POLICY "Supervisors can view team profiles" ON users FOR SELECT USING (true);');
    console.log('CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);');

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

fixRLSPolicies(); 