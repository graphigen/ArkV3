-- SEO Management System Tables

-- SEO settings table
CREATE TABLE IF NOT EXISTS seo_settings (
    id SERIAL PRIMARY KEY,
    site_title VARCHAR(500) DEFAULT 'Arkkontrol - Endüstriyel Otomasyon Çözümleri',
    site_description TEXT DEFAULT 'Robotik kaynak, lazer kesim ve endüstriyel otomasyon alanında uzman çözümler. ABB ve Fronius yetkili servisi.',
    site_keywords TEXT DEFAULT 'robotik kaynak, lazer kesim, endüstriyel otomasyon, ABB robot, Fronius kaynak',
    default_og_image VARCHAR(500),
    google_analytics_id VARCHAR(50),
    google_search_console_id VARCHAR(100),
    facebook_pixel_id VARCHAR(50),
    robots_txt TEXT DEFAULT 'User-agent: *\nAllow: /',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page SEO data table
CREATE TABLE IF NOT EXISTS page_seo (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL, -- 'page', 'blog_post', 'product', etc.
    page_id INTEGER NOT NULL,
    meta_title VARCHAR(500),
    meta_description TEXT,
    meta_keywords TEXT,
    og_title VARCHAR(500),
    og_description TEXT,
    og_image VARCHAR(500),
    og_type VARCHAR(50) DEFAULT 'website',
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    twitter_title VARCHAR(500),
    twitter_description TEXT,
    twitter_image VARCHAR(500),
    canonical_url VARCHAR(500),
    noindex BOOLEAN DEFAULT false,
    nofollow BOOLEAN DEFAULT false,
    schema_markup JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_type, page_id)
);

-- URL redirects table
CREATE TABLE IF NOT EXISTS url_redirects (
    id SERIAL PRIMARY KEY,
    from_url VARCHAR(500) NOT NULL UNIQUE,
    to_url VARCHAR(500) NOT NULL,
    redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302, 307, 308)),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    hit_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEO keywords tracking table
CREATE TABLE IF NOT EXISTS seo_keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    page_type VARCHAR(50) NOT NULL,
    page_id INTEGER NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    current_position INTEGER,
    best_position INTEGER,
    search_volume INTEGER DEFAULT 0,
    difficulty_score INTEGER DEFAULT 0,
    last_checked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_seo_page ON page_seo(page_type, page_id);
CREATE INDEX IF NOT EXISTS idx_url_redirects_from ON url_redirects(from_url);
CREATE INDEX IF NOT EXISTS idx_url_redirects_status ON url_redirects(status);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_page ON seo_keywords(page_type, page_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_keywords(keyword);

-- Insert default SEO settings
INSERT INTO seo_settings (site_title, site_description, site_keywords, robots_txt) VALUES (
    'Arkkontrol - Endüstriyel Otomasyon ve Robotik Kaynak Çözümleri',
    'Türkiye''nin önde gelen endüstriyel otomasyon firması. Robotik kaynak, lazer kesim, ABB robot servisi ve Fronius kaynak makineleri konusunda uzman çözümler.',
    'robotik kaynak, lazer kesim, endüstriyel otomasyon, ABB robot, Fronius kaynak, plazma kesim, fikstur sistemleri, pozisyoner, slider sistem',
    'User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://arkkontrol.com/sitemap.xml'
) ON CONFLICT DO NOTHING;

-- Insert default page SEO data
INSERT INTO page_seo (page_type, page_id, meta_title, meta_description, meta_keywords, og_title, og_description, canonical_url) VALUES
('page', 1, 'Arkkontrol - Endüstriyel Otomasyon ve Robotik Kaynak Çözümleri', 'Robotik kaynak, lazer kesim ve endüstriyel otomasyon alanında 15+ yıllık deneyim. ABB yetkili servisi ve Fronius kaynak makineleri uzmanı.', 'robotik kaynak, lazer kesim, endüstriyel otomasyon, ABB robot', 'Arkkontrol - Endüstriyel Otomasyon Çözümleri', 'Türkiye''nin önde gelen endüstriyel otomasyon firması', 'https://arkkontrol.com/'),
('page', 2, 'Hakkımızda - Arkkontrol Endüstriyel Otomasyon', 'Arkkontrol olarak 2008''den beri endüstriyel otomasyon alanında hizmet veriyoruz. ABB''nin Türkiye''deki tek yetkili kaynak değer sağlayıcısıyız.', 'hakkımızda, arkkontrol, endüstriyel otomasyon, ABB yetkili servis', 'Hakkımızda - Arkkontrol', 'Endüstriyel otomasyon alanında 15+ yıllık deneyim', 'https://arkkontrol.com/hakkimizda'),
('page', 3, 'İletişim - Arkkontrol Endüstriyel Otomasyon', 'Arkkontrol ile iletişime geçin. Robotik kaynak, lazer kesim ve otomasyon çözümleri için uzman ekibimizden teklif alın.', 'iletişim, arkkontrol, teklif al, robotik kaynak', 'İletişim - Arkkontrol', 'Uzman ekibimizden teklif alın', 'https://arkkontrol.com/iletisim')
ON CONFLICT (page_type, page_id) DO NOTHING;

-- Insert some common redirects
INSERT INTO url_redirects (from_url, to_url, redirect_type) VALUES
('/contact', '/iletisim', 301),
('/about', '/hakkimizda', 301),
('/services', '/urunler', 301),
('/products', '/urunler', 301)
ON CONFLICT (from_url) DO NOTHING;
