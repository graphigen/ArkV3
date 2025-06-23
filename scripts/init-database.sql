-- Admin Panel Database Schema

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL DEFAULT 'Arkkontrol',
    site_description TEXT,
    site_url VARCHAR(255),
    admin_email VARCHAR(255),
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    timezone VARCHAR(100) DEFAULT 'Europe/Istanbul',
    language VARCHAR(10) DEFAULT 'tr',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    allow_registration BOOLEAN DEFAULT FALSE,
    require_email_verification BOOLEAN DEFAULT TRUE,
    enable_comments BOOLEAN DEFAULT TRUE,
    enable_newsletter BOOLEAN DEFAULT TRUE,
    logo_url VARCHAR(255),
    favicon_url VARCHAR(255),
    footer_logo_url VARCHAR(255),
    social_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages Table
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled
    language VARCHAR(10) DEFAULT 'tr',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image VARCHAR(255),
    canonical_url VARCHAR(255),
    noindex BOOLEAN DEFAULT FALSE,
    template VARCHAR(100) DEFAULT 'default',
    custom_css TEXT,
    custom_js TEXT,
    featured_image VARCHAR(255),
    author_id INTEGER,
    parent_id INTEGER REFERENCES pages(id),
    menu_order INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    menu_location VARCHAR(50) NOT NULL, -- header, footer, sidebar
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255),
    page_id INTEGER REFERENCES pages(id),
    parent_id INTEGER REFERENCES menu_items(id),
    menu_order INTEGER DEFAULT 0,
    target VARCHAR(20) DEFAULT '_self', -- _self, _blank
    css_class VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'tr',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Settings Table
CREATE TABLE IF NOT EXISTS analytics_settings (
    id SERIAL PRIMARY KEY,
    google_analytics_id VARCHAR(50),
    google_tag_manager_id VARCHAR(50),
    yandex_metrica_id VARCHAR(50),
    bing_webmaster_code VARCHAR(255),
    facebook_pixel_id VARCHAR(50),
    google_search_console_code VARCHAR(255),
    custom_head_code TEXT,
    custom_body_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT INTO site_settings (
    site_name, 
    site_description, 
    site_url, 
    admin_email, 
    contact_email, 
    phone, 
    address
) VALUES (
    'Arkkontrol Robotik Otomasyon',
    'Türkiye''nin önde gelen robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı',
    'https://www.arkkontrol.com',
    'admin@arkkontrol.com',
    'info@arkkontrol.com',
    '(212) 407 01 02',
    'İkitelli OSB, Başakşehir, İstanbul'
) ON CONFLICT DO NOTHING;

-- Insert default pages
INSERT INTO pages (title, slug, content, status, seo_title, seo_description) VALUES 
(
    'Anasayfa',
    '/',
    'Arkkontrol Robotik Otomasyon olarak, endüstriyel üretim süreçlerinizi optimize etmek için en son teknoloji robotik kaynak sistemleri, lazer kesim çözümleri ve otomasyon sistemleri sunuyoruz.',
    'published',
    'Arkkontrol - Robotik Kaynak ve Lazer Kesim Sistemleri',
    'Türkiye''nin önde gelen robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı. Kaliteli hizmet ve teknoloji.'
),
(
    'Hakkımızda',
    '/hakkimizda',
    'Arkkontrol olarak, 2010 yılından bu yana endüstriyel otomasyon alanında faaliyet göstermekteyiz. Robotik kaynak sistemleri, lazer kesim teknolojileri ve özel otomasyon çözümleri konularında uzmanlaşmış ekibimizle müşterilerimize en kaliteli hizmeti sunmaktayız.',
    'published',
    'Hakkımızda - Arkkontrol',
    'Arkkontrol hakkında bilgi edinin. Robotik otomasyon alanındaki deneyimimiz ve uzman ekibimiz.'
),
(
    'İletişim',
    '/iletisim',
    'Robotik otomasyon çözümleriniz için bizimle iletişime geçin. Uzman ekibimiz size en uygun çözümü sunmak için hazır.',
    'published',
    'İletişim - Arkkontrol',
    'Arkkontrol ile iletişime geçin. Robotik kaynak ve otomasyon çözümleri için bize ulaşın.'
) ON CONFLICT (slug) DO NOTHING;

-- Insert default menu items
INSERT INTO menu_items (menu_location, title, page_id, menu_order) VALUES
('header', 'Anasayfa', 1, 1),
('header', 'Hakkımızda', 2, 2),
('header', 'İletişim', 3, 3) ON CONFLICT DO NOTHING;

-- Temel veritabanı yapısını oluştur
-- Bu script zaten mevcut ve çalışıyor
-- Sadece gerekli tabloları oluşturur
