-- Temiz Veritabanı Başlatma Scripti
-- Sadece temel tabloları oluşturur, hata vermez

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
    status VARCHAR(20) DEFAULT 'draft',
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
    parent_id INTEGER,
    menu_order INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Locations Table
CREATE TABLE IF NOT EXISTS menu_locations (
    id SERIAL PRIMARY KEY,
    location_key VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    menu_location VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255),
    page_id INTEGER,
    parent_id INTEGER,
    menu_order INTEGER DEFAULT 0,
    target VARCHAR(20) DEFAULT '_self',
    css_class VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'tr',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    category_id INTEGER,
    author_id INTEGER,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    views INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 5,
    tags JSONB DEFAULT '[]',
    meta_title VARCHAR(500),
    meta_description TEXT,
    custom_css TEXT,
    custom_js TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form Submissions Table
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    form_name VARCHAR(255) NOT NULL,
    form_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration Configs Table
CREATE TABLE IF NOT EXISTS integration_configs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    service_key VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}',
    is_enabled BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'inactive',
    last_tested_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, service_key)
);

-- Webhooks Table
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    secret VARCHAR(255),
    last_triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media Table
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    tags TEXT[],
    uploaded_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Media Folders Table
CREATE TABLE IF NOT EXISTS media_folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER,
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

-- Indexes (Normal indexes, not concurrent)
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_location ON menu_items(menu_location);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
