-- Admin users tablosuna eksik kolonları ekle
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Mevcut kullanıcıları güncelle
UPDATE admin_users 
SET 
    first_name = COALESCE(first_name, 'Admin'),
    last_name = COALESCE(last_name, 'User')
WHERE first_name IS NULL OR last_name IS NULL;

-- Analytics tablosu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS analytics_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_path VARCHAR(500),
    visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    traffic_source VARCHAR(100),
    device_type VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media Files tablosu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS media_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    description TEXT,
    tags TEXT[],
    folder_id INTEGER REFERENCES media_folders(id) ON DELETE SET NULL,
    uploaded_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample analytics data ekle
INSERT INTO analytics_data (date, page_path, visitors, page_views, unique_visitors, bounce_rate, avg_session_duration, traffic_source, device_type, country) 
VALUES 
    (CURRENT_DATE, '/', 150, 200, 120, 45.5, 180, 'organic', 'desktop', 'Turkey'),
    (CURRENT_DATE, '/urunler/tiger-torc', 80, 95, 75, 35.2, 240, 'direct', 'mobile', 'Turkey'),
    (CURRENT_DATE, '/projeler/robotik-kaynak', 60, 70, 55, 40.1, 200, 'referral', 'desktop', 'Turkey'),
    (CURRENT_DATE - INTERVAL '1 day', '/', 140, 190, 110, 48.2, 170, 'organic', 'desktop', 'Turkey'),
    (CURRENT_DATE - INTERVAL '1 day', '/blog', 45, 55, 40, 30.5, 300, 'social', 'mobile', 'Turkey'),
    (CURRENT_DATE - INTERVAL '2 days', '/', 135, 185, 105, 50.1, 165, 'organic', 'desktop', 'Turkey'),
    (CURRENT_DATE - INTERVAL '3 days', '/hakkimizda', 70, 85, 65, 42.3, 220, 'direct', 'tablet', 'Turkey')
ON CONFLICT DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_data(date);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics_data(page_path);
CREATE INDEX IF NOT EXISTS idx_media_files_folder_id ON media_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON media_files(file_type);

-- Verify the changes
SELECT 'admin_users columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

SELECT 'analytics_data sample:' as info;
SELECT COUNT(*) as total_records FROM analytics_data;

SELECT 'All tables count:' as info;
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';
