-- Mevcut admin_users tablosunu güncelle
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'editor',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;

-- Role constraint ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'admin_users_role_check'
    ) THEN
        ALTER TABLE admin_users 
        ADD CONSTRAINT admin_users_role_check 
        CHECK (role IN ('admin', 'editor', 'viewer'));
    END IF;
END $$;

-- Login Logs tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS login_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
    username VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT false,
    failure_reason VARCHAR(255),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS analytics_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
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

-- Media Folders tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS media_folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES media_folders(id) ON DELETE CASCADE,
    path VARCHAR(500) NOT NULL,
    created_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media Files tablosu (eğer yoksa)
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

-- Menu Locations tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS menu_locations (
    id SERIAL PRIMARY KEY,
    location_key VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mevcut kullanıcıları güncelle
UPDATE admin_users 
SET 
    first_name = COALESCE(first_name, 'Admin'),
    last_name = COALESCE(last_name, 'User'),
    role = COALESCE(role, 'admin'),
    is_active = COALESCE(is_active, true)
WHERE first_name IS NULL OR last_name IS NULL OR role IS NULL OR is_active IS NULL;

-- Varsayılan menü konumları
INSERT INTO menu_locations (location_key, location_name, description) 
VALUES 
    ('header', 'Ana Menü', 'Site üst kısmındaki ana navigasyon menüsü'),
    ('footer', 'Alt Menü', 'Site alt kısmındaki footer menüsü'),
    ('sidebar', 'Yan Menü', 'Sidebar navigasyon menüsü'),
    ('mobile', 'Mobil Menü', 'Mobil cihazlar için özel menü')
ON CONFLICT (location_key) DO NOTHING;

-- Varsayılan medya klasörleri
INSERT INTO media_folders (name, slug, parent_id, path, created_by) 
VALUES 
    ('Uploads', 'uploads', NULL, '/uploads', 1),
    ('Images', 'images', 1, '/uploads/images', 1),
    ('Documents', 'documents', 1, '/uploads/documents', 1),
    ('Videos', 'videos', 1, '/uploads/videos', 1)
ON CONFLICT DO NOTHING;

-- Sample analytics data
INSERT INTO analytics_data (date, page_path, visitors, page_views, unique_visitors, bounce_rate, avg_session_duration, traffic_source, device_type, country) 
VALUES 
    (CURRENT_DATE, '/', 150, 200, 120, 45.5, 180, 'organic', 'desktop', 'Turkey'),
    (CURRENT_DATE, '/urunler/tiger-torc', 80, 95, 75, 35.2, 240, 'direct', 'mobile', 'Turkey'),
    (CURRENT_DATE, '/projeler/robotik-kaynak', 60, 70, 55, 40.1, 200, 'referral', 'desktop', 'Turkey'),
    (CURRENT_DATE - INTERVAL '1 day', '/', 140, 190, 110, 48.2, 170, 'organic', 'desktop', 'Turkey'),
    (CURRENT_DATE - INTERVAL '1 day', '/blog', 45, 55, 40, 30.5, 300, 'social', 'mobile', 'Turkey')
ON CONFLICT DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_attempted_at ON login_logs(attempted_at);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_data(date);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics_data(page_path);
CREATE INDEX IF NOT EXISTS idx_media_files_folder_id ON media_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON media_files(file_type);
