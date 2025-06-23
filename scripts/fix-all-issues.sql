-- Fix any remaining database issues and optimize
-- This script ensures all tables are properly created and indexed

-- Ensure all required tables exist
DO $$ 
BEGIN
    -- Check and create missing tables if needed
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'admin',
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Insert default admin user
        INSERT INTO users (username, email, password_hash, role) 
        VALUES ('admin', 'admin@arkkontrol.com', '$2b$10$hash', 'admin');
    END IF;
    
    -- Add any missing columns to existing tables
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'meta_robots') THEN
        ALTER TABLE pages ADD COLUMN meta_robots VARCHAR(100) DEFAULT 'index,follow';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'reading_time') THEN
        ALTER TABLE blog_posts ADD COLUMN reading_time INTEGER DEFAULT 5;
    END IF;
END $$;

-- Update existing data
UPDATE pages SET status = 'published' WHERE status IS NULL;
UPDATE blog_posts SET status = 'published' WHERE status IS NULL;

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_menu_items_location ON menu_items(location);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_files_type ON media_files(mime_type);

-- Refresh materialized views if any exist
-- (Add any materialized view refreshes here if needed)

COMMIT;
