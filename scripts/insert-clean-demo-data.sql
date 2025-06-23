-- Temiz Demo Verisi - Hata Vermez

-- Site ayarlarını ekle
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

-- Menü konumlarını ekle
INSERT INTO menu_locations (location_key, location_name, description) VALUES
('header', 'Ana Menü', 'Site üst kısmındaki ana navigasyon menüsü'),
('footer', 'Footer Menü', 'Site alt kısmındaki footer menüsü'),
('mobile', 'Mobil Menü', 'Mobil cihazlar için hamburger menü')
ON CONFLICT (location_key) DO NOTHING;

-- Blog kategorilerini ekle
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Robotik Kaynak', 'robotik-kaynak', 'Robotik kaynak teknolojileri ve uygulamaları', '#F59E0B'),
('Lazer Kesim', 'lazer-kesim', 'Lazer kesim teknolojileri ve çözümleri', '#EF4444'),
('Endüstriyel Otomasyon', 'endustriyel-otomasyon', 'Otomasyon sistemleri ve çözümleri', '#3B82F6'),
('ABB Robotları', 'abb-robotlari', 'ABB robot teknolojileri ve servisleri', '#10B981'),
('Fronius Kaynak', 'fronius-kaynak', 'Fronius kaynak makineleri ve teknolojileri', '#8B5CF6'),
('Proje Hikayeleri', 'proje-hikayeleri', 'Başarılı proje hikayeleri ve vaka çalışmaları', '#F97316')
ON CONFLICT (slug) DO NOTHING;

-- Temel sayfaları ekle (sadece mevcut değilse)
INSERT INTO pages (title, slug, content, status, seo_title, seo_description, template, menu_order) 
SELECT * FROM (VALUES
    ('Ana Sayfa', '/', 'Arkkontrol Robotik Otomasyon ana sayfa içeriği', 'published', 'Arkkontrol - Robotik Kaynak ve Lazer Kesim Sistemleri', 'Türkiye''nin önde gelen robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı', 'homepage', 1),
    ('Hakkımızda', '/hakkimizda', 'Arkkontrol hakkında bilgiler', 'published', 'Hakkımızda - Arkkontrol', 'Arkkontrol hakkında detaylı bilgi', 'page', 2),
    ('İletişim', '/iletisim', 'İletişim bilgileri ve form', 'published', 'İletişim - Arkkontrol', 'Bizimle iletişime geçin', 'contact', 3),
    ('Blog', '/blog', 'Blog yazıları listesi', 'published', 'Blog - Arkkontrol', 'Teknoloji ve sektör hakkında yazılar', 'blog', 4)
) AS v(title, slug, content, status, seo_title, seo_description, template, menu_order)
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE pages.slug = v.slug);

-- Ana menü öğelerini ekle
INSERT INTO menu_items (menu_location, title, url, menu_order, is_active) 
SELECT * FROM (VALUES
    ('header', 'Ana Sayfa', '/', 1, true),
    ('header', 'Hakkımızda', '/hakkimizda', 2, true),
    ('header', 'Ürünler', '#', 3, true),
    ('header', 'Projeler', '#', 4, true),
    ('header', 'Blog', '/blog', 5, true),
    ('header', 'İletişim', '/iletisim', 6, true)
) AS v(menu_location, title, url, menu_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE menu_items.menu_location = v.menu_location AND menu_items.title = v.title);

-- Entegrasyon ayarlarını ekle
INSERT INTO integration_configs (category, service_key, config, is_enabled, status) VALUES
('analytics', 'google_analytics', '{"tracking_id": "", "measurement_id": ""}', false, 'inactive'),
('analytics', 'google_tag_manager', '{"container_id": ""}', false, 'inactive'),
('email', 'smtp', '{"host": "", "port": 587, "username": "", "password": ""}', false, 'inactive'),
('storage', 'aws_s3', '{"bucket": "", "region": "", "access_key": "", "secret_key": ""}', false, 'inactive')
ON CONFLICT (category, service_key) DO NOTHING;

-- Analytics ayarlarını ekle
INSERT INTO analytics_settings (google_analytics_id, google_tag_manager_id) VALUES
('', '')
ON CONFLICT DO NOTHING;

-- Media klasörünü ekle
INSERT INTO media_folders (name) VALUES ('Root') ON CONFLICT DO NOTHING;
