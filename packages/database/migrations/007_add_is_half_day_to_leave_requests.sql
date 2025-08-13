-- Migration: Add is_half_day column to leave_requests table
-- This allows tracking whether a leave request is for a full day or half day

-- Add is_half_day column to leave_requests table
ALTER TABLE leave_requests 
ADD COLUMN is_half_day BOOLEAN NOT NULL DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN leave_requests.is_half_day IS 'Indicates whether the leave request is for a half day (true) or full day (false)';

-- Create an index on is_half_day for better query performance
CREATE INDEX idx_leave_requests_is_half_day ON leave_requests(is_half_day);

-- Update existing records to have is_half_day = false (full day) by default
-- This ensures existing data is consistent
UPDATE leave_requests SET is_half_day = false WHERE is_half_day IS NULL; 