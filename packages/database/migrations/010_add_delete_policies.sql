-- Migration: Add DELETE policies for leave_requests
-- Description: Add RLS policies to allow DELETE operations on leave_requests table
-- Date: 2025-01-27

-- Add DELETE policies for leave_requests table
-- Since we're using NextAuth, we'll allow DELETE operations and handle authorization in the application layer
-- This is similar to how other policies were updated in migration 009

-- Allow users to delete leave requests (authorization handled in application layer)
CREATE POLICY "Users can delete requests" ON leave_requests 
FOR DELETE USING (true);

-- Note: The application layer should implement proper authorization checks:
-- 1. Users can only delete their own requests
-- 2. Users can only delete requests with status 'draft' or 'pending'
-- 3. Admins and HR can delete any request
-- 4. Approvers can delete requests they are assigned to approve
