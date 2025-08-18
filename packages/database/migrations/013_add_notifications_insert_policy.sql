-- Migration: Add INSERT policy for notifications table
-- Description: Add Row Level Security policy to allow notification creation
-- Date: 2025-01-27

-- Add INSERT policy for notifications
-- Allow authenticated users to create notifications (authorization handled in application layer)
CREATE POLICY "Allow notification creation" ON notifications 
FOR INSERT WITH CHECK (true);

-- Note: The application layer should implement proper authorization checks:
-- 1. Users can only create notifications for themselves
-- 2. System can create notifications for any user
-- 3. Admins and HR can create notifications for any user
-- 4. Notifications should be created by the system/application for user actions
