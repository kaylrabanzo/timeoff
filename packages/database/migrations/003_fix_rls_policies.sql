-- Fix RLS policies for signup and authentication
-- Allow public access for user creation (signup)
CREATE POLICY "Allow public user creation" ON users FOR INSERT WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Allow admins to read all users
CREATE POLICY "Admins can read all users" ON users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.id = auth.uid()::uuid 
        AND u.role IN ('admin', 'hr')
    )
);

-- Allow admins to update all users
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.id = auth.uid()::uuid 
        AND u.role IN ('admin', 'hr')
    )
);

-- Fix leave_requests policies for better access control
DROP POLICY IF EXISTS "Users can create own requests" ON leave_requests;
CREATE POLICY "Users can create own requests" ON leave_requests FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Allow public access to leave_policies (for reading policies)
CREATE POLICY "Public can read leave policies" ON leave_policies FOR SELECT USING (true);

-- Allow public access to departments (for reading departments)
CREATE POLICY "Public can read departments" ON departments FOR SELECT USING (true);

-- Allow public access to teams (for reading teams)
CREATE POLICY "Public can read teams" ON teams FOR SELECT USING (true); 