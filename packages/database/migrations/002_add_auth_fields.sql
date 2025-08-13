-- Add authentication-related fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password VARCHAR(255),
ADD COLUMN IF NOT EXISTS accept_marketing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sign_in_count INTEGER DEFAULT 0;

-- Update column names to match our application (camelCase to snake_case mapping)
-- Note: The existing schema uses snake_case, but our application expects camelCase
-- We'll add computed columns to maintain compatibility

-- Add computed columns for camelCase compatibility
-- ALTER TABLE users 
-- ADD COLUMN IF NOT EXISTS "firstName" VARCHAR(100) GENERATED ALWAYS AS (first_name) STORED,
-- ADD COLUMN IF NOT EXISTS "lastName" VARCHAR(100) GENERATED ALWAYS AS (last_name) STORED,
-- ADD COLUMN IF NOT EXISTS "managerId" UUID GENERATED ALWAYS AS (manager_id) STORED,
-- ADD COLUMN IF NOT EXISTS "hireDate" DATE GENERATED ALWAYS AS (hire_date) STORED,
-- ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN GENERATED ALWAYS AS (is_active) STORED,
-- ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at) STORED,
-- ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (updated_at) STORED;

-- Create index for password field
CREATE INDEX IF NOT EXISTS idx_users_password ON users(password);

-- Create index for email verification
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Add constraint to ensure password is required for non-oauth users
-- (This will be handled in the application logic) 