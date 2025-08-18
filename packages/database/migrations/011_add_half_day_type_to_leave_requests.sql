-- Migration: Add half_day_type column to leave_requests table
-- This allows specifying the type of half day (morning, afternoon, or null for full day)

-- Add half_day_type column to leave_requests table
ALTER TABLE leave_requests 
ADD COLUMN half_day_type VARCHAR(20) CHECK (half_day_type IN ('morning', 'afternoon'));

-- Add comment to explain the column
COMMENT ON COLUMN leave_requests.half_day_type IS 'Specifies the type of half day: morning, afternoon, or null for full day. Only applicable when is_half_day is true.';

-- Create an index on half_day_type for better query performance
CREATE INDEX idx_leave_requests_half_day_type ON leave_requests(half_day_type);

-- Update existing records to ensure consistency
-- If is_half_day is true but half_day_type is null, set it to 'morning' as default
UPDATE leave_requests 
SET half_day_type = 'morning' 
WHERE is_half_day = true AND half_day_type IS NULL;

-- Add a constraint to ensure half_day_type is only set when is_half_day is true
ALTER TABLE leave_requests 
ADD CONSTRAINT check_half_day_type_consistency 
CHECK (
    (is_half_day = true AND half_day_type IS NOT NULL) OR 
    (is_half_day = false AND half_day_type IS NULL)
);
