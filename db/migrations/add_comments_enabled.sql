-- Add comments_enabled column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN DEFAULT true;

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_comments_enabled ON posts(comments_enabled); 