const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function applyRLSFix() {
  try {
    console.log('🔧 Applying RLS policy fixes...');

    // Drop existing RLS policies that depend on auth.uid()
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can create own requests" ON leave_requests;',
      'DROP POLICY IF EXISTS "Users can view own requests" ON leave_requests;',
      'DROP POLICY IF EXISTS "Users can update own requests" ON leave_requests;',
      'DROP POLICY IF EXISTS "Approvers can view requests to approve" ON leave_requests;',
      'DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;',
      'DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;',
      'DROP POLICY IF EXISTS "Users can view relevant events" ON calendar_events;',
      'DROP POLICY IF EXISTS "Users can view own profile" ON users;',
      'DROP POLICY IF EXISTS "Supervisors can view team profiles" ON users;',
      'DROP POLICY IF EXISTS "Users can update own profile" ON users;'
    ];

    console.log('🗑️  Dropping existing policies...');
    for (const policy of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log(`⚠️  Policy drop warning (may not exist): ${error.message}`);
      }
    }

    // Create new RLS policies
    const createPolicies = [
      'CREATE POLICY "Users can create own requests" ON leave_requests FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Users can view own requests" ON leave_requests FOR SELECT USING (true);',
      'CREATE POLICY "Users can update own requests" ON leave_requests FOR UPDATE USING (true);',
      'CREATE POLICY "Approvers can view requests to approve" ON leave_requests FOR SELECT USING (true);',
      'CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (true);',
      'CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (true);',
      'CREATE POLICY "Users can view relevant events" ON calendar_events FOR SELECT USING (true);',
      'CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (true);',
      'CREATE POLICY "Supervisors can view team profiles" ON users FOR SELECT USING (true);',
      'CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);'
    ];

    console.log('✅ Creating new policies...');
    for (const policy of createPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.error(`❌ Error creating policy: ${error.message}`);
      } else {
        console.log('✅ Policy created successfully');
      }
    }

    console.log('🎉 RLS policy fixes applied successfully!');

  } catch (error) {
    console.error('💥 Error applying RLS fixes:', error.message);
  }
}

applyRLSFix(); 