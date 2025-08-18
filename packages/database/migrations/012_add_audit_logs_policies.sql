
-- Migration: Add RLS policies for audit_logs table
-- Description: Add Row Level Security policies to allow audit log operations
-- Date: 2025-01-27

-- Add INSERT policy for audit_logs
-- Allow authenticated users to create audit logs (authorization handled in application layer)
CREATE POLICY "Allow audit log creation" ON audit_logs 
FOR INSERT WITH CHECK (true);

-- Add SELECT policy for audit_logs
-- Allow users to read audit logs they created
CREATE POLICY "Users can read own audit logs" ON audit_logs 
FOR SELECT USING (auth.uid()::text = user_id::text);

-- Allow admins and HR to read all audit logs
CREATE POLICY "Admins can read all audit logs" ON audit_logs 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.id = auth.uid()::uuid 
        AND u.role IN ('admin', 'hr')
    )
);

-- Add UPDATE policy for audit_logs (if needed for corrections)
-- Allow admins to update audit logs
CREATE POLICY "Admins can update audit logs" ON audit_logs 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.id = auth.uid()::uuid 
        AND u.role IN ('admin', 'hr')
    )
);

-- Add DELETE policy for audit_logs (if needed for cleanup)
-- Allow admins to delete audit logs
CREATE POLICY "Admins can delete audit logs" ON audit_logs 
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.id = auth.uid()::uuid 
        AND u.role IN ('admin', 'hr')
    )
);

-- Note: The application layer should implement proper authorization checks:
-- 1. Audit logs should only be created by the system/application
-- 2. Users should only see audit logs related to their actions
-- 3. Admins and HR should have full access to audit logs for compliance
-- 4. Audit logs should generally not be modified or deleted (except by admins for cleanup)
