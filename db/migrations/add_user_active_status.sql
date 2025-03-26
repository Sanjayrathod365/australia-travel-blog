-- Add active column to users table with default value true
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active); 