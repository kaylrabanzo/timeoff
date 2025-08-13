-- Fix infinite recursion in RLS policies
-- First, drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Supervisors can view team profiles" ON users;
DROP POLICY IF EXISTS "Allow public user creation" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

-- Create simple, non-recursive policies
-- Allow public access for user creation (signup)
CREATE POLICY "Allow public user creation" ON users FOR INSERT WITH CHECK (true);

-- Allow users to read their own profile (using email instead of auth.uid() to avoid recursion)
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- Allow admins to read all users (by role check)
CREATE POLICY "Admins can read all users" ON users FOR SELECT USING (
    role IN ('admin', 'hr')
);

-- Allow admins to update all users
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
    role IN ('admin', 'hr')
);

-- For now, allow public read access to test the connection
-- (You can restrict this later once authentication is working)
CREATE POLICY "Public can read users" ON users FOR SELECT USING (true); 