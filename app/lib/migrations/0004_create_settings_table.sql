-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL,
  site_description TEXT,
  contact_email VARCHAR(255),
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (site_name, site_description, contact_email, social_links)
VALUES (
  'Australia Travel Blog',
  'Your guide to exploring Australia',
  'contact@example.com',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING; 