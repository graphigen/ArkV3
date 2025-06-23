-- Analytics ve Dashboard için ek tablolar

-- Site istatistikleri tablosu
CREATE TABLE IF NOT EXISTS site_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    new_visitors INTEGER DEFAULT 0,
    returning_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- Sayfa görüntüleme logları
CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
    page_url VARCHAR(500) NOT NULL,
    visitor_ip INET,
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(20) DEFAULT 'desktop', -- desktop, mobile, tablet
    browser VARCHAR(50),
    os VARCHAR(50),
    session_id VARCHAR(100),
    visit_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trafik kaynakları
CREATE TABLE IF NOT EXISTS traffic_sources (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- organic, direct, social, referral, email
    source_name VARCHAR(100),
    sessions INTEGER DEFAULT 0,
    users INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, source_type, source_name)
);

-- Cihaz istatistikleri
CREATE TABLE IF NOT EXISTS device_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    device_type VARCHAR(20) NOT NULL, -- desktop, mobile, tablet
    browser VARCHAR(50),
    os VARCHAR(50),
    users INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coğrafi istatistikler
CREATE TABLE IF NOT EXISTS geo_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    users INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İletişim mesajları
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread', -- unread, read, replied, archived
    ip_address INET,
    user_agent TEXT,
    source_page VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sistem aktiviteleri/loglar
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- page, settings, user, etc.
    entity_id INTEGER,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Analytics entegrasyon ayarları
CREATE TABLE IF NOT EXISTS analytics_settings (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL, -- google_analytics, yandex_metrica, etc.
    measurement_id VARCHAR(100),
    property_id VARCHAR(100),
    api_key TEXT,
    refresh_token TEXT,
    access_token TEXT,
    is_active BOOLEAN DEFAULT false,
    last_sync TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider)
);

-- Sistem uyarıları
CREATE TABLE IF NOT EXISTS system_alerts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- warning, error, info, success
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_text VARCHAR(100),
    action_url VARCHAR(500),
    is_dismissed BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Örnek veriler ekle
INSERT INTO site_stats (date, visitors, page_views, sessions, bounce_rate, avg_session_duration, new_visitors, returning_visitors) VALUES
('2024-01-15', 1200, 2400, 1800, 45.5, 180, 800, 400),
('2024-01-16', 1900, 3800, 2400, 42.3, 195, 1200, 700),
('2024-01-17', 800, 1600, 1200, 48.2, 165, 500, 300),
('2024-01-18', 2780, 5560, 3200, 38.7, 220, 1800, 980),
('2024-01-19', 1890, 3780, 2600, 41.2, 205, 1200, 690),
('2024-01-20', 2390, 4780, 3100, 39.1, 210, 1500, 890),
('2024-01-21', 3490, 6980, 4200, 35.8, 235, 2200, 1290)
ON CONFLICT (date) DO NOTHING;

INSERT INTO traffic_sources (date, source_type, source_name, sessions, users, page_views, bounce_rate) VALUES
('2024-01-21', 'organic', 'Google', 2200, 1800, 4500, 35.2),
('2024-01-21', 'direct', 'Direct', 1100, 950, 1800, 42.1),
('2024-01-21', 'social', 'LinkedIn', 450, 380, 720, 38.5),
('2024-01-21', 'referral', 'Industry Sites', 300, 250, 480, 45.3),
('2024-01-21', 'email', 'Newsletter', 150, 120, 200, 25.8)
ON CONFLICT (date, source_type, source_name) DO NOTHING;

INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', 'Robotik kaynak sistemi hakkında', 'Merhaba, robotik kaynak sistemleriniz hakkında detaylı bilgi almak istiyorum.', 'unread'),
('Fatma Kaya', 'fatma@example.com', 'Lazer kesim teklifi', 'Lazer kesim hizmetiniz için fiyat teklifi alabilir miyim?', 'unread'),
('Mehmet Demir', 'mehmet@example.com', 'ABB robot servisi', 'ABB robotumuz arızalı, servis hizmeti alabilir miyiz?', 'read')
ON CONFLICT DO NOTHING;

INSERT INTO system_alerts (type, title, message, action_text, action_url, priority) VALUES
('warning', 'SEO Uyarısı', '3 sayfada meta açıklama eksik', 'Düzelt', '/admin/seo/pages', 2),
('info', 'Yedekleme', 'Son yedekleme 2 gün önce alındı', 'Yedekle', '/admin/settings/backup', 1),
('success', 'Güncelleme', 'Sistem güncel durumda', NULL, NULL, 1)
ON CONFLICT DO NOTHING;
